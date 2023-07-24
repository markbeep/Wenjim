import { Flex, Grid, Title, Text, Tooltip, Skeleton } from "@mantine/core";
import React from "react";
import { HistoryStatisticsReply, TotalLessonsReply, TotalTrackingsReply } from "../../../generated/countday_pb";

const StatisticsBar = ({
  stats,
  totalLessons,
  totalTrackings,
}: {
  stats: HistoryStatisticsReply,
  totalLessons: TotalLessonsReply,
  totalTrackings: TotalTrackingsReply
}) => {
  const statCard = (
    header: string | undefined,
    text: string,
    tooltip: string,
  ) => (
    <Tooltip label={tooltip}>
      <Grid.Col span={1}>
        <Flex direction="column" align="center">
          {header ? (
            <Title variant="gradient" color="blue" align="center">
              {header}
            </Title>
          ) : (
            <Skeleton width={150} height={45} />
          )}
          <Text align="center">{text}</Text>
        </Flex>
      </Grid.Col>
    </Tooltip>
  );

  return (
    <Grid grow columns={1} maw="10rem">
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
