import getConfig from "next/config";
import { useQuery } from "react-query";
import { promisify } from "util";
import {
  HistoryClient,
  UtilityClient,
  WeeklyClient,
} from "../generated/countday_grpc_web_pb";
import {
  EventsIdRequest,
  EventsRequest,
  HistoryIdRequest,
  LocationsRequest,
  MinMaxDateRequest,
  SportsRequest,
  TitleRequest,
} from "../generated/countday_pb";

const { publicRuntimeConfig } = getConfig();
const host = "https://swenjim.markc.su/api";

const utilityClient = new UtilityClient(host, null, null);
const historyClient = new HistoryClient(host, null, null);
const weeklyClient = new WeeklyClient(host, null, null);

/*
UTILITY
*/

export function useSports() {
  const { isError, isLoading, data } = useQuery(["sports"], async () => {
    const promisified = promisify(utilityClient.sports).bind(utilityClient);
    const req = new SportsRequest();
    const resp = await promisified(req, {});
    return resp;
  });
  return { isError, isLoading, data };
}

export function useLocations(eventId: number) {
  const { isError, isLoading, data } = useQuery(
    ["locations", eventId],
    async () => {
      const promisified = promisify(utilityClient.locations).bind(
        utilityClient,
      );
      const req = new LocationsRequest();
      req.setEventid(eventId);
      const resp = await promisified(req, {});
      return resp;
    },
  );
  return { isError, isLoading, data };
}

export function useTitles(eventId: number) {
  const { isError, isLoading, data } = useQuery(
    ["titles", eventId],
    async () => {
      const promisified = promisify(utilityClient.titles).bind(utilityClient);
      const req = new TitleRequest();
      req.setEventid(eventId);
      const resp = await promisified(req, {});
      return resp;
    },
  );
  return { isError, isLoading, data };
}

export function useSingleEvent(eventId: number) {
  const { isError, isLoading, data } = useQuery(
    ["singleEvent", eventId],
    async () => {
      const promisified = promisify(utilityClient.singleEvent).bind(
        utilityClient,
      );
      const req = new EventsIdRequest();
      req.setId(eventId);
      const resp = await promisified(req, {});
      return resp;
    },
  );
  return { isError, isLoading, data };
}

export function useEvents() {
  const { isError, isLoading, data } = useQuery(["totalDay"], async () => {
    const promisified = promisify(utilityClient.events).bind(utilityClient);
    const req = new EventsRequest();
    const resp = await promisified(req, {});
    return resp;
  });
  return { isError, isLoading, data };
}

export function useMinMaxDate() {
  const { isError, isLoading, data } = useQuery(["minMaxDate"], async () => {
    const promisified = promisify(utilityClient.minMaxDate).bind(utilityClient);
    const resp = await promisified(new MinMaxDateRequest(), {});
    return resp;
  });
  return { isError, isLoading, data };
}

export function useTopEvents() {
  const { isError, isLoading, data } = useQuery(["topEvents"], async () => {
    // const promisified = promisify(utilityClient.topEvents).bind(utilityClient);
    // const req = new HistoryIdRequest();
    // const resp = await promisified(req, {});

    // PLACEHOLDER UNTIL IMPLEMENTED
    return [
      {
        sport: "Fitness",
        title: "Individuelles Training",
        location: "Sport Center Polyterrasse",
        niveau: "Alle",
        eventId: 8,
      },
      {
        sport: "Fitness",
        title: "Individuelles Training",
        location: "Sport Center Hönggerberg",
        niveau: "Alle",
        eventId: 8,
      },
      {
        sport: "Fitness",
        title: "Individuelles Training",
        location: "Sport Center Irchel",
        niveau: "Alle",
        eventId: 8,
      },
      {
        sport: "Fitness",
        title: "Individuelles Training",
        location: "Sport Center Rämistrasse",
        niveau: "Alle",
        eventId: 8,
      },
    ];
  });
  return { isError, isLoading, data };
}

/*
HISTORY
*/

export function useHistoryById(eventId: number, dateFrom: Date, dateTo: Date) {
  const { isError, isLoading, data } = useQuery(
    ["historyId", eventId, dateFrom, dateTo],
    async () => {
      const promisified = promisify(historyClient.historyId).bind(
        historyClient,
      );
      const req = new HistoryIdRequest();
      req.setEventid(eventId);
      req.setDatefrom(Math.round(dateFrom.getTime() / 1e3));
      req.setDateto(Math.round(dateTo.getTime() / 1e3));
      const resp = await promisified(req, {});
      return resp;
    },
  );
  return { isError, isLoading, data };
}

export function useEventStatistics(
  eventId: number,
  dateFrom: Date,
  dateTo: Date,
) {
  const { isError, isLoading, data } = useQuery(
    ["eventStatistics", eventId, dateFrom, dateTo],
    async () => {
      const promisified = promisify(historyClient.eventStatistics).bind(
        historyClient,
      );
      const req = new HistoryIdRequest();
      req.setEventid(eventId);
      req.setDatefrom(Math.round(dateFrom.getTime() / 1e3));
      req.setDateto(Math.round(dateTo.getTime() / 1e3));
      const resp = await promisified(req, {});
      return resp;
    },
  );
  return { isError, isLoading, data };
}
