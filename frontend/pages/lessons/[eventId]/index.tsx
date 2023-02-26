import {
  Select,
  Title,
  Text,
  Alert,
  Flex,
  Divider,
  Grid,
  Center,
  Loader,
  HoverCard,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { IconAlertCircle, IconSignRightFilled } from "@tabler/icons-react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import {
  useEventStatistics,
  useLocations,
  useSingleEvent,
  useTitles,
} from "../../../api/grpc";

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
  const {
    data: stats,
    isLoading: statsLoading,
    isError: statsError,
  } = useEventStatistics(eventId, dateFrom, dateTo);

  const statCard = (header: string, link: string, text: string) => (
    <Grid.Col span={1}>
      <Link href={link}>
        <Title variant="gradient" color="blue">
          {header}
        </Title>
        <Text>{text}</Text>
      </Link>
    </Grid.Col>
  );

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
          {statsLoading && (
            <Center>
              <Loader variant="dots" />
            </Center>
          )}
          {stats && (
            <Grid grow className="text-center">
              {statCard(
                stats.getTrackedlessons().toString(),
                `/lessons/${eventId}/history?dateFrom=${dateFrom.toISOString()}&dateTo=${dateTo.toISOString()}`,
                "Total tracked lessons",
              )}

              {statCard(
                (stats.getAverageminutes() / 60).toFixed(2),
                `/lessons/${eventId}/history?dateFrom=${dateFrom.toISOString()}&dateTo=${dateTo.toISOString()}`,
                "Average hours before full",
              )}

              {statCard(
                stats.getAverageplacesfree().toFixed(2),
                `/lessons/${eventId}/history?dateFrom=${dateFrom.toISOString()}&dateTo=${dateTo.toISOString()}`,
                "Average free places",
              )}

              {statCard(
                stats.getAverageplacesmax().toFixed(2),
                `/lessons/${eventId}/history?dateFrom=${dateFrom.toISOString()}&dateTo=${dateTo.toISOString()}`,
                "Average total places",
              )}

              {statCard(
                stats.getMaxplacesfree().toString(),
                `/lessons/${eventId}/history?dateFrom=${dateFrom.toISOString()}&dateTo=${dateTo.toISOString()}`,
                "Most recorded free spaces",
              )}

              <HoverCard>
                <HoverCard.Target>
                  {statCard(
                    stats.getMaxplacesmax().toString(),
                    `/lessons/${eventId}/history?dateFrom=${dateFrom.toISOString()}&dateTo=${dateTo.toISOString()}`,
                    "Most recorded total spaces",
                  )}
                </HoverCard.Target>
                <HoverCard.Dropdown>
                  kek
                  {new Date(stats.getDatemaxplacesmax()).toDateString()}
                </HoverCard.Dropdown>
              </HoverCard>

              {statCard(
                stats.getTotaltrackings().toString(),
                `/lessons/${eventId}/history?dateFrom=${dateFrom.toISOString()}&dateTo=${dateTo.toISOString()}`,
                "Total data points",
              )}
            </Grid>
          )}
        </>
      )}
    </>
  );
}
