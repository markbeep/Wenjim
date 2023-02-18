import React, { useCallback, useEffect, useState } from "react";
import Search from "../components/search";
import { useHistory, useHistoryLine } from "../api/hooks";
import { HistoryOrder } from "../api/interfaces";
import LineChart from "../components/lineChart";
import {
  Center,
  Container,
  Divider,
  Flex,
  Overlay,
  Pagination,
  ScrollArea,
  Skeleton,
  Table,
  Title,
  useMantineTheme,
  Text,
} from "@mantine/core";
import { IconChevronUp, IconChevronDown } from "@tabler/icons";
import { DateRangePickerValue } from "@mantine/dates";
import { useWindowScroll } from "@mantine/hooks";
import { GetServerSideProps } from "next";
import { HistorySortType } from "../generated/HistorySortType";
import { HistoryService } from "../api/service";
import { HistoryReply } from "../generated/HistoryReply";
import useResize from "../components/resize";

const History = ({
  history,
  error,
}: {
  history: HistoryReply;
  error: string;
}) => {
  const theme = useMantineTheme();
  const [activities, setActivities] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [date, setDate] = useState<DateRangePickerValue>();
  const [desc, setDesc] = useState(false);
  const { data: lineData, isLoading: lineIsLoading } = useHistoryLine(
    activities,
    locations,
    date?.[0] ?? new Date("2022-09-19"),
    date?.[1] ?? new Date("2023-12-24"),
  );

  const [, scrollTo] = useWindowScroll();

  const [show] = useResize();

  return (
    <Container fluid>
      <Search
        activities={activities}
        setActivities={setActivities}
        locations={locations}
        setLocations={setLocations}
        date={date}
        setDate={setDate}
      />

      <Divider my="md" />

      <Skeleton visible={lineIsLoading}>
        <LineChart data={lineData} />
        <Center>
          <Text>Total open spots per day for the selected activities</Text>
        </Center>
      </Skeleton>

      <Divider my="md" />
    </Container>
  );
};

export default History;

export const getServerSideProps: GetServerSideProps = async context => {
  try {
    const historyService = new HistoryService();
    const { history, error } = await historyService.getHistory(
      {
        sport: "Fitness",
        location: "Sport Center Polyterrasse",
        title: "Individuelles Training",
      },
      new Date("2000-01-01"),
      new Date("2030-12-12"),
      HistorySortType.HISTORYSORT_DATE,
    );

    if (history) {
      return {
        props: { history },
      };
    } else {
      return {
        props: {
          error: "No result",
        },
      };
    }
  } catch (error) {
    return {
      props: { error },
    };
  }
};
