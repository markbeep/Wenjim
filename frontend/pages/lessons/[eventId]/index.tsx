import {
  Select,
  Title,
  Text,
  Alert,
  Flex,
  Divider,
  Center,
  Loader,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { IconAlertCircle, IconSignRightFilled } from "@tabler/icons-react";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useLocations, useSingleEvent, useTitles } from "../../../api/grpc";
import StatisticsBar from "../../../components/statisticsBar";

export default function Lesson({}) {
  const router = useRouter();
  const eventId = Number(router.query.eventId ?? "-1");
  const [dateFrom, setDateFrom] = useState(
    new Date(
      router.query.dateFrom ? String(router.query.dateFrom) : "2022-01-01",
    ),
  );
  const [dateTo, setDateTo] = useState(
    new Date(router.query.dateTo ? String(router.query.dateTo) : "2030-12-31"),
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

  return (
    <>
      {isLoading && (
        <Center>
          <Loader variant="dots" />
        </Center>
      )}
      {data && (
        <>
          <Head>
            <title>
              {data.getSport()}: {data.getTitle()}
            </title>
          </Head>

          <Text color="dimmed">
            {data.getTitle()}, {data.getNiveau()}
          </Text>
          <Title size={24}>{data.getSport()}</Title>
          <Flex direction="row">
            <Center>
              <IconSignRightFilled size={18} />
              <Text ml={2} color="dimmed">
                {data.getLocation()}
              </Text>
            </Center>
          </Flex>

          {locationsError && (
            <Alert icon={<IconAlertCircle />} color="red">
              There was an error fetching locations
            </Alert>
          )}
          {locations && (
            <Select
              label="Location"
              placeholder={data.getLocation()}
              disabled={locationsLoading}
              data={locations.getLocationsList().map(e => ({
                value: e.getEventid().toString(),
                label: e.getLocation(),
              }))}
              onChange={v => router.push(`/lessons/${v}`)}
              w="100%"
              mt="sm"
            />
          )}

          {titlesError && (
            <Alert icon={<IconAlertCircle />} color="red">
              There was an error fetching titles
            </Alert>
          )}
          {titles && (
            <Select
              label="Subtitle"
              placeholder={data.getTitle()}
              disabled={titlesLoading}
              data={titles.getTitlesList().map(e => ({
                value: e.getEventid().toString(),
                label: e.getTitle(),
              }))}
              onChange={v => router.push(`/lessons/${v}`)}
              w="100%"
            />
          )}

          <DatePicker
            value={dateFrom}
            label="Date From"
            onChange={v => {
              const newDate = v ?? new Date("2022-01-01");
              setDateFrom(newDate);
              router.push(
                `${eventId}?dateFrom=${newDate.toISOString()}&dateTo=${dateTo.toISOString()}`,
              );
            }}
          />
          <DatePicker
            value={dateTo}
            label="Date To"
            onChange={v => {
              const newDate = v ?? new Date("2030-12-31");
              setDateTo(newDate);
              router.push(
                `${eventId}?dateFrom=${dateFrom.toISOString()}&dateTo=${newDate.toISOString()}`,
              );
            }}
          />

          <Divider my="sm" />

          <StatisticsBar dateFrom={dateFrom} dateTo={dateTo} />
        </>
      )}
    </>
  );
}
