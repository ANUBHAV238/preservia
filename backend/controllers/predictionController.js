const Prediction = require('../models/Prediction')
const Silo = require('../models/Silo')

// GET /api/prediction/:siloId
exports.getPrediction = async (req, res, next) => {
  try {
    const silo = await Silo.findOne({ _id: req.params.siloId, owner: req.user._id })
    if (!silo) return res.status(404).json({ success: false, message: 'Silo not found.' })

    const prediction = await Prediction.findOne({ silo: req.params.siloId })
      .sort({ createdAt: -1 })
      .lean()

    res.json({ success: true, prediction })
  } catch (err) {
    next(err)
  }
}

// GET /api/prediction/history/:siloId
exports.getPredictionHistory = async (req, res, next) => {
  try {
    const silo = await Silo.findOne({ _id: req.params.siloId, owner: req.user._id })
    if (!silo) return res.status(404).json({ success: false, message: 'Silo not found.' })

    const predictions = await Prediction.find({ silo: req.params.siloId })
      .sort({ createdAt: -1 })
      .limit(30)
      .lean()

    res.json({ success: true, predictions })
  } catch (err) {
    next(err)
  }
}
