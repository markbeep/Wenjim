import {
  Button,
  Center,
  Container,
  Flex,
  Loader,
  ScrollArea,
  Table,
  useMantineTheme,
} from "@mantine/core";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import router from "next/router";
import React, { useEffect, useState } from "react";
import { useHistoryById } from "../api/grpc";
import { HistoryRow } from "../generated/countday_pb";

enum sortOrder {
  DATE,
  PLACES_FREE,
  PLACES_MAX,
}

const pageSize = 200;

const HistoryTable = () => {
  const [orderBy, setOrderBy] = useState(sortOrder.DATE);
  const [descend, setDescend] = useState(false);
  const theme = useMantineTheme();
  const eventId = Number(router.query.eventId ?? "-1");
  const dateFrom = new Date(
    router.query.dateFrom ? String(router.query.dateFrom) : "2022-01-01",
  );
  const dateTo = new Date(
    router.query.dateTo ? String(router.query.dateTo) : "2030-12-31",
  );
  const {
    data: history,
    isLoading: historyLoading,
    isFetching: historyFetching,
    fetchNextPage,
  } = useHistoryById(eventId, dateFrom, dateTo, pageSize);
  const [data, setData] = useState<HistoryRow[]>([]);
  const sortData = (
    data: HistoryRow[],
    descend: boolean,
    orderBy: sortOrder,
  ) => {
    let sortedData: HistoryRow[] = [];
    if (descend) {
      switch (orderBy) {
        case sortOrder.DATE:
          sortedData = [...data.sort((a, b) => a.getDate() - b.getDate())];
          break;
        case sortOrder.PLACES_FREE:
          sortedData = [
            ...data.sort((a, b) => a.getPlacesfree() - b.getPlacesfree()),
          ];
          break;
        case sortOrder.PLACES_MAX:
          sortedData = [
            ...data.sort((a, b) => a.getPlacesmax() - b.getPlacesmax()),
          ];
          break;
      }
    } else {
      switch (orderBy) {
        case sortOrder.DATE:
          sortedData = [...data.sort((a, b) => b.getDate() - a.getDate())];
          break;
        case sortOrder.PLACES_FREE:
          sortedData = [
            ...data.sort((a, b) => b.getPlacesfree() - a.getPlacesfree()),
          ];
          break;
        case sortOrder.PLACES_MAX:
          sortedData = [
            ...data.sort((a, b) => b.getPlacesmax() - a.getPlacesmax()),
          ];
          break;
      }
    }
    setData(sortedData);
    return sortedData;
  };
  useEffect(() => {
    if (!history) return;
    const all = history.pages.flat();
    setData(sortData(all, descend, orderBy));
  }, [history, descend, orderBy]);

  useEffect(() => {
    if (data) sortData(data, descend, orderBy);
  }, [descend, orderBy]); // data is not here to avoid infinite loops

  const handleSortClick = (d: sortOrder) => {
    if (orderBy === d) {
      setDescend(d => !d);
    } else {
      setOrderBy(d);
      setDescend(false);
    }
  };

  const ths = (data: HistoryRow[]) => (
    <tr>
      <th>{data.length} rows</th>
      <th className={orderBy === sortOrder.DATE ? `bg-neutral-content` : ""}>
        <button onClick={() => handleSortClick(sortOrder.DATE)}>
          <Flex justify="center" direction="row" align="center">
            DATE
            {orderBy === sortOrder.DATE &&
              (descend ? <IconChevronUp /> : <IconChevronDown />)}
          </Flex>
        </button>
      </th>
      <th
        className={
          orderBy === sortOrder.PLACES_FREE ? `bg-neutral-content` : ""
        }
      >
        <button onClick={() => handleSortClick(sortOrder.PLACES_FREE)}>
          <Flex justify="center" direction="row" align="center">
            SPOTS FREE
            {orderBy === sortOrder.PLACES_FREE &&
              (descend ? <IconChevronUp /> : <IconChevronDown />)}
          </Flex>
        </button>
      </th>
      <th
        className={orderBy === sortOrder.PLACES_MAX ? `bg-neutral-content` : ""}
      >
        <button onClick={() => handleSortClick(sortOrder.PLACES_MAX)}>
          <Flex justify="center" direction="row" align="center">
            SPOTS TOTAL
            {orderBy === sortOrder.PLACES_MAX &&
              (descend ? <IconChevronUp /> : <IconChevronDown />)}
          </Flex>
        </button>
      </th>
    </tr>
  );

  return (
    <>
      {historyLoading && (
        <Center>
          <Loader variant="dots" />
        </Center>
      )}
      <ScrollArea h="50vh" type="auto">
        <Container sx={{ minHeight: "30rem" }} fluid>
          {data && (
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
                {ths(data)}
              </thead>
              <tbody>
                {data.map((e, i) => (
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
            </Table>
          )}
        </Container>
      </ScrollArea>
      <Center mb="xl">
        {historyFetching && <Loader mr="sm" />}
        <Button disabled={historyFetching} onClick={() => fetchNextPage()}>
          Load more
        </Button>
      </Center>
    </>
  );
};

export default HistoryTable;
