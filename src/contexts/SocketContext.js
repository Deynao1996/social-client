import React, { useContext, useRef } from 'react'
import { io } from 'socket.io-client'

const SocketContext = React.createContext()

export const useSocketProvider = () => {
  return useContext(SocketContext)
}

const socket =
  process.env.REACT_APP_WITH_SOCKETIO === 'true'
    ? io('ws://localhost:8900')
    : null

export const SocketProvider = ({ children }) => {
  const socketRef = useRef()

  const emitCurrentUser = (currentUserId) => {
    currentUserId && socket.emit('add-user', currentUserId)
  }

  const handleDisconnect = () => {
    socket.disconnect()
  }

  const handleConnect = (currentUserId) => {
    emitCurrentUser(currentUserId)
  }

  const value = {
    socketRef,
    socket,
    handleDisconnect,
    handleConnect
  }

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  )
}
