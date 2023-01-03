import { Avatar, Grid, Typography } from '@mui/material'
import * as Yup from 'yup'
import { LockOutlined } from '@mui/icons-material'
import CustomTextField from '../FormUI/CustomTextField'
import CustomSubmitButton from '../FormUI/CustomSubmitButton'
import { Formik } from 'formik'
import { StyledBodyLink, StyledForm } from '../../styled'
import { useSnackbar } from 'notistack'
import { registerUser } from '../../utils/service-utils'

export function renderTextFields(options) {
  return options.map(({ name, label, fullWidth, ...props }, i) => {
    const sm = fullWidth ? 12 : 6
    return (
      <Grid item xs={12} sm={sm} key={i}>
        <CustomTextField
          id={name}
          label={label}
          name={name}
          required={true}
          {...props}
        />
      </Grid>
    )
  })
}

const signUpOptions = [
  { name: 'name', label: 'Name', autoFocus: true, autoComplete: 'name' },
  { name: 'lastName', label: 'Last Name', autoComplete: 'name' },
  {
    name: 'userName',
    label: 'User Name',
    autoComplete: 'username',
    fullWidth: true
  },
  { name: 'email', label: 'Email', autoComplete: 'email', fullWidth: true },
  {
    name: 'password',
    label: 'Password',
    autoComplete: 'password',
    fullWidth: true,
    type: 'password',
    autoComplete: 'current-password'
  },
  {
    name: 'passwordAgain',
    label: 'Confirm Password',
    autoComplete: 'passwordAgain',
    fullWidth: true,
    type: 'password',
    autoComplete: 'current-password'
  }
]

const initialValues = {
  name: '',
  lastName: '',
  userName: '',
  email: '',
  password: '',
  passwordAgain: ''
}

const validationSchema = Yup.object({
  name: Yup.string()
    .required('Required field')
    .matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed for this field'),
  lastName: Yup.string()
    .required('Required field')
    .matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed for this field'),
  userName: Yup.string().required('Required field'),
  email: Yup.string().required('Required field').email('Invalid email format'),
  password: Yup.string().required('Required field'),
  passwordAgain: Yup.string()
    .required('Required field')
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
})

const SignUp = () => {
  const { enqueueSnackbar } = useSnackbar()

  async function handleSubmit(values, resetForm) {
    const { userName, email, password, name, lastName } = values
    const newUser = {
      username: userName.toLowerCase(),
      email: email.toLowerCase(),
      name: name.toLowerCase(),
      lastName: lastName.toLowerCase(),
      password
    }

    try {
      await registerUser(newUser)
      enqueueSnackbar('Account has been created', { variant: 'success' })
      resetForm()
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' })
    }
  }

  return (
    <>
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
        <LockOutlined />
      </Avatar>
      <Typography component="h1" variant="h5">
        Sign up
      </Typography>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => handleSubmit(values, resetForm)}
        validateOnChange={false}
        validateOnBlur={false}
      >
        {({ isSubmitting }) => (
          <StyledForm>
            <Grid container item columnSpacing={2} xs={12}>
              {renderTextFields(signUpOptions)}
            </Grid>
            <Typography variant="caption" mb={2} component="div">
              By creating an account, I consent to the processing of my personal
              data in accordance with the
              <b> PRIVACY POLICY</b>
            </Typography>
            <CustomSubmitButton
              withLoading={true}
              margin="normal"
              loading={isSubmitting}
              type="submit"
            >
              Sign up
            </CustomSubmitButton>
            <StyledBodyLink to="/auth/login">
              Already have an account? Sign in!
            </StyledBodyLink>
          </StyledForm>
        )}
      </Formik>
    </>
  )
}

export default SignUp
