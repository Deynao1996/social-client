import {
  Avatar,
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Dialog,
  Grid,
  IconButton,
  Typography
} from '@mui/material'
import { Close, LibraryMusic } from '@mui/icons-material'
import { useState } from 'react'
import { useHandleError } from '../../hooks/useHandleError'
import { fetchPost } from '../../utils/service-utils'
import { useQuery } from '@tanstack/react-query'
import { formatDistance } from 'date-fns'
import {
  getFullName,
  replaceFirebaseEndpoint
} from '../../utils/string-transforms-utils'
import { useSearchParams } from 'react-router-dom'
import Likes from '../Feed/Likes'
import Comments from '../Comments/Comments'
import { useEffect } from 'react'
import { setMediaConfig, StyledAudioMedia } from '../Feed/Media'
import BackdropLoading from '../LoadingUI/BackdropLoading'
import { AVATAR_TRANSFORMATION_CFG } from '../../storage'

const SingleFeedDialog = () => {
  const [searchParams, setSearchParams] = useSearchParams({})
  const postId = searchParams.get('post')
  const [open, setOpen] = useState(false)
  const { data, isLoading, isFetching, isError, error } = useQuery(
    ['post', postId],
    () => fetchPost(postId),
    {
      enabled: !!open && !!postId,
      refetchOnWindowFocus: false
    }
  )
  useHandleError(isError, error)
  const post = data?.data[0]
  const isMediaProvided = !!post?.media?.src

  const timeAgo = post
    ? formatDistance(new Date(post.createdAt), new Date(), {
        addSuffix: true
      })
    : 'recently'
  const fullName = post
    ? getFullName(post?.userInfo[0].lastName, post?.userInfo[0].name)
    : ''

  const handleClose = () => {
    setSearchParams({})
    setOpen(false)
  }

  useEffect(() => {
    postId && setOpen(true)
  }, [postId])

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg">
      {isLoading || isError || isFetching ? (
        <BackdropLoading />
      ) : (
        <Card
          component={Grid}
          container
          sx={{ height: '80vh', overflowY: 'auto' }}
        >
          {isMediaProvided && (
            <Grid item xs={12} sm={6}>
              <CustomMedia
                media={post?.media.src}
                mediaType={post?.mediaType}
              />
            </Grid>
          )}
          <Grid item xs={12} sm={isMediaProvided ? 6 : 12}>
            <CardHeader
              avatar={
                <Avatar
                  aria-label="recipe"
                  alt={fullName}
                  src={replaceFirebaseEndpoint(
                    post?.userInfo[0].profilePicture,
                    AVATAR_TRANSFORMATION_CFG
                  )}
                />
              }
              action={
                <IconButton onClick={handleClose}>
                  <Close />
                </IconButton>
              }
              title={fullName}
              subheader={timeAgo}
            />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {post?.descr}
              </Typography>
            </CardContent>
            <CardActions disableSpacing>
              <Likes
                likes={post?.likes}
                postId={postId}
                userId={post?.userId}
              />
            </CardActions>
            <Comments
              comments={post?.comments}
              expanded={true}
              postId={postId}
              userId={post?.userId}
              limit={2}
              disableScroll={true}
            />
          </Grid>
        </Card>
      )}
    </Dialog>
  )
}

const CustomMedia = ({ mediaType, media }) => {
  const cfg = setMediaConfig(mediaType, media)

  switch (mediaType) {
    case 'audio':
      return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: 600,
            height: '100%',
            paddingTop: 2,
            flexDirection: 'column'
          }}
        >
          <Avatar sx={{ width: 150, height: 150, marginBottom: 4 }}>
            <LibraryMusic sx={{ width: 100, height: 100 }} />
          </Avatar>
          <StyledAudioMedia {...cfg} />
        </Box>
      )
    case 'image':
      return (
        <CardMedia
          height="100%"
          {...{
            ...cfg,
            src: replaceFirebaseEndpoint(cfg.src, '&tr=fo-auto,w-1200'),
            srcSet: `${replaceFirebaseEndpoint(
              cfg.src,
              '&tr=fo-auto,w-1200'
            )} 1200w, ${replaceFirebaseEndpoint(
              cfg.src,
              '&tr=fo-auto,w-600'
            )} 600w`
          }}
        />
      )
    case 'video':
      return (
        <CardMedia
          {...cfg}
          sx={{
            height: '100%',
            width: '100%',
            objectFit: 'cover'
          }}
        />
      )
    default:
      return
  }
}

export default SingleFeedDialog
