import { ReactNode, useContext, useEffect, useState } from 'react'
import { themeChange } from 'theme-change'
import React from 'react'
export enum Pages {
  home,
}
export const ThemeContext = React.createContext({
  theme: 'dracula',
  handleTheme: (_: string) => { },
})

interface Children {
  children: ReactNode
}

export default function ThemeProvider({ children }: Children) {
  const [theme, setTheme] = useState("dracula");
  useEffect(() => {
    themeChange(false)
  }, [])

  const handleTheme = (_: string) => {
    setTheme(o => o == "dracula" ? "light" : "dracula")
  };

  return (
    <ThemeContext.Provider value={{ theme, handleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
