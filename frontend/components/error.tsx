import React from 'react'
import CancelIcon from '@mui/icons-material/Cancel'

const InternalServerError = () => {
  return (
    <div className="alert alert-error shadow-lg h-5">
      <div className="h-full">
        <CancelIcon />
        <span>Error! Internal server error.</span>
      </div>
    </div>
  )
}

export const Warning = (text: string) => {
  return (
    <div className="alert alert-error shadow-lg h-5">
      <div className="h-full">
        <CancelIcon />
        <span>{text}</span>
      </div>
    </div>
  )
}

export default InternalServerError
