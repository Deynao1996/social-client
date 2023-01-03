import {
  Avatar,
  Box,
  Button,
  ListItem,
  ListItemAvatar,
  TextField,
  Typography
} from '@mui/material'
import { useEffect, useRef } from 'react'
import { useAuthProvider } from '../../contexts/AuthContext'
import { useThemeProvider } from '../../contexts/ThemeContext'
import { createComment, createNotification } from '../../utils/service-utils'
import { getFullName } from '../../utils/string-transforms-utils'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useHandleError } from '../../hooks/useHandleError'
import { useSnackbar } from 'notistack'

const SendCommentField = ({
  expanded,
  postId,
  page,
  disableScroll,
  userId
}) => {
  const { currentUser } = useAuthProvider()
  const { theme } = useThemeProvider()
  const { enqueueSnackbar } = useSnackbar()
  const queryClient = useQueryClient()
  const { mutate, isError, error } = useMutation(createComment, { onSuccess })
  const scrollTriggerRef = useRef()
  const formRef = useRef()

  useHandleError(isError, error)
  const fullName =
    currentUser && getFullName(currentUser.lastName, currentUser.name)
  const profilePicture = currentUser?.profilePicture

  function scrollTo() {
    scrollTriggerRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    })
  }

  async function sendNotification() {
    if (currentUser?._id === userId) return
    const newObj = {
      senderId: currentUser?._id,
      receiverId: userId,
      type: 'new-comment',
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

  function onSuccess() {
    queryClient.invalidateQueries(['comments'])
    sendNotification()
  }

  function handleKeyPress(e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    }
  }

  async function handleSubmit(e) {
    e?.preventDefault()
    const message = formRef.current.comment.value
    const { _id, name, lastName, profilePicture } = currentUser

    const comment = {
      userId: _id,
      postId,
      name,
      lastName,
      profilePicture,
      message
    }
    mutate({
      data: comment
    })
    formRef.current.reset()
  }

  useEffect(() => {
    if (expanded && !disableScroll) {
      let timer = setTimeout(
        () => scrollTo(),
        theme.transitions.duration.standard
      )
      return () => {
        clearTimeout(timer)
      }
    }
  }, [expanded, page])

  return (
    <ListItem alignItems="flex-start">
      <ListItemAvatar ref={scrollTriggerRef}>
        <Avatar alt={fullName} src={profilePicture} />
      </ListItemAvatar>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          flexWrap: 'wrap'
        }}
      >
        <Typography component="div" sx={{ marginY: 1, flexBasis: '100%' }}>
          {fullName}
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          ref={formRef}
          sx={{
            display: 'flex',
            alignItems: { xs: 'flex-start', md: 'center' },
            justifyContent: 'space-between',
            gap: { xs: 1, md: 5 },
            flexBasis: '100%',
            flexDirection: { xs: 'column', md: 'row' }
          }}
        >
          <TextField
            id="comment"
            name="comment"
            variant="standard"
            size="small"
            placeholder="My comment..."
            multiline
            helperText=" "
            rows={3}
            fullWidth
            required
            onKeyDown={handleKeyPress}
          />
          <Button size="small" type="submit" variant="contained">
            Send
          </Button>
        </Box>
      </Box>
    </ListItem>
  )
}

export default SendCommentField
