import {
  Box,
  Container,
  CssBaseline,
  Grid,
  Paper,
  Typography
} from '@mui/material'
import { Outlet } from 'react-router-dom'
import Logo from '../components/Logo'

const ContainerLayout = () => {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 'unset',
        width: '100%',
        minHeight: '100svh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <CssBaseline enableColorScheme />
      <Container component="main" maxWidth="lg">
        <Grid container alignItems="center" spacing={1}>
          <Grid
            item
            xs={12}
            md={6}
            sx={{ display: { xs: 'none', md: 'block' } }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Logo w={50} h={50} />
              <Typography color="primary.main" component="h1" variant="h3">
                Sociate
              </Typography>
            </Box>
            <Typography variant="h6">
              Connect with friends and the world around you on Sociate
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Outlet />
          </Grid>
        </Grid>
      </Container>
    </Paper>
  )
}

export default ContainerLayout
