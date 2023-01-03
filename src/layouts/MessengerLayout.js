import { Outlet, useLocation } from 'react-router-dom'
import CustomAppBar from '../components/AppBar/CustomAppBar'
import { CssBaseline, useMediaQuery } from '@mui/material'
import BackdropLoading from '../components/LoadingUI/BackdropLoading'
import loadable from '@loadable/component'
import MobileNav from '../components/NavigationUI/MobileNav'
import { useThemeProvider } from '../contexts/ThemeContext'
import MobileAppBar from '../components/AppBar/MobileAppBar'

const SingleFeedDialog = loadable(
  () => import('../components/ModalUI/SingleFeedDialog'),
  {
    fallback: <BackdropLoading />
  }
)

const MessengerLayout = () => {
  const { search } = useLocation()
  const { theme } = useThemeProvider()
  const isTablet = useMediaQuery(theme.breakpoints.down('md'))
  const isFeedDialogOpen = search?.includes('post')

  return (
    <>
      {isTablet ? <MobileAppBar /> : <CustomAppBar />}
      <CssBaseline enableColorScheme />
      <Outlet />
      {isTablet && <MobileNav />}
      {isFeedDialogOpen && <SingleFeedDialog />}
    </>
  )
}

export default MessengerLayout
