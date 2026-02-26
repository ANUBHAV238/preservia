import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from './AuthContext'

const SocketContext = createContext(null)

export function SocketProvider({ children }) {
  const { user } = useAuth()
  const socketRef = useRef(null)
  const [connected, setConnected] = useState(false)
  const [sensorData, setSensorData] = useState({})
  const [alerts, setAlerts] = useState([])
  const [predictions, setPredictions] = useState({})
  const [controlUpdates, setControlUpdates] = useState({})

  useEffect(() => {
    if (!user) {
      socketRef.current?.disconnect()
      socketRef.current = null
      setConnected(false)
      return
    }

    const token = localStorage.getItem('preservia_token')
    const socket = io(import.meta.env.VITE_SOCKET_URL || window.location.origin, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    })

    socketRef.current = socket

    socket.on('connect', () => {
      setConnected(true)
      // Join farmer's room
      socket.emit('join_farmer_room', { farmerId: user.id })
    })

    socket.on('disconnect', () => setConnected(false))

    socket.on('sensor_update', ({ siloId, data }) => {
      setSensorData((prev) => ({ ...prev, [siloId]: data }))
    })

    socket.on('alert_triggered', (alert) => {
      setAlerts((prev) => [alert, ...prev.slice(0, 49)])
    })

    socket.on('prediction_update', ({ siloId, prediction }) => {
      setPredictions((prev) => ({ ...prev, [siloId]: prediction }))
    })

    socket.on('control_update', ({ siloId, state }) => {
      setControlUpdates((prev) => ({ ...prev, [siloId]: state }))
    })

    return () => {
      socket.disconnect()
    }
  }, [user])

  const emit = (event, data) => {
    socketRef.current?.emit(event, data)
  }

  return (
    <SocketContext.Provider value={{ connected, sensorData, alerts, predictions, controlUpdates, emit }}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => {
  const ctx = useContext(SocketContext)
  if (!ctx) throw new Error('useSocket must be used within SocketProvider')
  return ctx
}
