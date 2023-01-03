import { Slide, useScrollTrigger } from '@mui/material'

export const HideOnScroll = (props) => {
  const { children, window } = props

  const trigger = useScrollTrigger({
    target: window ? window() : undefined
  })

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  )
}
