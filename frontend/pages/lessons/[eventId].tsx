import { Select, Title, Text, Skeleton, Alert } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { useRouter } from "next/router";
import React from "react";
import {
  useHistoryById,
  useLocations,
  useSingleEvent,
  useTitles,
} from "../../api/grpc";
import HistoryTable from "../../components/historyTable";

export default function Lesson({}) {
  const router = useRouter();
  const eventId = Number(router.query.eventId ?? "-1");
  const dateFrom = new Date(
    router.query.dateFrom ? String(router.query.dateFrom) : "1970-01-01",
  );
  const dateTo = new Date(
    router.query.dateTo ? String(router.query.dateTo) : "2040-12-31",
  );
  const { data, isLoading } = useSingleEvent(eventId);
  const {
    data: locations,
    isLoading: locationsLoading,
    isError: locationsError,
  } = useLocations(eventId);
  const {
    data: titles,
    isLoading: titlesLoading,
    isError: titlesError,
  } = useTitles(eventId);
  const {
    data: history,
    isLoading: historyLoading,
    isError: historyError,
  } = useHistoryById(eventId, dateFrom, dateTo);

  return (
    <>
      {data && (
        <>
          <Title>
            {data.getSport()}: {data.getTitle()}
          </Title>

          {locationsError && (
            <Alert icon={<IconAlertCircle />} color="red">
              There was an error fetching locations
            </Alert>
          )}
          {locations && (
            <Select
              placeholder={data.getLocation()}
              disabled={locationsLoading}
              searchable
              dropdownPosition="bottom"
              data={locations.getLocationsList().map(e => ({
                value: e.getEventid().toString(),
                label: e.getLocation(),
              }))}
              onChange={v => router.push(`/lessons/${v}`)}
            />
          )}

          {titlesError && (
            <Alert icon={<IconAlertCircle />} color="red">
              There was an error fetching titles
            </Alert>
          )}
          {titles && (
            <Select
              placeholder={data.getTitle()}
              disabled={titlesLoading}
              searchable
              dropdownPosition="bottom"
              data={titles.getTitlesList().map(e => ({
                value: e.getEventid().toString(),
                label: e.getTitle(),
              }))}
              onChange={v => router.push(`/lessons/${v}`)}
            />
          )}

          <Text color="dimmed">
            {data.getLocation()} | Niveau: {data.getLocation()}
          </Text>
          {historyError && (
            <Alert icon={<IconAlertCircle />} color="red">
              There was an error fetching history data
            </Alert>
          )}
          <Skeleton animate visible={historyLoading}>
            <HistoryTable history={history} />
          </Skeleton>
        </>
      )}
    </>
  );
}
