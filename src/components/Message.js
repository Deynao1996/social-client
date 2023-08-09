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
          maxWidth: '70%',
          width: 'fit-content',
          paddingY: 0,
          ...(isOwner ? { marginRight: 'auto' } : { marginLeft: 'auto' })
        }}
      >
        <ListItemAvatar>
          <Avatar alt={msg.sender.fullName} src={msg.sender.profilePicture} />
        </ListItemAvatar>
        <ListItemText
          primary={msg.text}
          primaryTypographyProps={{
            sx: {
              minWidth: 'min-content',
              borderRadius: '20px',
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
