import { Container, CssBaseline, Grid, Paper, Typography } from '@mui/material'
import { Outlet } from 'react-router-dom'

const ContainerLayout = () => {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 'unset',
        width: '100%',
        height: '100%'
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
            <Typography color="primary.main" component="h1" variant="h3">
              Social
            </Typography>
            <Typography variant="h6">
              Connect with friends and the world around you on Social
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
