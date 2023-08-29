import styled from '@emotion/styled'
import { CardMedia } from '@mui/material'
import React from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { replaceFirebaseEndpoint } from '../utils/string-transforms-utils'

const StyledLazyLoadImage = styled(LazyLoadImage)(() => ({
  objectFit: 'cover'
}))

const isTablet = window.matchMedia('(max-width: 961px)').matches
const isMobile = window.matchMedia('(max-width: 481px)').matches

const OptimizedImage = ({ url, imageParams = '&tr=fo-auto', ...props }) => {
  const relativeURL = `${replaceFirebaseEndpoint(url)}${imageParams}`

  function setResponsiveUrl(url) {
    if (isMobile) {
      return relativeURL + ',w-500,h-500'
    } else if (isTablet) {
      return relativeURL + ',w-1000,h-700'
    } else {
      return url
    }
  }

  return (
    <CardMedia>
      <StyledLazyLoadImage
        key={url}
        src={setResponsiveUrl(relativeURL)}
        height={500}
        width={'100%'}
        effect="blur"
        placeholderSrc={setResponsiveUrl(relativeURL) + ',bl-100,q-10'}
        {...props}
      />
    </CardMedia>
  )
}

export default React.memo(OptimizedImage)
