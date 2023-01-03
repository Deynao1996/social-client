import { TextField } from '@mui/material'
import { useField } from 'formik'
import React, { useEffect, useState } from 'react'
import { usePropagateRef } from '../../hooks/usePropagateRef'

const PerformantTextField = (props) => {
  const [field, meta] = useField(props.name)
  const [fieldValue, setFieldValue] = useState(field.value)
  const { loading = false, ...otherProps } = props
  const configTextfield = {
    fullWidth: true,
    helperText: props.texthelper ?? ' ',
    margin: 'dense',
    title: otherProps.disabled ? 'You are not able  to change it' : '',
    ...otherProps
  }

  usePropagateRef({
    setFieldValue,
    name: props.name,
    value: field.value
  })

  useEffect(() => {
    if (meta.touched) {
      return
    }
    if (field.value !== fieldValue) {
      setFieldValue(field.value)
    }
  }, [field.value])

  const onChange = (evt) => {
    setFieldValue(evt.target.value)
  }

  const onBlur = (evt) => {
    const val = evt.target.value || ''
    window.setTimeout(() => {
      field.onChange({
        target: {
          name: props.name,
          value: props.type === 'number' ? parseInt(val, 10) : val
        }
      })
    }, 0)
  }

  const performanceProps = {
    ...field,
    value: loading ? 'Loading...' : fieldValue,
    onChange,
    onBlur,
    onFocus: onBlur
  }

  if (meta && meta.touched && meta.error) {
    configTextfield.error = true
    configTextfield.helperText = meta.error
  }

  return (
    <>
      <TextField {...configTextfield} {...performanceProps} />
    </>
  )
}

export default PerformantTextField
