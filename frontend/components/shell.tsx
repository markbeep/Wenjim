import {
  ActionIcon,
  AppShell,
  Burger,
  Button,
  Center,
  Container,
  Drawer,
  Flex,
  Header,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { ReactNode, useState } from "react";
import { IconExternalLink } from "@tabler/icons";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

const Shell = ({ children }: { children: ReactNode }) => {
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
        >
          <Container fluid h="100%">
            <Center inline h="100%">
              <Burger opened={show} onClick={() => setShow(e => !e)} />
              <Container fluid>
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
