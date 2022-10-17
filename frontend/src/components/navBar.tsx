import React from 'react'
import { ThemeContext } from '../App'
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <div className="navbar bg-base-100">
      <Link to="/" className="btn btn-ghost normal-case text-xl">
        Home
      </Link>
      <ThemeContext.Consumer>
        {({ theme, handleTheme }) => (
          <button className='btn btn-ghost normal-case text-xl' onClick={handleTheme}>
            {(theme === "light") ? <LightModeIcon /> : <DarkModeIcon />}
          </button>
        )
        }
      </ThemeContext.Consumer>

    </div>
  )
}

export default NavBar
