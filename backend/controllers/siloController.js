const Silo = require('../models/Silo')
const EventLog = require('../models/EventLog')
const logger = require('../utils/logger')

// POST /api/silos
exports.createSilo = async (req, res, next) => {
  try {
    const { name, location, capacity, thresholds } = req.body
    const silo = await Silo.create({
      name,
      location,
      capacity,
      thresholds,
      owner: req.user._id,
    })

    await EventLog.create({
      silo: silo._id,
      owner: req.user._id,
      eventType: 'silo_created',
      description: `Silo "${name}" created.`,
      triggeredBy: 'manual',
      userId: req.user._id,
    })

    logger.info(`Silo created: ${silo.name} by user ${req.user._id}`)
    res.status(201).json({ success: true, silo })
  } catch (err) {
    next(err)
  }
}

// GET /api/silos
exports.getSilos = async (req, res, next) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { owner: req.user._id }
    const silos = await Silo.find(filter).sort({ createdAt: -1 })
    res.json({ success: true, silos })
  } catch (err) {
    next(err)
  }
}

// PUT /api/silos/:id
exports.updateSilo = async (req, res, next) => {
  try {
    const silo = await Silo.findOne({ _id: req.params.id, owner: req.user._id })
    if (!silo) return res.status(404).json({ success: false, message: 'Silo not found.' })

    const { name, location, capacity, thresholds } = req.body
    if (name) silo.name = name
    if (location !== undefined) silo.location = location
    if (capacity !== undefined) silo.capacity = capacity
    if (thresholds) silo.thresholds = { ...silo.thresholds.toObject(), ...thresholds }

    await silo.save()

    await EventLog.create({
      silo: silo._id,
      owner: req.user._id,
      eventType: 'silo_updated',
      description: `Silo "${silo.name}" updated.`,
      triggeredBy: 'manual',
      userId: req.user._id,
      meta: req.body,
    })

    res.json({ success: true, silo })
  } catch (err) {
    next(err)
  }
}

// DELETE /api/silos/:id
exports.deleteSilo = async (req, res, next) => {
  try {
    const silo = await Silo.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
    if (!silo) return res.status(404).json({ success: false, message: 'Silo not found.' })

    logger.info(`Silo deleted: ${silo.name} by user ${req.user._id}`)
    res.json({ success: true, message: 'Silo deleted successfully.' })
  } catch (err) {
    next(err)
  }
}
