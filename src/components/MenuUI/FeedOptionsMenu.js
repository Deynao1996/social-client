import { OpenInNew, Share } from '@mui/icons-material'
import {
  Button,
  DialogActions,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Typography
} from '@mui/material'
import React, { useCallback, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ConfirmDialog from '../ModalUI/ConfirmDialog'
import {
  FacebookShareButton,
  ViberShareButton,
  WhatsappShareButton,
  TelegramShareButton,
  EmailShareButton,
  FacebookIcon,
  ViberIcon,
  TelegramIcon,
  WhatsappIcon,
  EmailIcon
} from 'react-share'

const shareButtons = [
  {
    ButtonComponent: FacebookShareButton,
    title: 'Facebook',
    IconComponent: FacebookIcon
  },
  {
    ButtonComponent: ViberShareButton,
    title: 'Viber',
    IconComponent: ViberIcon
  },
  {
    ButtonComponent: WhatsappShareButton,
    title: 'Whatsapp',
    IconComponent: WhatsappIcon
  },
  {
    ButtonComponent: TelegramShareButton,
    title: 'Telegram',
    IconComponent: TelegramIcon
  },
  {
    ButtonComponent: EmailShareButton,
    title: 'Email',
    IconComponent: EmailIcon
  }
]

const FeedOptionsMenu = ({
  anchorEl,
  handleMenuClose,
  renderDeleteItem,
  postId
}) => {
  const isMenuOpen = Boolean(anchorEl)
  const [_searchParams, setSearchParams] = useSearchParams({})
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)

  const handleShareDialogClose = useCallback(() => {
    setIsShareDialogOpen(false)
  }, [setIsShareDialogOpen])

  const handleShareDialogOpen = () => setIsShareDialogOpen(true)

  function handleClick() {
    handleMenuClose()
    setSearchParams({ post: postId })
  }

  return (
    <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={handleMenuClose}>
      <MenuItem onClick={handleClick}>
        <ListItemIcon>
          <OpenInNew fontSize="small" />
        </ListItemIcon>
        <ListItemText>Expand</ListItemText>
      </MenuItem>
      <MenuItem onClick={handleShareDialogOpen}>
        <ListItemIcon>
          <Share fontSize="small" />
        </ListItemIcon>
        <ListItemText>Share</ListItemText>
      </MenuItem>
      {renderDeleteItem?.(handleMenuClose)}
      {isMenuOpen && (
        <ConfirmDialog
          open={isShareDialogOpen}
          handleClose={handleShareDialogClose}
          title="Share with your friends"
          renderDialogContent={() => (
            <Stack direction="row" spacing={2}>
              {shareButtons.map(({ ButtonComponent, title, IconComponent }) => (
                <ButtonComponent
                  key={title}
                  quote={title}
                  url={`${process.env.REACT_APP_PUBLIC_URL}/?post=${postId}`}
                >
                  <IconComponent size={32} round={true} />
                  <Typography variant="caption" component="div">
                    {title}
                  </Typography>
                </ButtonComponent>
              ))}
            </Stack>
          )}
          renderDialogActions={() => (
            <DialogActions>
              <Button onClick={handleShareDialogClose}>Close</Button>
            </DialogActions>
          )}
        />
      )}
    </Menu>
  )
}

export default React.memo(FeedOptionsMenu)
