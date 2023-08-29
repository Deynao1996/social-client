import { Avatar, Box, MenuItem, Typography } from '@mui/material'
import { formatDistance } from 'date-fns'
import { StyledLink } from '../styled'
import {
  getFullName,
  replaceFirebaseEndpoint
} from '../utils/string-transforms-utils'
import { AVATAR_TRANSFORMATION_CFG } from '../storage'

const Notification = ({ not, handleClose }) => {
  if (not.type === 'new-message') return
  const fullName = getFullName(not.userInfo[0].lastName, not.userInfo[0].name)
  const timeAgo = formatDistance(new Date(not.createdAt), new Date(), {
    addSuffix: true
  })

  function setNotificationText(type) {
    switch (type) {
      case 'new-follower':
        return 'started following you'
      case 'new-unfollower':
        return 'unfollowed you'
      case 'new-comment':
        return 'sent you a comment'
      case 'new-like':
        return 'licked your post'
      case 'new-message':
        return 'sent you a message'
      case 'new-conversation':
        return 'started conversation with you'
      default:
        return ''
    }
  }

  function setPath(notification) {
    if (!notification.meta) return `/profile/${notification.senderId}`
    if (notification.meta.postId) return `?post=${notification.meta.postId}`
    if (notification.meta.conversationId)
      return `/chat/${notification.meta.conversationId}`
    return '/'
  }

  const description = `${fullName} ${setNotificationText(not.type)}`

  return (
    <MenuItem>
      <Box
        component={StyledLink}
        to={setPath(not)}
        onClick={handleClose}
        sx={{ display: 'flex' }}
      >
        <Avatar
          alt={fullName}
          src={replaceFirebaseEndpoint(
            not.userInfo[0].profilePicture,
            AVATAR_TRANSFORMATION_CFG
          )}
          sx={{ mr: 1 }}
        />
        <div>
          <Typography component="div">{description}</Typography>
          <Typography component="div" variant="caption">
            {timeAgo}
          </Typography>
        </div>
      </Box>
    </MenuItem>
  )
}

export default Notification
