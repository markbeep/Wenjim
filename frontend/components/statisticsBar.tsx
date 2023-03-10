import {
  Center,
  Flex,
  Grid,
  HoverCard,
  Loader,
  Title,
  Text,
} from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import {
  useEventStatistics,
  useTotalLessons,
  useTotalTrackings,
} from "../api/grpc";

const StatisticsBar = ({
  dateFrom,
  dateTo,
}: {
  dateFrom: Date;
  dateTo: Date;
}) => {
  const router = useRouter();
  const eventId = Number(router.query.eventId ?? "-1");
  const {
    data: stats,
    isLoading: statsLoading,
    isError: statsError,
  } = useEventStatistics(eventId, dateFrom, dateTo);
  const { data: totalLessons, isLoading: lessonsLoading } = useTotalLessons(
    eventId,
    dateFrom,
    dateTo,
  );
  const { data: totalTrackings, isLoading: trackingsLoading } =
    useTotalTrackings(eventId, dateFrom, dateTo);

  const statCard = (header: string | undefined, link: string, text: string) =>
    header ? (
      <Grid.Col span={1}>
        <Link href={link}>
          <Title variant="gradient" color="blue">
            {header}
          </Title>
          <Text>{text}</Text>
        </Link>
      </Grid.Col>
    ) : (
      <Grid.Col span={1}>
        <Flex h="100%" justify="end" direction="column">
          <Center>
            <Loader variant="dots" />
          </Center>
          <Text mt="sm">{text}</Text>
        </Flex>
      </Grid.Col>
    );

  return (
    <Grid grow className="text-center">
      {statCard(
        totalTrackings?.getTotaltrackings().toString(),
        `/lessons/${eventId}/history?dateFrom=${dateFrom.toISOString()}&dateTo=${dateTo.toISOString()}`,
        "Total data points",
      )}

      {statCard(
        totalLessons?.getTotallessons().toString(),
        `/lessons/${eventId}/history?dateFrom=${dateFrom.toISOString()}&dateTo=${dateTo.toISOString()}`,
        "Total tracked lessons",
      )}

      {statCard(
        stats ? (stats?.getAverageminutes() / 60).toFixed(2) : undefined,
        `/lessons/${eventId}/history?dateFrom=${dateFrom.toISOString()}&dateTo=${dateTo.toISOString()}`,
        "Average hours before full",
      )}

      {statCard(
        stats?.getAverageplacesfree().toFixed(2),
        `/lessons/${eventId}/history?dateFrom=${dateFrom.toISOString()}&dateTo=${dateTo.toISOString()}`,
        "Average free places",
      )}

      {statCard(
        stats?.getAverageplacesmax().toFixed(2),
        `/lessons/${eventId}/history?dateFrom=${dateFrom.toISOString()}&dateTo=${dateTo.toISOString()}`,
        "Average total places",
      )}

      <HoverCard>
        <HoverCard.Target>
          {statCard(
            stats?.getMaxplacesfree().toString(),
            `/lessons/${eventId}/history?dateFrom=${dateFrom.toISOString()}&dateTo=${dateTo.toISOString()}`,
            "Most recorded total spaces",
          )}
        </HoverCard.Target>
        <HoverCard.Dropdown>
          {stats
            ? new Date(stats.getDatemaxplacesfree() * 1000).toDateString()
            : "n/a"}
        </HoverCard.Dropdown>
      </HoverCard>

      <HoverCard>
        <HoverCard.Target>
          {statCard(
            stats?.getMaxplacesmax().toString(),
            `/lessons/${eventId}/history?dateFrom=${dateFrom.toISOString()}&dateTo=${dateTo.toISOString()}`,
            "Most recorded total spaces",
          )}
        </HoverCard.Target>
        <HoverCard.Dropdown>
          {stats
            ? new Date(stats.getDatemaxplacesmax() * 1000).toDateString()
            : "n/a"}
        </HoverCard.Dropdown>
      </HoverCard>
    </Grid>
  );
};

export default StatisticsBar;
