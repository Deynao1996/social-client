import styled from '@emotion/styled'
import { Box } from '@mui/material'
import { Form } from 'formik'
import { Link } from 'react-router-dom'

export const StyledForm = styled(Form)(({ theme }) => ({
  marginTop: theme.spacing(1)
}))

export const StyledLink = styled(Link, {
  shouldForwardProp: (prop) => prop !== 'sx'
})(({ sx }) => ({
  color: 'inherit',
  textDecoration: 'none',
  ...sx
}))

export const StyledBox = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}))

export const StyledBodyLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.secondary,
  textAlign: 'center',
  display: 'block',
  marginTop: theme.spacing(1),
  ...theme.typography.body2
}))
