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
  useMantineColorScheme,
} from "@mantine/core";
import { ReactNode, useEffect, useState } from "react";
import {
  IconBrandGithub,
  IconHeart,
  IconHeartMinus,
  IconMoon,
  IconRefresh,
  IconSun,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEvents, usePing } from "../api/grpc";
import { useDisclosure } from "@mantine/hooks";
import { Event } from "../generated/countday_pb";
import EventCard from "./eventCard";

const Shell = ({ children }: { children: ReactNode }) => {
  const [count, setCount] = useState(0);
  const router = useRouter();
  const { data } = useEvents();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
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
  }, [data, opened]); // opened make's sure the list is updated when opened

  const removeFavorite = (id: number) => {
    const newFavorites = favorites.filter(e => e.getId() !== id);
    const fav = JSON.stringify(newFavorites.map(e => e.getId()));
    localStorage.setItem("favorites", fav);
    setFavorites(newFavorites);
  };

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
                    src={
                      colorScheme === "dark"
                        ? "/assets/wenjim_dark.svg"
                        : "/assets/wenjim_light.svg"
                    }
                    height={30}
                    width={30}
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
            </Flex>

            <Modal opened={opened} onClose={close} title="Favorites">
              {favorites.length === 0 && (
                <Text>{"It's quite empty here. Favorite some events."}</Text>
              )}
              {favorites.map(e => (
                <Flex mb="xs" key={e.getId()}>
                  <Center>
                    <ActionIcon
                      mr="sm"
                      onClick={() => removeFavorite(e.getId())}
                    >
                      <IconHeartMinus />
                    </ActionIcon>
                  </Center>
                  <div onClick={close} style={{ width: "100%" }}>
                    <EventCard event={e} />
                  </div>
                </Flex>
              ))}
            </Modal>

            <Flex direction="row" w="100%" justify="right" align="center">
              <ActionIcon onClick={open}>
                <IconHeart size={30} />
              </ActionIcon>

              <ActionIcon ml="sm" onClick={() => toggleColorScheme()}>
                {colorScheme === "dark" ? (
                  <IconSun size={30} />
                ) : (
                  <IconMoon size={30} />
                )}
              </ActionIcon>

              <Link href="https://github.com/markbeep/Wenjim" passHref>
                <ActionIcon mx="sm">
                  <IconBrandGithub size={30} />
                </ActionIcon>
              </Link>

              <Tooltip
                // round to decimal
                label={`Last updated ${lastUpdatedAt(secondsAgo)}`}
              >
                <IconRefresh color={hoursAgo < 1 ? "green" : "red"} />
              </Tooltip>
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

/**
 * To produce a dynamic string saying how many seconds/hours/minutes ago
 * something was
 */
function lastUpdatedAt(secondsAgo: number): string {
  if (secondsAgo < 60) {
    return `${secondsAgo} seconds ago`;
  }
  const minutesAgo = Math.round(secondsAgo / 60);
  if (minutesAgo < 60) {
    return `${minutesAgo} minutes ago`;
  }
  const hoursAgo = Math.round(minutesAgo / 60);
  return `${hoursAgo} hours ago`;
}

export default Shell;
