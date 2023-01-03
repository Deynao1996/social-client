import { Grid } from '@mui/material'
import { useSearchParams } from 'react-router-dom'
import Banner from '../components/Banner'
import ExpandedUsersList from '../components/Lists/ExpandedUsersList'
import FeedsList from '../components/Lists/FeedsList'
import { useAuthProvider } from '../contexts/AuthContext'

const SearchPage = () => {
  const { currentUser } = useAuthProvider()
  const userId = currentUser?._id
  const [searchParams] = useSearchParams()
  const userSearchParam = searchParams.get('user')
  const tagSearchParam = searchParams.get('tag')
  const mediaSearchParam = searchParams.get('media')

  return (
    <>
      <Grid item xs={12} md={6} component="main" position="relative">
        {userSearchParam !== null ? (
          <ExpandedUsersList filter={userSearchParam} />
        ) : (
          <FeedsList
            tagSearchParam={tagSearchParam}
            mediaSearchParam={mediaSearchParam}
            userId={userId}
          />
        )}
      </Grid>
      <Grid item xs={3} sx={{ display: { xs: 'none', md: 'block' } }}>
        <Banner />
      </Grid>
    </>
  )
}

export default SearchPage
