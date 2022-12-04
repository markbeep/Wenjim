import { AspectRatio, Container, Divider, Flex, ScrollArea, SimpleGrid, Title, Text, Paper, useMantineTheme, useMantineColorScheme, Center, Table, MantineTheme, Button, Modal } from '@mantine/core'
import { DateRangePickerValue } from '@mantine/dates'
import React, { useState } from 'react'
import Search from '../components/search'
import SingleSearch from '../components/singleSearch'
import { useWeekly } from './api/hooks'
import { WeeklyTimeData } from './api/interfaces'

const Hour = (props: { data: WeeklyTimeData | undefined }) => {
  const theme = useMantineTheme()
  const [opened, setOpened] = useState(false);
  const { data } = props;

  if (!data || !data.details)
    return (
      <Container
        mt="sm"
        bg={theme.colors.dark[7]}
        mih={30}
        w="100%"
      />)
  const c = theme.colors
  const colors = [c.red, c.orange, c.yellow, c.lime, c.teal, c.lime]
  const ind = Math.floor(data.details.avgFree / data.details.maxAvg * (colors.length - 1))
  console.log(data.details, ind, data.details.maxAvg);

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={`${data.details.sport}`}
      >
        <Flex w="100%" direction="row" align="center" justify="center">
          <Flex w="100%" direction="column" align="flex-start" justify="flex-start" mr="sm">
            <Text>Time</Text>
            <Text>Weekday</Text>
            <Text>Average Free Spots</Text>
            <Text>Subtitle</Text>
          </Flex>
          <Flex w="100%" direction="column" align="flex-end" justify="flex-start">
            <Text>{data.details.time} - {data.details.timeTo}</Text>
            <Text>{data.details.weekday.slice(0, 1).toUpperCase() + data.details.weekday.slice(1)}</Text>
            <Text>{Math.round(data.details.avgFree)}</Text>
            <Text>{data.details.title}</Text>
          </Flex>
        </Flex>
      </Modal>

      <button style={{ width: "100%", height: "100%" }} onClick={() => setOpened(true)}>
        <Container
          mt="sm"
          bg={colors[ind][4] ?? c.dark[6]}
          mih={30}
          w="100%"
          c={c.dark[4]}
        >
          {Math.round(data.details.avgFree)}
        </Container>
      </button>
    </>
  )
}

const Weekly = () => {
  const [activity, setActivity] = useState<string | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [date, setDate] = useState<DateRangePickerValue>();
  const { data } = useWeekly(
    activity ? [activity] : [],
    location ? [location] : [],
    date?.[0] ?? new Date("2022-08-01"),
    date?.[1] ?? new Date("2022-12-31")
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

      <ScrollArea type='auto'>
        <SimpleGrid cols={8} miw={1300} >
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
        <SimpleGrid cols={8} miw={1300} >
          <Flex direction="column" align="center">
            {data && data.monday.map((e, i) => <Container key={i} mt="sm" w="100%" mih={30}><Center>{e.time}</Center></Container>)}
          </Flex>
          <Flex direction="column" align="center">
            {data && data.monday.map((e, i) => <Hour key={"monday" + i} data={e} />)}
          </Flex>
          <Flex direction="column" align="center">
            {data && data.tuesday.map((e, i) => <Hour key={"tuesday" + i} data={e} />)}
          </Flex>
          <Flex direction="column" align="center">
            {data && data.wednesday.map((e, i) => <Hour key={"wednesday" + i} data={e} />)}
          </Flex>
          <Flex direction="column" align="center">
            {data && data.thursday.map((e, i) => <Hour key={"thursday" + i} data={e} />)}
          </Flex>
          <Flex direction="column" align="center">
            {data && data.friday.map((e, i) => <Hour key={"friday" + i} data={e} />)}
          </Flex>
          <Flex direction="column" align="center">
            {data && data.saturday.map((e, i) => <Hour key={"saturday" + i} data={e} />)}
          </Flex>
          <Flex direction="column" align="center">
            {data && data.sunday.map((e, i) => <Hour key={"sunday" + i} data={e} />)}
          </Flex>
        </SimpleGrid>
      </ScrollArea>
    </Container >
  )
}

export default Weekly
