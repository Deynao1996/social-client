import { Drawer } from '@mui/material'

const MobileDrawer = ({
  isMobileOpen,
  handleDrawerToggle,
  window,
  children
}) => {
  const container =
    window !== undefined ? () => window().document.body : undefined

  return (
    <Drawer
      container={container}
      variant="temporary"
      open={isMobileOpen}
      anchor="right"
      onClose={handleDrawerToggle}
      ModalProps={{
        keepMounted: true
      }}
      sx={{
        display: { xs: 'block', md: 'none' },
        '& .MuiDrawer-paper': {
          boxSizing: 'border-box',
          width: 'clamp(240px, 280px, 80%)'
        }
      }}
    >
      {children}
    </Drawer>
  )
}

export default MobileDrawer
