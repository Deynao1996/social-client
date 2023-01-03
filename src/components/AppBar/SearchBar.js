import styled from '@emotion/styled'
import { Clear, Search as SearchIcon } from '@mui/icons-material'
import {
  alpha,
  Button,
  DialogActions,
  IconButton,
  InputBase
} from '@mui/material'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import CustomStepper from '../CustomStepper'
import ConfirmDialog from '../ModalUI/ConfirmDialog'

const Search = styled('form')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25)
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('md')]: {
    width: 'auto'
  },
  [theme.breakpoints.down('sm')]: {
    borderRadius: 0
  }
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    transition: theme.transitions.create('width'),
    width: '100%'
  }
}))

const SearchBar = React.forwardRef((props, ref) => {
  const [inputValue, setInputValue] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const isFirstFocusRef = useRef(true)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const handleDialogClose = useCallback(() => {
    setIsDialogOpen(false)
  }, [setIsDialogOpen])

  const handleBlockDialog = () => {
    localStorage.setItem('show-search-dialog', 'block')
    handleDialogClose()
  }

  const handleDialogOpen = () => {
    const dialogStatus = localStorage.getItem('show-search-dialog')
    if (!isFirstFocusRef.current || dialogStatus) return
    setIsDialogOpen(true)
    isFirstFocusRef.current = false
  }

  function setSearchUrlParams(pathName) {
    if (pathName.includes('?tag')) {
      return navigate({
        pathname: '/search',
        search: pathName
      })
    }
    navigate({
      pathname: '/search',
      search: pathName
    })
  }

  function setSearchParams() {
    const tagParam = searchParams.get('tag')
      ? '#' + searchParams.get('tag')
      : ''
    const params = tagParam || searchParams.get('user') || ''
    setInputValue(params)
  }

  function handleClear() {
    setInputValue('')
    navigate('/')
  }

  async function handleSubmit(e) {
    e?.preventDefault()
    const searchPathName = inputValue.includes('#')
      ? `?tag=${inputValue.replace(/#/g, '')}`
      : `?user=${inputValue}`
    setSearchUrlParams(searchPathName)
  }

  useEffect(() => {
    setSearchParams()
  }, [searchParams.get('tag'), searchParams.get('user')])

  return (
    <>
      <Search onSubmit={handleSubmit}>
        <StyledInputBase
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={handleDialogOpen}
          autoComplete="off"
          placeholder="Search for friends and posts..."
          endAdornment={
            <IconButton
              sx={{
                visibility: inputValue ? 'visible' : 'hidden',
                color: 'rgba(255, 255, 255, 1)'
              }}
              onClick={handleClear}
            >
              <Clear />
            </IconButton>
          }
          startAdornment={
            <IconButton
              onClick={() => handleSubmit()}
              sx={{ color: 'rgba(255, 255, 255, 1)' }}
            >
              <SearchIcon />
            </IconButton>
          }
          inputProps={{
            'aria-label': 'search'
          }}
          inputRef={ref}
          name="search"
          id="search"
        />
      </Search>
      <ConfirmDialog
        open={isDialogOpen}
        handleClose={handleDialogClose}
        title="How to use search bar?"
        renderDialogContent={() => (
          <CustomStepper handleClose={handleDialogClose} />
        )}
        renderDialogActions={() => (
          <DialogActions>
            <Button onClick={handleDialogClose}>Close</Button>
            <Button onClick={handleBlockDialog}>Never show me again</Button>
          </DialogActions>
        )}
      />
    </>
  )
})

export default SearchBar
