import { Notifications as NotificationsIcon } from '@mui/icons-material'
import { Badge, IconButton, Tooltip } from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useCallback, useState } from 'react'
import { useAuthProvider } from '../../contexts/AuthContext'
import { useHandleError } from '../../hooks/useHandleError'
import { StyledBox } from '../../styled'
import {
  clearNotifications,
  fetchNotifications
} from '../../utils/service-utils'
import NotificationsMenu from '../MenuUI/NotificationsMenu'

const Notifications = ({ children }) => {
  const { currentUser } = useAuthProvider()
  const queryClient = useQueryClient()
  const userId = currentUser?._id
  const [anchorEl, setAnchorEl] = useState(null)
  const {
    mutate,
    isError: isClearError,
    error: clearError
  } = useMutation(clearNotifications, {
    onSuccess: onMutateSuccess
  })
  const { data, isError, error } = useQuery(
    ['notifications', userId],
    () => fetchNotifications(userId),
    {
      enabled: !!userId,
      refetchOnWindowFocus: false,
      select: (data) => {
        const filteredValues = data.data.filter(
          (not) => not.type !== 'new-message'
        )
        return { data: filteredValues }
      }
    }
  )
  useHandleError(isError, error)
  useHandleError(isClearError, clearError)

  const notificationsCount = data?.data.length

  const handleMenuOpen = (event) => {
    if (!notificationsCount) return
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null)
  }, [setAnchorEl])

  function onMutateSuccess() {
    queryClient.setQueryData(['notifications', userId], () => ({ data: [] }))
  }

  const handleClear = useCallback(() => {
    handleMenuClose()
    mutate({ receiverId: userId })
  }, [handleMenuClose, mutate, userId])

  return (
    <>
      <StyledBox sx={{ cursor: 'pointer' }} onClick={handleMenuOpen}>
        <Tooltip title="Notifications">
          <IconButton size="large" color="inherit">
            <Badge badgeContent={notificationsCount || 0} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Tooltip>
        {children}
      </StyledBox>
      {!!notificationsCount && (
        <NotificationsMenu
          handleClose={handleMenuClose}
          anchorEl={anchorEl}
          data={data}
          handleClear={handleClear}
        />
      )}
    </>
  )
}

export default Notifications
