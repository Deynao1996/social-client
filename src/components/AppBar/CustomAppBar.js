import styled from '@emotion/styled'
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Grid,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery
} from '@mui/material'
import { LightMode, More, Feed, Chat } from '@mui/icons-material'
import { useCallback, useState } from 'react'
import { StyledBox, StyledLink } from '../../styled'
import ProfileMenu from '../MenuUI/ProfileMenu'
import TabletMenu from '../MenuUI/TabletMenu'
import { useThemeProvider } from '../../contexts/ThemeContext'
import { useAuthProvider } from '../../contexts/AuthContext'
import SearchBar from './SearchBar'
import Notifications from './Notifications'
import ChatInfo from './ChatInfo'
import { replaceFirebaseEndpoint } from '../../utils/string-transforms-utils'
import { AVATAR_TRANSFORMATION_CFG } from '../../storage'
import Logo from '../Logo'

export const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
  }
}))

const CustomAppBar = () => {
  const { toggleColorMode, theme } = useThemeProvider()
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'))
  const { currentUser } = useAuthProvider()
  const [anchorEl, setAnchorEl] = useState(null)
  const [tabletMoreAnchorEl, setTabletMoreAnchorEl] = useState(null)

  const handleProfileMenuOpen = useCallback(
    (event) => {
      setAnchorEl(event.currentTarget)
    },
    [setAnchorEl]
  )

  const handleTabletMenuClose = useCallback(() => {
    setTabletMoreAnchorEl(null)
  }, [setTabletMoreAnchorEl])

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null)
    setTabletMoreAnchorEl(null)
  }, [setAnchorEl, setTabletMoreAnchorEl])

  const handleTabletMenuOpen = (event) => {
    setTabletMoreAnchorEl(event.currentTarget)
  }

  return (
    <>
      <AppBar position="sticky">
        <Grid component={Toolbar} container>
          <Grid item xs={3}>
            <StyledLink to="/">
              <Typography variant="h5" noWrap component="div" sx={{ mr: 2 }}>
                Sociate
              </Typography>
            </StyledLink>
          </Grid>
          <Grid item xs={7} md={6}>
            <SearchBar />
          </Grid>
          <Grid item xs={2} md={3}>
            <Box
              sx={{
                display: { md: 'none', lg: 'flex' },
                justifyContent: 'flex-end'
              }}
            >
              <IconButton
                onClick={toggleColorMode}
                size="large"
                aria-label="Toggle Color Mode"
                color="inherit"
              >
                <LightMode />
              </IconButton>
              <StyledBox sx={{ cursor: 'pointer' }}>
                <Tooltip title="Timeline">
                  <StyledLink to="/">
                    <IconButton
                      size="large"
                      color="inherit"
                      aria-label="Timeline"
                    >
                      <Feed />
                    </IconButton>
                  </StyledLink>
                </Tooltip>
              </StyledBox>
              <ChatInfo
                renderContent={(data) => (
                  <StyledBox sx={{ cursor: 'pointer' }}>
                    <Tooltip title="Chat">
                      <StyledLink
                        to="/chat"
                        sx={{ display: 'flex', alignItems: 'center' }}
                      >
                        <IconButton
                          size="large"
                          color="inherit"
                          aria-label="Chat"
                        >
                          <Badge
                            badgeContent={data?.data.newMessagesCount}
                            color="error"
                          >
                            <Chat />
                          </Badge>
                        </IconButton>
                      </StyledLink>
                    </Tooltip>
                  </StyledBox>
                )}
              />
              <Notifications />
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <Tooltip title="Account settings">
                  <IconButton
                    onClick={handleProfileMenuOpen}
                    size="small"
                    aria-haspopup="true"
                  >
                    <StyledBadge
                      overlap="circular"
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right'
                      }}
                      variant="dot"
                    >
                      <Avatar
                        alt={`Profile picture of ${currentUser?.name}`}
                        src={replaceFirebaseEndpoint(
                          currentUser?.profilePicture,
                          AVATAR_TRANSFORMATION_CFG
                        )}
                      />
                    </StyledBadge>
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            <Box
              sx={{
                display: { md: 'flex', lg: 'none' },
                justifyContent: 'flex-end'
              }}
            >
              <IconButton
                size="large"
                aria-label="show more"
                aria-haspopup="true"
                onClick={handleTabletMenuOpen}
                color="inherit"
              >
                <More />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </AppBar>
      {!isDesktop && (
        <TabletMenu
          tabletMoreAnchorEl={tabletMoreAnchorEl}
          handleTabletMenuClose={handleTabletMenuClose}
          handleProfileMenuOpen={handleProfileMenuOpen}
        />
      )}
      <ProfileMenu anchorEl={anchorEl} handleMenuClose={handleMenuClose} />
    </>
  )
}

export default CustomAppBar
