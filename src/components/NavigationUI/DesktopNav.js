import {
  Audiotrack,
  Chat,
  EventNote,
  Group,
  HelpOutline,
  Info,
  Work,
  PlayCircle,
  RssFeed
} from '@mui/icons-material'
import {
  Avatar,
  Box,
  Divider,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Typography,
  Link as MuiLink
} from '@mui/material'
import React, { forwardRef } from 'react'
import FriendsList from '../Lists/FriendsList'
import { StyledBadge } from '../AppBar/CustomAppBar'
import { Link as RouterLink } from 'react-router-dom'
import { renderFriendLinks } from '../../utils/render-items-utils'

const navLinks = [
  { primary: 'Feeds', icon: <RssFeed />, to: '/' },
  { primary: 'Chats', icon: <Chat />, to: '/chat' },
  {
    primary: 'Videos',
    icon: <PlayCircle />,
    to: '/search',
    search: '?media=video'
  },
  {
    primary: 'Audio',
    icon: <Audiotrack />,
    to: '/search',
    search: '?media=audio'
  },
  { primary: 'Groups', icon: <Group />, to: '/', isDisabled: true },
  { primary: 'Questions', icon: <HelpOutline />, to: '/', isDisabled: true },
  { primary: 'Jobs', icon: <Work />, to: '/', isDisabled: true },
  { primary: 'Events', icon: <EventNote />, to: '/', isDisabled: true },
  { primary: 'Courses', icon: <Info />, to: '/', isDisabled: true }
]

const Link = forwardRef(function Link(itemProps, ref) {
  return <RouterLink ref={ref} {...itemProps} role={undefined} />
})

export const ListItemLink = ({
  icon,
  primary,
  to,
  avatar,
  isOnline,
  renderActions,
  isDisabled,
  search = '',
  ...props
}) => {
  return (
    <li>
      <ListItemButton
        component={Link}
        to={{ pathname: to, search }}
        disabled={isDisabled}
      >
        {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
        {avatar ? (
          <ListItemAvatar>
            {isOnline ? (
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
              >
                <Avatar alt={primary} src={avatar} />
              </StyledBadge>
            ) : (
              <Avatar alt={primary} src={avatar} />
            )}
          </ListItemAvatar>
        ) : null}
        <ListItemText primary={primary} primaryTypographyProps={{ ...props }} />
        {renderActions?.()}
      </ListItemButton>
    </li>
  )
}

const DesktopNav = () => {
  function renderNavLinks() {
    return navLinks.map((link, i) => {
      return <ListItemLink {...link} key={i} />
    })
  }

  function renderFriendsList(friends) {
    return (
      <List
        subheader={
          <ListSubheader
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Typography component="span" align="left" fontWeight={500}>
              Best friends:
            </Typography>
            <MuiLink
              component={RouterLink}
              state={{ data: friends }}
              to="/search?user="
            >
              {`See all (${friends?.length})`}
            </MuiLink>
          </ListSubheader>
        }
      >
        {renderFriendLinks(friends)}
      </List>
    )
  }

  return (
    <Box
      sx={{
        flex: 3,
        position: 'sticky',
        left: 0,
        top: '50px',
        maxHeight: 'calc(100vh - 64px)',
        overflowY: 'auto'
      }}
    >
      <List>{renderNavLinks()}</List>
      <Divider />
      <FriendsList
        renderFriendsList={(friends) => renderFriendsList(friends)}
      />
    </Box>
  )
}

export default DesktopNav
