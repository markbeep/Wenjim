import {
  ActionIcon,
  AppShell,
  Burger,
  Button,
  Center,
  Drawer,
  Flex,
  Header,
  Kbd,
  Text,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { ReactNode, useState } from "react";
import { IconBrandGithub, IconExternalLink, IconSearch } from "@tabler/icons";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Event } from "../generated/Event";
import {
  openSpotlight,
  SpotlightAction,
  SpotlightProvider,
} from "@mantine/spotlight";

const Shell = ({
  children,
  events,
}: {
  children: ReactNode;
  events: Event[];
}) => {
  const theme = useMantineTheme();
  const [show, setShow] = useState(false);
  const [count, setCount] = useState(0);
  const router = useRouter();

  const menus = [
    {
      name: "History",
      href: "/history",
    },
    {
      name: "Weekly",
      href: "/weekly",
    },
    {
      name: "Report Issues",
      href: "https://github.com/markbeep/Wenjim/issues",
      icon: <IconExternalLink color={theme.colors.gray[3]} />,
    },
  ];

  const actions: SpotlightAction[] = events.map(e => ({
    title: `${e.sport}: ${e.title}`,
    description: `${e.location} (${e.niveau})`,
    onTrigger: () => {
      router.push({ pathname: `/lessons/${e.id}` });
    },
    keywords: [e.sport?.toLowerCase() ?? "", e.location?.toLowerCase() ?? ""],
  }));

  const keybind = (
    <div style={{ display: "flex", alignItems: "center" }}>
      <Kbd>Ctrl</Kbd>
      <span style={{ margin: "0 5px" }}>+</span>
      <Kbd>K</Kbd>
    </div>
  );

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
          className={show ? "" : "backdrop-blur-sm"}
          zIndex={100}
          pl="sm"
          pr="md"
        >
          <Center h="100%" w="100%">
            <Flex direction="row" w="100%" justify="left" align="center">
              <Burger opened={show} onClick={() => setShow(e => !e)} />
              <Link href="/" passHref>
                <ActionIcon
                  variant="transparent"
                  onClick={() => {
                    if (router.pathname !== "/") {
                      setShow(false);
                      return;
                    }
                    setCount(c => (c += 1));
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
            </Flex>
            <Flex direction="row" w="100%" justify="right" align="center">
              <SpotlightProvider
                actions={actions}
                searchIcon={<IconSearch size={18} />}
                searchPlaceholder="Search..."
                shortcut={["mod + P", "mod + K"]}
                highlightQuery
                nothingFoundMessage="Nothing found"
                transition="rotate-right"
              >
                <TextInput
                  icon={<IconSearch size={18} />}
                  onClick={() => openSpotlight()}
                  rightSection={keybind}
                  rightSectionWidth={90}
                  placeholder="Search"
                />
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
      navbar={
        <Drawer
          withCloseButton={false}
          padding="sm"
          opened={show}
          onClose={() => setShow(false)}
          overlayOpacity={0.2}
          overlayBlur={2}
          size="sm"
          transition="rotate-right"
          zIndex={50}
          className="shadow-md shadow-black"
        >
          {/* <Burger opened={show} onClick={() => setShow(e => !e)} /> */}
          <Flex direction="column" pt={40}>
            {menus.map(e => (
              <Link key={e.name} href={e.href}>
                <Button
                  mt="sm"
                  variant="light"
                  fullWidth
                  h={40}
                  sx={{
                    "& > .mantine-Button-inner": {
                      justifyContent: "flex-start",
                    },
                  }}
                  rightIcon={e.icon}
                  onClick={() => {
                    if (router.pathname !== e.href) {
                      setShow(false);
                    }
                  }}
                >
                  <Text color={theme.colors.gray[3]}>{e.name}</Text>
                </Button>
              </Link>
            ))}
          </Flex>
        </Drawer>
      }
    >
      {children}
    </AppShell>
  );
};

export default Shell;
