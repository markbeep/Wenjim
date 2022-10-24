import React from 'react'
import DateInput from '../components/dateInput'
import InternalServerError from '../components/error'
import NavBar from '../components/navBar'
import { useLocations, useSports } from './api/hooks'

const History = () => {
  const { loading: l1, data: d1, error: e1 } = useSports()
  const { loading: l2, data: d2, error: e2 } = useLocations()
  return (
    <div>
      <NavBar />
      <div className="flex flex-row px-4">
        <div className="p-1 w-1/2">
          <select
            className="select select-bordered w-full"
            disabled={!d1}
            defaultValue="Pick an activity"
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
        <div className="p-1 w-1/2">
          <DateInput />
        </div>
        <div className="p-1 w-1/2">
          <DateInput />
        </div>
      </div>
    </div>
  )
}

export default History
