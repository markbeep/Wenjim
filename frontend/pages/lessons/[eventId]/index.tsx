import { Center, Divider, Tabs } from "@mantine/core";
import React from "react";
import HistoryTable from "../../../components/historyTable";
import StatisticsBar from "../../../components/statisticsBar";
import LessonForm from "../../../components/lessonForm";

export default function Lesson({}) {
  return (
    <>
      <LessonForm />

      <Divider my="sm" />

      <Tabs defaultValue="overview">
        <Tabs.List mb="sm">
          <Tabs.Tab value="overview">Overview</Tabs.Tab>
          <Tabs.Tab value="history">History</Tabs.Tab>
          <Tabs.Tab value="weekly">Weekly</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="overview">
          <StatisticsBar />
        </Tabs.Panel>

        <Tabs.Panel value="history">
          <HistoryTable />
        </Tabs.Panel>

        <Tabs.Panel value="weekly">
          <Center>Coming soon...</Center>
        </Tabs.Panel>
      </Tabs>
    </>
  );
}
