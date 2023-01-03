import { Box } from '@mui/material'
import SignUp from '../components/Auth/SignUp'

const SignUpPage = () => {
  return (
    <Box
      sx={{
        my: 2,
        mx: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <SignUp />
    </Box>
  )
}

export default SignUpPage
