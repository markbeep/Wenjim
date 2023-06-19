import {
  Title,
  Select,
  Center,
  Loader,
  Flex,
  Text,
  ActionIcon,
  Accordion,
  Skeleton,
} from "@mantine/core";
import {
  IconArrowsHorizontal,
  IconCalendar,
  IconHeart,
  IconHeartMinus,
  IconListDetails,
  IconMapPin,
} from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { useSingleEvent, useLocations, useTitles } from "../../../api/grpc";
import { DatePickerInput } from "@mantine/dates";
import { useRouter } from "next/navigation";

const formatDate = (date: Date) => {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

const LessonForm = ({
  eventId,
  dateFrom,
  dateTo,
}: {
  eventId: number;
  dateFrom: Date;
  dateTo: Date;
}) => {
  const router = useRouter();

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

  const [favorites, setFavorites] = useState<number[]>([]);
  useEffect(() => {
    const fav = localStorage.getItem("favorites") || "[]";
    setFavorites(JSON.parse(fav));
  }, []);

  const addFavorite = (id: number) => {
    const newFavorites = [...favorites, id];
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
    setFavorites(newFavorites);
  };

  const removeFavorite = (id: number) => {
    const newFavorites = favorites.filter(e => e !== id);
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
    setFavorites(newFavorites);
  };

  return (
    <>
      <>
        <Flex direction="row" align="center">
          {data ? (
            <Title mx="sm" size={24}>
              {data.getSport()}
            </Title>
          ) : (
            <Skeleton ml="sm" width={200} height={32} />
          )}
          <ActionIcon
            onClick={() =>
              favorites.includes(eventId)
                ? removeFavorite(eventId)
                : addFavorite(eventId)
            }
          >
            {favorites.includes(eventId) ? <IconHeartMinus /> : <IconHeart />}
          </ActionIcon>
        </Flex>

        <Flex direction="row" ml="sm" mt="sm">
          <Center>
            <IconMapPin size={18} />
          </Center>
          {data ? (
            <Text ml="sm">{data.getLocation()}</Text>
          ) : (
            <Skeleton ml="sm" width={200} height={25} />
          )}
        </Flex>

        <Flex direction="row" ml="sm">
          <Center>
            <IconListDetails size={18} />
          </Center>
          {data ? (
            <Text ml="sm">
              {data.getTitle()}, {data.getNiveau()}
            </Text>
          ) : (
            <Skeleton ml="sm" width={200} height={25} />
          )}
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

        <Accordion variant="contained" mt="sm" chevronPosition="left">
          <Accordion.Item value="settings">
            <Accordion.Control>
              <Text>Search Parameters</Text>
            </Accordion.Control>
            <Accordion.Panel>
              {isLoading && (
                <Center>
                  <Loader variant="dots" color="gray" />
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
                          `${v}?dateFrom=${formatDate(
                            dateFrom,
                          )}&dateTo=${formatDate(dateTo)}`,
                        )
                      }
                      icon={<IconMapPin />}
                      error={
                        locationsError &&
                        "There was an error fetching locations"
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
                          `${v}?dateFrom=${formatDate(
                            dateFrom,
                          )}&dateTo=${formatDate(dateTo)}`,
                        )
                      }
                      icon={<IconListDetails />}
                      error={
                        titlesError && "There was an error fetching subtitles"
                      }
                    />
                  )}

                  <Flex direction="row" w="100%">
                    <DatePickerInput
                      label="From"
                      value={dateFrom}
                      clearable={false}
                      onChange={v => {
                        const newDate = v ?? new Date("2022-01-01");
                        router.push(
                          `${eventId}?dateFrom=${formatDate(
                            newDate,
                          )}&dateTo=${formatDate(dateTo)}`,
                        );
                      }}
                      mr="sm"
                      w="100%"
                    />

                    <DatePickerInput
                      label="To"
                      value={dateTo}
                      clearable={false}
                      onChange={v => {
                        const newDate = v ?? new Date("2030-12-31");
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
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </>
    </>
  );
};

export default LessonForm;
