import loadable from '@loadable/component'
import { CssBaseline, Grid, useMediaQuery } from '@mui/material'
import { Outlet, useLocation } from 'react-router-dom'
import CustomAppBar from '../components/AppBar/CustomAppBar'
import MobileAppBar from '../components/AppBar/MobileAppBar'
import BackdropLoading from '../components/LoadingUI/BackdropLoading'
import DesktopNav from '../components/NavigationUI/DesktopNav'
import MobileNav from '../components/NavigationUI/MobileNav'
import { useThemeProvider } from '../contexts/ThemeContext'

const SingleFeedDialog = loadable(
  () => import('../components/ModalUI/SingleFeedDialog'),
  {
    fallback: <BackdropLoading />
  }
)

const MainLayout = () => {
  const { search } = useLocation()
  const { theme } = useThemeProvider()
  const isFeedDialogOpen = search?.includes('post')
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))

  return (
    <>
      {!isDesktop ? <MobileAppBar /> : <CustomAppBar />}
      <CssBaseline enableColorScheme />
      <Grid container spacing={2}>
        {isDesktop && (
          <Grid item xs={3}>
            <DesktopNav />
          </Grid>
        )}
        <Outlet />
        {!isDesktop && <MobileNav />}
        {isFeedDialogOpen && <SingleFeedDialog />}
      </Grid>
    </>
  )
}

export default MainLayout
