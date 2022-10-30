import { CircularProgress } from '@mui/material'
import Link from 'next/link'
import { useCountDay } from './api/hooks'
import NavBar from '../components/navBar'
import { CalendarChart } from '../components/calendarChart'
import ErrorIcon from '@mui/icons-material/Error'
import Image from 'next/image'
import { useTheme } from '../context/themeProvider'
import Footer from '../components/footer'

export const CardStyle = "card border-solid border-neutral-focus border-2 bg-base";

const Home = () => {
  const { data, isLoading, isError } = useCountDay()
  const { theme } = useTheme()

  return (
    <div data-theme={theme}>
      <NavBar />

      <div className="px-10 pb-10 h-full w-full">
        <div className={`${CardStyle} p-10 w-full text-center items-center`}>
          <Image
            alt="mountain"
            src="/dark-bg.jpg"
            quality={100}
            layout="fill"
            objectFit='cover'
            className='opacity-30'
          />
          <div className="max-w-md z-10">
            <h1 className="mb-5 text-5xl font-bold">Welcome</h1>
            <p className="mb-5">
              Ever went to a ASVZ activity just for it to be packed? Fret no more! With this tool you can
              find out at what time the least people are present.
            </p>
            <h2 className="mb-2 text-2xl font-bold">Get started</h2>
            <Link href="/history">
              <button className="btn btn-primary m-2">History</button>
            </Link>
            <Link href="/weekly">
              <button className="btn btn-primary m-2">Weekly</button>
            </Link>
          </div>
        </div>

        <div className={`${CardStyle} w-full text-center mt-5 items-center`} style={{ height: "30vw" }}>
          {isLoading && <CircularProgress />}
          {isError && <ErrorIcon />}
          {data && <CalendarChart data={data} />}
        </div>

        <div className={`${CardStyle} p-10 w-full text-center mt-5 items-center`}>
          <h1 className="mb-5 text-2xl font-bold">Changelog</h1>
          <ul>
            <li>v01 - Initial Website with History and Weekly</li>
          </ul>
        </div>

      </div>
      <Footer />
    </div>
  )
}

export default Home
