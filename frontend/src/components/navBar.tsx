import { ThemeContext } from '../context/themeProvider'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import Link from 'next/link'
import HomeIcon from '@mui/icons-material/Home'

const NavBar = () => {
  return (
    <div className="navbar bg-base-100 w-full">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost normal-case text-xl">
          <HomeIcon />
        </Link>
        <Link href="/history" className="btn btn-ghost normal-case text-xl">
          History
        </Link>
        <Link href="/weekly" className="btn btn-ghost normal-case text-xl">
          Weekly
        </Link>
      </div>
      <ThemeContext.Consumer>
        {({ theme, handleTheme }) => (
          <button
            className="btn btn-ghost normal-case text-xl flex-none"
            onClick={handleTheme}
          >
            {theme === 'light' ? <LightModeIcon /> : <DarkModeIcon />}
          </button>
        )}
      </ThemeContext.Consumer>
    </div>
  )
}

export default NavBar
