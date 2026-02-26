const mongoose = require('mongoose')

const predictionSchema = new mongoose.Schema(
  {
    silo: { type: mongoose.Schema.Types.ObjectId, ref: 'Silo', required: true, index: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    spoilageRisk: { type: Number, min: 0, max: 100 },
    estimatedSafeDays: { type: Number, min: 0 },
    sproutingRisk: { type: Number, min: 0, max: 100 },
    decayRisk: { type: Number, min: 0, max: 100 },
    co2Risk: { type: Number, min: 0, max: 100 },
    humidityRisk: { type: Number, min: 0, max: 100 },
    recommendation: { type: String },
    inputs: {
      avgTemperature: Number,
      avgHumidity: Number,
      avgCo2: Number,
      avgO2: Number,
      storageDurationDays: Number,
    },
    generatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

predictionSchema.index({ silo: 1, createdAt: -1 })

module.exports = mongoose.model('Prediction', predictionSchema)
