import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material'
import React, { useContext, useState, useMemo, useEffect } from 'react'

const ThemeContext = React.createContext()

export const useThemeProvider = () => {
  return useContext(ThemeContext)
}

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(localStorage.getItem('theme-mode') || 'dark')

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))
  }

  const theme = useMemo(
    () =>
      createTheme({
        typography: {
          fontFamily: ['Roboto', 'sans-serif'].join(',')
        },
        palette: {
          mode
        }
      }),
    [mode]
  )

  useEffect(() => localStorage.setItem('theme-mode', mode), [mode])

  const value = {
    toggleColorMode,
    theme,
    mode
  }

  return (
    <MuiThemeProvider theme={theme}>
      <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    </MuiThemeProvider>
  )
}
