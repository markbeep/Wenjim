import {
  Container,
  Divider,
  Flex,
  ScrollArea,
  SimpleGrid,
  Text,
  useMantineTheme,
  Center,
  Modal,
} from "@mantine/core";
import { DateRangePickerValue } from "@mantine/dates";
import React, { useState } from "react";
import SingleSearch from "../components/singleSearch";
import { useWeekly } from "../api/hooks";
import { WeeklyTimeData } from "../api/interfaces";
import { GetServerSideProps } from "next";
import { HistoryService, UtilityService } from "../api/service";
import { HistorySortType } from "../generated/HistorySortType";
import { HistoryReply } from "../generated/HistoryReply";

const Hour = (props: { data: WeeklyTimeData | undefined }) => {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  const { data } = props;

  if (!data || !data.details || data.details.length === 0) {
    return (
      <Container
        mt={5}
        bg={theme.colors.dark[7]}
        mih={25}
        w="100%"
        sx={{ borderRadius: "5%" }}
      />
    );
  }
  const avgFree =
    data.details.reduce((a, b) => a + b.avgFree, 0) / data.details.length;
  const maxAvg =
    data.details.reduce((a, b) => a + b.maxAvg, 0) / data.details.length;
  const c = theme.colors;
  const colors = [c.red, c.orange, c.yellow, c.lime, c.teal, c.lime];
  const ind = Math.floor((avgFree / maxAvg) * (colors.length - 1));

  return (
    <>
      <Modal opened={opened} onClose={() => setOpened(false)} overlayBlur={2}>
        {data.details.map((d, i) => (
          <Container key={i}>
            {i > 0 && <Divider size="sm" />}
            <Flex
              w="100%"
              direction="row"
              align="center"
              justify="center"
              my="sm"
            >
              <Flex
                w="100%"
                direction="column"
                align="flex-start"
                justify="flex-start"
                mr="sm"
              >
                <Text>Sport</Text>
                <Text>Subtitle</Text>
                <Text>Time</Text>
                <Text>Weekday</Text>
                <Text>Average Free Spots</Text>
                <Text>Average Total Spots</Text>
              </Flex>
              <Flex
                w="100%"
                direction="column"
                align="flex-end"
                justify="flex-start"
              >
                <Text>
                  {d.sport.slice(0, 1).toUpperCase() + d.sport.slice(1)}
                </Text>
                <Text>{d.title}</Text>
                <Text>
                  {d.time} - {d.timeTo}
                </Text>
                <Text>
                  {d.weekday.slice(0, 1).toUpperCase() + d.weekday.slice(1)}
                </Text>
                <Text>{Math.round(d.avgFree)}</Text>
                <Text>{Math.round(d.maxAvg)}</Text>
              </Flex>
            </Flex>
          </Container>
        ))}
      </Modal>

      <button
        style={{ width: "100%", height: "100%" }}
        onClick={() => setOpened(true)}
      >
        <Container
          mt={5}
          bg={colors[ind] ? colors[ind][4] : c.dark[6]}
          mih={25}
          w="100%"
          pt={4}
          c={c.dark[4]}
          sx={{ borderRadius: "5%" }}
        >
          {Math.round(avgFree)}
        </Container>
      </button>
    </>
  );
};

const Weekly = (props: { history: HistoryReply; error: string }) => {
  const [activity, setActivity] = useState<string | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [date, setDate] = useState<DateRangePickerValue>();
  const { data } = useWeekly(
    activity ? [activity] : [],
    location ? [location] : [],
    date?.[0] ?? new Date("2022-09-19"),
    date?.[1] ?? new Date("2023-12-24"),
  );

  return (
    <Container fluid>
      <SingleSearch
        activity={activity}
        setActivity={setActivity}
        location={location}
        setLocation={setLocation}
        date={date}
        setDate={setDate}
      />

      <Divider my="sm" />
      {data && (
        <Center>
          <ScrollArea type="auto">
            <SimpleGrid cols={8} w={800}>
              <Center>Time</Center>
              <Center>Monday</Center>
              <Center>Tuesday</Center>
              <Center>Wednesday</Center>
              <Center>Thursday</Center>
              <Center>Friday</Center>
              <Center>Saturday</Center>
              <Center>Sunday</Center>
            </SimpleGrid>
            <Divider />
            <SimpleGrid cols={8} w={800}>
              <Flex direction="column" align="center">
                {data.monday.map((e, i) => (
                  <Container key={i} mt={5} w="100%" mih={25}>
                    <Center>{e.time}</Center>
                  </Container>
                ))}
              </Flex>
              <Flex direction="column" align="center">
                {data.monday.map((e, i) => (
                  <Hour key={"monday" + i} data={e} />
                ))}
              </Flex>
              <Flex direction="column" align="center">
                {data.tuesday.map((e, i) => (
                  <Hour key={"tuesday" + i} data={e} />
                ))}
              </Flex>
              <Flex direction="column" align="center">
                {data.wednesday.map((e, i) => (
                  <Hour key={"wednesday" + i} data={e} />
                ))}
              </Flex>
              <Flex direction="column" align="center">
                {data.thursday.map((e, i) => (
                  <Hour key={"thursday" + i} data={e} />
                ))}
              </Flex>
              <Flex direction="column" align="center">
                {data.friday.map((e, i) => (
                  <Hour key={"friday" + i} data={e} />
                ))}
              </Flex>
              <Flex direction="column" align="center">
                {data.saturday.map((e, i) => (
                  <Hour key={"saturday" + i} data={e} />
                ))}
              </Flex>
              <Flex direction="column" align="center">
                {data.sunday.map((e, i) => (
                  <Hour key={"sunday" + i} data={e} />
                ))}
              </Flex>
            </SimpleGrid>
            <Center>
              {
                <Text>
                  Hourly average free spots. Click to view in more detail.
                </Text>
              }
            </Center>
          </ScrollArea>
        </Center>
      )}
    </Container>
  );
};

export default Weekly;

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
