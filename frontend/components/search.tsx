import React from 'react'
import { useLocations, useSports } from '../pages/api/hooks'
import InternalServerError from './error'
import CloseIcon from '@mui/icons-material/Close';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
}

const Search = ({ activities, setActivities, locations, setLocations, fromDate, setFromDate, toDate, setToDate }: SearchData) => {
  const { isLoading: l1, data: d1, isError: e1 } = useSports()
  const { isLoading: l2, data: d2, isError: e2 } = useLocations()

  return <>
    <div className="flex flex-row">
      <div className="py-1 w-1/2 pr-1">
        <select
          className="select select-bordered w-full"
          disabled={!d1}
          value="Pick an activity"
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
      <div className="py-1 w-1/2 pl-1 card-body">
        <select
          className="select select-bordered w-full"
          disabled={!d2}
          onChange={e => { setLocations(old => Array.from(new Set([...old, e.target.value]))); }}
          value="Pick a location"
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

    <div className="flex flex-row w-full">
      <div className="w-1/2 flex flex-col px-1">
        <span>From</span>
        <DatePicker
          onChange={(date: Date) => setFromDate(date)}
          selected={fromDate}
          selectsStart
          startDate={fromDate}
          endDate={toDate}
        />
        <button
          className='mt-2 btn btn-bordered btn-sm flex-none'
          onClick={() => setActivities([])}
          disabled={activities.length == 0}
        >
          Clear Activities
        </button>
      </div>
      <div className="w-1/2 flex flex-col px-1">
        <span>To</span>
        <DatePicker
          onChange={(date: Date) => setToDate(date)}
          selected={toDate}
          selectsEnd
          startDate={fromDate}
          endDate={toDate}
          minDate={fromDate}
        />
        <button
          className='mt-2 btn btn-bordered btn-sm'
          onClick={() => setLocations([])}
          disabled={locations.length == 0}
        >
          Clear Locations
        </button>
      </div>
    </div>


    <div className='w-full flex flex-row mt-2'>
      <div className='w-1/2'>
        {activities.map(v => (
          <div key={v} className='badge badge-neutral h-auto m-1'>
            {v}
            <button onClick={() => setActivities(old => [...old.filter(e => v !== e)])}>
              <CloseIcon />
            </button>
          </div>))}
      </div>
      <div className='w-1/2'>
        {locations.map(v => (
          <div key={v} className='badge badge-neutral h-auto w-auto m-1'>
            {v}
            <button onClick={() => setLocations(old => [...old.filter(e => v !== e)])}>
              <CloseIcon />
            </button>
          </div>))}
      </div>
    </div>

  </>
}

export default Search
