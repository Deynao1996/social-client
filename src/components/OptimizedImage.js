import styled from '@emotion/styled'
import { CardMedia } from '@mui/material'
import React, { useState } from 'react'
import { Blurhash } from 'react-blurhash'
import { LazyLoadImage } from 'react-lazy-load-image-component'

const StyledLazyLoadImage = styled(LazyLoadImage)(() => ({
  objectFit: 'cover'
}))

const StyledBlurHash = styled(Blurhash)(() => ({
  zIndex: 5,
  position: 'absolute !important',
  top: '0',
  left: '0'
}))

const OptimizedImage = ({ url, blurhash, ...props }) => {
  const [isLoaded, setLoaded] = useState(false)
  const [isLoadStarted, setLoadStarted] = useState(false)

  const handleLoad = () => {
    setLoaded(true)
  }

  const handleLoadStarted = () => {
    setLoadStarted(true)
  }

  return (
    <CardMedia sx={{ position: 'relative' }}>
      <StyledLazyLoadImage
        key={url}
        src={url}
        height={500}
        width={'100%'}
        onLoad={handleLoad}
        beforeLoad={handleLoadStarted}
        {...props}
      />
      {!isLoaded && isLoadStarted && (
        <StyledBlurHash
          hash={blurhash}
          width={'100%'}
          height={500}
          resolutionX={32}
          resolutionY={32}
          punch={1}
        />
      )}
    </CardMedia>
  )
}

export default React.memo(OptimizedImage)
