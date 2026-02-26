const SensorReading = require('../models/SensorReading')
const Silo = require('../models/Silo')

// GET /api/sensor/:siloId — latest reading
exports.getLatestReading = async (req, res, next) => {
  try {
    const silo = await Silo.findOne({ _id: req.params.siloId, owner: req.user._id })
    if (!silo) return res.status(404).json({ success: false, message: 'Silo not found.' })

    const reading = await SensorReading.findOne({ silo: req.params.siloId }).sort({ createdAt: -1 })
    res.json({ success: true, reading: reading || silo.lastReading })
  } catch (err) {
    next(err)
  }
}

// GET /api/sensor/history/:siloId
exports.getHistory = async (req, res, next) => {
  try {
    const silo = await Silo.findOne({ _id: req.params.siloId, owner: req.user._id })
    if (!silo) return res.status(404).json({ success: false, message: 'Silo not found.' })

    const hours = Math.min(parseInt(req.query.hours) || 24, 720)
    const since = new Date(Date.now() - hours * 60 * 60 * 1000)

    const readings = await SensorReading.find({
      silo: req.params.siloId,
      createdAt: { $gte: since },
    })
      .sort({ createdAt: 1 })
      .select('temperature humidity co2 o2 battery healthScore createdAt')
      .limit(1000)
      .lean()

    res.json({ success: true, readings, count: readings.length })
  } catch (err) {
    next(err)
  }
}
