import { LightMode, Search, ZoomOut } from '@mui/icons-material'
import {
  AppBar,
  Avatar,
  Collapse,
  IconButton,
  Stack,
  Toolbar,
  Typography
} from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { useAuthProvider } from '../../contexts/AuthContext'
import { useThemeProvider } from '../../contexts/ThemeContext'
import { StyledLink } from '../../styled'
import { HideOnScroll } from '../ScrollWrappers/HideOnScroll'
import { StyledBadge } from './CustomAppBar'
import Notifications from './Notifications'
import SearchBar from './SearchBar'
import { replaceFirebaseEndpoint } from '../../utils/string-transforms-utils'
import { AVATAR_TRANSFORMATION_CFG } from '../../storage'

const MobileAppBar = () => {
  const { currentUser } = useAuthProvider()
  const { toggleColorMode } = useThemeProvider()
  const [checked, setChecked] = useState(false)
  const inputRef = useRef()

  const handleToggleChecked = () => {
    setChecked((checked) => !checked)
  }

  useEffect(() => {
    checked && inputRef.current.focus()
  }, [checked])

  return (
    <HideOnScroll>
      <AppBar position="sticky">
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <StyledLink to="/">
            <Typography variant="h5" noWrap component="div" sx={{ mr: 2 }}>
              Sociate
            </Typography>
          </StyledLink>
          <Stack direction="row" spacing={0}>
            <IconButton
              size="large"
              color="inherit"
              onClick={handleToggleChecked}
            >
              {checked ? <ZoomOut /> : <Search />}
            </IconButton>
            <IconButton onClick={toggleColorMode} size="large" color="inherit">
              <LightMode />
            </IconButton>
            <Notifications />
            <StyledLink to={`/profile/${currentUser?._id}`}>
              <IconButton size="small" aria-haspopup="true">
                <StyledBadge
                  overlap="circular"
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                  }}
                  variant="dot"
                >
                  <Avatar
                    alt={'Profile picture of ' + currentUser?.name}
                    src={replaceFirebaseEndpoint(
                      currentUser?.profilePicture,
                      AVATAR_TRANSFORMATION_CFG
                    )}
                  />
                </StyledBadge>
              </IconButton>
            </StyledLink>
          </Stack>
        </Toolbar>
        <Collapse in={checked}>
          <SearchBar ref={inputRef} />
        </Collapse>
      </AppBar>
    </HideOnScroll>
  )
}

export default MobileAppBar
