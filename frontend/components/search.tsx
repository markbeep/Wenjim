import React, { useState } from 'react'
import { useLocations, useSports } from '../pages/api/hooks'
import InternalServerError, { Warning } from './error'
import CloseIcon from '@mui/icons-material/Close';


interface PreDate {
  day: number,
  month: number,
  year: number
}

interface SearchData {
  activities: string[],
  setActivities: React.Dispatch<React.SetStateAction<string[]>>,
  locations: string[],
  setLocations: React.Dispatch<React.SetStateAction<string[]>>,
  fromDate: Date,
  setFromDate: React.Dispatch<React.SetStateAction<Date>>,
  toDate: Date,
  setToDate: React.Dispatch<React.SetStateAction<Date>>,
  refresh: () => void,
}

const Search = ({ activities, setActivities, locations, setLocations, fromDate, setFromDate, toDate, setToDate, refresh }: SearchData) => {
  const { loading: l1, data: d1, error: e1 } = useSports()
  const { loading: l2, data: d2, error: e2 } = useLocations()

  const [preFrom, setPreFrom] = useState<PreDate>({ day: 1, month: 1, year: 2022 });
  const [preTo, setPreTo] = useState<PreDate>({ day: 31, month: 12, year: 2024 });
  const bothDates = [preFrom, preTo];
  const bothSetPreDates = [setPreFrom, setPreTo];
  const bothSetDates = [setFromDate, setToDate];

  const [invalidFrom, setInvalidFrom] = useState(false);
  const [invalidTo, setInvalidTo] = useState(false);
  const [invalidBoth, setInvalidBoth] = useState(false);

  const removeFlags = () => {
    setInvalidFrom(false);
    setInvalidTo(false);
    setInvalidBoth(false);
  }

  const dateInput = (ind: number) => {
    const preDate = bothDates[ind];
    const setPreDate = bothSetPreDates[ind];
    const setDate = bothSetDates[ind];
    const { day, month, year } = preDate;
    return (
      <div className="flex flex-row w-full">
        <div className='w-full'>
          <select
            className="select w-full"
            defaultValue={day}
            onChange={(e) => {
              removeFlags();
              const x = Number(e.target.value);
              setPreDate((old) => {
                setDate(new Date(`${old.year}-${old.month}-${x}`));
                return { ...old, day: x };
              })
            }}
          >
            <option disabled>
              Day
            </option>
            {new Array(31).fill(0).map((_, i) => (
              <option key={i + 1}>{i + 1}</option>
            ))}
          </select>
        </div>
        <div className='w-full px-1'>
          <select
            className="select w-full"
            defaultValue={month}
            onChange={(e) => {
              removeFlags();
              const x = Number(e.target.value);
              setPreDate((old) => {
                setDate(new Date(`${old.year}-${x}-${old.day}`));
                return { ...old, month: x };
              })
            }}
          >
            <option disabled>
              Month
            </option>
            {new Array(12).fill(0).map((_, i) => (
              <option key={i + 1}>{i + 1}</option>
            ))}
          </select>
        </div>
        <div className='w-full pr-1'>
          <select
            className="select w-full"
            defaultValue={year}
            onChange={(e) => {
              removeFlags();
              const x = Number(e.target.value);
              setPreDate((old) => {
                setDate(new Date(`${x}-${old.month}-${old.day}`));
                return { ...old, year: x };
              })
            }}
          >
            <option disabled>
              Year
            </option>
            {new Array(3).fill(0).map((_, i) => (
              <option key={i + 2022}>{i + 2022}</option>
            ))}
          </select>
        </div>
      </div >)
  };

  const handleButton = () => {
    if (fromDate.valueOf() !== fromDate.valueOf()) {
      setInvalidFrom(true);
      return;
    }
    if (toDate.valueOf() !== toDate.valueOf()) {
      setInvalidTo(true);
      return;
    }

    if (toDate.getTime() - fromDate.getTime() < 0) {
      setInvalidBoth(true);
      return;
    }

    console.log(fromDate, toDate);
    refresh();
  }

  return <>
    <div className="flex flex-row px-4">
      <div className="p-1 w-1/2">
        <select
          className="select select-bordered w-full"
          disabled={!d1}
          defaultValue="Pick an activity"
          onChange={e => setActivities(old => Array.from(new Set([...old, e.target.value])))}
        >
          <option disabled>
            Pick an activity
          </option>
          {d1 && d1.map((v) => <option key={v}>{v}</option>)}
        </select>
        {e1 && (
          <div className="mt-2">
            <InternalServerError />
          </div>
        )}
      </div>
      <div className="p-1 w-1/2">
        <select
          className="select select-bordered w-full"
          disabled={!d2}
          defaultValue="Pick a location"
          onChange={e => setLocations(old => Array.from(new Set([...old, e.target.value])))}
        >
          <option disabled>
            Pick a location
          </option>
          {d2 && d2.map((v) => <option key={v}>{v}</option>)}
        </select>
        {e2 && (
          <div className="mt-2">
            <InternalServerError />
          </div>
        )}
      </div>
    </div>

    <div className="flex flex-row px-4">
      <div className="w-1/2 flex flex-col">
        <span>From</span>
        {dateInput(0)}
      </div>
      <div className="w-1/2 flex flex-col">
        <span>To</span>
        {dateInput(1)}
      </div>
    </div>


    <div className='px-4 w-full flex flex-row'>
      <div className='w-1/2'>
        {activities.map(v => (
          <div key={v} className='badge badge-secondary h-auto m-1'>
            {v}
            <button onClick={() => setActivities(old => [...old.filter(e => v !== e)])}>
              <CloseIcon />
            </button>
          </div>))}
      </div>
      <div className='w-1/2'>
        {locations.map(v => (
          <div key={v} className='badge badge-secondary h-auto w-auto m-1'>
            {v}
            <button onClick={() => setLocations(old => [...old.filter(e => v !== e)])}>
              <CloseIcon />
            </button>
          </div>))}
      </div>
    </div>

    <div className='w-full px-4 py-2'>
      <div className={activities.length === 0 ? `tooltip tooltip-bottom tooltip-error w-full z-10` : ""} data-tip="Select some activities">
        <button
          className='w-full btn btn-primary'
          disabled={invalidFrom || invalidTo || invalidBoth || (activities.length === 0)}
          onClick={handleButton}
        >
          Search
        </button>
      </div>
    </div>
    <div className='px-4'>
      {invalidBoth && Warning("Invalid date range")}
      {invalidFrom && Warning("Invalid \"From\" date")}
      {invalidTo && Warning("Invalid \"To\" date")}
    </div>
  </>
}

export default Search
