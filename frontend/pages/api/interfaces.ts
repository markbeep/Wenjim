export interface SportCountDay {
  day: string,
  sport: string,
  value: string,
};

export interface HistoryData {
  date: string,
  activity: string,
  location: string,
  spots_available: number,
  spots_taken: number,
}

export enum HistoryOrder {
  date,
  activity,
  location,
  spots_available,
  spots_taken,
}
