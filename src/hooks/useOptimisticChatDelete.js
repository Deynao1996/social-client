import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteConversation } from '../utils/service-utils'
import { useHandleError } from './useHandleError'

export const useOptimisticChatDelete = (
  selectedConversationId,
  currentUserId
) => {
  const queryClient = useQueryClient()
  const { mutate, isError, error } = useMutation(deleteConversation, {
    onMutate: onHandleMutate,
    onError: onHandleError,
    onSettled: onHandleSettled
  })
  useHandleError(isError, error)

  async function onHandleMutate() {
    await queryClient.cancelQueries('conversations')
    const prevData = queryClient.getQueryData(['conversations', currentUserId])
    queryClient.setQueryData(['conversations', currentUserId], (oldData) => {
      return {
        ...oldData,
        data: [
          ...oldData.data.filter(
            (conversation) => conversation._id === selectedConversationId
          )
        ]
      }
    })
    return {
      prevData
    }
  }

  function onHandleError(_error, _hero, context) {
    queryClient.setQueriesData(
      ['conversations', currentUserId],
      context.prevData
    )
  }

  function onHandleSettled() {
    queryClient.invalidateQueries(['conversations', currentUserId])
  }
  return { mutate }
}
