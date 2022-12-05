import React, { useCallback, useEffect, useState } from 'react'
import Search from '../components/search'
import { useHistory, useHistoryLine } from './api/hooks'
import { HistoryOrder } from './api/interfaces'
import LineChart from '../components/lineChart'
import { Center, Container, Divider, Flex, Overlay, Pagination, ScrollArea, Skeleton, Table, Title, useMantineTheme, Text } from '@mantine/core'
import { IconChevronUp, IconChevronDown } from '@tabler/icons'
import { DateRangePickerValue } from '@mantine/dates'
import { useWindowScroll } from '@mantine/hooks'

const History = () => {
  const theme = useMantineTheme();
  const [activities, setActivities] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [date, setDate] = useState<DateRangePickerValue>();
  const [orderBy, setOrderBy] = useState<HistoryOrder>(HistoryOrder.date);
  const [desc, setDesc] = useState(false);
  const [page, setPage] = useState(0);
  const [amount, setAmount] = useState(50); // amount of items to show per page
  const { data, isLoading } = useHistory(
    activities,
    locations,
    date?.[0] ?? new Date("2022-09-19"),
    date?.[1] ?? new Date("2022-12-24"),
    orderBy,
    desc
  );
  const { data: lineData, isLoading: lineIsLoading } = useHistoryLine(
    activities,
    locations,
    date?.[0] ?? new Date("2022-09-19"),
    date?.[1] ?? new Date("2022-12-24"),
  );
  const [scroll, scrollTo] = useWindowScroll();

  const [show, setShow] = useState(false);

  const handleResize = useCallback((width: number) => {
    if (width < theme.breakpoints.sm) {
      setShow(false);
    } else {
      setShow(true);
    }
  }, [theme])
  // initially check for window size
  useEffect(() => {
    if (typeof window !== "undefined") {
      handleResize(window.innerWidth);
    }

  }, [handleResize])

  if (typeof window !== "undefined") {
    window.addEventListener("resize", () => {
      handleResize(window.innerWidth);
    })
  }

  const handleSortClick = (d: HistoryOrder) => {
    if (orderBy === d) {
      setDesc(b => !b);
      return;
    }
    setOrderBy(d);
    setDesc(false);
  };

  const ths = (
    <tr>
      <th></th>
      <th className={orderBy === HistoryOrder.date ? `bg-neutral-content` : ""}>
        <button onClick={() => handleSortClick(HistoryOrder.date)}>
          <Flex justify="center" direction="row" align="center">
            DATE
            {orderBy === HistoryOrder.date && (desc ? <IconChevronUp /> : <IconChevronDown />)}
          </Flex>
        </button>
      </th>
      <th className={orderBy === HistoryOrder.activity ? `bg-neutral-content` : ""}>
        <button onClick={() => handleSortClick(HistoryOrder.activity)}>
          <Flex justify="center" direction="row" align="center">
            ACTIVITY
            {orderBy === HistoryOrder.activity && (desc ? <IconChevronUp /> : <IconChevronDown />)}
          </Flex>
        </button>
      </th>
      <th className={orderBy === HistoryOrder.location ? `bg-neutral-content` : ""}>
        <button onClick={() => handleSortClick(HistoryOrder.location)}>
          <Flex justify="center" direction="row" align="center">
            LOCATION
            {orderBy === HistoryOrder.location && (desc ? <IconChevronUp /> : <IconChevronDown />)}
          </Flex>
        </button>
      </th>
      <th className={orderBy === HistoryOrder.spots_free ? `bg-neutral-content` : ""}>
        <button onClick={() => handleSortClick(HistoryOrder.spots_free)}>
          <Flex justify="center" direction="row" align="center">
            SPOTS FREE
            {orderBy === HistoryOrder.spots_free && (desc ? <IconChevronUp /> : <IconChevronDown />)}
          </Flex>
        </button>
      </th>
      <th className={orderBy === HistoryOrder.spots_total ? `bg-neutral-content` : ""}>
        <button onClick={() => handleSortClick(HistoryOrder.spots_total)}>
          <Flex justify="center" direction="row" align="center">
            SPOTS TOTAL
            {orderBy === HistoryOrder.spots_total && (desc ? <IconChevronUp /> : <IconChevronDown />)}
          </Flex>
        </button>
      </th>
    </tr>
  )

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

      {(data && data.length === 0) && <Center>
        <Title>No data found</Title>
      </Center>}
      <Skeleton visible={!data || isLoading}>
        <ScrollArea type='auto'>
          <Container sx={{ minHeight: "30rem" }} fluid>
            {(!data || data.length === 0) && <Overlay color={theme.primaryShade.toString()} blur={2} />}
            <Table captionSide='bottom' highlightOnHover striped>
              <thead>{ths}</thead>
              <tbody>
                {data?.slice(page * amount, (page + 1) * amount).map((e, i) => (
                  <tr key={page * amount + i}>
                    <th>{page * amount + i + 1}</th>
                    <td>{e.date}</td>
                    <td>{e.activity}</td>
                    <td>{e.location}</td>
                    <td>{e.spots_free}</td>
                    <td>{e.spots_total}</td>
                  </tr>
                ))
                }
              </tbody>
              {data && data.length > 0 && <tfoot>{ths}</tfoot>}
            </Table>
          </Container>
        </ScrollArea>
        <Center>
          {data && data.length > amount &&
            <Pagination siblings={show ? 2 : 1} withControls={show} total={Math.floor(data.length / amount)} onChange={e => { setPage(e); setTimeout(() => scrollTo({ y: 5000 }), 100) }} />
          }
        </Center>
      </Skeleton>

    </Container>
  )
}

export default History
