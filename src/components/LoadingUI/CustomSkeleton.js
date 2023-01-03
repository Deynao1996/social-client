import {
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  List,
  ListItem,
  ListItemAvatar,
  Skeleton,
  ImageListItem,
  useMediaQuery,
  Box
} from '@mui/material'
import { useThemeProvider } from '../../contexts/ThemeContext'

const CustomSkeleton = ({ type, count = 1 }) => {
  const FriendsSkeleton = () => {
    const { theme } = useThemeProvider()
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'))

    return isDesktop ? (
      <List>
        <ListItem>
          <Skeleton variant="text" sx={{ width: '50%', height: 20 }} />
        </ListItem>
        {[...Array(count)].map((_, i) => {
          return (
            <ListItem key={i}>
              <ListItemAvatar>
                <Skeleton variant="circular" width={40} height={40} />
              </ListItemAvatar>
              <Skeleton variant="text" sx={{ width: '100%', height: 40 }} />
            </ListItem>
          )
        })}
      </List>
    ) : (
      <>
        {[...Array(count)].map((_, i) => {
          return (
            <Box key={i} padding={1}>
              <Skeleton variant="circular" width={40} height={40} />
            </Box>
          )
        })}
      </>
    )
  }

  const LikedUsersSkeleton = () => {
    return (
      <>
        {[...Array(count)].map((_, i) => {
          return <Skeleton variant="circular" width={40} height={40} key={i} />
        })}
      </>
    )
  }

  const SearchedFriendsSkeleton = () => {
    const { theme } = useThemeProvider()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
    return (
      <>
        {[...Array(count)].map((_, i) => (
          <ImageListItem key={i} cols={1}>
            <Skeleton
              variant="rectangular"
              width={'100%'}
              height={isMobile ? '160px' : '236px'}
            />
          </ImageListItem>
        ))}
      </>
    )
  }

  const FeedsSkeleton = () => {
    return (
      <List>
        {[...Array(count)].map((_, i) => {
          return (
            <ListItem key={i}>
              <Card sx={{ width: '100%' }}>
                <CardHeader
                  avatar={
                    <Skeleton
                      variant="circular"
                      width={'40px'}
                      height={'40px'}
                    />
                  }
                  title={
                    <Skeleton
                      variant="text"
                      sx={{ width: '50%', height: 20 }}
                    />
                  }
                  subheader={
                    <Skeleton
                      variant="text"
                      sx={{ width: '20%', height: 15 }}
                    />
                  }
                />
                <CardMedia component="div">
                  <Skeleton
                    variant="rectangular"
                    width={'100%'}
                    height={'500px'}
                  />
                </CardMedia>
                <CardContent>
                  <Skeleton variant="text" sx={{ width: '50%', height: 20 }} />
                  <Skeleton
                    variant="text"
                    sx={{ width: '100%', height: 20, mt: 2 }}
                  />
                </CardContent>
              </Card>
            </ListItem>
          )
        })}
      </List>
    )
  }

  switch (type) {
    case 'friends':
      return <FriendsSkeleton />
    case 'licked-users':
      return <LikedUsersSkeleton />
    case 'feeds':
      return <FeedsSkeleton />
    case 'searched-users':
      return <SearchedFriendsSkeleton />
    default:
      break
  }
}

export default CustomSkeleton
