import { LinearProgress } from '@mui/material'
import React, { useState } from 'react'
import NavBar from '../components/navBar'
import Search from '../components/search'
import { useHistory, useHistoryLine } from './api/hooks'
import { HistoryOrder } from './api/interfaces'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import LineChart from '../components/lineChart'
import { CardStyle } from '.'
import Footer from '../components/footer'
import { useTheme } from '../context/themeProvider'

const History = () => {
  const { theme } = useTheme();

  const [activities, setActivities] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [from, setFrom] = useState<Date>(new Date("1970-1-1"));
  const [to, setTo] = useState<Date>(new Date("2040-12-31"));
  const [orderBy, setOrderBy] = useState<HistoryOrder>(HistoryOrder.date);
  const [desc, setDesc] = useState(false);
  const [page, setPage] = useState(0);
  const [amount, setAmount] = useState(500); // amount of items to show per page
  const { data, isLoading } = useHistory(activities, locations, from, to, orderBy, desc);
  const { data: lineData, isLoading: lineIsLoading } = useHistoryLine(activities, locations, from, to);

  const handleSortClick = (d: HistoryOrder) => {
    if (orderBy === d) {
      setDesc(b => !b);
      return;
    }
    setOrderBy(d);
    setDesc(false);
  };

  console.log(lineData);

  return (
    <div data-theme={theme}>
      <NavBar />

      <div className='px-10 pb-10 h-full w-full'>
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
        <div className={`${CardStyle} overflow-x-auto p-0 w-full mt-5 h-1/2`} style={{ height: "40vw", minHeight: "300px" }}>
          {<LineChart data={lineData ?? []} />}
        </div>
        <div className={`${CardStyle} overflow-auto w-full mt-5 h-1/2`} style={{ height: "30rem" }}>
          {isLoading && <LinearProgress className='m-10' />}
          {data && data.length > 0 &&
            <table className="table table-compact w-full border-collapse">
              <thead>
                <tr className='h-full'>
                  <th></th>
                  <th className={orderBy === HistoryOrder.date ? `bg-neutral-content` : ""}>
                    <button onClick={() => handleSortClick(HistoryOrder.date)}>
                      DATE
                      {orderBy === HistoryOrder.date && (desc ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
                    </button>
                  </th>
                  <th className={orderBy === HistoryOrder.activity ? `bg-neutral-content` : ""}>
                    <button onClick={() => handleSortClick(HistoryOrder.activity)}>
                      ACTIVITY
                      {orderBy === HistoryOrder.activity && (desc ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
                    </button>
                  </th>
                  <th className={orderBy === HistoryOrder.location ? `bg-neutral-content` : ""}>
                    <button onClick={() => handleSortClick(HistoryOrder.location)}>
                      LOCATION
                      {orderBy === HistoryOrder.location && (desc ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
                    </button>
                  </th>
                  <th className={orderBy === HistoryOrder.spots_free ? `bg-neutral-content` : ""}>
                    <button onClick={() => handleSortClick(HistoryOrder.spots_free)}>
                      SPOTS FREE
                      {orderBy === HistoryOrder.spots_free && (desc ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
                    </button>
                  </th>
                  <th className={orderBy === HistoryOrder.spots_total ? `bg-neutral-content` : ""}>
                    <button onClick={() => handleSortClick(HistoryOrder.spots_total)}>
                      SPOTS TOTAL
                      {orderBy === HistoryOrder.spots_total && (desc ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />)}
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.slice(page * amount, (page + 1) * amount).map((e, i) => (
                  <tr key={page * amount + i}>
                    <th>{page * amount + i + 1}</th>
                    <td>{e.date}</td>
                    <td>{e.activity}</td>
                    <td>{e.location}</td>
                    <td>{e.spots_free}</td>
                    <td>{e.spots_total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          }
        </div>
        {data && data.length > 1 && <div className="btn-group justify-center flex flex-row">
          <button className="btn" onClick={() => setPage(0)}>1</button>
          <button className="btn" onClick={() => setPage(1)}>2</button>
          <button className="btn btn-disabled">...</button>
          <button className="btn" onClick={() => setPage(Math.floor(data.length / amount) - 1)}>{Math.floor(data.length / amount) - 1}</button>
          <button className="btn" onClick={() => setPage(Math.floor(data.length / amount))}>{Math.floor(data.length / amount)}</button>
        </div>}
      </div>

      <Footer />
    </div>
  )
}

export default History
