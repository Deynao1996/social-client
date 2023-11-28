import { formatDistance } from 'date-fns'
import { useCallback, useState } from 'react'
import styled from '@emotion/styled'
import { ExpandMore as ExpandMoreIcon, MoreVert } from '@mui/icons-material'
import {
  Avatar,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  Link,
  ListItem,
  Typography
} from '@mui/material'
import { StyledLink } from '../../styled'
import Likes from './Likes'
import { Link as RouterLink } from 'react-router-dom'
import Media from './Media'
import Comments from '../Comments/Comments'
import {
  getFullName,
  replaceFirebaseEndpoint
} from '../../utils/string-transforms-utils'
import FeedOptionsMenu from '../MenuUI/FeedOptionsMenu'
import { AVATAR_TRANSFORMATION_CFG } from '../../storage'

const ExpandMore = styled((props) => {
  const { expand, ...other } = props
  return <IconButton {...other} />
})(({ theme, expand, disabled }) => ({
  pointerEvents: disabled ? 'none' : 'auto',
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest
  })
}))

const Feed = ({
  media,
  mediaType,
  tags,
  descr,
  comments,
  _id,
  createdAt,
  userInfo,
  likes,
  userId,
  renderConfirmDialog,
  renderDeleteItem
}) => {
  const [expanded, setExpanded] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const timeAgo = formatDistance(new Date(createdAt), new Date(), {
    addSuffix: true
  })
  const tagsArr = tags === '' ? [] : tags.split('#').filter((n) => n)
  const [user] = userInfo
  const fullName = getFullName(user.lastName, user.name)

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null)
  }, [setAnchorEl])

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  function setCommentsDescr() {
    const count = comments.length
    return `${comments.length} ${count === 1 ? 'comment' : 'comments'}`
  }

  return (
    <ListItem>
      {renderConfirmDialog?.()}
      <Card sx={{ width: '100%' }}>
        <CardHeader
          avatar={
            <StyledLink to={`/profile/${userId}`}>
              <Avatar
                alt={'Profile picture of ' + fullName}
                src={replaceFirebaseEndpoint(
                  user.profilePicture,
                  AVATAR_TRANSFORMATION_CFG
                )}
              />
            </StyledLink>
          }
          action={
            <IconButton aria-label="settings" onClick={handleMenuClick}>
              <MoreVert />
            </IconButton>
          }
          title={fullName}
          titleTypographyProps={{
            sx: { fontWeight: 500 }
          }}
          subheader={timeAgo}
        />
        {!!media?.src && <Media mediaType={mediaType} media={media.src} />}
        <CardContent sx={{ paddingX: 2, paddingY: !!media?.src ? 2 : 0 }}>
          {tagsArr.length !== 0 &&
            tagsArr.map((tag, i) => (
              <Link
                component={RouterLink}
                to={{
                  pathname: `/search`,
                  search: `?tag=${tag}`
                }}
                key={i}
              >
                #{tag}
              </Link>
            ))}
          <Typography variant="body2" color="text.primary">
            {descr}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <Likes likes={likes} postId={_id} userId={userId} />
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </ExpandMore>
          <Typography variant="body2">{setCommentsDescr()}</Typography>
        </CardActions>
        <Comments
          comments={comments}
          expanded={expanded}
          postId={_id}
          userId={userId}
        />
        <FeedOptionsMenu
          postId={_id}
          anchorEl={anchorEl}
          handleMenuClose={handleMenuClose}
          renderDeleteItem={renderDeleteItem}
        />
      </Card>
    </ListItem>
  )
}

export default Feed
