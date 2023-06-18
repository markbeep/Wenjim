import {
  Text,
  Divider,
  Tabs,
  Center,
  Flex,
  ScrollArea,
  useMantineTheme,
} from "@mantine/core";
import React from "react";
import StatisticsBar from "../../../components/statisticsBar";
import LessonForm from "../../../components/lessonForm";
import Weekly from "../../../components/weekly";
import HistoryTable from "../../../components/historyTable";
import useResize from "../../../components/resize";

export default function Lesson() {
  const theme = useMantineTheme();
  const [wide] = useResize(theme.breakpoints.md);

  return (
    <>
      <LessonForm />

      <Divider my="sm" />

      <Tabs defaultValue="overview">
        <Tabs.List mb="sm">
          <Tabs.Tab value="overview">Overview</Tabs.Tab>
          <Tabs.Tab value="history">History</Tabs.Tab>
          <Tabs.Tab value="signup">Signup Speed</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="overview">
          <Center>
            <Flex direction={wide ? "row" : "column"} align="center">
              <StatisticsBar />
              <ScrollArea maw="100vw">
                <Weekly />
              </ScrollArea>
            </Flex>
          </Center>
        </Tabs.Panel>

        <Tabs.Panel value="history">
          <HistoryTable />
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
