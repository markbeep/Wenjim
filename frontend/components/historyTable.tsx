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
import { IconChevronDown, IconChevronUp } from "@tabler/icons";
import React, { useState } from "react";
import { HistoryRow } from "../generated/HistoryRow";
import { HistorySortType } from "../generated/HistorySortType";
import { JSONHistoryRow } from "../pages/lessons/[eventId]";
import useResize from "./resize";

const HistoryTable = ({ history }: { history: JSONHistoryRow[] }) => {
  const [orderBy, setOrderBy] = useState<HistorySortType>(
    HistorySortType.HISTORYSORT_DATE,
  );
  const [descend, setDescend] = useState(false);
  const [page, setPage] = useState(0);
  const theme = useMantineTheme();
  const [amount, setAmount] = useState(50); // amount of items to show per page
  const [show] = useResize();
  const [data, setData] = useState(history);

  const sortData = (descend: boolean, orderBy: HistorySortType) => {
    if (descend) {
      switch (orderBy) {
        case HistorySortType.HISTORYSORT_DATE:
          setData([...data.sort((a, b) => a.date - b.date)]);
          break;
        case HistorySortType.HISTORYSORT_PLACESFREE:
          setData([
            ...data.sort((a, b) => (a.placesFree ?? 0) - (b.placesFree ?? 0)),
          ]);
          break;
        case HistorySortType.HISTORYSORT_PLACESMAX:
          setData([
            ...data.sort((a, b) => (a.placesMax ?? 0) - (b.placesMax ?? 0)),
          ]);
          break;
      }
    } else {
      switch (orderBy) {
        case HistorySortType.HISTORYSORT_DATE:
          setData([...data.sort((a, b) => b.date - a.date)]);
          break;
        case HistorySortType.HISTORYSORT_PLACESFREE:
          setData([
            ...data.sort((a, b) => (b.placesFree ?? 0) - (a.placesFree ?? 0)),
          ]);
          break;
        case HistorySortType.HISTORYSORT_PLACESMAX:
          setData([
            ...data.sort((a, b) => (b.placesMax ?? 0) - (a.placesMax ?? 0)),
          ]);
          break;
      }
    }
  };

  const handleSortClick = (d: HistorySortType) => {
    if (orderBy === d) {
      sortData(!descend, orderBy);
      setDescend(b => !b);
    } else {
      sortData(false, orderBy);
      setOrderBy(d);
      setDescend(false);
    }
  };

  const ths = (
    <tr>
      <th></th>
      <th
        className={
          orderBy === HistorySortType.HISTORYSORT_DATE
            ? `bg-neutral-content`
            : ""
        }
      >
        <button
          onClick={() => handleSortClick(HistorySortType.HISTORYSORT_DATE)}
        >
          <Flex justify="center" direction="row" align="center">
            DATE
            {orderBy === HistorySortType.HISTORYSORT_DATE &&
              (descend ? <IconChevronUp /> : <IconChevronDown />)}
          </Flex>
        </button>
      </th>
      <th
        className={
          orderBy === HistorySortType.HISTORYSORT_PLACESFREE
            ? `bg-neutral-content`
            : ""
        }
      >
        <button
          onClick={() =>
            handleSortClick(HistorySortType.HISTORYSORT_PLACESFREE)
          }
        >
          <Flex justify="center" direction="row" align="center">
            SPOTS FREE
            {orderBy === HistorySortType.HISTORYSORT_PLACESFREE &&
              (descend ? <IconChevronUp /> : <IconChevronDown />)}
          </Flex>
        </button>
      </th>
      <th
        className={
          orderBy === HistorySortType.HISTORYSORT_PLACESMAX
            ? `bg-neutral-content`
            : ""
        }
      >
        <button
          onClick={() => handleSortClick(HistorySortType.HISTORYSORT_PLACESMAX)}
        >
          <Flex justify="center" direction="row" align="center">
            SPOTS TOTAL
            {orderBy === HistorySortType.HISTORYSORT_PLACESMAX &&
              (descend ? <IconChevronUp /> : <IconChevronDown />)}
          </Flex>
        </button>
      </th>
    </tr>
  );

  return (
    <Container>
      <ScrollArea h={500} type="auto">
        <Container sx={{ minHeight: "30rem" }} fluid>
          {(!data || data.length === 0) && (
            <Overlay color={theme.primaryShade.toString()} blur={2} />
          )}
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
              {ths}
            </thead>
            <tbody>
              {data?.slice(page * amount, (page + 1) * amount).map((e, i) => (
                <tr key={page * amount + i}>
                  <th>{page * amount + i + 1}</th>
                  <td>
                    {new Date(e.date).toLocaleString("nu-arab", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </td>
                  <td>{e.placesFree}</td>
                  <td>{e.placesMax}</td>
                </tr>
              ))}
            </tbody>
          </Table>
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
    </Container>
  );
};

export default HistoryTable;
