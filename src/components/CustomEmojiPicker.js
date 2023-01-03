import { Box, useMediaQuery } from '@mui/material'
import EmojiPicker from 'emoji-picker-react'
import React from 'react'
import { useThemeProvider } from '../contexts/ThemeContext'

const CustomEmojiPicker = ({ handleChange }) => {
  const { theme } = useThemeProvider()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  function onEmojiClick(emojiObject) {
    handleChange(emojiObject.emoji)
  }

  return (
    <Box
      sx={{
        position: 'absolute',
        top: '140%',
        left: { xs: '0%', sm: '50%' },
        zIndex: 1
      }}
    >
      <EmojiPicker
        onEmojiClick={onEmojiClick}
        searchDisabled={true}
        skinTonesDisabled={true}
        emojiStyle="facebook"
        width={isMobile ? '100%' : 350}
        lazyLoadEmojis={true}
        theme={theme.palette.mode}
      />
    </Box>
  )
}

export default React.memo(CustomEmojiPicker)
