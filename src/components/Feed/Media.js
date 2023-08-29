import styled from '@emotion/styled'
import { CardMedia } from '@mui/material'
import OptimizedImage from '../OptimizedImage'

export const StyledAudioMedia = styled(CardMedia)(({ theme }) => ({
  boxShadow: 'none',
  padding: `0 ${theme.spacing(1)}`,
  width: '70%',
  dropShadow: theme.shadows[2],
  filter: 'drop-shadow(1px 1px 2px #000)',
  '&:hover, &:focus, &:active': {
    boxShadow: 'none',
    transform: 'none'
  }
}))

function setMediaComponentType(mediaType) {
  switch (mediaType) {
    case 'image':
      return 'img'
    case 'audio':
      return 'audio'
    case 'video':
      return 'video'
    default:
      return
  }
}

export function setMediaConfig(mediaType, media) {
  const isControl =
    mediaType && (mediaType === 'video' || mediaType === 'audio')

  return {
    component: setMediaComponentType(mediaType),
    controls: isControl ? true : false,
    preload: mediaType === 'video' ? 'metadata' : 'none',
    alt: 'Post media',
    src: media
  }
}

const Media = ({ mediaType, media }) => {
  switch (mediaType) {
    case 'audio':
      return <StyledAudioMedia {...setMediaConfig(mediaType, media)} />
    case 'image':
      return <OptimizedImage url={media} alt="Post media" />
    case 'video':
      return (
        <CardMedia
          {...setMediaConfig(mediaType, media)}
          sx={{
            height: 400,
            width: '100%'
          }}
        />
      )
    default:
      return
  }
}

export default Media
