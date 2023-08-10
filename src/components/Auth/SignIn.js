import Avatar from '@mui/material/Avatar'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import {
  Typography,
  Link as MuiLink,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material'
import { Formik } from 'formik'
import * as Yup from 'yup'
import CustomTextField from '../FormUI/CustomTextField'
import CustomSubmitButton from '../FormUI/CustomSubmitButton'
import { useSnackbar } from 'notistack'
import { loginUser } from '../../utils/service-utils'
import { useAuthProvider } from '../../contexts/AuthContext'
import { StyledBodyLink, StyledForm } from '../../styled'
import ConfirmDialog from '../ModalUI/ConfirmDialog'
import { useCallback, useEffect, useState } from 'react'

const initialValues = {
  email: 'deynao1996@gmail.com',
  password: '121212'
}

const validationSchema = Yup.object({
  email: Yup.string().required('Required field').email('Invalid email format'),
  password: Yup.string().required('Required field')
})

const Copyright = (props) => {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {'Copyright © '}
      <MuiLink color="inherit" component="span">
        Social
      </MuiLink>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}

const SignIn = () => {
  const { enqueueSnackbar } = useSnackbar()
  const { login } = useAuthProvider()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleDialogClose = useCallback(() => {
    setIsDialogOpen(false)
  }, [setIsDialogOpen])

  const handleBlockDialog = () => {
    localStorage.setItem('show-server-delay-dialog', 'block')
    handleDialogClose()
  }

  const handleDialogOpen = () => {
    const dialogStatus = localStorage.getItem('show-server-delay-dialog')
    if (dialogStatus) return
    setIsDialogOpen(true)
  }

  async function handleSubmit({ email, password }) {
    const user = {
      email: email.toLowerCase(),
      password
    }

    try {
      const newUser = await loginUser(user)
      login(newUser.data, '/')
      localStorage.setItem('token', newUser.data.accessToken)
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' })
    }
  }

  useEffect(() => {
    handleDialogOpen()
  }, [])

  return (
    <>
      <ConfirmDialog
        open={isDialogOpen}
        handleClose={handleDialogClose}
        title="Server Wake-up Notice"
        renderDialogContent={() => (
          <DialogContentText>
            Please note that this is a free service and the server may take
            30-60 seconds to wake up if there hasn't been recent activity. Your
            request is important to us, and we appreciate your patience.
          </DialogContentText>
        )}
        renderDialogActions={() => (
          <DialogActions>
            <Button onClick={handleDialogClose}>Close</Button>
            <Button onClick={handleBlockDialog}>Never show me again</Button>
          </DialogActions>
        )}
      />
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Sign in
      </Typography>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validateOnChange={false}
        validateOnBlur={false}
      >
        {({ isSubmitting }) => (
          <StyledForm>
            <CustomTextField
              id="email"
              label="Email"
              name="email"
              autoFocus
              autoComplete="email"
              required={true}
              disabled={true}
            />
            <CustomTextField
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              required={true}
              disabled={true}
            />
            <CustomSubmitButton
              margin="normal"
              disabled={isSubmitting}
              type="submit"
            >
              Sign In
            </CustomSubmitButton>
            <StyledBodyLink to="/auth/register">
              Do not have an account? Sign Up!
            </StyledBodyLink>
          </StyledForm>
        )}
      </Formik>
      <Copyright sx={{ mt: 4, mb: 4 }} />
    </>
  )
}

export default SignIn
