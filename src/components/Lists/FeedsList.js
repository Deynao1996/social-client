import { Box, Chip, Divider, List } from '@mui/material'
import React, { Fragment, useEffect, useRef } from 'react'
import { useIsInViewPort } from '../../hooks/useIsInViewPort'
import Feed from '../Feed/Feed'
import { withDeleteFeed } from '../../hoc/withDeleteFeed'
import CustomSkeleton from '../LoadingUI/CustomSkeleton'
import { useMemo } from 'react'
import { useInfiniteTimelineData } from '../../hooks/useInfiniteTimelineData'
import { useAuthProvider } from '../../contexts/AuthContext'

const FeedsList = ({
  tagSearchParam,
  mediaSearchParam,
  skipCurrentUser,
  userId
}) => {
  const triggerRef = useRef()
  const inView = useIsInViewPort(triggerRef)
  const { currentUser } = useAuthProvider()
  const currentUserId = currentUser?._id
  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage
  } = useInfiniteTimelineData({
    userId,
    tagSearchParam,
    mediaSearchParam,
    skipCurrentUser
  })
  const isCustomLoading = isLoading || isError

  function createListElement(feed) {
    if (feed.userId === currentUserId) {
      const FeedWithDelete = withDeleteFeed(Feed, currentUserId)
      return <FeedWithDelete key={feed._id} {...feed} />
    } else {
      return <Feed key={feed._id} {...feed} />
    }
  }

  function renderFeedsList() {
    return (
      <List sx={{ paddingBottom: { xs: 7, md: 1 } }}>
        {data?.pages.map((group, i) => {
          return (
            <Fragment key={i}>
              {group.data.timeline.map(createListElement)}
            </Fragment>
          )
        })}
      </List>
    )
  }

  const feedsContent = useMemo(() => renderFeedsList(), [data])

  useEffect(() => {
    if (hasNextPage && inView) fetchNextPage()
  }, [inView])

  return (
    <>
      {isCustomLoading && <CustomSkeleton type="feeds" count={2} />}
      {data?.pages[0].data.timeline.length === 0 && (
        <Divider component="li" sx={{ marginTop: 2 }}>
          <Chip label="Still no any post here" />
        </Divider>
      )}
      {feedsContent}
      {isFetchingNextPage && <CustomSkeleton type="feeds" count={1} />}
      <Box
        ref={triggerRef}
        sx={{
          position: 'absolute',
          pointeEvents: 'none',
          visibility: 'hidden',
          bottom: '10%',
          width: '5px',
          height: '5px'
        }}
      ></Box>
    </>
  )
}

export default FeedsList
