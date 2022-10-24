import { useRequest } from 'ahooks'
import { CalendarDatum } from '@nivo/calendar'
import { Serie } from '@nivo/line';

async function loadCountDay() {
  const response = await fetch('/api/countday')
  const data = await response.json();
  return data as CalendarDatum[];
}

export function useCountDay() {
  const { error, loading, data, run } = useRequest(() =>
    loadCountDay(),
  )
  return { error, loading, data, run } as const
}


async function loadCountDaySport() {
  const url = "/api/countdaybar"
  const response = await fetch(url)
  const data = await response.json();
  return data as Serie[];
}

export function useCountDaySport() {
  const { error, loading, data, run } = useRequest(() =>
    loadCountDaySport(),
  )
  return { error, loading, data, run } as const
}

async function loadSports() {
  const url = "/api/sports"
  const response = await fetch(url)
  const data = await response.json();
  return data as string[];
}

export function useSports() {
  const { error, loading, data, run } = useRequest(() =>
    loadSports(),
  )
  return { error, loading, data, run } as const
}

async function loadLocations() {
  const url = "/api/locations"
  const response = await fetch(url)
  const data = await response.json();
  return data as string[];
}

export function useLocations() {
  const { error, loading, data, run } = useRequest(() =>
    loadLocations(),
  )
  return { error, loading, data, run } as const
}
