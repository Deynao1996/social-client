import { Avatar, Box, Button, IconButton, useMediaQuery } from '@mui/material'
import { useAuthProvider } from '../../contexts/AuthContext'
import { StyledLink } from '../../styled'
import CustomSkeleton from '../LoadingUI/CustomSkeleton'
import { fetchFriends } from '../../utils/service-utils'
import { useQuery } from '@tanstack/react-query'
import { useHandleError } from '../../hooks/useHandleError'
import { Add } from '@mui/icons-material'
import { useThemeProvider } from '../../contexts/ThemeContext'

const FriendsList = ({ renderFriendsList }) => {
  const { currentUser } = useAuthProvider()
  const userId = currentUser?._id
  const { theme } = useThemeProvider()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { data, isLoading, isError, error } = useQuery(
    ['best-friends', userId],
    () => fetchFriends(userId),
    {
      enabled: !!userId,
      refetchOnWindowFocus: false
    }
  )
  useHandleError(isError, error)
  const friends = data?.data.followingUsers

  if (friends?.length === 0) {
    return (
      <Box sx={{ p: { xs: 0, sm: 2 } }}>
        <StyledLink
          to={{
            pathname: '/search',
            search: '?user='
          }}
        >
          {isMobile ? (
            <IconButton>
              <Avatar sx={{ backgroundColor: 'primary.main' }}>
                <Add />
              </Avatar>
            </IconButton>
          ) : (
            <Button variant="contained" fullWidth>
              Find new friends
            </Button>
          )}
        </StyledLink>
      </Box>
    )
  }

  return (
    <>
      {isLoading || isError ? (
        <CustomSkeleton type="friends" count={3} />
      ) : (
        renderFriendsList(friends)
      )}
    </>
  )
}

export default FriendsList
