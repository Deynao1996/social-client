import { Chat, LightMode, ManageAccounts } from '@mui/icons-material'
import { Badge, IconButton, Menu, MenuItem } from '@mui/material'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useThemeProvider } from '../../contexts/ThemeContext'
import { StyledBox, StyledLink } from '../../styled'
import ChatInfo from '../AppBar/ChatInfo'
import Notifications from '../AppBar/Notifications'

const TabletMenu = ({
  tabletMoreAnchorEl,
  handleTabletMenuClose,
  handleProfileMenuOpen
}) => {
  const location = useLocation()
  const { toggleColorMode, theme } = useThemeProvider()
  const isMobileMenuOpen = Boolean(tabletMoreAnchorEl)

  useEffect(() => {
    handleTabletMenuClose()
  }, [location])

  return (
    <Menu
      anchorEl={tabletMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      open={isMobileMenuOpen}
      onClose={handleTabletMenuClose}
    >
      <MenuItem>
        <ChatInfo
          renderContent={(data) => (
            <StyledBox sx={{ cursor: 'pointer' }}>
              <StyledLink
                to="/chat"
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                <IconButton size="large" color="inherit">
                  <Badge
                    badgeContent={data?.data.newMessagesCount}
                    color="error"
                  >
                    <Chat />
                  </Badge>
                </IconButton>
                <p>Messages</p>
              </StyledLink>
            </StyledBox>
          )}
        />
      </MenuItem>
      <MenuItem>
        <Notifications>
          <p>Notifications</p>
        </Notifications>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <ManageAccounts />
        </IconButton>
        <p>Account</p>
      </MenuItem>
      <MenuItem onClick={toggleColorMode}>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <LightMode />
        </IconButton>
        <p>{`${theme.palette.mode === 'light' ? 'Dark' : 'Light'} mode`}</p>
      </MenuItem>
    </Menu>
  )
}

export default TabletMenu
