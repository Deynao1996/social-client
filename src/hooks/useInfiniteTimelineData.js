import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchTimeline } from '../utils/service-utils'
import { useHandleError } from './useHandleError'

export const useInfiniteTimelineData = ({
  userId,
  tagSearchParam,
  mediaSearchParam,
  skipCurrentUser
}) => {
  const {
    data,
    isLoading,
    isFetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isError,
    error
  } = useInfiniteQuery(
    [
      'timeline',
      {
        userId,
        tags: tagSearchParam,
        mediaType: mediaSearchParam,
        skipCurrentUser
      }
    ],
    ({ pageParam = 1, queryKey }) => fetchTimeline({ queryKey, pageParam }),
    {
      refetchOnWindowFocus: false,
      enabled: !!userId,
      getNextPageParam: (lastPage, pages) => {
        if (pages.length < lastPage.data.totalPages) {
          return pages.length + 1
        } else {
          return undefined
        }
      }
    }
  )
  useHandleError(isError, error)

  return {
    data,
    isLoading,
    isError,
    isFetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage
  }
}
