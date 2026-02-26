const Silo = require('../models/Silo')
const SensorReading = require('../models/SensorReading')
const Prediction = require('../models/Prediction')
const EventLog = require('../models/EventLog')
const logger = require('../utils/logger')

function clamp(val, min, max) { return Math.max(min, Math.min(max, val)) }

function computePrediction({ avgTemp, avgHumidity, avgCo2, avgO2, storageDays }) {
  let risk = 0
  let sproutRisk = 0
  let decayRisk = 0
  let co2Risk = 0
  let humidRisk = 0

  // Temperature contribution
  const tempDev = Math.abs(avgTemp - 18.5)
  risk += tempDev * 3
  decayRisk += tempDev * 5

  // Humidity contribution
  if (avgHumidity > 72) { risk += (avgHumidity - 72) * 2; decayRisk += (avgHumidity - 72) * 3; humidRisk += (avgHumidity - 72) * 5 }
  else if (avgHumidity < 60) { risk += (60 - avgHumidity) * 1.5 }

  // CO2 contribution (too low triggers sprouting)
  if (avgCo2 < 3) { risk += (3 - avgCo2) * 12; sproutRisk += (3 - avgCo2) * 20 }
  else if (avgCo2 > 5.5) { risk += (avgCo2 - 5.5) * 8; co2Risk += (avgCo2 - 5.5) * 15 }

  // O2 contribution
  if (avgO2 < 1) { risk += (1 - avgO2) * 15; decayRisk += (1 - avgO2) * 20 }
  else if (avgO2 > 3) { risk += (avgO2 - 3) * 10; sproutRisk += (avgO2 - 3) * 12 }

  // Storage age (increases risk over time)
  risk += storageDays * 0.3

  risk = clamp(risk, 0, 95)
  sproutRisk = clamp(sproutRisk, 0, 95)
  decayRisk = clamp(decayRisk, 0, 95)
  co2Risk = clamp(co2Risk, 0, 95)
  humidRisk = clamp(humidRisk, 0, 95)

  const safeDays = Math.round(Math.max(1, 60 - storageDays - (risk * 0.4)))

  let recommendation = 'Atmospheric conditions are within optimal range. Continue automated monitoring.'
  if (co2Risk > 30) recommendation = 'CO₂ levels are approaching unsafe limits. Schedule a ventilation cycle within 12–18 hours to reduce CO₂ breach risk.'
  else if (sproutRisk > 25) recommendation = 'Sprouting risk is elevated. Verify CO₂ concentration is maintained above 3.5% and review temperature stability.'
  else if (decayRisk > 20) recommendation = 'Decay risk detected. Check humidity levels and ensure ventilation is not causing rapid moisture changes.'
  else if (humidRisk > 20) recommendation = 'Humidity is elevated. Activate desiccation mode and monitor for condensation on produce surface.'
  else if (risk > 40) recommendation = 'Multiple parameters are drifting from optimal. Consider scheduling a full system check and recalibration.'

  return { spoilageRisk: Math.round(risk), estimatedSafeDays: safeDays, sproutRisk: Math.round(sproutRisk), decayRisk: Math.round(decayRisk), co2Risk: Math.round(co2Risk), humidRisk: Math.round(humidRisk), recommendation }
}

class PredictionService {
  constructor() {
    this.io = null
    this.interval = null
    this.isRunning = false
  }

  start(io) {
    if (this.isRunning) return
    this.io = io
    this.isRunning = true
    const intervalMs = parseInt(process.env.PREDICTION_INTERVAL_MS) || 1800000
    this.interval = setInterval(() => this.runAll(), intervalMs)
    // Run once after 30s startup
    setTimeout(() => this.runAll(), 30000)
    logger.info('Prediction service started (interval: ' + Math.round(intervalMs / 60000) + ' min)')
  }

  stop() {
    if (this.interval) { clearInterval(this.interval); this.interval = null; this.isRunning = false }
  }

  async runAll() {
    try {
      const silos = await Silo.find({ isActive: true })
      for (const silo of silos) {
        await this.predict(silo)
      }
    } catch (e) {
      logger.error('Prediction run error: ' + e.message)
    }
  }

  async predict(silo) {
    try {
      const since24h = new Date(Date.now() - 24 * 3600 * 1000)
      const readings = await SensorReading.find({ silo: silo._id, createdAt: { $gte: since24h } }).lean()
      if (readings.length < 2) return

      const avg = (arr, key) => arr.reduce((s, r) => s + (r[key] || 0), 0) / arr.length
      const avgTemp = avg(readings, 'temperature')
      const avgHumidity = avg(readings, 'humidity')
      const avgCo2 = avg(readings, 'co2')
      const avgO2 = avg(readings, 'o2')
      const storageDays = Math.round((Date.now() - silo.createdAt.getTime()) / 86400000)

      const result = computePrediction({ avgTemp, avgHumidity, avgCo2, avgO2, storageDays })

      const prediction = await Prediction.create({
        silo: silo._id,
        owner: silo.owner,
        spoilageRisk: result.spoilageRisk,
        estimatedSafeDays: result.estimatedSafeDays,
        sproutingRisk: result.sproutRisk,
        decayRisk: result.decayRisk,
        co2Risk: result.co2Risk,
        humidityRisk: result.humidRisk,
        recommendation: result.recommendation,
        inputs: { avgTemperature: avgTemp, avgHumidity, avgCo2, avgO2, storageDurationDays: storageDays },
        generatedAt: new Date(),
      })

      await EventLog.create({
        silo: silo._id,
        owner: silo.owner,
        eventType: 'prediction_generated',
        description: 'AI prediction: spoilage risk ' + result.spoilageRisk + '%, ' + result.estimatedSafeDays + ' safe days remaining.',
        triggeredBy: 'system',
        meta: result,
      })

      if (this.io) {
        this.io.to('farmer_' + silo.owner).emit('prediction_update', { siloId: silo._id, prediction: prediction.toObject() })
      }

      // Alert if high risk
      if (result.spoilageRisk > 60) {
        const Alert = require('../models/Alert')
        const { sendNotification } = require('../config/firebase')
        const User = require('../models/User')

        await Alert.create({
          silo: silo._id,
          siloName: silo.name,
          owner: silo.owner,
          type: 'sprouting_risk',
          message: 'Spoilage risk increased to ' + result.spoilageRisk + '% in ' + silo.name + '. ' + result.recommendation,
          severity: 'critical',
          triggeredBy: 'system',
        })

        const user = await User.findById(silo.owner)
        if (user && user.deviceTokens.length > 0) {
          await sendNotification(user.deviceTokens, 'Spoilage Risk Alert', 'Risk: ' + result.spoilageRisk + '% in ' + silo.name, { siloId: String(silo._id) })
        }
      }
    } catch (e) {
      logger.error('Predict error for ' + silo._id + ': ' + e.message)
    }
  }
}

module.exports = new PredictionService()
