import {
  ActionIcon,
  AppShell,
  Center,
  Flex,
  Header,
  Modal,
  Text,
  Tooltip,
  Transition,
} from "@mantine/core";
import { ReactNode, useEffect, useState } from "react";
import {
  IconBrandGithub,
  IconHeart,
  IconHeartMinus,
  IconRefresh,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import useResize from "./resize";
import { useEvents, usePing } from "../api/grpc";
import { useDisclosure } from "@mantine/hooks";
import { Event } from "../generated/countday_pb";
import EventCard from "./eventCard";

const Shell = ({ children }: { children: ReactNode }) => {
  const [count, setCount] = useState(0);
  const router = useRouter();
  const { data, isLoading, isError } = useEvents();

  const { data: time } = usePing();
  const currentDate = new Date();
  const secondsAgo = currentDate.getTime() / 1000 - (time ?? 0);
  const hoursAgo = secondsAgo / 3600;

  // open/close favorites modal
  const [opened, { open, close }] = useDisclosure(false);
  const [favorites, setFavorites] = useState<Event[]>([]);
  useEffect(() => {
    const events = data?.getEventsList();
    const fav = localStorage.getItem("favorites") || "[]";
    if (fav && events) {
      const arr: number[] = JSON.parse(fav);
      setFavorites(events.filter(e => arr.includes(e.getId())));
    }
  }, [data]);


  const removeFavorite = (id: number) => {
    const newFavorites = favorites.filter(e => e.getId() !== id);
    const fav = JSON.stringify(newFavorites.map(e => e.getId()));
    localStorage.setItem("favorites", fav);
    setFavorites(newFavorites);
  }

  return (
    <AppShell
      header={
        <Header
          height={60}
          style={{
            backgroundColor: "rgba(0,0,0,0)",
            border: 0,
            transition: "250ms ease",
          }}
          className="backdrop-blur-sm"
          zIndex={100}
          pl="sm"
          pr="md"
        >
          <Center h="100%" w="100%">
            <Flex direction="row" w="100%" justify="left" align="center">
              <Link href="/" passHref>
                <ActionIcon
                  variant="transparent"
                  onClick={() => {
                    if (router.pathname === "/") {
                      setCount(c => (c += 1));
                    }
                  }}
                  m="sm"
                >
                  <Image
                    src="/assets/wenjim_dark.svg"
                    height={30}
                    width={30}
                    blurDataURL="/assets/favicon.png"
                    alt="Logo"
                    style={{
                      transform: count % 20 >= 10 ? "rotate(180deg)" : "",
                      transition: "transform 250ms ease",
                    }}
                  />
                </ActionIcon>
              </Link>
              <Transition
                mounted={count % 20 >= 10}
                transition="slide-right"
                duration={250}
                timingFunction="ease"
              >
                {styles => (
                  <Text
                    style={{ ...styles, MozUserSelect: "none" }}
                    ml={-10}
                    unselectable="on"
                  >
                    ark
                  </Text>
                )}
              </Transition>
              <Tooltip
                // round to decimal
                label={`Last updated ${
                  Math.round(hoursAgo * 10) / 10
                } hours ago`}
              >
                <IconRefresh color={hoursAgo < 1 ? "green" : "red"} />
              </Tooltip>
            </Flex>

            <Modal opened={opened} onClose={close} title="Favorites">
              {favorites.length === 0 && (
                <Text>{"It's quite empty here. Favorite some events."}</Text>
              )}
              {favorites.map(e => (
                <Flex mb="xs" key={e.getId()}>
                  <Center>
                  <ActionIcon mr="sm" onClick={() => removeFavorite(e.getId())}>
                    <IconHeartMinus />
                  </ActionIcon>
                  </Center>
                  <EventCard event={e} />
                </Flex>
              ))}
            </Modal>

            <Flex direction="row" w="100%" justify="right" align="center">
              <ActionIcon onClick={open}>
                <IconHeart size={30} />
              </ActionIcon>

              <Link href="https://github.com/markbeep/Wenjim" passHref>
                <ActionIcon ml="sm">
                  <IconBrandGithub size={30} />
                </ActionIcon>
              </Link>
            </Flex>
          </Center>
        </Header>
      }
      padding="sm"
      styles={theme => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}
    >
      {children}
    </AppShell>
  );
};

export default Shell;
