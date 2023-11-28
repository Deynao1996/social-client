import { Info } from '@mui/icons-material'
import {
  Chip,
  Divider,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  useMediaQuery
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuthProvider } from '../../contexts/AuthContext'
import { useThemeProvider } from '../../contexts/ThemeContext'
import { useHandleError } from '../../hooks/useHandleError'
import { StyledLink } from '../../styled'
import { fetchAllUsers } from '../../utils/service-utils'
import {
  getFullName,
  replaceFirebaseEndpoint
} from '../../utils/string-transforms-utils'
import CustomSkeleton from '../LoadingUI/CustomSkeleton'
import {
  NEW_FRIENDS_TRANSFORMATION_CFG_400,
  NEW_FRIENDS_TRANSFORMATION_CFG_200
} from '../../storage'

const ExpandedUsersList = ({ filter }) => {
  const { state } = useLocation()
  const { currentUser } = useAuthProvider()
  const { theme } = useThemeProvider()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const userId = currentUser?._id
  const { data, isLoading, isError, error } = useQuery(
    ['all-users', userId, filter],
    () => fetchAllUsers(userId, filter),
    {
      enabled: !!userId,
      refetchOnWindowFocus: false
    }
  )
  useHandleError(isError, error)

  const users = useMemo(
    () => (state?.data ? state.data : data?.data),
    [state, data]
  )

  return (
    <>
      <ImageList cols={3} sx={{ pX: 2 }}>
        {isLoading ? (
          <CustomSkeleton count={8} type="searched-users" />
        ) : (
          users.map((user) => (
            <View user={user} isMobile={isMobile} key={user._id} />
          ))
        )}
      </ImageList>
      {data?.data.length === 0 && (
        <Divider>
          <Chip label={`User "${filter}" doesn't exist yet!`} />
        </Divider>
      )}
    </>
  )
}

const View = ({ user, isMobile }) => {
  const fullName = getFullName(user.lastName, user.name)
  const followersCount = user.followers.length
  const subtitle =
    followersCount === 1
      ? `${followersCount} follower`
      : `${followersCount} followers`

  const mobileSrc = replaceFirebaseEndpoint(
    user.profilePicture,
    NEW_FRIENDS_TRANSFORMATION_CFG_200
  )

  const desktopSrc = replaceFirebaseEndpoint(
    user.profilePicture,
    NEW_FRIENDS_TRANSFORMATION_CFG_400
  )

  return (
    <ImageListItem cols={1}>
      <img
        src={desktopSrc}
        alt={'Profile picture of ' + fullName}
        srcSet={`${mobileSrc} 200w, ${desktopSrc} 400w`}
        sizes="(min-width: 900px) 20vw, 33vw"
        loading="lazy"
        height={isMobile ? '150px' : '290px'}
      />
      <ImageListItemBar
        title={fullName}
        subtitle={subtitle}
        actionIcon={
          <StyledLink to={`/profile/${user._id}`}>
            <IconButton sx={{ color: 'rgba(255, 255, 255, 0.54)' }}>
              <Info />
            </IconButton>
          </StyledLink>
        }
      />
    </ImageListItem>
  )
}

export default ExpandedUsersList
