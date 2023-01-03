import { BookmarkAdded } from '@mui/icons-material'
import {
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList
} from '@mui/material'
import Notification from '../Notification'

const ITEM_HEIGHT = 62

const NotificationsMenu = ({ anchorEl, handleClose, data, handleClear }) => {
  const isNotificationsMenuOpen = Boolean(anchorEl)

  return (
    <Menu
      anchorEl={anchorEl}
      open={isNotificationsMenuOpen}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right'
      }}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      PaperProps={{
        style: {
          maxHeight: ITEM_HEIGHT * 4.5
        }
      }}
    >
      <MenuList dense>
        {data?.data.map((not) => (
          <Notification not={not} key={not._id} handleClose={handleClose} />
        ))}
        <Divider />
        <MenuItem sx={{ mt: 2 }} onClick={handleClear}>
          <ListItemIcon>
            <BookmarkAdded fontSize="small" />
          </ListItemIcon>
          <ListItemText>Mark as read</ListItemText>
        </MenuItem>
      </MenuList>
    </Menu>
  )
}

export default NotificationsMenu
