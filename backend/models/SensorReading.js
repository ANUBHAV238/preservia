const mongoose = require('mongoose')

const sensorReadingSchema = new mongoose.Schema(
  {
    silo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Silo',
      required: true,
      index: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    temperature: { type: Number, required: true },
    humidity: { type: Number, required: true },
    co2: { type: Number, required: true },
    o2: { type: Number, required: true },
    battery: { type: Number, required: true },
    healthScore: { type: Number, min: 0, max: 100 },
    estimatedDaysRemaining: { type: Number },
    source: {
      type: String,
      enum: ['simulation', 'hardware', 'manual'],
      default: 'simulation',
    },
  },
  {
    timestamps: true,
  }
)

// TTL index — auto-delete readings older than 90 days
sensorReadingSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 })
sensorReadingSchema.index({ silo: 1, createdAt: -1 })

module.exports = mongoose.model('SensorReading', sensorReadingSchema)
