import React from 'react'

const DateInput = () => {
  return (
    <div className="flex flex-row">
      <select className="select w-1/3 max-w-xs">
        <option disabled selected>
          Day
        </option>
        {new Array(31).fill(0).map((_, i) => (
          <option key={i + 1}>{i + 1}</option>
        ))}
      </select>
      <select className="select w-1/3 max-w-xs">
        <option disabled selected>
          Month
        </option>
        {new Array(31).fill(0).map((_, i) => (
          <option key={i + 1}>{i + 1}</option>
        ))}
      </select>
      <select className="select w-1/3 max-w-xs">
        <option disabled selected>
          Year
        </option>
        {new Array(31).fill(0).map((_, i) => (
          <option key={i + 1}>{i + 1}</option>
        ))}
      </select>
    </div>
  )
}

export default DateInput
