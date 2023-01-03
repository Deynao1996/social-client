import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthProvider } from '../contexts/AuthContext'
import { deletePost } from '../utils/service-utils'
import { useHandleError } from './useHandleError'

export const useOptimisticDeletePostData = (postId) => {
  const queryClient = useQueryClient()
  const { currentUser } = useAuthProvider()
  const { mutate, isError, error } = useMutation(deletePost, {
    onMutate: onHandleMutate,
    onError: onHandleError,
    onSettled: onHandleSettled
  })
  useHandleError(isError, error)

  async function onHandleMutate() {
    await queryClient.cancelQueries('timeline')
    const prevData = queryClient.getQueryData([
      'timeline',
      { userId: currentUser._id }
    ])
    queryClient.setQueryData(
      ['timeline', { userId: currentUser._id }],
      (oldQueryData) => {
        let clone = JSON.parse(JSON.stringify(oldQueryData))
        const prevTimeline = oldQueryData.pages[0].data.timeline
        const newPosts = prevTimeline.filter((post) => post._id !== postId)
        clone.pages[0].data.timeline = newPosts
        return clone
      }
    )
    return {
      prevData
    }
  }

  function onHandleError(_error, _hero, context) {
    queryClient.setQueriesData(
      ['timeline', { userId: currentUser._id }],
      context.prevData
    )
  }

  function onHandleSettled() {
    queryClient.invalidateQueries(['timeline'])
  }
  return { mutate }
}
