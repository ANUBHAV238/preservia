require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const Silo = require('../models/Silo')

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/preservia')
  console.log('Connected to MongoDB')

  // Create demo farmer
  const existingUser = await User.findOne({ email: 'demo@preservia.io' })
  let user = existingUser

  if (!existingUser) {
    user = await User.create({
      name: 'Demo Farmer',
      email: 'demo@preservia.io',
      password: 'Demo@1234',
      phone: '+91 98765 43210',
      role: 'farmer',
    })
    console.log('Created demo user: demo@preservia.io / Demo@1234')
  } else {
    console.log('Demo user already exists')
  }

  // Create demo silos
  const siloCount = await Silo.countDocuments({ owner: user._id })
  if (siloCount === 0) {
    await Silo.create([
      { name: 'Silo A — Main Storage', owner: user._id, location: 'Nashik, Maharashtra', capacity: 25 },
      { name: 'Silo B — North Block', owner: user._id, location: 'Nashik, Maharashtra', capacity: 15 },
    ])
    console.log('Created 2 demo silos')
  } else {
    console.log('Silos already exist')
  }

  console.log('Seed complete.')
  await mongoose.disconnect()
}

seed().catch((err) => { console.error(err); process.exit(1) })
