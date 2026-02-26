const admin = require('firebase-admin')
const logger = require('../utils/logger')

let app = null

const initFirebase = () => {
  if (process.env.FIREBASE_ENABLED !== 'true') {
    logger.info('Firebase disabled via FIREBASE_ENABLED env. Push notifications will be skipped.')
    return
  }

  try {
    app = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        clientId: process.env.FIREBASE_CLIENT_ID,
      }),
    })
    logger.info('Firebase Admin SDK initialized')
  } catch (err) {
    logger.error('Firebase initialization failed:', err.message)
  }
}

const sendNotification = async (tokens, title, body, data = {}) => {
  if (!app || !tokens?.length) return

  const cleanTokens = tokens.filter(Boolean)
  if (!cleanTokens.length) return

  try {
    const message = {
      notification: { title, body },
      data: Object.fromEntries(Object.entries(data).map(([k, v]) => [k, String(v)])),
      tokens: cleanTokens,
    }
    const response = await admin.messaging(app).sendEachForMulticast(message)
    logger.info(`Push notification sent. Success: ${response.successCount}, Failure: ${response.failureCount}`)
    return response
  } catch (err) {
    logger.error('Failed to send push notification:', err.message)
  }
}

module.exports = { initFirebase, sendNotification }
