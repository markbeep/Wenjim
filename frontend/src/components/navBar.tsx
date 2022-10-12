import React from 'react'
import { Pages } from '../App'
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

interface navbar {
  setPage: React.Dispatch<React.SetStateAction<Pages>>
  dark: boolean
  setDark: React.Dispatch<React.SetStateAction<boolean>>
}

const NavBar = ({ setPage, dark, setDark }: navbar) => {
  return (
    <div className="navbar bg-base-100">
      <button onClick={() => setPage(Pages.home)} className="btn btn-ghost normal-case text-xl">
        Home
      </button>
      <button>
        <button className='btn btn-ghost normal-case text-xl' onClick={() => { setDark(e => !e) }}>
          {dark ? <LightModeIcon /> : <DarkModeIcon />}
        </button>

      </button>
    </div>
  )
}

export default NavBar
