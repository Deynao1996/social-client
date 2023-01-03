import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useState } from 'react'
import { useAuthProvider } from '../../contexts/AuthContext'
import { useSocketProvider } from '../../contexts/SocketContext'
import { useHandleError } from '../../hooks/useHandleError'
import { fetchUsers } from '../../utils/service-utils'

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min)
}

const OnlineFriendsList = ({ renderOnlineFriendsList }) => {
  const { socket } = useSocketProvider()
  const { currentUser } = useAuthProvider()
  const [onlineUserIds, setOnlineUserIds] = useState([])
  const {
    data = [],
    isError,
    error
  } = useQuery(
    ['online-users', onlineUserIds],
    () => fetchUsers(onlineUserIds),
    {
      enabled: !!onlineUserIds.length && !!currentUser?._id,
      refetchOnWindowFocus: false,
      select: (data) => {
        return data?.data
          .filter((user) => user._id !== currentUser?._id)
          .map((user) => ({ ...user, isOnline: true }))
      }
    }
  )
  useHandleError(isError, error)

  const handleSetOnlineUserIds = useCallback((data) => {
    setOnlineUserIds(() => data.map((item) => item.userId))
  }, [])

  function setFakeFriendIds() {
    if (currentUser && currentUser.following.length !== 0) {
      const friends = currentUser.following
      const userFriendsCount = friends.length
      const randomNumber = getRandomNumber(1, userFriendsCount + 1)
      const fakeArr = friends.slice(-randomNumber)
      setOnlineUserIds(fakeArr)
    }
  }

  useEffect(() => {
    if (process.env.REACT_APP_WITH_SOCKETIO === 'true') {
      if (currentUser && socket) {
        socket.emit('add-user', currentUser?._id)
        socket.on('get-online-users', handleSetOnlineUserIds)
        return () => socket.off('get-online-users', handleSetOnlineUserIds)
      }
    }
  }, [currentUser, socket, handleSetOnlineUserIds])

  useEffect(() => {
    if (process.env.REACT_APP_WITH_SOCKETIO === 'false') {
      currentUser && setFakeFriendIds()
    }
  }, [currentUser])

  return renderOnlineFriendsList(data)
}

export default OnlineFriendsList
