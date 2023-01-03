import {
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
  useMediaQuery
} from '@mui/material'
import React from 'react'
import { useThemeProvider } from '../../contexts/ThemeContext'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

const ConfirmDialog = ({
  open,
  handleClose,
  renderDialogActions,
  renderDialogContent,
  title
}) => {
  const { theme } = useThemeProvider()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      fullScreen={isMobile}
      onClose={handleClose}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{renderDialogContent()}</DialogContent>
      {renderDialogActions?.()}
    </Dialog>
  )
}

export default ConfirmDialog
