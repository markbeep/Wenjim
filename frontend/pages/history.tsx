import React, { useEffect, useState } from 'react'
import NavBar from '../components/navBar'
import Search from '../components/search'
import { useHistory, useLocations, useSports } from './api/hooks'
import { HistoryOrder } from './api/interfaces'

const History = () => {
  const [activities, setActivities] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [from, setFrom] = useState<Date>(new Date());
  const [to, setTo] = useState<Date>(new Date());
  const { data, loading, error, refresh } = useHistory(activities, locations, from, to, HistoryOrder.date, false);

  const handleSearch = (from: Date, to: Date, activities: string[], locations: string[]) => {
    console.log(from, to, activities, locations);
    setActivities(activities);
    setLocations(locations);
    setFrom(from);
    setTo(to);
    refresh();
  };

  useEffect(() => {
    refresh();
  }, [activities, locations, from, to])

  return (
    <div>
      <NavBar />

      <Search
        handleSearch={handleSearch}
      />

      <div className="overflow-auto p-4">
        <table className="table table-compact w-full">
          <thead>
            <tr>
              <th></th>
              <th><button className='w-full'>DATE</button></th>
              <th>Activity</th>
              <th>Location</th>
              <th>Spots Available</th>
              <th>Spots Taken</th>
            </tr>
          </thead>
          <tbody>
            {data && data.map((e, i) => (
              <tr key={i}>
                <th>{i + 1}</th>
                <td>{e.date}</td>
                <td>{e.activity}</td>
                <td>{e.location}</td>
                <td>{e.spots_available}</td>
                <td>{e.spots_taken}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}

export default History
