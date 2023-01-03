import { AccountCircle, Logout, Settings } from '@mui/icons-material'
import { IconButton, Menu, MenuItem } from '@mui/material'
import { useCallback, useState } from 'react'
import { useAuthProvider } from '../../contexts/AuthContext'
import { StyledLink } from '../../styled'
import UserSettingsDialog from '../ModalUI/UserSettingsDialog'

const ProfileMenu = ({ anchorEl, handleMenuClose }) => {
  const { currentUser, logOut } = useAuthProvider()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const isMenuOpen = Boolean(anchorEl)

  const handleDialogOpen = () => {
    handleMenuClose()
    setIsDialogOpen(true)
  }

  const handleDialogClose = useCallback(() => {
    setIsDialogOpen(false)
  }, [setIsDialogOpen])

  return (
    <>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        open={isMenuOpen}
        onClose={handleMenuClose}
      >
        <StyledLink
          to={`/profile/${currentUser?._id}`}
          onClick={handleMenuClose}
        >
          <MenuItem>
            <IconButton size="medium" color="inherit">
              <AccountCircle />
            </IconButton>
            <p>My profile</p>
          </MenuItem>
        </StyledLink>
        <MenuItem onClick={handleDialogOpen}>
          <IconButton size="medium" color="inherit">
            <Settings />
          </IconButton>
          <p>User settings</p>
        </MenuItem>
        <MenuItem onClick={logOut}>
          <IconButton size="medium" color="inherit">
            <Logout />
          </IconButton>
          <p>Logout</p>
        </MenuItem>
      </Menu>
      {currentUser && (
        <UserSettingsDialog
          open={isDialogOpen}
          handleClose={handleDialogClose}
          currentUser={currentUser}
        />
      )}
    </>
  )
}

export default ProfileMenu
