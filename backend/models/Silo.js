const mongoose = require('mongoose')

const thresholdSchema = new mongoose.Schema(
  {
    temperatureMin: { type: Number, default: 15 },
    temperatureMax: { type: Number, default: 22 },
    humidityMin: { type: Number, default: 60 },
    humidityMax: { type: Number, default: 72 },
    co2Min: { type: Number, default: 3 },
    co2Max: { type: Number, default: 5.5 },
    o2Min: { type: Number, default: 1 },
    o2Max: { type: Number, default: 3 },
    batteryMin: { type: Number, default: 20 },
  },
  { _id: false }
)

const stateSchema = new mongoose.Schema(
  {
    mode: { type: String, enum: ['auto', 'manual'], default: 'auto' },
    ventOpen: { type: Boolean, default: false },
    co2Active: { type: Boolean, default: false },
    n2Active: { type: Boolean, default: false },
  },
  { _id: false }
)

const siloSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Silo name is required'],
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    location: { type: String, trim: true },
    capacity: { type: Number, min: 0 }, // metric tonnes
    thresholds: { type: thresholdSchema, default: () => ({}) },
    state: { type: stateSchema, default: () => ({}) },
    lastReading: {
      temperature: Number,
      humidity: Number,
      co2: Number,
      o2: Number,
      battery: Number,
      healthScore: Number,
      estimatedDaysRemaining: Number,
      readingAt: Date,
    },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
)

siloSchema.index({ owner: 1 })

module.exports = mongoose.model('Silo', siloSchema)
