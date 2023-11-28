import {
  Avatar,
  Divider,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography
} from '@mui/material'
import { formatDistance } from 'date-fns'
import { Fragment } from 'react'
import { AVATAR_TRANSFORMATION_CFG } from '../storage'
import { replaceFirebaseEndpoint } from '../utils/string-transforms-utils'

const Message = ({
  msg,
  i,
  arr,
  currentUser,
  isShowMessageDivider,
  data = 0
}) => {
  const timeAgo = formatDistance(new Date(msg.createdAt), new Date(), {
    addSuffix: true
  })
  const isOwner = msg.sender.senderId === currentUser?._id
  const isDividerPassed = isShowMessageDivider && i === arr.length - data

  return (
    <Fragment>
      {isDividerPassed && <Divider component="li">Unread messages</Divider>}
      <ListItem
        alignItems="flex-start"
        sx={{
          width: { xs: '90%', md: '70%' },
          paddingY: 0,
          ...(isOwner ? { marginRight: 'auto' } : { marginLeft: 'auto' })
        }}
      >
        <ListItemAvatar>
          <Avatar
            alt={`Profile picture of ${msg.sender.fullName}`}
            src={replaceFirebaseEndpoint(
              msg.sender.profilePicture,
              AVATAR_TRANSFORMATION_CFG
            )}
          />
        </ListItemAvatar>
        <ListItemText
          primary={msg.text}
          primaryTypographyProps={{
            sx: {
              minWidth: 'min-content',
              borderRadius: '10px',
              p: 1.2,
              backgroundColor: isOwner ? 'info.dark' : 'divider',
              color: (theme) =>
                theme.palette.mode === 'light' && isOwner ? 'white' : 'inherit'
            }
          }}
          secondary={
            <Typography
              component="div"
              variant="caption"
              color="text.secondary"
              align={isOwner ? 'left' : 'right'}
              sx={{ mX: 1 }}
            >
              {timeAgo}
            </Typography>
          }
        />
      </ListItem>
    </Fragment>
  )
}

export default Message
