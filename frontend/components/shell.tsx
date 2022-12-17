import Link from "next/link";
import {
  ActionIcon,
  Affix,
  AppShell,
  Box,
  Burger,
  Button,
  Center,
  Container,
  Drawer,
  Flex,
  Header,
  Navbar,
  NavLink,
  Text,
  ThemeIcon,
  Title,
  Transition,
  useMantineTheme,
} from "@mantine/core";
import { ReactNode, useCallback, useEffect, useState } from "react";
import {
  IconArrowUp,
  IconBook,
  IconBrandGithub,
  IconBug,
  IconCalendar,
  IconHome,
} from "@tabler/icons";
import { useWindowScroll } from "@mantine/hooks";
import Image from "next/image";

const Shell = ({ children }: { children: ReactNode }) => {
  const theme = useMantineTheme();
  const [show, setShow] = useState(false);

  const menus = [
    {
      name: "Home",
      href: "/",
    },
    {
      name: "History",
      href: "/history",
    },
    {
      name: "Weekly",
      href: "/weekly",
    },
    {
      name: "Report an Issue",
      href: "https://github.com/markbeep/ASVZ-Graph-Website/issues",
    },
  ];

  return (
    <AppShell
      header={
        <Header
          height={60}
          style={{ backgroundColor: "rgba(0,0,0,0)", border: 0 }}
          className="backdrop-blur-sm"
        >
          <Container fluid h="100%">
            <Center inline h="100%">
              <Burger opened={show} onClick={() => setShow(e => !e)} />
              <Container fluid>
                <ActionIcon component="a" href="/" variant="transparent">
                  <Image
                    src="/assets/wenjim_dark.svg"
                    height={30}
                    width={30}
                    placeholder="blur"
                    blurDataURL="/assets/favicon.png"
                  />
                </ActionIcon>
              </Container>
            </Center>
          </Container>
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
          transitionDuration={200}
          transition="rotate-right"
        >
          <Burger opened={show} onClick={() => setShow(e => !e)} />
          <Flex direction="column">
            {menus.map(e => (
              <Button
                key={e.name}
                mt="sm"
                variant="light"
                fullWidth
                h={40}
                component="a"
                href={e.href}
                sx={{
                  "& > .mantine-Button-inner": { justifyContent: "flex-start" },
                }}
              >
                <Text color={theme.colors.gray[3]}>{e.name}</Text>
              </Button>
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
