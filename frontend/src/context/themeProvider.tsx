import { ReactNode, useContext, useEffect, useState } from 'react'
import { themeChange } from 'theme-change'
import React from 'react'
import { useLocalStorageState } from 'ahooks'
export enum Pages {
  home,
}
export const ThemeContext = React.createContext({
  theme: 'dark',
  handleTheme: () => {},
})

interface Children {
  children: ReactNode
}

export default function ThemeProvider({ children }: Children) {
  const [theme, setTheme] = useLocalStorageState('theme', {
    defaultValue: 'dark',
  })
  const handleTheme = () => {
    setTheme((cur) => (cur === 'dark' ? 'light' : 'dark'))
  }
  useEffect(() => {
    themeChange(false)
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, handleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
