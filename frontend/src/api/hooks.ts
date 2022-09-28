import { useRequest } from 'ahooks'
import { CalendarDatum } from '@nivo/calendar'

async function loadCountDay() {
  const response = await fetch('/api/alldata')
  const data = await response.json();
  return data as CalendarDatum[];
}

export function useCountDay() {
  const { error, loading, data, run } = useRequest(() =>
    loadCountDay(),
  )
  return { error, loading, data, run } as const
}
