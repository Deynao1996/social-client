import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect } from 'react'
import { useAuthProvider } from '../../contexts/AuthContext'
import { useSocketProvider } from '../../contexts/SocketContext'
import { useHandleError } from '../../hooks/useHandleError'
import { countMessages } from '../../utils/service-utils'

const ChatInfo = ({ renderContent }) => {
  const { currentUser } = useAuthProvider()
  const { socket } = useSocketProvider()
  const queryClient = useQueryClient()
  const userId = currentUser?._id

  const { data, isError, error } = useQuery(
    ['count-message-notifications', userId],
    () => countMessages(userId),
    {
      enabled: !!userId,
      refetchOnWindowFocus: false
    }
  )
  useHandleError(isError, error)

  const handleSetNotificationCountFromWS = useCallback(() => {
    queryClient.setQueryData(
      ['count-message-notifications', userId],
      (oldData) => {
        return {
          ...oldData,
          data: { newMessagesCount: oldData.data.newMessagesCount + 1 }
        }
      }
    )
  }, [])

  useEffect(() => {
    if (process.env.REACT_APP_WITH_SOCKETIO === 'true') {
      socket?.on('get-message-notification', handleSetNotificationCountFromWS)
      return () =>
        socket?.off(
          'get-message-notification',
          handleSetNotificationCountFromWS
        )
    }
  }, [handleSetNotificationCountFromWS])

  return renderContent(data)
}

export default ChatInfo
