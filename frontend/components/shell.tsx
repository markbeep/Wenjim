import {
  ActionIcon,
  AppShell,
  Button,
  Center,
  Drawer,
  Flex,
  Group,
  Header,
  Kbd,
  Text,
  Transition,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { ReactNode, useState } from "react";
import {
  IconBrandGithub,
  IconExternalLink,
  IconSearch,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  openSpotlight,
  SpotlightAction,
  SpotlightProvider,
} from "@mantine/spotlight";
import useResize from "./resize";
import { useEvents } from "../api/grpc";

const Shell = ({ children }: { children: ReactNode }) => {
  const theme = useMantineTheme();
  const [bigSearch] = useResize();
  const [count, setCount] = useState(0);
  const router = useRouter();
  const { data, isLoading, isError } = useEvents();

  const actions: SpotlightAction[] =
    data?.getEventsList().map(e => ({
      title: `${e.getSport()}: ${e.getTitle()}`,
      description: `${e.getLocation()} (${e.getNiveau()})`,
      onTrigger: () => {
        router.push({ pathname: `/lessons/${e.getId()}` });
      },
      keywords: [
        e.getSport().toLowerCase() ?? "",
        e.getLocation().toLowerCase() ?? "",
      ],
    })) ?? [];

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
            </Flex>
            <Flex direction="row" w="100%" justify="right" align="center">
              <SpotlightProvider
                actions={actions}
                searchIcon={<IconSearch size={18} />}
                searchPlaceholder={isLoading ? "Loading..." : "Search..."}
                shortcut={isError ? [] : ["mod + P", "mod + K"]}
                highlightQuery
                nothingFoundMessage="Nothing found"
                styles={{ root: { margin: 10 } }}
                limit={8}
              >
                <UnstyledButton
                  onClick={() => openSpotlight()}
                  p={bigSearch ? 3 : 0}
                  w={bigSearch ? "30vw" : ""}
                  maw={300}
                  m="sm"
                  opacity={isLoading || isError ? 0.5 : 1}
                  disabled={isLoading || isError}
                  style={{ cursor: isLoading || isError ? "not-allowed" : "" }}
                >
                  {!bigSearch && <IconSearch size={30} />}
                  {bigSearch && (
                    <Flex
                      w="100%"
                      direction="row"
                      display="flex"
                      p={3}
                      style={{
                        border: `solid 2px ${theme.colors.dark[4]}`,
                        borderRadius: "3px",
                      }}
                    >
                      <Group w="100%">
                        <IconSearch size={18} />
                        <Text size={14} color="dimmed">
                          {isLoading ? "Loading..." : "Search"}
                        </Text>
                      </Group>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "right",
                          width: "100%",
                        }}
                      >
                        <Kbd>Ctrl</Kbd>
                        <span style={{ margin: "0 5px" }}>+</span>
                        <Kbd>K</Kbd>
                      </div>
                    </Flex>
                  )}
                </UnstyledButton>
              </SpotlightProvider>
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
