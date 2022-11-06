import { CalendarDatum } from '@nivo/calendar'
import { Serie } from '@nivo/line';
import { HistoryData, HistoryOrder, StringDatum, StringExtraProps, WeeklyDetails, WeeklyDetailsObject } from "./interfaces";
import { useQuery } from 'react-query';
import { HeatMapSerie } from '@nivo/heatmap';

async function loadCountDay() {
  const response = await fetch('/api/countday')
  const data = await response.json();
  return data as CalendarDatum[];
}

export function useCountDay() {
  const { isError, isLoading, data } = useQuery(["countday"], () =>
    loadCountDay(),
  )
  return { isError, isLoading, data } as const
}


async function loadCountDaySport() {
  const url = "/api/countdaybar"
  const response = await fetch(url)
  const data = await response.json();
  return data as Serie[];
}

export function useCountDaySport() {
  const { isError, isLoading, data } = useQuery(["countdaysport"], () =>
    loadCountDaySport(),
  )
  return { isError, isLoading, data } as const
}

async function loadSports() {
  const url = "/api/sports"
  const response = await fetch(url)
  const data = await response.json();
  return data as string[];
}

export function useSports() {
  const { isError, isLoading, data } = useQuery(["sports"], () =>
    loadSports(),
  )
  return { isError, isLoading, data } as const
}

async function loadLocations() {
  const url = "/api/locations"
  const response = await fetch(url)
  const data = await response.json();
  return data as string[];
}

export function useLocations() {
  const { isError, isLoading, data } = useQuery(["locations"], () =>
    loadLocations(),
  )
  return { isError, isLoading, data } as const
}

async function loadHistory(activities: string[], locations: string[], from: Date, to: Date, orderBy: HistoryOrder, desc: boolean) {
  if (activities.length === 0 || from === undefined || to === undefined) return [];
  let orderByKey = "date";
  switch (orderBy) {
    case HistoryOrder.activity:
      orderByKey = "sport";
      break;
    case HistoryOrder.location:
      orderByKey = "location";
      break;
    case HistoryOrder.spots_total:
      orderByKey = "places_max";
      break;
    case HistoryOrder.spots_free:
      orderByKey = "places_max-places_taken";
      break;
  }
  const body = JSON.stringify({ activities, locations, from: from.toISOString(), to: to.toISOString(), orderBy: orderByKey, desc });
  const content = {
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    method: "POST",
    body: body
  }

  const url = "/api/history"
  console.log(`POST: ${url} | BODY ${body}`)
  const response = await fetch(url, content)
  const data = await response.json();
  return data as HistoryData[];
}

export function useHistory(activities: string[], locations: string[], from: Date, to: Date, orderBy: HistoryOrder, desc: boolean) {
  const { isError, isLoading, data } = useQuery(["history", activities, locations, from, to, orderBy, desc], () =>
    loadHistory(activities, locations, from, to, orderBy, desc)
  );
  return { isError, isLoading, data } as const
}


async function loadHistoryLine(activities: string[], locations: string[], from: Date, to: Date) {
  if (activities.length === 0 || from === undefined || to === undefined) return [];
  const body = JSON.stringify({ activities, locations, from: from.toISOString(), to: to.toISOString() });
  const content = {
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    method: "POST",
    body: body
  }

  const url = "/api/historyline"
  console.log(`POST: ${url} | BODY ${body}`)
  const response = await fetch(url, content)
  const data = await response.json();
  return data as Serie[];
}

export function useHistoryLine(activities: string[], locations: string[], from: Date, to: Date) {
  const { isError, isLoading, data } = useQuery(["historyline", activities, locations, from, to], () =>
    loadHistoryLine(activities, locations, from, to)
  );
  return { isError, isLoading, data } as const
}

async function loadWeekly(activities: string[], locations: string[], from: Date, to: Date) {
  if (activities.length === 0 || from === undefined || to === undefined) return [];
  const body = JSON.stringify({ activities, locations, from: from.toISOString(), to: to.toISOString() });
  const content = {
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    method: "POST",
    body: body
  }

  const url = "/api/weekly"
  console.log(`POST: ${url} | BODY ${body}`)
  const response = await fetch(url, content)
  const data = await response.json();

  return data as HeatMapSerie<StringDatum, StringExtraProps>[];
}

export function useWeekly(activities: string[], locations: string[], from: Date, to: Date) {
  const { isError, isLoading, data } = useQuery(["weekly", activities, locations, from, to], () =>
    loadWeekly(activities, locations, from, to)
  );
  return { isError, isLoading, data } as const
}
