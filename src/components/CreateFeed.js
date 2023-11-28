import {
  Close,
  Delete,
  DoneAll,
  EmojiEmotions,
  PermMedia,
  Tag
} from '@mui/icons-material'
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  Collapse,
  InputAdornment,
  LinearProgress,
  Paper,
  Stack,
  TextField,
  useMediaQuery
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import { useAuthProvider } from '../contexts/AuthContext'
import { useSendFile } from '../hooks/useSendFile'
import { useHandleError } from '../hooks/useHandleError'
import {
  capitalizeString,
  replaceFirebaseEndpoint
} from '../utils/string-transforms-utils'
import { createPost } from '../utils/service-utils'
import loadable from '@loadable/component'
import { useCallback } from 'react'
import { useThemeProvider } from '../contexts/ThemeContext'
import styled from '@emotion/styled'
import { AVATAR_TRANSFORMATION_CFG } from '../storage'

const CustomEmojiPicker = loadable(() => import('./CustomEmojiPicker'), {
  fallback: <CircularProgress color="primary" size={20} />
})

export const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
  position: 'fixed',
  width: '100%',
  top: 0,
  left: 0,
  zIndex: theme.zIndex.appBar + 1,
  '& .MuiLinearProgress-bar': {
    transition: 'none'
  }
}))

const CreateFeed = () => {
  const { currentUser } = useAuthProvider()
  const queryClient = useQueryClient()
  const { theme } = useThemeProvider()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { mutate, isError, error, isLoading } = useMutation(createPost, {
    onSuccess
  })
  const { sendFileToFB, isFileUploading, progress } = useSendFile()

  const [media, setMedia] = useState(null)
  const [expanded, setExpanded] = useState(false)
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const [message, setMessage] = useState('')
  const fileRef = useRef()
  const formRef = useRef()

  useHandleError(isError, error)

  const capitalizeName = currentUser ? capitalizeString(currentUser.name) : ''
  const isHandleLoading = isLoading || isFileUploading

  function handleMediaClear() {
    setMedia(null)
    fileRef.current.value = null
  }

  async function handleFileChange(e) {
    const file = e.target.files[0]
    setMedia(file)
  }

  function setValidTags(value) {
    if (!value) return ''
    return value.split(',').reduce((prev, curr) => {
      return prev + `#${curr.trim()}`
    }, '')
  }

  function handleToggleTextfield() {
    setExpanded((expanded) => !expanded)
  }

  function onSuccess() {
    queryClient.invalidateQueries('timeline')
    handleMediaClear()
    setIsPickerOpen(false)
    setExpanded(false)
    setMessage('')
    formRef.current.reset()
  }

  function togglePickerOpen() {
    setIsPickerOpen((isPickerOpen) => !isPickerOpen)
  }

  const handleChange = useCallback(
    (value) => {
      setMessage((message) => message + value)
    },
    [setMessage]
  )

  async function handleSubmit(e) {
    e.preventDefault()
    setExpanded(false)
    const fileType = media?.type.split('/')[0]
    const tags = setValidTags(e.target.tags.value)

    const post = {
      userId: currentUser._id,
      descr: message,
      mediaType: fileType,
      tags
    }
    if (media) {
      const res = await sendFileToFB(media)
      mutate({ ...post, media: res })
    } else {
      mutate(post)
    }
  }

  return (
    <>
      {isFileUploading && (
        <StyledLinearProgress
          variant="determinate"
          value={progress}
          color="info"
        />
      )}
      <Paper
        sx={{ p: 2, m: 2 }}
        component="form"
        onSubmit={handleSubmit}
        ref={formRef}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            alt={`Profile picture of ${currentUser?.username}`}
            src={replaceFirebaseEndpoint(
              currentUser?.profilePicture,
              AVATAR_TRANSFORMATION_CFG
            )}
            sx={{ mr: 1, my: 0.5, width: 56, height: 56 }}
          />
          <TextField
            placeholder={`What's in your mind ${capitalizeName}?`}
            variant="standard"
            fullWidth
            name="message"
            autoComplete="off"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            id="message"
            required
            size="small"
            InputProps={{ sx: { fontSize: '0.8rem' } }}
          />
        </Box>
        <Stack
          direction={isMobile ? 'column' : 'row'}
          justifyContent="space-between"
          alignItems={isMobile ? 'baseline' : 'center'}
          marginTop={isMobile ? 2 : 4}
          spacing={2}
        >
          <div>
            <ButtonGroup
              variant="text"
              size="small"
              sx={{
                position: 'relative',
                alignItems: 'center',
                flexWrap: 'wrap'
              }}
            >
              {!!media && (
                <Button
                  startIcon={<Delete fontSize="0.5rem" />}
                  onClick={handleMediaClear}
                />
              )}
              <Button
                sx={{ textTransform: 'none' }}
                startIcon={media ? <DoneAll color="success" /> : <PermMedia />}
                aria-label="Upload Media"
                component="label"
              >
                <input
                  hidden
                  name="media"
                  ref={fileRef}
                  type="file"
                  accept="image/*, video/*, audio/*"
                  id="media"
                  multiple={false}
                  onChange={handleFileChange}
                  aria-label="Upload Media"
                />
                Photo, Video or Audio
              </Button>
              <Button
                sx={{ textTransform: 'none' }}
                startIcon={<Tag />}
                component="div"
                onClick={handleToggleTextfield}
              >
                Tag
              </Button>
              <Button
                sx={{ textTransform: 'none' }}
                startIcon={isPickerOpen ? <Close /> : <EmojiEmotions />}
                onClick={togglePickerOpen}
              >
                Feelings
              </Button>
              {isPickerOpen && (
                <CustomEmojiPicker
                  handleChange={handleChange}
                  setMessage={setMessage}
                />
              )}
            </ButtonGroup>
            <Collapse in={expanded} timeout="auto">
              <TextField
                autoComplete="off"
                size="small"
                name="tags"
                id="tags"
                autoFocus={expanded}
                margin="dense"
                helperText="Write tags separated by commas"
                InputProps={{
                  sx: { fontSize: '0.9rem' },
                  startAdornment: (
                    <InputAdornment position="start">
                      <Tag color="primary" fontSize="0.7rem" />
                    </InputAdornment>
                  )
                }}
                variant="standard"
              />
            </Collapse>
          </div>
          <LoadingButton
            fullWidth={isMobile}
            variant="contained"
            size="small"
            type="submit"
            loading={isHandleLoading}
          >
            Share
          </LoadingButton>
        </Stack>
      </Paper>
    </>
  )
}

export default CreateFeed
