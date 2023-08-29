import styled from '@emotion/styled'
import { Close, Delete } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Dialog,
  Grid,
  IconButton,
  MenuItem,
  Slide,
  TextField,
  useMediaQuery
} from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import React, { useState } from 'react'
import { useRef } from 'react'
import { useHandleError } from '../../hooks/useHandleError'
import { useSendFile } from '../../hooks/useSendFile'
import { updateUser } from '../../utils/service-utils'
import {
  capitalizeString,
  replaceFirebaseEndpoint
} from '../../utils/string-transforms-utils'
import { useThemeProvider } from '../../contexts/ThemeContext'
import { PROFILE_TRANSFORMATION_CFG } from '../../storage'

const inputFields = [
  { label: 'Name', value: 'name', pattern: '^[a-zA-Z]*$' },
  { label: 'Last name', value: 'lastName', pattern: '^[a-zA-Z]*$' },
  { label: 'User name', value: 'username' },
  { label: 'City', value: 'city', pattern: '^[a-zA-Z ]*$' },
  { label: 'Country', value: 'from', pattern: '^[a-zA-Z ]*$' },
  {
    label: 'Email',
    value: 'email'
  },
  { label: 'Profile description', value: 'descr' }
]

const relationshipVariants = [
  { label: 'Married', value: 1 },
  { label: 'Actively looking', value: 2 },
  { label: 'Difficult situation', value: 3 },
  { label: 'No information yet', value: 0 }
]

const StyledImageBackdrop = styled('span')(({ theme }) => ({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundColor: theme.palette.common.black,
  opacity: 0.4
}))

const StyledCoverBackground = styled('div')(({ theme }) => ({
  width: '100%',
  height: '100%',
  position: 'absolute',
  top: 0,
  left: 0
}))

const StyledAvatarContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center'
}))

const StyledButtonsGroup = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: `0 ${theme.spacing(1)}`
}))

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />
})

const UserSettingsDialog = ({ open, handleClose, currentUser }) => {
  const [imagePreviews, setImagePreviews] = useState({
    profilePicture: currentUser?.profilePicture,
    coverPicture: currentUser?.coverPicture
  })
  const { theme } = useThemeProvider()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { isFileUploading, sendFileToFB } = useSendFile()
  const { mutate, isError, error, isLoading } = useMutation(updateUser, {
    onSuccess
  })
  const formRef = useRef()
  const isCustomLoading = isLoading || isFileUploading
  useHandleError(isError, error)

  function readFile(fileSource) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      const fileName = fileSource.name
      fileReader.onerror = () => reject(fileReader.error)
      fileReader.onload = () =>
        resolve({
          fileName,
          base64: fileReader.result.split(',')[1],
          result: fileReader.result
        })
      fileReader.readAsDataURL(fileSource)
    })
  }

  async function handleChange(e, type) {
    const files = e.target.files
    const res = await readFile(files[0])
    setImagePreviews((imagePreviews) => ({
      ...imagePreviews,
      [type]: res.result
    }))
  }

  function handlePreviewClear() {
    setImagePreviews((imagePreviews) => ({
      ...imagePreviews,
      profilePicture: null
    }))
    formRef.current.profilePicture.value = null
  }

  function onSuccess() {
    handleClose()
    window.location.reload()
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const isProfilePictureEmpty = !imagePreviews.profilePicture
    const updatedUserInfo = {
      lastName: e.target.lastName.value,
      name: e.target.name.value,
      username: e.target.username.value,
      city: e.target.city.value,
      from: e.target.from.value,
      descr: e.target.descr.value,
      relationship: +e.target.relationship.value,
      ...(isProfilePictureEmpty && { profilePicture: '' })
    }
    if (e.target.profilePicture.files[0]) {
      const profileUrl = await sendFileToFB(e.target.profilePicture.files[0])
      updatedUserInfo.profilePicture = profileUrl
    }
    if (e.target.coverPicture.files[0]) {
      const coverUrl = await sendFileToFB(e.target.coverPicture.files[0])
      updatedUserInfo.coverPicture = coverUrl
    }
    mutate({ userId: currentUser._id, data: updatedUserInfo })
  }

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      maxWidth="lg"
      fullScreen={isMobile}
      onClose={handleClose}
    >
      <Card
        sx={{
          maxWidth: 600,
          maxHeight: '100vh',
          height: '100%',
          overflowY: 'auto'
        }}
        onSubmit={handleSubmit}
        component="form"
        ref={formRef}
      >
        <CardHeader
          action={
            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          }
          titleTypographyProps={{ fontSize: '1.3rem' }}
          title="User profile settings:"
        />
        <CardMedia
          component={Box}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            p: 1
          }}
        >
          <StyledCoverBackground>
            <StyledImageBackdrop />
            <img
              src={replaceFirebaseEndpoint(
                imagePreviews.coverPicture,
                '&tr=w-800,fo-auto'
              )}
              alt="bg"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </StyledCoverBackground>
          <StyledAvatarContainer>
            <Avatar
              alt={currentUser?.username}
              src={replaceFirebaseEndpoint(
                imagePreviews.profilePicture,
                PROFILE_TRANSFORMATION_CFG
              )}
              sx={{ width: 150, height: 150, border: '3px solid white' }}
            />
          </StyledAvatarContainer>
        </CardMedia>
        <StyledButtonsGroup>
          <div>
            <Button component="label" variant="text">
              Profile picture
              <input
                hidden
                accept="image/*"
                type="file"
                name="profilePicture"
                id="profilePicture"
                onChange={(e) => handleChange(e, 'profilePicture')}
              />
            </Button>
            <IconButton onClick={handlePreviewClear}>
              <Delete fontSize="small" color="primary" />
            </IconButton>
          </div>
          <Button component="label" variant="text">
            Cover picture
            <input
              hidden
              accept="image/*"
              type="file"
              name="coverPicture"
              onChange={(e) => handleChange(e, 'coverPicture')}
              id="coverPicture"
            />
          </Button>
        </StyledButtonsGroup>
        <CardContent component={Grid} container spacing={2}>
          {inputFields.map((item, i) => (
            <View item={item} currentUser={currentUser} key={i} />
          ))}
          <Grid item xs={6}>
            <TextField
              select
              label="Relationship"
              variant="standard"
              name="relationship"
              id="relationship"
              defaultValue={currentUser.relationship || 0}
              fullWidth
            >
              {relationshipVariants.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button size="small" onClick={handleClose}>
            Close
          </Button>
          <LoadingButton
            variant="contained"
            size="small"
            type="submit"
            loading={isCustomLoading}
          >
            Save changes
          </LoadingButton>
        </CardActions>
      </Card>
    </Dialog>
  )
}

const View = ({ item, currentUser }) => {
  const currentValue = currentUser[item.value]
  const transformedValue = currentValue ? capitalizeString(currentValue) : ''

  return (
    <Grid item xs={6}>
      <TextField
        label={item.label}
        defaultValue={transformedValue}
        InputProps={{ sx: { textTransform: 'capitalize' } }}
        name={item.value}
        id={item.value}
        variant="standard"
        fullWidth
        inputProps={{ pattern: item.pattern || '.*' }}
        margin="none"
      />
    </Grid>
  )
}

export default UserSettingsDialog
