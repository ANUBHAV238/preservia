const Alert = require('../models/Alert')
const Silo = require('../models/Silo')

// GET /api/alerts/:siloId
exports.getAlerts = async (req, res, next) => {
  try {
    const silo = await Silo.findOne({ _id: req.params.siloId, owner: req.user._id })
    if (!silo) return res.status(404).json({ success: false, message: 'Silo not found.' })

    const page = Math.max(parseInt(req.query.page) || 1, 1)
    const limit = Math.min(parseInt(req.query.limit) || 50, 200)
    const skip = (page - 1) * limit

    const [alerts, total] = await Promise.all([
      Alert.find({ silo: req.params.siloId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Alert.countDocuments({ silo: req.params.siloId }),
    ])

    res.json({ success: true, alerts, total, page, pages: Math.ceil(total / limit) })
  } catch (err) {
    next(err)
  }
}

// PATCH /api/alerts/:id/acknowledge
exports.acknowledgeAlert = async (req, res, next) => {
  try {
    const alert = await Alert.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { acknowledged: true, acknowledgedAt: new Date() },
      { new: true }
    )
    if (!alert) return res.status(404).json({ success: false, message: 'Alert not found.' })
    res.json({ success: true, alert })
  } catch (err) {
    next(err)
  }
}
