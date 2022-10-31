import { useTheme } from '../context/themeProvider'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import Link from 'next/link'
import HomeIcon from '@mui/icons-material/Home'

const NavBar = () => {
  const { theme, handleTheme } = useTheme()
  return (
    <div className="navbar bg-base-100 w-full">
      <div className="flex-1">
        <Link href="/">
          <button className="btn btn-ghost">
            <HomeIcon fontSize='large' />
          </button>
        </Link>
        <Link href="/history" className="btn btn-ghost normal-case text-xl">
          <button className="btn btn-ghost normal-case text-xl">History</button>
        </Link>
        <Link href="/weekly" className="btn btn-ghost normal-case text-xl">
          <button className="btn btn-ghost normal-case text-xl">Weekly</button>
        </Link>
      </div>
      <button
        className="btn btn-ghost normal-case text-xl flex-none"
        onClick={() => handleTheme("placeholder")}
      >
        {theme === 'light' ? <LightModeIcon fontSize='large' /> : <DarkModeIcon fontSize='large' />}
      </button>
    </div>
  )
}

export default NavBar
