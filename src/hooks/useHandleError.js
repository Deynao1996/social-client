import { useSnackbar } from 'notistack'
import { useEffect } from 'react'

export const useHandleError = (isError, error) => {
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    isError &&
      enqueueSnackbar(error.message || 'Something went wrong!', {
        variant: 'error'
      })
  }, [isError])
}
