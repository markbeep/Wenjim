import React from 'react'

const DateInput = () => {
  return (
    <div className="flex flex-row">
      <select className="select w-1/3 max-w-xs p-2" defaultValue="Day">
        <option disabled>
          Day
        </option>
        {new Array(31).fill(0).map((_, i) => (
          <option key={i + 1}>{i + 1}</option>
        ))}
      </select>
      <select className="select w-1/3 max-w-xs" defaultValue="Month">
        <option disabled>
          Month
        </option>
        {new Array(12).fill(0).map((_, i) => (
          <option key={i + 1}>{i + 1}</option>
        ))}
      </select>
      <select className="select w-1/3 max-w-xs" defaultValue="Year">
        <option disabled>
          Year
        </option>
        {new Array(10).fill(0).map((_, i) => (
          <option key={i + 2022}>{i +2022}</option>
        ))}
      </select>
    </div>
  )
}

export default DateInput
