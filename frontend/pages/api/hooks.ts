import { CalendarDatum } from '@nivo/calendar'
import axios from "axios"
import { Serie } from '@nivo/line';
import { HistoryData, HistoryOrder, StringDatum, StringExtraProps, WeeklyData } from "./interfaces";
import { useQuery } from 'react-query';
import { HeatMapSerie } from '@nivo/heatmap';
import { showNotification } from '@mantine/notifications';
import { completeNavigationProgress } from '@mantine/nprogress';

async function loadCountDay() {
  const response = await axios.get('/api/countday')
  return response.data as CalendarDatum[];
}

export function useCountDay() {
  const { isError, isLoading, data } = useQuery(["countday"], () =>
    loadCountDay(),
    {
      onError: (e: TypeError) => showNotification({
        title: "Error",
        message: `${e.message}`,
        color: "red",
      })
    }
  )
  return { isError, isLoading, data } as const
}


async function loadCountDaySport() {
  const url = "/api/countdaybar"
  const response = await axios.get(url)
  return response.data as Serie[];
}

export function useCountDaySport() {
  const { isError, isLoading, data } = useQuery(["countdaysport"], () =>
    loadCountDaySport(),
    {
      onError: (e: TypeError) => showNotification({
        title: "Error",
        message: `${e.message}`,
        color: "red",
      })
    }
  )
  return { isError, isLoading, data } as const
}

async function loadSports() {
  const url = "/api/sports"
  const response = await axios.get(url)
  return response.data as string[];
}

export function useSports() {
  const { isError, isLoading, data } = useQuery(["sports"], () =>
    loadSports(),
    {
      onError: (e: TypeError) => showNotification({
        title: "Error",
        message: `${e.message}`,
        color: "red",
      })
    }
  )
  return { isError, isLoading, data } as const
}

async function loadLocations(activities: string[]) {
  if (activities.length === 0) return [];
  const url = "/api/locations"
  const response = await axios.post(url, activities)
  return response.data as string[];
}

export function useLocations(activities: string[]) {
  const { isError, isLoading, data } = useQuery(["locations", ...activities], () =>
    loadLocations(activities),
    {
      onError: (e: TypeError) => showNotification({
        title: "Error",
        message: `${e.message}`,
        color: "red",
      }),
      onSuccess: () => completeNavigationProgress()
    }
  )
  return { isError, isLoading, data } as const
}

async function loadHistory(activities: string[], locations: string[], from: Date, to: Date, orderBy: HistoryOrder, desc: boolean) {
  if (activities.length === 0 || locations.length === 0 || !from || !to) return [];
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
  const body = { activities, locations, from: from.toISOString(), to: to.toISOString(), orderBy: orderByKey, desc };

  const url = "/api/history"
  const response = await axios.post(url, body)
  return response.data as HistoryData[];
}

export function useHistory(activities: string[], locations: string[], from: Date, to: Date, orderBy: HistoryOrder, desc: boolean) {
  const { isError, isLoading, data } = useQuery(["history", activities, locations, from, to, orderBy, desc], () =>
    loadHistory(activities, locations, from, to, orderBy, desc),
    {
      onError: (e: TypeError) => showNotification({
        title: "Error",
        message: `${e.message}`,
        color: "red",
      })
    }
  );
  return { isError, isLoading, data } as const
}


async function loadHistoryLine(activities: string[], locations: string[], from: Date, to: Date) {
  if (activities.length === 0 || locations.length === 0 || !from || !to) return [];
  const body = { activities, locations, from: from.toISOString(), to: to.toISOString() };

  const url = "/api/historyline"
  const response = await axios.post(url, body)
  return response.data as Serie[];
}

export function useHistoryLine(activities: string[], locations: string[], from: Date, to: Date) {
  const { isError, isLoading, data } = useQuery(["historyline", activities, locations, from, to], () =>
    loadHistoryLine(activities, locations, from, to),
    {
      onError: (e: TypeError) => showNotification({
        title: "Error",
        message: `${e.message}`,
        color: "red",
      })
    }
  );
  return { isError, isLoading, data } as const
}

async function loadWeekly(activities: string[], locations: string[], from: Date, to: Date) {
  if (activities.length === 0 || from === undefined || to === undefined) return undefined;
  const body = { activities, locations, from: from.toISOString(), to: to.toISOString() };

  const url = "/api/weekly"
  const response = await axios.post(url, body)

  return response.data as WeeklyData;
}

export function useWeekly(activities: string[], locations: string[], from: Date, to: Date) {
  const { isError, isLoading, data } = useQuery(["weekly", activities, locations, from, to], () =>
    loadWeekly(activities, locations, from, to),
    {
      onError: (e: TypeError) => showNotification({
        title: "Error",
        message: `${e.message}`,
        color: "red",
      })
    }
  );
  return { isError, isLoading, data } as const
}


async function loadMinMaxDate() {
  const url = "/api/minmaxdate"
  const response = await axios.get(url)
  return response.data as { from: Date, to: Date };
}

export function useMinMaxDate() {
  const { isError, isLoading, data } = useQuery(["minmaxdate"], () =>
    loadMinMaxDate(),
    {
      onError: (e: TypeError) => showNotification({
        title: "Error",
        message: `${e.message}`,
        color: "red",
      })
    }
  );
  return { isError, isLoading, data } as const
}
