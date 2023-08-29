import { Diversity3 } from '@mui/icons-material'
import { Avatar, Card, CardHeader, CardMedia } from '@mui/material'
import React from 'react'
import { replaceFirebaseEndpoint } from '../utils/string-transforms-utils'
import { BANNER_TRANSFORMATION_CFG } from '../storage'

const Banner = () => {
  return (
    <Card sx={{ margin: 2 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            <Diversity3 />
          </Avatar>
        }
        titleTypographyProps={{
          sx: { fontWeight: 'bold' }
        }}
        title="Share your posts, find new friends and exchange emotions with them"
      />
      <CardMedia
        component="img"
        height="300"
        image={replaceFirebaseEndpoint(
          'https://firebasestorage.googleapis.com/v0/b/social-b02bb.appspot.com/o/1691318111428DreamShaper_v7_woman_in_social_media_2.jpg?alt=media&token=9c2791b4-69f9-4ae0-a9a5-26f283d5bc50',
          BANNER_TRANSFORMATION_CFG
        )}
        alt="Banner image"
      />
    </Card>
  )
}

export default Banner
