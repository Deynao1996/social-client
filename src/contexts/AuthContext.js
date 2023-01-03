import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginWithJWT } from '../utils/service-utils'
import { useSnackbar } from 'notistack'
import { useSocketProvider } from './SocketContext'

const AuthContext = React.createContext()

export const useAuthProvider = () => {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
  const { handleDisconnect, handleConnect } = useSocketProvider()
  const [currentUser, setCurrentUser] = useState(null)
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  const login = (user, to) => {
    setCurrentUser(user)
    to && navigate(to)
    return user
  }

  const logOut = () => {
    localStorage.removeItem('token')
    setCurrentUser(null)
    if (process.env.REACT_APP_WITH_SOCKETIO === 'true') handleDisconnect()
    navigate('/auth/login', { replace: true })
  }

  useEffect(() => {
    if (process.env.REACT_APP_WITH_SOCKETIO === 'true') {
      if (currentUser) {
        handleConnect(currentUser._id)
        return () => {
          handleDisconnect()
        }
      }
    }
  }, [currentUser])

  useEffect(() => {
    const currentToken = localStorage.getItem('token')
    if (currentToken) {
      loginWithJWT(currentToken)
        .then((user) => login(user.data))
        .catch((e) => {
          enqueueSnackbar(e.message, { variant: 'error' })
          logOut()
        })
    } else {
      navigate('/auth/login', { replace: true })
    }
  }, [])

  const value = {
    setCurrentUser,
    currentUser,
    login,
    logOut
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
