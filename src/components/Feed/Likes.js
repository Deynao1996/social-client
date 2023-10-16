import { Favorite, FavoriteBorder } from '@mui/icons-material'
import { Avatar, Checkbox, Popover, Stack, Typography } from '@mui/material'
import { useMutation, useQuery } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import { useHandleError } from '../../hooks/useHandleError'
import {
  createNotification,
  fetchUsers,
  toggleLikePost
} from '../../utils/service-utils'
import { useAuthProvider } from '../../contexts/AuthContext'
import { StyledLink } from '../../styled'
import CustomSkeleton from '../LoadingUI/CustomSkeleton'
import { useSnackbar } from 'notistack'
import { replaceFirebaseEndpoint } from '../../utils/string-transforms-utils'
import { AVATAR_TRANSFORMATION_CFG } from '../../storage'

const Likes = ({ likes, postId, userId }) => {
  const { currentUser } = useAuthProvider()
  const [popoverAnchorEl, setPopoverAnchorEl] = useState(null)
  const [customLikes, setCustomLikes] = useState(likes)
  const [isChecked, setIsChecked] = useState(
    customLikes.includes(currentUser?._id)
  )
  const { enqueueSnackbar } = useSnackbar()
  const popoverOpen = Boolean(popoverAnchorEl)
  const {
    mutate,
    isError: isMutateError,
    error: mutateError
  } = useMutation(toggleLikePost)
  const { data, isLoading, isError, error } = useQuery(
    ['users', customLikes],
    () => fetchUsers(customLikes),
    {
      enabled: popoverOpen,
      refetchOnWindowFocus: false
    }
  )
  useHandleError(isError, error)
  useHandleError(isMutateError, mutateError)

  const handlePopoverClick = (event) => {
    setPopoverAnchorEl(event.currentTarget)
  }

  const handlePopoverClose = () => {
    setPopoverAnchorEl(null)
  }

  const handleCheck = () => {
    if (isChecked) {
      if (!customLikes.includes(currentUser?._id)) {
        setCustomLikes((customLikes) => [...customLikes, currentUser._id])
      }
    } else {
      setCustomLikes((customLikes) =>
        customLikes.filter((like) => like !== currentUser?._id)
      )
    }
  }

  async function sendNotification() {
    if (currentUser?._id === userId) return
    const newObj = {
      senderId: currentUser?._id,
      receiverId: userId,
      type: 'new-like',
      meta: {
        postId
      }
    }

    try {
      await createNotification(newObj)
    } catch (error) {
      enqueueSnackbar(error.message || 'Something went wrong!', {
        variant: 'error'
      })
    }
  }

  async function handleClick() {
    if (!isChecked) {
      sendNotification()
    }
    setIsChecked((isChecked) => !isChecked)
    mutate({
      postId,
      userId: currentUser?._id
    })
  }

  useEffect(() => {
    handleCheck()
  }, [isChecked])

  return (
    <>
      <Checkbox
        icon={<FavoriteBorder />}
        checkedIcon={<Favorite color="error" />}
        onClick={handleClick}
        checked={isChecked}
      />
      <Typography
        variant="body2"
        sx={{
          cursor: 'pointer',
          pointerEvents: customLikes.length ? 'auto' : 'none'
        }}
        onClick={handlePopoverClick}
      >
        {`${customLikes.length} people like it`}
      </Typography>
      <Popover
        open={popoverOpen}
        anchorEl={popoverAnchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          padding={1}
          sx={{ overflowX: 'auto', maxWidth: 500 }}
        >
          {isLoading || isError ? (
            <CustomSkeleton type="licked-users" count={customLikes.length} />
          ) : (
            data?.data.map((user) => (
              <StyledLink to={`/profile/${user._id}`} key={user._id}>
                <Avatar
                  size="small"
                  alt={user.name}
                  src={replaceFirebaseEndpoint(
                    user.profilePicture,
                    AVATAR_TRANSFORMATION_CFG
                  )}
                />
              </StyledLink>
            ))
          )}
        </Stack>
      </Popover>
    </>
  )
}

export default React.memo(Likes)
