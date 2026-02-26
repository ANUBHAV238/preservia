const express = require('express')
const { body } = require('express-validator')
const router = express.Router()
const authController = require('../controllers/authController')
const siloController = require('../controllers/siloController')
const sensorController = require('../controllers/sensorController')
const alertController = require('../controllers/alertController')
const predictionController = require('../controllers/predictionController')
const controlController = require('../controllers/controlController')
const { protect, authorize } = require('../middleware/auth')
const validate = require('../middleware/validate')

// ── Auth Routes ──────────────────────────────────────────────────────────────
router.post('/auth/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  ],
  validate,
  authController.register
)

router.post('/auth/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  authController.login
)

router.post('/auth/device-token', protect, authController.registerDeviceToken)
router.get('/auth/me', protect, authController.getMe)

// ── Silo Routes ───────────────────────────────────────────────────────────────
router.post('/silos', protect, siloController.createSilo)
router.get('/silos', protect, siloController.getSilos)
router.put('/silos/:id', protect, siloController.updateSilo)
router.delete('/silos/:id', protect, siloController.deleteSilo)

// ── Sensor Routes ─────────────────────────────────────────────────────────────
router.get('/sensor/:siloId', protect, sensorController.getLatestReading)
router.get('/sensor/history/:siloId', protect, sensorController.getHistory)

// ── Alert Routes ──────────────────────────────────────────────────────────────
router.get('/alerts/:siloId', protect, alertController.getAlerts)
router.patch('/alerts/:id/acknowledge', protect, alertController.acknowledgeAlert)

// ── Prediction Routes ─────────────────────────────────────────────────────────
router.get('/prediction/:siloId', protect, predictionController.getPrediction)
router.get('/prediction/history/:siloId', protect, predictionController.getPredictionHistory)

// ── Control Routes ────────────────────────────────────────────────────────────
router.post('/control/:siloId',
  protect,
  [body('action').notEmpty().withMessage('Action is required')],
  validate,
  controlController.executeControl
)
router.get('/control/:siloId/logs', protect, controlController.getEventLogs)

module.exports = router
