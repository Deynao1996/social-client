import { useMutation, useQueryClient } from '@tanstack/react-query'
import { sendMessage } from '../utils/service-utils'
import { useHandleError } from './useHandleError'

export const useOptimisticMessageData = (conversationId) => {
  const queryClient = useQueryClient()
  const { mutate, isError, error } = useMutation(sendMessage, {
    onMutate: onHandleMutate,
    onError: onHandleError,
    onSettled: onHandleSettled
  })
  useHandleError(isError, error)

  async function onHandleMutate(newMessage) {
    await queryClient.cancelQueries('messages')
    const prevData = queryClient.getQueryData(['messages', conversationId])
    queryClient.setQueryData(['messages', conversationId], (oldData) => {
      return {
        ...oldData,
        data: [
          ...oldData.data,
          {
            _id: oldData?.data?.length + 1,
            createdAt: new Date(Date.now()),
            ...newMessage
          }
        ]
      }
    })
    return {
      prevData
    }
  }

  function onHandleError(_error, _hero, context) {
    queryClient.setQueriesData(['messages', conversationId], context.prevData)
  }

  function onHandleSettled() {
    queryClient.invalidateQueries(['messages', conversationId])
  }
  return { mutate }
}
