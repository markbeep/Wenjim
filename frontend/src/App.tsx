import { useEffect, useState } from 'react'
import NavBar from './components/navBar'
import Home from './pages/home'
import { themeChange } from 'theme-change'
export enum Pages {
  home,
}

function App() {
  const [page, setPage] = useState<Pages>(Pages.home)
  const [dark, setDark] = useState(true)

  useEffect(() => {
    themeChange(false)
  }, [])

  return (
    <div className="tile" data-set-theme={dark ? "dark" : "light"}>
      <NavBar setPage={setPage} dark={dark} setDark={setDark} />
      {page === Pages.home && <Home />}
    </div>
  )
}

export default App
