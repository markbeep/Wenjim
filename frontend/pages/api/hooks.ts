import { useRequest } from 'ahooks'
import { CalendarDatum } from '@nivo/calendar'
import { Serie } from '@nivo/line';
import {HistoryData, HistoryOrder} from "./interfaces";

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

async function loadHistory(activities: string[], locations: string[], from: Date, to: Date, orderBy: HistoryOrder, desc: boolean) {
  const url = "/api/history"

  const orderByKey = () => {
    if (orderBy === HistoryOrder.date) return "date";
    if (orderBy === HistoryOrder.activity) return "sport";
    if (orderBy === HistoryOrder.location) return "location" ;
    if (orderBy === HistoryOrder.spots_available) return "places_max";
    if (orderBy === HistoryOrder.spots_taken) return "places_taken";    
  };

  const body = JSON.stringify({activities, locations, from: from.toISOString(), to: to.toISOString(), orderBy: orderByKey(), desc });

  const content = {
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    method: "POST", 
    body: body
  }
  console.log(`POST: ${url} | BODY ${body}`)
  const response = await fetch(url, content)
  const data = await response.json();
  return data as HistoryData[];
}

export function useHistory(activities: string[], locations: string[], from: Date, to: Date, orderBy: HistoryOrder, desc: boolean) {
  const { error, loading, data, refresh, run } = useRequest(() =>
    loadHistory(activities, locations, from, to, orderBy, desc),
  )
  return { error, loading, data, refresh, run } as const
}
