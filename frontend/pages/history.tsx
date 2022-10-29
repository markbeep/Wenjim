import React, { useEffect, useState } from 'react'
import NavBar from '../components/navBar'
import Search from '../components/search'
import { useHistory } from './api/hooks'
import { HistoryOrder } from './api/interfaces'
import { CircularProgress } from '@mui/material'

const History = () => {
  const [activities, setActivities] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [from, setFrom] = useState<Date>(new Date("1970-1-1"));
  const [to, setTo] = useState<Date>(new Date("2040-12-31"));
  const [orderBy, setOrderBy] = useState<HistoryOrder>(HistoryOrder.location);
  const [desc, setDesc] = useState(false);
  const { data, loading, refresh } = useHistory(activities, locations, from, to, orderBy, desc);

  const handleSortClick = (d: HistoryOrder) => {
    if (orderBy === d) {
      setDesc(b => !b);
      return;
    }
    setOrderBy(d);
    setDesc(false);
  };

  useEffect(() => {
    refresh();
  }, [desc, orderBy])

  return (
    <div>
      <NavBar />

      <div className='p-16'>
        <Search
          activities={activities}
          setActivities={setActivities}
          locations={locations}
          setLocations={setLocations}
          fromDate={from}
          setFromDate={setFrom}
          toDate={to}
          setToDate={setTo}
          refresh={refresh}
        />
        {data && data.length > 0 &&
          <div className="overflow-auto p-4 w-full border-solid" style={{ height: "30rem" }}>
            <table className="table table-compact w-full border-collapse">
              <thead>
                <tr className='h-full'>
                  <th></th>
                  <th style={{ position: "sticky", top: 0, zIndex: 1 }} className={orderBy === HistoryOrder.date ? `bg-neutral` : ""}>
                    <button onClick={() => handleSortClick(HistoryOrder.date)}>DATE</button>
                  </th>
                  <th style={{ position: "sticky", top: 0, zIndex: 1 }} className={orderBy === HistoryOrder.activity ? `bg-neutral` : ""}>
                    <button onClick={() => handleSortClick(HistoryOrder.activity)}>ACTIVITY</button>
                  </th>
                  <th style={{ position: "sticky", top: 0, zIndex: 1 }} className={orderBy === HistoryOrder.location ? `bg-neutral` : ""}>
                    <button onClick={() => handleSortClick(HistoryOrder.location)}>LOCATION</button>
                  </th>
                  <th style={{ position: "sticky", top: 0, zIndex: 1 }} className={orderBy === HistoryOrder.spots_taken ? `bg-neutral` : ""}>
                    <button onClick={() => handleSortClick(HistoryOrder.spots_taken)}>SPOTS TAKEN</button>
                  </th>
                  <th style={{ position: "sticky", top: 0, zIndex: 1 }} className={orderBy === HistoryOrder.spots_available ? `bg-neutral` : ""}>
                    <button onClick={() => handleSortClick(HistoryOrder.spots_available)}>SPOTS TOTAL</button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((e, i) => (
                  <tr key={i}>
                    <th>{i + 1}</th>
                    <td>{e.date}</td>
                    <td>{e.activity}</td>
                    <td>{e.location}</td>
                    <td>{e.spots_taken}</td>
                    <td>{e.spots_available}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        }
      </div>

    </div>
  )
}

export default History
