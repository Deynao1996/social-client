import { Grid, useMediaQuery } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import AsideUserInfo from '../components/UserInfo/AsideUserInfo'
import CreateFeed from '../components/CreateFeed'
import FeedsList from '../components/Lists/FeedsList'
import TopUserInfo from '../components/UserInfo/TopUserInfo'
import { useAuthProvider } from '../contexts/AuthContext'
import { useHandleError } from '../hooks/useHandleError'
import { fetchUser } from '../utils/service-utils'
import ProfileButton from '../components/ButtonUI/ProfileButton'
import { useThemeProvider } from '../contexts/ThemeContext'
import { useCallback } from 'react'

const ProfilePage = () => {
  const { userId } = useParams()
  const { currentUser } = useAuthProvider()
  const { theme } = useThemeProvider()
  const isTablet = useMediaQuery(theme.breakpoints.down('md'))
  const currentUserId = currentUser?._id
  const { data, isLoading, isError, error } = useQuery(
    ['user', userId],
    () => fetchUser(userId),
    {
      enabled: !!userId,
      refetchOnWindowFocus: false
    }
  )
  useHandleError(isError, error)

  const renderActionButton = useCallback(() => {
    if (!currentUser || currentUserId === userId) return
    if (currentUser.following.includes(userId)) {
      return <ProfileButton type="unfollow" userId={userId} />
    } else {
      return <ProfileButton type="follow" userId={userId} />
    }
  }, [currentUser, userId])

  return (
    <Grid item container xs={12} md={9}>
      <Grid item xs={12}>
        <TopUserInfo
          data={data}
          isLoading={isLoading}
          renderActionButton={renderActionButton}
        />
      </Grid>
      <Grid item xs={12} md={8}>
        {currentUserId === userId && <CreateFeed />}
        <FeedsList skipCurrentUser={true} userId={userId} />
      </Grid>
      {!isTablet && (
        <Grid item xs={4}>
          <AsideUserInfo data={data} renderActionButton={renderActionButton} />
        </Grid>
      )}
    </Grid>
  )
}

export default ProfilePage
