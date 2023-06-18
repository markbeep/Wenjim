import {
  Center,
  Container,
  Flex,
  Loader,
  Table,
  useMantineTheme,
  Text,
  Affix,
  Button,
  Transition,
} from "@mantine/core";
import {
  IconArrowUp,
  IconSortAscending2,
  IconSortDescending2,
} from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { useHistoryById } from "../../../api/grpc";
import { HistoryPageIdRequest } from "../../../generated/countday_pb";
import InfiniteScroll from "react-infinite-scroller";
import { useWindowScroll } from "@mantine/hooks";

const pageSize = 200;

const HistoryTable = ({
  eventId,
  dateFrom,
  dateTo,
}: {
  eventId: number;
  dateFrom: Date;
  dateTo: Date;
}) => {
  const [orderBy, setOrderBy] = useState(HistoryPageIdRequest.SORT.DATE);
  const [descend, setDescend] = useState(false);
  const [scroll, scrollTo] = useWindowScroll();
  const theme = useMantineTheme();
  const {
    data: history,
    isLoading: historyLoading,
    isFetching,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useHistoryById(eventId, dateFrom, dateTo, pageSize, orderBy, descend);

  const handleSortClick = (d: HistoryPageIdRequest.SORT) => {
    if (orderBy === d) {
      setDescend(d => !d);
    } else {
      setOrderBy(d);
      setDescend(false);
    }
  };

  useEffect(() => {
    refetch();
  }, [orderBy, descend, refetch]);

  const ths = (size: number) => (
    <tr>
      <th>{size} rows</th>
      <th
        className={
          orderBy === HistoryPageIdRequest.SORT.DATE ? `bg-neutral-content` : ""
        }
      >
        <button onClick={() => handleSortClick(HistoryPageIdRequest.SORT.DATE)}>
          <Flex justify="center" direction="row" align="center">
            <Text mr="sm">DATE</Text>
            {orderBy === HistoryPageIdRequest.SORT.DATE &&
              (descend ? <IconSortDescending2 /> : <IconSortAscending2 />)}
          </Flex>
        </button>
      </th>
      <th
        className={
          orderBy === HistoryPageIdRequest.SORT.FREE ? `bg-neutral-content` : ""
        }
      >
        <button onClick={() => handleSortClick(HistoryPageIdRequest.SORT.FREE)}>
          <Flex justify="center" direction="row" align="center">
            <Text mr="sm">SPOTS FREE</Text>
            {orderBy === HistoryPageIdRequest.SORT.FREE &&
              (descend ? <IconSortDescending2 /> : <IconSortAscending2 />)}
          </Flex>
        </button>
      </th>
      <th
        className={
          orderBy === HistoryPageIdRequest.SORT.TOTAL
            ? `bg-neutral-content`
            : ""
        }
      >
        <button
          onClick={() => handleSortClick(HistoryPageIdRequest.SORT.TOTAL)}
        >
          <Flex justify="center" direction="row" align="center">
            <Text mr="sm">SPOTS TOTAL</Text>
            {orderBy === HistoryPageIdRequest.SORT.TOTAL &&
              (descend ? <IconSortDescending2 /> : <IconSortAscending2 />)}
          </Flex>
        </button>
      </th>
    </tr>
  );

  return (
    <>
      <Affix position={{ bottom: "2rem", right: "2rem" }}>
        <Transition transition="slide-up" mounted={scroll.y > 0}>
          {transitionStyles => (
            <Button
              leftIcon={<IconArrowUp size="1rem" />}
              style={transitionStyles}
              onClick={() => scrollTo({ y: 0 })}
            >
              Scroll to top
            </Button>
          )}
        </Transition>
      </Affix>
      {historyLoading && (
        <Center>
          <Loader variant="dots" color="gray" />
        </Center>
      )}
      <Container sx={{ minHeight: "30rem" }} fluid>
        <InfiniteScroll
          loadMore={() => !isFetching && fetchNextPage()}
          hasMore={hasNextPage}
          loader={
            <Center>
              <Loader variant="dots" color="gray" />
            </Center>
          }
        >
          <Table captionSide="bottom" highlightOnHover striped>
            <thead
              style={{
                top: 0,
                position: "sticky",
                backgroundColor:
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[7]
                    : theme.white,
              }}
            >
              {ths(history?.pages.flat().length ?? 0)}
            </thead>
            {history && (
              <tbody>
                {history.pages.flat().map((e, i) => (
                  <tr key={i + e.getDate()}>
                    <th>{i}</th>
                    <td>
                      {new Date(e.getDate() * 1e3).toLocaleString("nu-arab", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                    <td>{e.getPlacesfree()}</td>
                    <td>{e.getPlacesmax()}</td>
                  </tr>
                ))}
              </tbody>
            )}
          </Table>
        </InfiniteScroll>
      </Container>
    </>
  );
};

export default HistoryTable;
