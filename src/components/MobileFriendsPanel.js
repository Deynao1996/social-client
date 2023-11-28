import styled from '@emotion/styled'
import { Add } from '@mui/icons-material'
import {
  Avatar,
  Badge,
  Box,
  Collapse,
  Fab,
  IconButton,
  Stack,
  Typography,
  useScrollTrigger,
  Zoom
} from '@mui/material'
import React, { useCallback, useState } from 'react'
import { useAuthProvider } from '../contexts/AuthContext'
import { StyledLink } from '../styled'
import CreateFeed from './CreateFeed'
import FriendsList from './Lists/FriendsList'
import { replaceFirebaseEndpoint } from '../utils/string-transforms-utils'
import { AVATAR_TRANSFORMATION_CFG } from '../storage'

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
  }
}))

const StyledFab = styled(Fab)({
  position: 'fixed',
  zIndex: 11,
  bottom: 30,
  left: 0,
  right: 0,
  margin: '0 auto'
})

const MobileFriendsPanel = () => {
  const { currentUser } = useAuthProvider()
  const [checked, setChecked] = useState(false)

  const handleCheck = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
    setChecked(true)
  }, [setChecked])

  const toggleChecked = () => {
    setChecked((checked) => !checked)
  }

  const renderFriendsList = useCallback((friends) => {
    return friends.map((friend) => (
      <StyledLink
        key={friend._id}
        to={`/profile/${friend._id}`}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <IconButton key={friend._id}>
          <Avatar
            alt={`Profile picture of ${friend.username}`}
            src={replaceFirebaseEndpoint(
              friend.profilePicture,
              AVATAR_TRANSFORMATION_CFG
            )}
          />
        </IconButton>
        <Typography variant="caption" noWrap color="main">
          {friend.username}
        </Typography>
      </StyledLink>
    ))
  }, [])

  return (
    <>
      <Stack
        direction="row"
        sx={{ margin: 2, maxWidth: '100%', overflowX: 'auto' }}
        spacing={1}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <IconButton onClick={toggleChecked}>
            <StyledBadge
              overlap="circular"
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
              badgeContent={'+'}
              color="primary"
            >
              <Avatar
                alt={`Profile picture of ${currentUser?.username}`}
                src={currentUser?.profilePicture}
              />
            </StyledBadge>
          </IconButton>
          <Typography variant="caption" noWrap color="main">
            {currentUser?.username}
          </Typography>
        </Box>
        <FriendsList
          renderFriendsList={(friends) => renderFriendsList(friends)}
        />
      </Stack>
      <Collapse in={checked}>
        <CreateFeed />
      </Collapse>
      <AddFeedButton handleCheck={handleCheck} />
    </>
  )
}

const AddFeedButton = ({ handleCheck }) => {
  const trigger = useScrollTrigger({
    target: window,
    disableHysteresis: true,
    threshold: 100
  })

  return (
    <Zoom in={trigger}>
      <StyledFab color="info" aria-label="add" onClick={handleCheck}>
        <Add />
      </StyledFab>
    </Zoom>
  )
}

export default MobileFriendsPanel
