const mongoose = require('mongoose')

const alertSchema = new mongoose.Schema(
  {
    silo: { type: mongoose.Schema.Types.ObjectId, ref: 'Silo', required: true, index: true },
    siloName: { type: String },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: {
      type: String,
      enum: [
        'temperature_exceed', 'humidity_exceed', 'co2_exceed', 'o2_breach',
        'battery_low', 'sprouting_risk', 'decay_risk', 'system_warning', 'manual_override',
      ],
      required: true,
    },
    message: { type: String, required: true },
    description: { type: String },
    severity: { type: String, enum: ['info', 'warning', 'critical'], default: 'warning' },
    triggeredBy: { type: String, enum: ['system', 'manual'], default: 'system' },
    actionType: { type: String },
    value: { type: Number },  // the offending sensor value
    threshold: { type: Number }, // the threshold that was crossed
    acknowledged: { type: Boolean, default: false },
    acknowledgedAt: { type: Date },
  },
  { timestamps: true }
)

alertSchema.index({ owner: 1, createdAt: -1 })

module.exports = mongoose.model('Alert', alertSchema)
