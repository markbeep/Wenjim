import { Text, Divider, Tabs, Center } from "@mantine/core";
import React from "react";
import StatisticsBar from "../../../components/statisticsBar";
import LessonForm from "../../../components/lessonForm";
import Weekly from "../../../components/weekly";

export default function Lesson({ }) {
  return (
    <>
      <LessonForm />

      <Divider my="sm" />

      <Tabs defaultValue="overview">
        <Tabs.List mb="sm">
          <Tabs.Tab value="overview">Overview</Tabs.Tab>
          <Tabs.Tab value="weekly">Weekly</Tabs.Tab>
          <Tabs.Tab value="history">History</Tabs.Tab>
          <Tabs.Tab value="signup">Signup Speed</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="overview">
          <StatisticsBar />
          <Center>
            <Text c="dimmed" mt="md">Total data (ignoring date range)</Text>
          </Center>
        </Tabs.Panel>

        <Tabs.Panel value="weekly">
          <Weekly />
        </Tabs.Panel>

        <Tabs.Panel value="history">
          {/* <HistoryTable /> */}
          <Center>
            <Text c="dimmed">Coming soon...</Text>
          </Center>
        </Tabs.Panel>

        <Tabs.Panel value="signup">
          <Center>
            <Text c="dimmed">Coming soon...</Text>
          </Center>
        </Tabs.Panel>
      </Tabs>
    </>
  );
}
