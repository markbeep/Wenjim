import { ReactNode, useContext, useEffect, useState } from 'react'
import { themeChange } from 'theme-change'
import React from 'react'
export enum Pages {
  home,
}
export const ThemeContext = React.createContext({
  theme: 'dracula',
  setTheme: React.Dispatch<React.SetStateAction<string>>,
})

interface Children {
  children: ReactNode
}

export default function ThemeProvider({ children }: Children) {
  const [theme, setTheme] = useState("dracula");
  useEffect(() => {
    themeChange(false)
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
