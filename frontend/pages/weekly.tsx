import React, { useState } from 'react'
import { CardStyle } from '.'
import Footer from '../components/footer'
import NavBar from '../components/navBar'
import Search from '../components/search'
import WeekSchedule from '../components/weekSchedule'
import { useTheme } from '../context/themeProvider'
import { useWeekly } from './api/hooks'

const Weekly = () => {
  const [activities, setActivities] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [from, setFrom] = useState<Date>(new Date("1970-1-1"));
  const [to, setTo] = useState<Date>(new Date("2040-12-31"));
  const { isLoading, data } = useWeekly(activities, locations, from, to);

  const { theme } = useTheme()


  return (
    <div data-theme={theme}>
      <NavBar />

      <div className='px-10 pb-10 h-full w-full' data-theme={theme}>

        <div className={`${CardStyle} p-4 w-full h-1/2`}>
          <Search
            activities={activities}
            setActivities={setActivities}
            locations={locations}
            setLocations={setLocations}
            fromDate={from}
            setFromDate={setFrom}
            toDate={to}
            setToDate={setTo}
          />
        </div>

        <div className={`${CardStyle} p-4 w-full mt-5`} style={{ height: "50vw" }}>
          {data && <WeekSchedule data={data} />}
        </div>

      </div>
      <Footer />
    </div>
  )
}

export default Weekly
