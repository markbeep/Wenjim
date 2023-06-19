import { useInfiniteQuery, useQuery } from "react-query";
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
  HistoryPageIdRequest,
  LastScrapeRequest,
  LocationsRequest,
  MinMaxDateRequest,
  SportsRequest,
  TitleRequest,
} from "../generated/countday_pb";

export const utilityClient = new UtilityClient("/api", null, null);
export const historyClient = new HistoryClient("/api", null, null);
export const weeklyClient = new WeeklyClient("/api", null, null);

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
  // hardcoded events for now
  const { data: e1, isLoading: l1, isError: err1 } = useSingleEvent(8);
  const { data: e2, isLoading: l2, isError: err2 } = useSingleEvent(4);
  const { data: e3, isLoading: l3, isError: err3 } = useSingleEvent(42);
  const { data: e4, isLoading: l4, isError: err4 } = useSingleEvent(51);
  return {
    isError: err1 || err2 || err3 || err4,
    isLoading: l1 || l2 || l3 || l4,
    data: [e1, e2, e3, e4],
  };
}

/**
 *
 * @returns boolean whether the last scrape is less than an hour ago
 */
export function usePing() {
  const { isError, isLoading, data } = useQuery(["scrape"], async () => {
    const promisified = promisify(utilityClient.lastScrape).bind(utilityClient);
    const resp = await promisified(new LastScrapeRequest(), {});
    return resp.getTime();
  });
  return { isError, isLoading, data };
}

/*
HISTORY
*/

export function useHistoryById(
  eventId: number,
  dateFrom: Date,
  dateTo: Date,
  pageSize: number,
  sortBy: HistoryPageIdRequest.SORT,
  descending: boolean,
) {
  return useInfiniteQuery({
    queryKey: [
      "historyId",
      eventId,
      dateFrom,
      dateTo,
      pageSize,
      sortBy,
      descending,
    ],
    queryFn: async ({ pageParam }) => {
      const promisified = promisify(historyClient.historyId).bind(
        historyClient,
      );
      const req = new HistoryPageIdRequest();
      req.setEventid(eventId);
      req.setDatefrom(Math.round(dateFrom.getTime() / 1e3));
      req.setDateto(Math.round(dateTo.getTime() / 1e3));
      req.setSize(pageSize);
      req.setPage(pageParam);
      req.setSortby(sortBy);
      req.setDescending(descending);
      const resp = await promisified(req, {});
      return resp.getRowsList();
    },
    getNextPageParam: (last, pages) =>
      last.length === 0 ? undefined : pages.length + 1,
  });
}

export function useTotalLessons(eventId: number, dateFrom: Date, dateTo: Date) {
  const { isError, isLoading, data } = useQuery(
    ["totalLessons", eventId, dateFrom, dateTo],
    async () => {
      const promisified = promisify(historyClient.totalLessons).bind(
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

export function useTotalTrackings(
  eventId: number,
  dateFrom: Date,
  dateTo: Date,
) {
  const { isError, isLoading, data } = useQuery(
    ["totalTrackings", eventId, dateFrom, dateTo],
    async () => {
      const promisified = promisify(historyClient.totalTrackings).bind(
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

/*
WEEKLY
*/

export function useWeekly(eventId: number, dateFrom: Date, dateTo: Date) {
  const { isError, isLoading, data } = useQuery(
    ["weekly", eventId, dateFrom, dateTo],
    async () => {
      const promisified = promisify(weeklyClient.weekly).bind(weeklyClient);
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
