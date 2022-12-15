import Link from "next/link";
import {
  Affix,
  AppShell,
  Box,
  Burger,
  Button,
  Center,
  Container,
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

const Shell = ({ children }: { children: ReactNode }) => {
  const theme = useMantineTheme();
  const [show, setShow] = useState(false);
  const [scroll, scrollTo] = useWindowScroll();

  const handleResize = useCallback(
    (width: number) => {
      if (width < theme.breakpoints.sm) {
        setShow(false);
      } else {
        setShow(true);
      }
    },
    [theme],
  );

  // initially check for window size
  useEffect(() => {
    if (typeof window !== "undefined") {
      handleResize(window.innerWidth);
    }
  }, [handleResize]);

  if (typeof window !== "undefined") {
    window.addEventListener("resize", () => {
      handleResize(window.innerWidth);
    });
  }

  const menus = [
    {
      name: "Home",
      icon: <IconHome />,
      href: "/",
    },
    {
      name: "History",
      icon: <IconBook />,
      href: "/history",
    },
    {
      name: "Weekly",
      icon: <IconCalendar />,
      href: "/weekly",
    },
    {
      name: "Issues",
      icon: <IconBug />,
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
            <Center inline w="100%" h="100%">
              <Flex w="100%" direction="row">
                {menus.map(e => (
                  <Link key={e.name} href={e.href}>
                    <Title
                      mx="md"
                      order={1}
                      variant="gradient"
                      size={20}
                      style={{ cursor: "pointer" }}
                      gradient={{
                        from: theme.colors.blue[1],
                        to: theme.colors.blue[2],
                        deg: 45,
                      }}
                      sx={{
                        fontFamily: "HighlandGothic, sans-serif",
                      }}
                    >
                      {e.name}
                    </Title>
                  </Link>
                ))}
              </Flex>
            </Center>
          </Container>
        </Header>
      }
      padding="md"
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
