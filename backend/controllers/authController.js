const jwt = require('jsonwebtoken')
const User = require('../models/User')
const logger = require('../utils/logger')

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' })

// POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body

    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' })
    }

    const user = await User.create({ name, email, password, phone })
    const token = generateToken(user._id)

    logger.info(`New user registered: ${email}`)
    res.status(201).json({ success: true, token, user })
  } catch (err) {
    next(err)
  }
}

// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' })
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account has been deactivated.' })
    }

    user.lastLogin = new Date()
    await user.save({ validateBeforeSave: false })

    const token = generateToken(user._id)
    logger.info(`User logged in: ${email}`)
    res.json({ success: true, token, user })
  } catch (err) {
    next(err)
  }
}

// POST /api/auth/device-token
exports.registerDeviceToken = async (req, res, next) => {
  try {
    const { token } = req.body
    if (!token) return res.status(400).json({ success: false, message: 'Device token required.' })

    const user = await User.findById(req.user._id)
    if (!user.deviceTokens.includes(token)) {
      user.deviceTokens.push(token)
      await user.save({ validateBeforeSave: false })
    }

    res.json({ success: true, message: 'Device token registered.' })
  } catch (err) {
    next(err)
  }
}

// GET /api/auth/me
exports.getMe = async (req, res) => {
  res.json({ success: true, user: req.user })
}
