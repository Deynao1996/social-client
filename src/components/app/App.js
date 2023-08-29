import { Routes, Route } from 'react-router-dom'
import MainLayout from '../../layouts/MainLayout'
import MessengerLayout from '../../layouts/MessengerLayout'
import ContainerLayout from '../../layouts/ContainerLayout'
import BackdropLoading from '../LoadingUI/BackdropLoading'
import ScrollToTop from '../ScrollWrappers/ScrollToTop'
import loadable from '@loadable/component'
import { ThemeProvider } from '../../contexts/ThemeContext'
import { SnackbarProvider } from 'notistack'
import SignInPage from '../../pages/SignInPage'
import SignUpPage from '../../pages/SignUpPage'
import { AuthProvider } from '../../contexts/AuthContext'
import { SocketProvider } from '../../contexts/SocketContext'
import HomePage from '../../pages/HomePage'
import ProfilePage from '../../pages/ProfilePage'
import 'react-lazy-load-image-component/src/effects/blur.css'

const SearchPage = loadable(() => import('../../pages/SearchPage'), {
  fallback: <BackdropLoading />
})

const MessengerPage = loadable(() => import('../../pages/MessengerPage'), {
  fallback: <BackdropLoading />
})

const App = () => {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
    >
      <SocketProvider>
        <AuthProvider>
          <ThemeProvider>
            <ScrollToTop>
              <Routes>
                <Route path="/" element={<MainLayout />}>
                  <Route index element={<HomePage />} />
                  <Route path="profile/:userId" element={<ProfilePage />} />
                  <Route path="search" element={<SearchPage />} />
                </Route>
                <Route path="/auth" element={<ContainerLayout />}>
                  <Route path="register" element={<SignUpPage />} />
                  <Route path="login" element={<SignInPage />} />
                </Route>
                <Route path="/chat" element={<MessengerLayout />}>
                  <Route index element={<MessengerPage />} />
                  <Route path=":conversationId" element={<MessengerPage />} />
                </Route>
              </Routes>
            </ScrollToTop>
          </ThemeProvider>
        </AuthProvider>
      </SocketProvider>
    </SnackbarProvider>
  )
}

export default App
