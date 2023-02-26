import {
  Alert,
  Center,
  Container,
  Group,
  Loader,
  Skeleton,
} from "@mantine/core";
import { IconAlertCircle, IconArrowLeft } from "@tabler/icons-react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useHistoryById, useSingleEvent } from "../../../api/grpc";
import HistoryTable from "../../../components/historyTable";

const History = () => {
  const router = useRouter();

  const eventId = Number(router.query.eventId ?? "-1");
  const { data, isLoading } = useSingleEvent(eventId);
  const dateFrom = new Date(
    router.query.dateFrom ? String(router.query.dateFrom) : "2022-01-01",
  );
  const dateTo = new Date(
    router.query.dateTo ? String(router.query.dateTo) : "2030-12-31",
  );
  const {
    data: history,
    isLoading: historyLoading,
    isError: historyError,
  } = useHistoryById(eventId, dateFrom, dateTo);

  return (
    <>
      <Container p={0}>
        <Link
          href={`/lessons/${eventId}?dateFrom=${dateFrom.toISOString()}&dateTo=${dateTo.toISOString()}`}
        >
          <IconArrowLeft size={30} />
        </Link>

        <Group mt="sm">
          {historyError && (
            <Alert icon={<IconAlertCircle />} color="red">
              There was an error fetching history data
            </Alert>
          )}

          {historyLoading && (
            <Center m="sm">
              <Loader variant="dots" />
            </Center>
          )}

          {historyLoading || (history?.getRowsList().length ?? 0) > 0 ? (
            <HistoryTable history={history} />
          ) : (
            <Alert>
              There seems to be no history data for this sport and date range.
              Try going back and picking more suitable dates.
            </Alert>
          )}
        </Group>
      </Container>
    </>
  );
};

export default History;
