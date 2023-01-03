import { Diversity3 } from '@mui/icons-material'
import { Avatar, Card, CardHeader, CardMedia } from '@mui/material'
import React from 'react'

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
        image="https://hwabeng.org.my/wp-content/uploads/2021/09/social-media-marketing-agency.jpg"
        alt="Banner image"
      />
    </Card>
  )
}

export default Banner
