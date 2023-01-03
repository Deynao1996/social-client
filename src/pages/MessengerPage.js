import styled from '@emotion/styled'
import { GroupAdd } from '@mui/icons-material'
import { Fab, Grid, Typography, useMediaQuery, Zoom } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import { useParams } from 'react-router-dom'
import MobileDrawer from '../components/DrawerUI/MobileDrawer'
import ConversationsList from '../components/Lists/ConversationsList'
import MessengerBox from '../components/MessengerBox'
import FriendsTab from '../components/TabUI/FriendsTab'
import { useAuthProvider } from '../contexts/AuthContext'
import { useThemeProvider } from '../contexts/ThemeContext'
import { useHandleError } from '../hooks/useHandleError'
import { fetchConversations } from '../utils/service-utils'

const StyledFab = styled(Fab)(() => ({
  position: 'absolute',
  bottom: 70,
  right: 16
}))

const MessengerPage = () => {
  const { currentUser } = useAuthProvider()
  const { conversationId } = useParams()
  const currentUserId = currentUser?._id
  const { theme } = useThemeProvider()
  const isTablet = useMediaQuery(theme.breakpoints.down('md'))
  const { data, isLoading, isError, error } = useQuery(
    ['conversations', currentUserId],
    () => fetchConversations(currentUserId),
    {
      enabled: !!currentUserId,
      refetchOnWindowFocus: false
    }
  )
  useHandleError(isError, error)

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3.5}>
          <ConversationsList
            data={data}
            isLoading={isLoading}
            currentUserId={currentUserId}
            conversationId={conversationId}
          />
        </Grid>
        <Grid item xs={12} md={5.5}>
          {conversationId ? (
            <MessengerBox conversationId={conversationId} data={data} />
          ) : (
            <Typography
              variant="h3"
              color="text.secondary"
              sx={{ display: { xs: 'none', md: 'block' } }}
            >
              Open a conversation to start a chat
            </Typography>
          )}
        </Grid>
        {!isTablet && (
          <Grid item xs={3}>
            <FriendsTab data={data} isConversationLoading={isLoading} />
          </Grid>
        )}
      </Grid>
      {isTablet && !conversationId && (
        <MobileFriends data={data} isLoading={isLoading} />
      )}
    </>
  )
}

const MobileFriends = ({ data, isLoading }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const handleDrawerToggle = useCallback(() => {
    setIsMobileOpen((isMobileOpen) => !isMobileOpen)
  }, [setIsMobileOpen])

  return (
    <>
      <Zoom in={true}>
        <StyledFab color="primary" onClick={handleDrawerToggle}>
          <GroupAdd />
        </StyledFab>
      </Zoom>
      <MobileDrawer
        handleDrawerToggle={handleDrawerToggle}
        isMobileOpen={isMobileOpen}
      >
        <FriendsTab data={data} isConversationLoading={isLoading} />
      </MobileDrawer>
    </>
  )
}

export default MessengerPage
