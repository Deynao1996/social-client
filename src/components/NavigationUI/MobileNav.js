import { Chat, Logout, Newspaper, Settings } from '@mui/icons-material'
import {
  Badge,
  BottomNavigation,
  BottomNavigationAction,
  Paper
} from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuthProvider } from '../../contexts/AuthContext'
import ChatInfo from '../AppBar/ChatInfo'
import UserSettingsDialog from '../ModalUI/UserSettingsDialog'

const MobileNav = () => {
  const { pathname } = useLocation()
  const currentPath = '/' + pathname.split('/')[1]
  const [value, setValue] = useState(currentPath)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { logOut, currentUser } = useAuthProvider()

  const handleChange = (_e, newValue) => {
    setValue(newValue)
  }

  const handleDialogOpen = () => {
    setIsModalOpen(true)
  }

  const handleDialogClose = useCallback(() => {
    setIsModalOpen(false)
  }, [setIsModalOpen])

  useEffect(() => {
    setValue(currentPath)
  }, [isModalOpen])

  useEffect(() => {
    setValue(currentPath)
  }, [currentPath])

  return (
    <Paper
      sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 10 }}
      elevation={3}
    >
      <BottomNavigation value={value} onChange={handleChange}>
        <BottomNavigationAction
          LinkComponent={Link}
          to="/"
          label="Timeline"
          value="/"
          icon={<Newspaper />}
        />
        <BottomNavigationAction
          LinkComponent={Link}
          to="/chat"
          label="Chat"
          value="/chat"
          icon={
            <ChatInfo
              renderContent={(data) => (
                <Badge badgeContent={data?.data.newMessagesCount} color="error">
                  <Chat />
                </Badge>
              )}
            />
          }
        />
        <BottomNavigationAction
          label="Settings"
          onClick={handleDialogOpen}
          value="settings"
          icon={<Settings />}
        />
        <BottomNavigationAction
          onClick={logOut}
          label="Leave"
          value="leave"
          icon={<Logout />}
        />
      </BottomNavigation>
      {currentUser && (
        <UserSettingsDialog
          open={isModalOpen}
          currentUser={currentUser}
          handleClose={handleDialogClose}
        />
      )}
    </Paper>
  )
}

export default MobileNav
