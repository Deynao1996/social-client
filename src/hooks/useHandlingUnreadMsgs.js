import { useMutation, useQueryClient } from '@tanstack/react-query'
import { clearUnreadMessageNotifications } from '../utils/service-utils'
import { useHandleError } from './useHandleError'

export const useHandlingUnreadMsgs = (conversationId, currentUserId, cb) => {
  const queryClient = useQueryClient()
  const { mutate, isError, error } = useMutation(
    clearUnreadMessageNotifications,
    {
      onSuccess: () => {
        queryClient.setQueryData(
          ['new-messages', currentUserId],
          (oldQueryData) => {
            return {
              data: [
                ...oldQueryData.data.filter(
                  (not) => not.meta.conversationId !== conversationId
                )
              ]
            }
          }
        )
        queryClient.invalidateQueries(['message-notifications', currentUserId])
        queryClient.invalidateQueries([
          'count-message-notifications',
          currentUserId
        ])
      }
    }
  )
  useHandleError(isError, error)

  return { mutate }
}
