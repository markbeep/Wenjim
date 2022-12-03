import { DateRangePickerValue } from '@mantine/dates'
import React, { useState } from 'react'
import { CardStyle } from '.'
import Footer from '../components/footer'
import Search from '../components/search'
import WeekSchedule from '../components/weekSchedule'
import { useWeekly } from './api/hooks'

const Weekly = () => {
  const [activities, setActivities] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [date, setDate] = useState<DateRangePickerValue>();
  const { isLoading, data } = useWeekly(
    activities,
    locations,
    date?.[0] ?? new Date("2022-08-01"),
    date?.[1] ?? new Date("2022-12-31")
  );

  return (
    <div>
      <div className='px-10 pb-10 h-full w-full'>

        <div className={`${CardStyle} p-4 w-full h-1/2`}>
          <Search
            activities={activities}
            setActivities={setActivities}
            locations={locations}
            setLocations={setLocations}
            date={date}
            setDate={setDate}
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
