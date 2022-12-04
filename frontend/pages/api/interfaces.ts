import { HeatMapDatum, HeatMapSerie } from "@nivo/heatmap";

export interface SportCountDay {
  day: string,
  sport: string,
  value: string,
};

export interface HistoryData {
  date: string,
  activity: string,
  location: string,
  spots_total: number,
  spots_free: number,
}

export enum HistoryOrder {
  date,
  activity,
  location,
  spots_total,
  spots_free,
}

export interface StringDatum extends HeatMapDatum {
  x: string;
  y: number;
};

export interface StringExtraProps {
  id: string;
  data: StringDatum[];
};

export interface WeeklyDetails {
  sport: string;
  time: string;
  timeTo: string;
  avgFree: number;
  maxAvg: number;
  title: string;
  weekday: string;
};

export interface WeeklyTimeData {
  time: string;
  details: WeeklyDetails | null;
}

export interface WeeklyData {
  monday: WeeklyTimeData[],
  tuesday: WeeklyTimeData[],
  wednesday: WeeklyTimeData[],
  thursday: WeeklyTimeData[],
  friday: WeeklyTimeData[],
  saturday: WeeklyTimeData[],
  sunday: WeeklyTimeData[],
}
