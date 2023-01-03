import {
  Grid,
  Link,
  List,
  ListSubheader,
  Typography,
  useMediaQuery
} from '@mui/material'
import React, { useCallback } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import Banner from '../components/Banner'
import CreateFeed from '../components/CreateFeed'
import FeedsList from '../components/Lists/FeedsList'
import OnlineFriendsList from '../components/Lists/OnlineFriendsList'
import MobileFriendsPanel from '../components/MobileFriendsPanel'
import { useAuthProvider } from '../contexts/AuthContext'
import { useThemeProvider } from '../contexts/ThemeContext'
import { renderFriendLinks } from '../utils/render-items-utils'

const HomePage = () => {
  const { currentUser } = useAuthProvider()
  const { theme } = useThemeProvider()
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
  const currentUserId = currentUser?._id

  const renderOnlineFriendsList = useCallback((friends) => {
    return (
      <List
        subheader={
          <ListSubheader
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Typography component="span" align="left" fontWeight={500}>
              Online friends:
            </Typography>
            <Link
              sx={{ pointerEvents: friends.length ? 'auto' : 'none' }}
              component={RouterLink}
              state={{ data: friends }}
              to="/search?user="
            >
              {`See all (${friends?.length || 0})`}
            </Link>
          </ListSubheader>
        }
      >
        {!!friends.length && renderFriendLinks(friends)}
      </List>
    )
  }, [])

  return (
    <>
      <Grid item xs={isDesktop ? 6 : 12} component="main" position="relative">
        {isDesktop ? <CreateFeed /> : <MobileFriendsPanel />}
        <FeedsList userId={currentUserId} />
      </Grid>
      {isDesktop && (
        <Grid item xs={3}>
          <Banner />
          <OnlineFriendsList
            renderOnlineFriendsList={(friends) =>
              renderOnlineFriendsList(friends)
            }
          />
        </Grid>
      )}
    </>
  )
}

export default HomePage
