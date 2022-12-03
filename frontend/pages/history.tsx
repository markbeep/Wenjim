import React, { useState } from 'react'
import Search from '../components/search'
import { useHistory, useHistoryLine, useMinMaxDate } from './api/hooks'
import { HistoryOrder } from './api/interfaces'
import LineChart from '../components/lineChart'
import { Container, Divider } from '@mantine/core'
import { IconChevronUp, IconChevronDown } from '@tabler/icons'
import { DateRangePickerValue } from '@mantine/dates'

const History = () => {
  const [activities, setActivities] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [date, setDate] = useState<DateRangePickerValue>();
  const [orderBy, setOrderBy] = useState<HistoryOrder>(HistoryOrder.date);
  const [desc, setDesc] = useState(false);
  const [page, setPage] = useState(0);
  const [amount, setAmount] = useState(500); // amount of items to show per page
  const { data, isLoading } = useHistory(
    activities,
    locations,
    date?.[0] ?? new Date("2022-08-01"),
    date?.[1] ?? new Date("2022-12-31"),
    orderBy,
    desc
  );
  const { data: lineData, isLoading: lineIsLoading } = useHistoryLine(
    activities,
    locations,
    date?.[0] ?? new Date("2022-08-01"),
    date?.[1] ?? new Date("2022-12-31"),
  );

  const handleSortClick = (d: HistoryOrder) => {
    if (orderBy === d) {
      setDesc(b => !b);
      return;
    }
    setOrderBy(d);
    setDesc(false);
  };

  return (
    <Container fluid>

      <Search
        activities={activities}
        setActivities={setActivities}
        locations={locations}
        setLocations={setLocations}
        date={date}
        setDate={setDate}
      />

      <Divider my="md" />

      {<LineChart data={lineData} />}
      {data && data.length > 0 &&
        <table className="table table-compact w-full border-collapse">
          <thead>
            <tr className='h-full'>
              <th></th>
              <th className={orderBy === HistoryOrder.date ? `bg-neutral-content` : ""}>
                <button onClick={() => handleSortClick(HistoryOrder.date)}>
                  DATE
                  {orderBy === HistoryOrder.date && (desc ? <IconChevronUp /> : <IconChevronDown />)}
                </button>
              </th>
              <th className={orderBy === HistoryOrder.activity ? `bg-neutral-content` : ""}>
                <button onClick={() => handleSortClick(HistoryOrder.activity)}>
                  ACTIVITY
                  {orderBy === HistoryOrder.activity && (desc ? <IconChevronUp /> : <IconChevronDown />)}
                </button>
              </th>
              <th className={orderBy === HistoryOrder.location ? `bg-neutral-content` : ""}>
                <button onClick={() => handleSortClick(HistoryOrder.location)}>
                  LOCATION
                  {orderBy === HistoryOrder.location && (desc ? <IconChevronUp /> : <IconChevronDown />)}
                </button>
              </th>
              <th className={orderBy === HistoryOrder.spots_free ? `bg-neutral-content` : ""}>
                <button onClick={() => handleSortClick(HistoryOrder.spots_free)}>
                  SPOTS FREE
                  {orderBy === HistoryOrder.spots_free && (desc ? <IconChevronUp /> : <IconChevronDown />)}
                </button>
              </th>
              <th className={orderBy === HistoryOrder.spots_total ? `bg-neutral-content` : ""}>
                <button onClick={() => handleSortClick(HistoryOrder.spots_total)}>
                  SPOTS TOTAL
                  {orderBy === HistoryOrder.spots_total && (desc ? <IconChevronUp /> : <IconChevronDown />)}
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
      {data && data.length > 1 && <div className="btn-group justify-center flex flex-row">
        <button className="btn" onClick={() => setPage(0)}>1</button>
        <button className="btn" onClick={() => setPage(1)}>2</button>
        <button className="btn btn-disabled">...</button>
        <button className="btn" onClick={() => setPage(Math.floor(data.length / amount) - 1)}>{Math.floor(data.length / amount) - 1}</button>
        <button className="btn" onClick={() => setPage(Math.floor(data.length / amount))}>{Math.floor(data.length / amount)}</button>
      </div>}

    </Container>
  )
}

export default History
