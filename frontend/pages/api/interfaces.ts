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
  avg: number;
  title: string;
};

export interface WeeklyDetailsObject {
  [index: string]: WeeklyDetails;
};
