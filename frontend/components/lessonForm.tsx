import {
  Title,
  Select,
  Center,
  Loader,
  Flex,
  Modal,
  Text,
  Button,
} from "@mantine/core";
import {
  IconAdjustments,
  IconArrowsHorizontal,
  IconCalendar,
  IconListDetails,
  IconMapPin,
} from "@tabler/icons-react";
import router from "next/router";
import React, { useState } from "react";
import { useSingleEvent, useLocations, useTitles } from "../api/grpc";
import { DatePicker } from "@mantine/dates";
import Head from "next/head";
import { useDisclosure } from "@mantine/hooks";

const formatDate = (date: Date) => {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

const LessonForm = () => {
  const [opened, { open, close }] = useDisclosure(false);

  const eventId = Number(router.query.eventId ?? "-1");
  const [dateFrom, setDateFrom] = useState(
    new Date(
      router.query.dateFrom ? String(router.query.dateFrom) : "2022-01-01",
    ),
  );
  const [dateTo, setDateTo] = useState(
    new Date(router.query.dateTo ? String(router.query.dateTo) : "2030-12-31"),
  );

  const { data, isLoading } = useSingleEvent(eventId);
  const {
    data: locations,
    isLoading: locationsLoading,
    isError: locationsError,
  } = useLocations(eventId);
  const {
    data: titles,
    isLoading: titlesLoading,
    isError: titlesError,
  } = useTitles(eventId);

  return (
    <>
      <Modal opened={opened} onClose={close} title="Search Settings" centered>
        {isLoading && (
          <Center>
            <Loader variant="dots" />
          </Center>
        )}
        {data && (
          <div>
            {locations && (
              <Select
                label="Location"
                placeholder={data.getLocation()}
                disabled={locationsLoading}
                data={locations.getLocationsList().map(e => ({
                  value: e.getEventid().toString(),
                  label: e.getLocation(),
                }))}
                onChange={v =>
                  router.push(
                    `${v}?dateFrom=${formatDate(dateFrom)}&dateTo=${formatDate(
                      dateTo,
                    )}`,
                  )
                }
                icon={<IconMapPin />}
                error={
                  locationsError && "There was an error fetching locations"
                }
              />
            )}

            {titles && (
              <Select
                label="Subtitle"
                placeholder={data.getTitle()}
                disabled={titlesLoading}
                data={titles.getTitlesList().map(e => ({
                  value: e.getEventid().toString(),
                  label: e.getTitle(),
                }))}
                onChange={v =>
                  router.push(
                    `${v}?dateFrom=${formatDate(dateFrom)}&dateTo=${formatDate(
                      dateTo,
                    )}`,
                  )
                }
                icon={<IconListDetails />}
                error={titlesError && "There was an error fetching subtitles"}
              />
            )}

            <Flex direction="row" w="100%">
              <DatePicker
                label="From"
                value={dateFrom}
                clearable={false}
                onChange={v => {
                  const newDate = v ?? new Date("2022-01-01");
                  setDateFrom(newDate);
                  router.push(
                    `${eventId}?dateFrom=${formatDate(
                      newDate,
                    )}&dateTo=${formatDate(dateTo)}`,
                  );
                }}
                mr="sm"
                w="100%"
              />

              <DatePicker
                label="To"
                value={dateTo}
                clearable={false}
                onChange={v => {
                  const newDate = v ?? new Date("2030-12-31");
                  setDateTo(newDate);
                  router.push(
                    `${eventId}?dateFrom=${formatDate(
                      dateFrom,
                    )}&dateTo=${formatDate(newDate)}`,
                  );
                }}
                w="100%"
              />
            </Flex>
          </div>
        )}
      </Modal>

      {isLoading && (
        <Center>
          <Loader variant="dots" />
        </Center>
      )}
      {data && (
        <>
          <Head>
            <title>
              {data.getSport()}: {data.getTitle()}
            </title>
          </Head>

          <Title ml="sm" size={24}>
            {data.getSport()}
          </Title>

          <Flex direction="row" ml="sm" mt="sm">
            <Center>
              <IconMapPin size={18} />
            </Center>
            <Text ml="sm">{data.getLocation()}</Text>
          </Flex>

          <Flex direction="row" ml="sm">
            <Center>
              <IconListDetails size={18} />
            </Center>
            <Text ml="sm">
              {data.getTitle()}, {data.getNiveau()}
            </Text>
          </Flex>

          <Flex direction="row" ml="sm">
            <Center>
              <IconCalendar size={18} />
            </Center>
            <Text ml="sm">{dateFrom.toDateString()}</Text>
            <Center mx="sm">
              <IconArrowsHorizontal size={18} />
            </Center>
            <Text>{dateTo.toDateString()}</Text>
          </Flex>

          <Center mt="sm">
            <Button
              leftIcon={<IconAdjustments />}
              variant="outline"
              onClick={open}
            >
              <Text>Search Parameters</Text>
            </Button>
          </Center>
        </>
      )}
    </>
  );
};

export default LessonForm;
