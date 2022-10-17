import { useEffect, useState } from 'react'
import Home from './pages/home'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { themeChange } from 'theme-change'
import React from 'react';
export enum Pages {
  home,
}
export const ThemeContext = React.createContext({
  theme: "dark",
  handleTheme: () => { }
});


function App() {
  const [theme, setTheme] = useState("dark");
  const handleTheme = () => {
    setTheme(cur => {
      if (cur === "dark") return "light";
      return "dark";
    })
  }
  useEffect(() => {
    themeChange(false)
  }, [])

  return (
    <html data-theme={theme}>
      <ThemeContext.Provider value={{ theme, handleTheme }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </BrowserRouter>
      </ThemeContext.Provider>
    </html>
  )
}

export default App
