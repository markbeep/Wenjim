"use client";

import {
  Divider,
  Tabs,
  Center,
  Flex,
  ScrollArea,
  useMantineTheme,
  Loader,
} from "@mantine/core";
import React from "react";
import StatisticsBar from "./statisticsBar";
import LessonForm from "./lessonForm";
import Weekly from "./weekly";
import HistoryTable from "./historyTable";
import useResize from "../../../components/resize";
import { useSearchParams } from "next/navigation";
import {
  useEventStatistics,
  useTotalLessons,
  useTotalTrackings,
  useWeekly,
} from "../../../api/grpc";

export default function Lesson({ params }: { params: { eventId: string } }) {
  const searchParams = useSearchParams();
  const theme = useMantineTheme();
  const [wide] = useResize(theme.breakpoints.md, true);
  const eventId = Number(params.eventId);

  const dateFrom = new Date(searchParams.get("dateFrom") || "2022-01-01");
  const dateTo = new Date(searchParams.get("dateTo") || "2030-12-31");

  const { data: stats, isLoading: statsLoading } = useEventStatistics(
    eventId,
    dateFrom,
    dateTo,
  );
  const { data: totalLessons, isLoading: totalLessonsLoading } =
    useTotalLessons(eventId, dateFrom, dateTo);
  const { data: totalTrackings, isLoading: totalTrackingsLoading } =
    useTotalTrackings(eventId, dateFrom, dateTo);
  const { data: weekly, isLoading: weeklyLoading } = useWeekly(
    eventId,
    dateFrom,
    dateTo,
  );

  const isLoading =
    !stats ||
    !totalLessons ||
    !totalTrackings ||
    !weekly ||
    statsLoading ||
    totalLessonsLoading ||
    totalTrackingsLoading ||
    weeklyLoading;

  return (
    <>
      <LessonForm eventId={eventId} dateFrom={dateFrom} dateTo={dateTo} />

      <Divider my="sm" />

      <Tabs defaultValue="overview">
        <Tabs.List mb="sm">
          <Tabs.Tab value="overview">Overview</Tabs.Tab>
          <Tabs.Tab value="history">History</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="overview">
          <Center>
            {isLoading ? (
              <Loader />
            ) : (
              <Flex direction={wide ? "row" : "column"} align="center">
                <StatisticsBar
                  stats={stats}
                  totalLessons={totalLessons}
                  totalTrackings={totalTrackings}
                />
                <ScrollArea maw="100vw">
                  <Weekly
                    eventId={eventId}
                    dateFrom={dateFrom}
                    dateTo={dateTo}
                    data={weekly}
                  />
                </ScrollArea>
              </Flex>
            )}
          </Center>
        </Tabs.Panel>

        <Tabs.Panel value="history">
          <HistoryTable eventId={eventId} dateFrom={dateFrom} dateTo={dateTo} />
        </Tabs.Panel>
      </Tabs>
    </>
  );
}
