import { Delete, MoreVert } from '@mui/icons-material'
import {
  Button,
  DialogActions,
  DialogContentText,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem
} from '@mui/material'
import { useCallback, useState } from 'react'
import ConfirmDialog from '../components/ModalUI/ConfirmDialog'
import { useOptimisticDeletePostData } from '../hooks/useOptimisticDeletePostData'

export const withDeleteFeed = (BaseComponent) => {
  return (props) => {
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
    const { mutate } = useOptimisticDeletePostData(props._id)

    const handleDialogClose = useCallback(() => {
      setIsConfirmDialogOpen(false)
    }, [setIsConfirmDialogOpen])

    const handleDelete = useCallback(() => {
      mutate({ postId: props._id })
      handleDialogClose()
      scrollToTop()
    }, [mutate, handleDialogClose])

    const handleDialogOpen = useCallback(() => {
      setIsConfirmDialogOpen(true)
    }, [setIsConfirmDialogOpen])

    const renderDeleteItem = useCallback(
      (cb) => {
        return (
          <MenuItem
            onClick={() => {
              handleDialogOpen()
              cb?.()
            }}
          >
            <ListItemIcon>
              <Delete fontSize="small" />
            </ListItemIcon>
            <ListItemText>Delete post</ListItemText>
          </MenuItem>
        )
      },
      [handleDialogOpen]
    )

    function scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }

    function renderConfirmDialog() {
      return (
        <ConfirmDialog
          open={isConfirmDialogOpen}
          handleClose={handleDialogClose}
          title="Please confirm your action!"
          renderDialogContent={() => (
            <DialogContentText id="alert-dialog-slide-description">
              Are you sure you want to delete this entry? Otherwise, you will
              never be able to restore it.
            </DialogContentText>
          )}
          renderDialogActions={() => (
            <DialogActions>
              <Button onClick={handleDialogClose}>Disagree</Button>
              <Button onClick={handleDelete}>Agree</Button>
            </DialogActions>
          )}
        />
      )
    }

    return (
      <BaseComponent
        {...props}
        renderConfirmDialog={renderConfirmDialog}
        renderDeleteItem={renderDeleteItem}
      />
    )
  }
}
