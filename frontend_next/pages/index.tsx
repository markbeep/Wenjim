import { CircularProgress } from '@mui/material'
import Link from 'next/link'
import { useCountDay } from './api/hooks'
import NavBar from '../components/navBar'
import dynamic from 'next/dynamic'
import { CalendarChart } from '../components/calendarChart'

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
              <Link href="/history">
                <button className="btn btn-primary m-2">History</button>
              </Link>
              <Link href="/weekly">
                <button className="btn btn-primary m-2">Weekly</button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="hero rounded-xl border-separate overflow-hidden h-screen">
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
          <div className="hero-content w-full h-full flex-col">
            <h1 className="mb-5 text-2xl font-bold">Changelog</h1>
            <ul>
              <li>v02 - Did something else</li>
              <li>v01 - Did something</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
