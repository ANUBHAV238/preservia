const mongoose = require('mongoose')

const eventLogSchema = new mongoose.Schema(
  {
    silo: { type: mongoose.Schema.Types.ObjectId, ref: 'Silo', required: true, index: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    eventType: {
      type: String,
      enum: [
        'vent_opened', 'vent_closed', 'mode_switched', 'co2_activated',
        'n2_activated', 'threshold_exceeded', 'alert_triggered',
        'sensor_calibrated', 'prediction_generated', 'system_reset',
        'firmware_updated', 'silo_created', 'silo_updated', 'manual_override',
      ],
      required: true,
    },
    description: { type: String, required: true },
    triggeredBy: { type: String, enum: ['system', 'manual'], default: 'system' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    meta: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
)

eventLogSchema.index({ silo: 1, createdAt: -1 })

module.exports = mongoose.model('EventLog', eventLogSchema)
