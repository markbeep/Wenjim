import React, { useState, useEffect } from 'react'
import { useRequest } from 'ahooks'
import { AllData } from './interfaces'

async function loadAllTimeData(location: string, sport: string) {
  const response = await fetch('/data')
  const data = await response.json()
  return data as AllData[]
}

export function useAllTimeData(location: string, sport: string) {
  const { error, loading, data, run } = useRequest(() =>
    loadAllTimeData(location, sport),
  )
  return { error, loading, data, run } as const
}
