import {
  Center,
  Flex,
  Grid,
  Loader,
  Title,
  Text,
  Tooltip,
} from "@mantine/core";
import React from "react";
import {
  useEventStatistics,
  useTotalLessons,
  useTotalTrackings,
} from "../../../api/grpc";

const StatisticsBar = ({
  eventId,
  dateFrom,
  dateTo,
}: {
  eventId: number;
  dateFrom: Date;
  dateTo: Date;
}) => {
  const { data: stats } = useEventStatistics(eventId, dateFrom, dateTo);
  const { data: totalLessons } = useTotalLessons(eventId, dateFrom, dateTo);
  const { data: totalTrackings } = useTotalTrackings(eventId, dateFrom, dateTo);

  const statCard = (
    header: string | undefined,
    text: string,
    tooltip: string,
  ) => (
    <Tooltip label={tooltip}>
      {header ? (
        <Grid.Col span={1}>
          <Title variant="gradient" color="blue">
            {header}
          </Title>
          <Text>{text}</Text>
        </Grid.Col>
      ) : (
        <Grid.Col span={1}>
          <Flex h="100%" justify="end" direction="column">
            <Center>
              <Loader variant="dots" color="gray" />
            </Center>
            <Text mt="sm">{text}</Text>
          </Flex>
        </Grid.Col>
      )}
    </Tooltip>
  );

  return (
    <Grid grow className="text-center" columns={1} maw="10rem">
      {statCard(
        totalTrackings?.getTotaltrackings().toString(),
        "Total data points",
        "Total tracked points",
      )}

      {statCard(
        totalLessons?.getTotallessons().toString(),
        "Total tracked lessons",
        "Total unique tracked lessons",
      )}

      {statCard(
        stats ? (stats?.getAverageminutes() / 60).toFixed(2) : undefined,
        "Average hours before full",
        "Only counting lessons that become full",
      )}

      {statCard(
        stats?.getAverageplacesfree().toFixed(2),
        "Average free places",
        "The average free places with all lessons combined.",
      )}

      {statCard(
        stats?.getAverageplacesmax().toFixed(2),
        "Average total places",
        "The average total places with all lessons combined.",
      )}

      {statCard(
        stats?.getMaxplacesfree().toString(),
        "Most recorded free spaces",
        stats
          ? new Date(stats.getDatemaxplacesfree() * 1000).toDateString()
          : "n/a",
      )}

      {statCard(
        stats?.getMaxplacesmax().toString(),
        "Most recorded total spaces",
        stats
          ? new Date(stats.getDatemaxplacesmax() * 1000).toDateString()
          : "n/a",
      )}
    </Grid>
  );
};

export default StatisticsBar;
