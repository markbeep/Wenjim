import React from 'react'
import { useCountDay, useCountDaySport, useSports } from '../api/hooks'
import { CalendarChart } from '../components/calendarChart'
import { BarChart } from '../components/barChart'
import { useState } from 'react'
import { CircularProgress, MenuItem, Select } from '@mui/material'

const Home = () => {
  const { data, loading } = useCountDay()
  const { data: d2, loading: l2 } = useCountDaySport()
  const { data: sports, loading: l3 } = useSports()
  const [selectedSports, setSelectedSports] = useState<string[]>([])

  return (
    <div>
      <div className='bg-neutral'>
        <p>TEST</p>
        {loading && <CircularProgress />}
        {data && CalendarChart(data)}
      </div>
      <Select label="Sports">
        {sports && sports.map((a) => <MenuItem value={a}>{a}</MenuItem>)}
        {selectedSports.map((e) => (
          <p>{e}</p>
        ))}
      </Select>

      {d2 && sports && BarChart(d2)}
    </div>
  )
}

export default Home
