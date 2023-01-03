import { TextField } from '@mui/material'
import { useField } from 'formik'

const CustomTextField = ({ name, textHelper, ...otherProps }) => {
  const [field, meta] = useField(name)
  const configTextfield = {
    ...field,
    fullWidth: true,
    helperText: textHelper ?? ' ',
    margin: 'dense',
    title: otherProps.disabled ? 'You are not able  to change it' : '',
    ...otherProps
  }

  if (meta && meta.touched && meta.error) {
    configTextfield.error = true
    configTextfield.helperText = meta.error
  }

  return <TextField {...configTextfield} />
}

export default CustomTextField
