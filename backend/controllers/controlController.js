const Silo = require('../models/Silo')
const EventLog = require('../models/EventLog')
const Alert = require('../models/Alert')
const logger = require('../utils/logger')

const ACTIONS = {
  openVent: { field: 'ventOpen', value: true, event: 'vent_opened', desc: 'Vent manually opened.' },
  closeVent: { field: 'ventOpen', value: false, event: 'vent_closed', desc: 'Vent manually closed.' },
  activateCO2: { field: 'co2Active', value: true, event: 'co2_activated', desc: 'CO₂ injection activated manually.' },
  deactivateCO2: { field: 'co2Active', value: false, event: 'co2_activated', desc: 'CO₂ injection deactivated.' },
  activateN2: { field: 'n2Active', value: true, event: 'n2_activated', desc: 'N₂ flushing activated manually.' },
  deactivateN2: { field: 'n2Active', value: false, event: 'n2_activated', desc: 'N₂ flushing deactivated.' },
  switchMode: null, // handled separately
  resetSystem: null, // handled separately
}

// POST /api/control/:siloId
exports.executeControl = async (req, res, next) => {
  try {
    const { action } = req.body
    if (!action) return res.status(400).json({ success: false, message: 'Action is required.' })

    const silo = await Silo.findOne({ _id: req.params.siloId, owner: req.user._id })
    if (!silo) return res.status(404).json({ success: false, message: 'Silo not found.' })

    let eventType, description

    if (action === 'switchMode') {
      silo.state.mode = silo.state.mode === 'auto' ? 'manual' : 'auto'
      eventType = 'mode_switched'
      description = `Control mode switched to ${silo.state.mode}.`
    } else if (action === 'resetSystem') {
      silo.state = { mode: 'auto', ventOpen: false, co2Active: false, n2Active: false }
      eventType = 'system_reset'
      description = 'System reset to default safe state.'
    } else if (ACTIONS[action]) {
      const { field, value, event, desc } = ACTIONS[action]
      silo.state[field] = value
      eventType = event
      description = desc
    } else {
      return res.status(400).json({ success: false, message: `Unknown action: ${action}` })
    }

    await silo.save()

    // Log the event
    await EventLog.create({
      silo: silo._id,
      owner: req.user._id,
      eventType,
      description,
      triggeredBy: 'manual',
      userId: req.user._id,
      meta: { action },
    })

    // Create manual_override alert
    await Alert.create({
      silo: silo._id,
      siloName: silo.name,
      owner: req.user._id,
      type: 'manual_override',
      message: description,
      severity: 'info',
      triggeredBy: 'manual',
      actionType: action,
    })

    // Emit via socket (attached to req by socket service)
    if (req.io) {
      req.io.to(`farmer_${req.user._id}`).emit('control_update', {
        siloId: silo._id,
        state: silo.state,
      })
    }

    logger.info(`Control executed: ${action} on silo ${silo._id} by user ${req.user._id}`)
    res.json({ success: true, state: silo.state, action, description })
  } catch (err) {
    next(err)
  }
}

// GET /api/control/:siloId/logs
exports.getEventLogs = async (req, res, next) => {
  try {
    const EventLog = require('../models/EventLog')
    const silo = await Silo.findOne({ _id: req.params.siloId, owner: req.user._id })
    if (!silo) return res.status(404).json({ success: false, message: 'Silo not found.' })

    const logs = await EventLog.find({ silo: req.params.siloId })
      .sort({ createdAt: -1 })
      .limit(100)
      .lean()

    res.json({ success: true, logs })
  } catch (err) {
    next(err)
  }
}
