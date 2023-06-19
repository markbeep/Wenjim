"use client";

import {
  Divider,
  Tabs,
  Center,
  Flex,
  ScrollArea,
  useMantineTheme,
} from "@mantine/core";
import React from "react";
import StatisticsBar from "./statisticsBar";
import LessonForm from "./lessonForm";
import Weekly from "./weekly";
import HistoryTable from "./historyTable";
import useResize from "../../../components/resize";
import { useSearchParams } from "next/navigation";

export default function Lesson({ params }: { params: { eventId: string } }) {
  const searchParams = useSearchParams();
  const theme = useMantineTheme();
  const [wide] = useResize(theme.breakpoints.md, true);
  const eventId = Number(params.eventId);

  const dateFrom = new Date(searchParams.get("dateFrom") || "2022-01-01");
  const dateTo = new Date(searchParams.get("dateTo") || "2030-12-31");

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
            <Flex direction={wide ? "row" : "column"} align="center">
              <StatisticsBar
                eventId={eventId}
                dateFrom={dateFrom}
                dateTo={dateTo}
              />
              <ScrollArea maw="100vw">
                <Weekly eventId={eventId} dateFrom={dateFrom} dateTo={dateTo} />
              </ScrollArea>
            </Flex>
          </Center>
        </Tabs.Panel>

        <Tabs.Panel value="history">
          <HistoryTable eventId={eventId} dateFrom={dateFrom} dateTo={dateTo} />
        </Tabs.Panel>
      </Tabs>
    </>
  );
}
