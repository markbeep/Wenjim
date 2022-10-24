import { CircularProgress } from '@mui/material'
import Link from 'react-router-dom'
import { useCountDay } from '../api/hooks'
import { CalendarChart } from '../components/calendarChart'
import NavBar from '../components/navBar'

const Home = () => {
  const { data, loading } = useCountDay()

  return (
    <div>
      <NavBar />

      <div className="p-4">
        <div
          className="hero rounded-xl border-separate overflow-hidden"
          style={{
            backgroundImage: `/dark-bg.jpg`,
          }}
        >
          <div className="hero-overlay bg-opacity-60"></div>
          <div className="hero-content text-center text-neutral-content">
            <div className="max-w-md">
              <h1 className="mb-5 text-5xl font-bold">Welcome</h1>
              <p className="mb-5">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Augue lacus viverra vitae congue eu consequat ac. Dictum at
                tempor commodo ullamcorper a lacus vestibulum sed arcu.
              </p>
              <h2 className="mb-2 text-2xl font-bold">Get started</h2>
              <Link href="/history" className="btn btn-primary m-2">
                History
              </Link>
              <Link href="/weekly" className="btn btn-primary m-2">
                Weekly
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="hero rounded-xl border-separate overflow-hidden">
          <div className="hero-overlay bg-opacity-60"></div>
          <div className="hero-content w-full h-full flex-col">
            {loading && <CircularProgress />}
            {data && <CalendarChart data={data} />}
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="hero rounded-xl border-separate overflow-hidden">
          <div className="hero-overlay bg-opacity-60"></div>
          <div className="hero-content w-full h-full">
            <h1 className="mb-5 text-2xl font-bold">Changelog</h1>
            <ul>
              <></>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
