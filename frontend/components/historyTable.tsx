import {
  Center,
  Container,
  Flex,
  Overlay,
  Pagination,
  ScrollArea,
  Table,
  useMantineTheme,
} from "@mantine/core";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { HistoryReply, HistoryRow } from "../generated/countday_pb";
import useResize from "./resize";

enum sortOrder {
  DATE,
  PLACES_FREE,
  PLACES_MAX,
}

const formatHistory = (history: HistoryReply) => {};

const HistoryTable = ({ history }: { history: HistoryReply | undefined }) => {
  const [orderBy, setOrderBy] = useState(sortOrder.DATE);
  const [descend, setDescend] = useState(false);
  const [page, setPage] = useState(0);
  const theme = useMantineTheme();
  const [amount, setAmount] = useState(50); // amount of items to show per page
  const [show] = useResize();
  const [data, setData] = useState(history?.getRowsList());

  useEffect(() => setData(history?.getRowsList()), [history]);

  const sortData = (
    data: HistoryRow[],
    descend: boolean,
    orderBy: sortOrder,
  ) => {
    if (descend) {
      switch (orderBy) {
        case sortOrder.DATE:
          setData([...data.sort((a, b) => a.getDate() - b.getDate())]);
          break;
        case sortOrder.PLACES_FREE:
          setData([
            ...data.sort((a, b) => a.getPlacesfree() - b.getPlacesfree()),
          ]);
          break;
        case sortOrder.PLACES_MAX:
          setData([
            ...data.sort((a, b) => a.getPlacesmax() - b.getPlacesmax()),
          ]);
          break;
      }
    } else {
      switch (orderBy) {
        case sortOrder.DATE:
          setData([...data.sort((a, b) => b.getDate() - a.getDate())]);
          break;
        case sortOrder.PLACES_FREE:
          setData([
            ...data.sort((a, b) => b.getPlacesfree() - a.getPlacesfree()),
          ]);
          break;
        case sortOrder.PLACES_MAX:
          setData([
            ...data.sort((a, b) => b.getPlacesmax() - a.getPlacesmax()),
          ]);
          break;
      }
    }
  };

  useEffect(() => {
    if (data) sortData(data, descend, orderBy);
  }, [descend, orderBy, data]);

  const handleSortClick = (data: HistoryRow[], d: sortOrder) => {
    if (orderBy === d) {
      setDescend(d => !d);
    } else {
      setOrderBy(d);
      setDescend(false);
    }
  };

  const ths = (data: HistoryRow[]) => (
    <tr>
      <th></th>
      <th className={orderBy === sortOrder.DATE ? `bg-neutral-content` : ""}>
        <button onClick={() => handleSortClick(data, sortOrder.DATE)}>
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
        <button onClick={() => handleSortClick(data, sortOrder.PLACES_FREE)}>
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
        <button onClick={() => handleSortClick(data, sortOrder.PLACES_MAX)}>
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
      <ScrollArea h="75vh" type="auto">
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
                {data?.slice(page * amount, (page + 1) * amount).map((e, i) => (
                  <tr key={page * amount + i}>
                    <th>{page * amount + i + 1}</th>
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
      <Center mt="sm">
        {data && data.length > amount && (
          <Pagination
            siblings={show ? 2 : 1}
            withControls={show}
            total={Math.ceil(data.length / amount)}
            onChange={e => setPage(e - 1)}
          />
        )}
      </Center>
    </>
  );
};

export default HistoryTable;
