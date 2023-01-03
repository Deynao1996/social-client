import {
  Avatar,
  Box,
  Divider,
  ListItem,
  ListItemAvatar,
  Typography
} from '@mui/material'
import { formatDistance } from 'date-fns'
import { StyledLink } from '../../styled'
import { getFullName } from '../../utils/string-transforms-utils'

const SingleComment = ({
  lastName,
  name,
  profilePicture,
  message,
  userId,
  createdAt
}) => {
  const fullName = getFullName(lastName, name)
  const timeAgo = formatDistance(new Date(createdAt), new Date(), {
    addSuffix: true
  })

  return (
    <>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <StyledLink to={`/profile/${userId}`}>
            <Avatar alt={fullName} src={profilePicture} />
          </StyledLink>
        </ListItemAvatar>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            flexWrap: 'wrap'
          }}
        >
          <Typography component="div" sx={{ flexBasis: '50%', marginY: 1 }}>
            {fullName}
          </Typography>
          <Typography
            component="div"
            sx={{ flexBasis: '50%' }}
            variant="caption"
            color="text.secondary"
            align="right"
          >
            {timeAgo}
          </Typography>
          <Typography
            component="div"
            sx={{ flexBasis: '100%' }}
            variant="body2"
            color="text.primary"
          >
            {message}
          </Typography>
        </Box>
      </ListItem>
      <Divider variant="inset" component="li" />
    </>
  )
}

export default SingleComment
