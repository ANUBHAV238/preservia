const { socketAuth } = require('../middleware/auth')
const logger = require('../utils/logger')

module.exports = (io) => {
  // Authenticate every socket connection
  io.use(socketAuth)

  io.on('connection', (socket) => {
    const userId = socket.user._id.toString()
    logger.info('Socket connected: user ' + userId)

    // Client emits join_farmer_room after connect
    socket.on('join_farmer_room', ({ farmerId }) => {
      const roomId = 'farmer_' + farmerId
      socket.join(roomId)
      logger.debug('Socket joined room: ' + roomId)
    })

    // Auto-join based on auth user
    socket.join('farmer_' + userId)

    socket.on('disconnect', (reason) => {
      logger.info('Socket disconnected: user ' + userId + ' (' + reason + ')')
    })

    socket.on('error', (err) => {
      logger.error('Socket error for user ' + userId + ': ' + err.message)
    })
  })
}
