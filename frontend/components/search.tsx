import React, { useState } from 'react'
import { useLocations, useSports } from '../pages/api/hooks'
import InternalServerError, { Warning } from './error'
import CloseIcon from '@mui/icons-material/Close';

interface SearchData {
  activities: string[],
  setActivities: React.Dispatch<React.SetStateAction<string[]>>,
  locations: string[],
  setLocations: React.Dispatch<React.SetStateAction<string[]>>,
  handleSearch: (from: Date, to: Date, activities: string[], locations: string[]) => void,
}

interface PreDate {
  day: number,
  month: number,
  year: number
}

interface PreDateDuo {
  preDate: PreDate,
  setPreDate: React.Dispatch<React.SetStateAction<PreDate>>
}

const Search = ({ activities, setActivities, locations, setLocations, handleSearch }: SearchData) => {
  const { loading: l1, data: d1, error: e1 } = useSports()
  const { loading: l2, data: d2, error: e2 } = useLocations()
  const [preDateFrom, setPreDateFrom] = useState<PreDate>({ day: 1, month: 1, year: 2022 })
  const [preDateTo, setPreDateTo] = useState<PreDate>({ day: 31, month: 12, year: 2024 })
  const both: PreDateDuo[] = [{ preDate: preDateFrom, setPreDate: setPreDateFrom }, { preDate: preDateTo, setPreDate: setPreDateTo }];
  const [invalidFrom, setInvalidFrom] = useState(false);
  const [invalidTo, setInvalidTo] = useState(false);
  const [invalidBoth, setInvalidBoth] = useState(false);

  const removeFlags = () => {
    setInvalidFrom(false);
    setInvalidTo(false);
    setInvalidBoth(false);
  }

  const dateInput = (ind: number) => {
    const { preDate, setPreDate } = both[ind];
    const { day, month, year } = preDate;
    return (
      <div className="flex flex-row w-full">
        <div className='w-full'>
          <select
            className="select w-full"
            defaultValue={day}
            onChange={(e) => { removeFlags(); setPreDate((old) => ({ ...old, day: Number(e.target.value) })) }}
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
            onChange={(e) => { removeFlags(); setPreDate((old) => ({ ...old, month: Number(e.target.value) })) }}
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
            onChange={(e) => { removeFlags(); setPreDate((old) => ({ ...old, year: Number(e.target.value) })) }}
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
      <button
        className='w-full btn btn-primary'
        disabled={invalidFrom || invalidTo || invalidBoth}
        onClick={() => {
          const from = new Date(`${preDateFrom.year}-${preDateFrom.month}-${preDateFrom.day}`)
          if (from.valueOf() !== from.valueOf()) {
            setInvalidFrom(true);
            return;
          }
          const to = new Date(`${preDateTo.year}-${preDateTo.month}-${preDateTo.day}`)
          if (to.valueOf() !== to.valueOf()) {
            setInvalidTo(true);
            return;
          }

          if (to.getTime() - from.getTime() < 0) {
            setInvalidBoth(true);
            return;
          }

          handleSearch(from, to, activities, locations);
        }}
      >
        Search
      </button>
    </div>
    <div className='px-4'>
      {invalidBoth && Warning("Invalid date range")}
      {invalidFrom && Warning("Invalid \"From\" date")}
      {invalidTo && Warning("Invalid \"To\" date")}
    </div>
  </>
}

export default Search
