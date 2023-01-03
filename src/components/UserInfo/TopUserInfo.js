import { Info } from '@mui/icons-material'
import {
  Avatar,
  Box,
  IconButton,
  Skeleton,
  Typography,
  useMediaQuery
} from '@mui/material'
import { useCallback } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useThemeProvider } from '../../contexts/ThemeContext'
import { getFullName } from '../../utils/string-transforms-utils'
import MobileUserInfoDrawer from '../DrawerUI/MobileDrawer'
import AsideUserInfo from './AsideUserInfo'

const TopUserInfo = ({ data, isLoading, renderActionButton }) => {
  const { theme } = useThemeProvider()
  const isTablet = useMediaQuery(theme.breakpoints.down('md'))
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const location = useLocation()
  const fullName = data?.data
    ? getFullName(data.data.lastName, data.data.name)
    : ''

  const handleDrawerToggle = useCallback(() => {
    setIsMobileOpen((isMobileOpen) => !isMobileOpen)
  }, [setIsMobileOpen])

  useEffect(() => {
    setIsMobileOpen(false)
  }, [location])

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: { xs: 0, md: 2 },
        paddingTop: 10,
        paddingBottom: 6,
        position: 'relative'
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: '50%',
          position: 'absolute',
          top: 0,
          left: 0
        }}
      >
        {isLoading ? (
          <Skeleton variant="rectangular" width={'100%'} height={'180px'} />
        ) : (
          <img
            src={data?.data.coverPicture}
            alt="bg"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Avatar
          alt={fullName}
          src={data?.data.profilePicture}
          sx={{ width: 150, height: 150, border: '3px solid white' }}
        />
        <Typography variant="h4" marginTop={2}>
          {fullName}
        </Typography>
        <Typography>{data?.data.descr}</Typography>
        {!isLoading && (
          <IconButton
            sx={{
              display: { sx: 'block', md: 'none' },
              color: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'inherit'
                  : theme.palette.info.main
            }}
            onClick={handleDrawerToggle}
          >
            <Info />
          </IconButton>
        )}
      </Box>
      {isTablet && (
        <MobileUserInfoDrawer
          isMobileOpen={isMobileOpen}
          handleDrawerToggle={handleDrawerToggle}
        >
          <AsideUserInfo data={data} renderActionButton={renderActionButton} />
        </MobileUserInfoDrawer>
      )}
    </Box>
  )
}

export default TopUserInfo
