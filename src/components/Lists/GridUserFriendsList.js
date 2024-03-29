import {
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Link,
  ListSubheader,
  Typography,
  useMediaQuery
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { Link as RouterLink } from 'react-router-dom'
import { useThemeProvider } from '../../contexts/ThemeContext'
import { useHandleError } from '../../hooks/useHandleError'
import { StyledLink } from '../../styled'
import { fetchUsers } from '../../utils/service-utils'
import {
  getFullName,
  replaceFirebaseEndpoint
} from '../../utils/string-transforms-utils'
import { GRID_FRIEND_TRANSFORMATION_CFG } from '../../storage'

const GridUserFriendsList = ({ following = [] }) => {
  const { data, isError, error } = useQuery(
    ['user-friends', following],
    () => fetchUsers(following),
    {
      enabled: !!following.length,
      refetchOnWindowFocus: false
    }
  )
  const { theme } = useThemeProvider()
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'))
  useHandleError(isError, error)

  return (
    <>
      {data?.data.length && (
        <ImageList cols={isTablet ? 2 : 3} sx={{ pr: { xs: 0, md: 2 } }}>
          <ImageListItem key="Subheader" cols={isTablet ? 2 : 3}>
            <ListSubheader
              component="div"
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'inherit'
              }}
            >
              <Typography
                component="span"
                align="left"
                variant="body2"
                fontWeight="bold"
              >
                User friends:
              </Typography>
              <Link
                sx={{
                  pointerEvents: data?.data.length ? 'auto' : 'none',
                  display: { xs: 'none', md: 'block' }
                }}
                component={RouterLink}
                state={{ data: data?.data }}
                to="/search?user="
              >
                {`See all (${data?.data.length || 0})`}
              </Link>
            </ListSubheader>
          </ImageListItem>
          {data?.data.map((user) => {
            const fullName = getFullName(user.lastName, user.name)
            return (
              <ImageListItem key={user._id}>
                <StyledLink to={`/profile/${user._id}`}>
                  <img
                    src={replaceFirebaseEndpoint(
                      user.profilePicture,
                      GRID_FRIEND_TRANSFORMATION_CFG
                    )}
                    alt={'Profile picture of ' + fullName}
                    loading="lazy"
                    style={{
                      height: '120px',
                      width: '100%',
                      objectFit: 'cover'
                    }}
                  />
                  <ImageListItemBar
                    title={fullName}
                    position="below"
                    sx={{
                      pl: { xs: 1, md: 0 },
                      '.MuiImageListItemBar-title': { fontSize: '0.8rem' }
                    }}
                  />
                </StyledLink>
              </ImageListItem>
            )
          })}
        </ImageList>
      )}
    </>
  )
}

export default GridUserFriendsList
