const Silo = require('../models/Silo')
const SensorReading = require('../models/SensorReading')
const logger = require('../utils/logger')

const siloState = new Map()

function initSiloState(siloId) {
  if (!siloState.has(String(siloId))) {
    siloState.set(String(siloId), {
      temperature: 18 + Math.random() * 2,
      humidity: 63 + Math.random() * 5,
      co2: 4.0 + Math.random() * 0.8,
      o2: 2.0 + Math.random() * 0.5,
      battery: 85 + Math.random() * 15,
      tempTrend: 0,
      humidTrend: 0,
      co2Trend: 0,
      o2Trend: 0,
    })
  }
  return siloState.get(String(siloId))
}

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val))
}

function generateReading(prev, silo) {
  const s = { ...prev }

  s.tempTrend = clamp(s.tempTrend + (Math.random() - 0.5) * 0.05, -0.3, 0.3)
  s.humidTrend = clamp(s.humidTrend + (Math.random() - 0.5) * 0.08, -0.4, 0.4)
  s.co2Trend = clamp(s.co2Trend + (Math.random() - 0.5) * 0.03, -0.15, 0.15)
  s.o2Trend = clamp(s.o2Trend + (Math.random() - 0.5) * 0.02, -0.1, 0.1)

  s.temperature = clamp(s.temperature + s.tempTrend + (Math.random() - 0.5) * 0.1, 14, 26)
  s.humidity = clamp(s.humidity + s.humidTrend + (Math.random() - 0.5) * 0.2, 50, 85)
  s.co2 = clamp(s.co2 + s.co2Trend + (Math.random() - 0.5) * 0.05, 2.5, 7)
  s.o2 = clamp(s.o2 + s.o2Trend + (Math.random() - 0.5) * 0.03, 0.5, 4)
  s.battery = clamp(s.battery - 0.001 + (Math.random() - 0.7) * 0.02, 0, 100)

  if (silo.state && silo.state.ventOpen) {
    s.co2 = clamp(s.co2 - 0.1, 2.5, 7)
    s.o2 = clamp(s.o2 + 0.05, 0.5, 4)
    s.humidity = clamp(s.humidity - 0.3, 50, 85)
  }

  if (silo.state && silo.state.co2Active) {
    s.co2 = clamp(s.co2 + 0.2, 2.5, 7)
  }

  // 3% anomaly chance
  if (Math.random() < 0.03) {
    const t = Math.floor(Math.random() * 5)
    if (t === 0) s.humidity = clamp(s.humidity + 8 + Math.random() * 5, 50, 90)
    else if (t === 1) s.temperature = clamp(s.temperature + 4 + Math.random() * 3, 14, 30)
    else if (t === 2) s.co2 = clamp(s.co2 + 1 + Math.random() * 0.8, 2.5, 8)
    else if (t === 3) s.o2 = clamp(s.o2 + 1.5 + Math.random(), 0.5, 5)
    else s.battery = Math.max(s.battery - 10, 5)
  }

  // Mean reversion
  s.temperature += (18.5 - s.temperature) * 0.005
  s.humidity += (65 - s.humidity) * 0.008
  s.co2 += (4.5 - s.co2) * 0.005
  s.o2 += (2.0 - s.o2) * 0.005

  return s
}

function computeHealthScore(temperature, humidity, co2, o2, battery) {
  let score = 100
  if (temperature < 15 || temperature > 22) score -= Math.min(20, Math.abs(temperature - 18.5) * 3)
  if (humidity < 60 || humidity > 72) score -= Math.min(20, Math.abs(humidity - 66) * 1.5)
  if (co2 < 3 || co2 > 5.5) score -= Math.min(25, Math.abs(co2 - 4.5) * 8)
  if (o2 < 1 || o2 > 3) score -= Math.min(25, Math.abs(o2 - 2) * 15)
  if (battery < 20) score -= 10
  return Math.round(clamp(score, 0, 100))
}

class SimulationEngine {
  constructor() {
    this.io = null
    this.interval = null
    this.isRunning = false
  }

  start(io) {
    if (this.isRunning) return
    this.io = io
    this.isRunning = true
    const intervalMs = parseInt(process.env.SIMULATION_INTERVAL_MS) || 5000
    this.interval = setInterval(() => this.tick(), intervalMs)
    logger.info('Simulation engine started (interval: ' + intervalMs + 'ms)')
  }

  stop() {
    if (this.interval) { clearInterval(this.interval); this.interval = null; this.isRunning = false }
  }

  async tick() {
    try {
      const silos = await Silo.find({ isActive: true }).populate('owner', 'deviceTokens _id')
      for (const silo of silos) {
        try {
          const prev = initSiloState(silo._id)
          const newState = generateReading(prev, silo)
          siloState.set(String(silo._id), newState)

          const healthScore = computeHealthScore(newState.temperature, newState.humidity, newState.co2, newState.o2, newState.battery)
          const estimatedDaysRemaining = Math.round(Math.max(0, (healthScore / 100) * 60))

          const readingData = {
            silo: silo._id,
            owner: silo.owner._id,
            temperature: parseFloat(newState.temperature.toFixed(2)),
            humidity: parseFloat(newState.humidity.toFixed(2)),
            co2: parseFloat(newState.co2.toFixed(3)),
            o2: parseFloat(newState.o2.toFixed(3)),
            battery: parseFloat(newState.battery.toFixed(1)),
            healthScore,
            estimatedDaysRemaining,
            source: 'simulation',
          }

          await SensorReading.create(readingData)
          await Silo.findByIdAndUpdate(silo._id, { lastReading: { ...readingData, readingAt: new Date() } })

          if (this.io) {
            this.io.to('farmer_' + silo.owner._id).emit('sensor_update', { siloId: silo._id, data: readingData })
          }

          await this.checkThresholds(silo, readingData)
        } catch (e) {
          logger.error('Silo tick error ' + silo._id + ': ' + e.message)
        }
      }
    } catch (e) {
      logger.error('Tick error: ' + e.message)
    }
  }

  async checkThresholds(silo, reading) {
    const t = silo.thresholds || {}
    const checks = [
      { field: 'temperature', val: reading.temperature, min: t.temperatureMin || 15, max: t.temperatureMax || 22, type: 'temperature_exceed' },
      { field: 'humidity', val: reading.humidity, min: t.humidityMin || 60, max: t.humidityMax || 72, type: 'humidity_exceed' },
      { field: 'co2', val: reading.co2, min: t.co2Min || 3, max: t.co2Max || 5.5, type: 'co2_exceed' },
      { field: 'o2', val: reading.o2, min: t.o2Min || 1, max: t.o2Max || 3, type: 'o2_breach' },
      { field: 'battery', val: reading.battery, min: t.batteryMin || 20, max: 100, type: 'battery_low' },
    ]
    for (const { field, val, min, max, type } of checks) {
      if (val < min || val > max) await this.triggerAlert(silo, type, field, val, val < min ? min : max)
    }
  }

  async triggerAlert(silo, type, field, value, threshold) {
    try {
      const Alert = require('../models/Alert')
      const EventLog = require('../models/EventLog')
      const { sendNotification } = require('../config/firebase')

      const recent = await Alert.findOne({ silo: silo._id, type, createdAt: { $gte: new Date(Date.now() - 5 * 60 * 1000) } })
      if (recent) return

      const dir = value > threshold ? 'exceeded' : 'dropped below'
      const msg = field + ' ' + dir + ' threshold in ' + silo.name + '. Current: ' + value.toFixed(2) + ', Limit: ' + threshold

      const alert = await Alert.create({
        silo: silo._id,
        siloName: silo.name,
        owner: silo.owner._id,
        type,
        message: msg,
        severity: type.includes('exceed') || type === 'o2_breach' ? 'critical' : 'warning',
        triggeredBy: 'system',
        value,
        threshold,
      })

      await EventLog.create({
        silo: silo._id,
        owner: silo.owner._id,
        eventType: 'alert_triggered',
        description: msg,
        triggeredBy: 'system',
        meta: { type, value, threshold },
      })

      if (this.io) {
        this.io.to('farmer_' + silo.owner._id).emit('alert_triggered', { ...alert.toObject(), siloName: silo.name })
      }

      const tokens = (silo.owner.deviceTokens || []).filter(Boolean)
      if (tokens.length > 0) {
        await sendNotification(tokens, 'Preservia Alert', msg, { siloId: String(silo._id), type })
      }
    } catch (e) {
      logger.error('Alert trigger error: ' + e.message)
    }
  }
}

module.exports = new SimulationEngine()
