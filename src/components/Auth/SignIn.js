import Avatar from '@mui/material/Avatar'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { Typography, Link as MuiLink } from '@mui/material'
import { Formik } from 'formik'
import * as Yup from 'yup'
import CustomTextField from '../FormUI/CustomTextField'
import CustomSubmitButton from '../FormUI/CustomSubmitButton'
import { useSnackbar } from 'notistack'
import { loginUser } from '../../utils/service-utils'
import { useAuthProvider } from '../../contexts/AuthContext'
import { StyledBodyLink, StyledForm } from '../../styled'

const initialValues = {
  email: '',
  password: ''
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

  return (
    <>
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
            />
            <CustomTextField
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              required={true}
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
