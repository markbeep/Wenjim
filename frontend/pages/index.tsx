import Link from 'next/link'
import { useCountDay } from './api/hooks'
import { CalendarChart } from '../components/calendarChart'
import { AppShell, Header, Container, Text, Burger, useMantineTheme, Center, Skeleton, Navbar, MediaQuery, Flex } from '@mantine/core';
import NavBar from '../components/navBar'
import { IconBook, IconCalendar, IconHome } from "@tabler/icons";
import { useEffect, useState } from 'react';

export const CardStyle = "card border-solid border-neutral-focus border-2 bg-base";

const Home = () => {
  const { data, isLoading } = useCountDay();
  const theme = useMantineTheme();
  const [show, setShow] = useState(false);

  const handleResize = (width: number) => {
    if (width < theme.breakpoints.sm) {
      setShow(false);
    } else {
      setShow(true);
    }
  }

  // initially check for window size
  useEffect(() => {
    if (typeof window !== "undefined") {
      handleResize(window.innerWidth);
    }

  }, [])

  if (typeof window !== "undefined") {
    window.addEventListener("resize", () => {
      console.log(window.innerWidth, theme.breakpoints.sm, show);
      handleResize(window.innerWidth);
    })
  }

  return (
    <AppShell
      navbar={
        <Navbar p="md" width={{ base: 50, sm: 150 }}>

          <Navbar.Section mt={10}>
            <Center>
              <Link href="/">
                <button className="btn btn-ghost">
                  <Flex direction="row" justify="start" align="center">
                    <IconHome size={32} />
                    {show && <Text ml={20}>Home</Text>}
                  </Flex>
                </button>
              </Link>
            </Center>
          </Navbar.Section>

          <Navbar.Section mt={10}>
            <Center>
              <Link href="/history">
                <button>
                  <Flex direction="row" justify="start" align="center">
                    <IconBook size={32} />
                    {show && <Text ml={20}>History</Text>}
                  </Flex>
                </button>
              </Link>
            </Center>
          </Navbar.Section>

          <Navbar.Section mt={10}>
            <Center>
              <Link href="/weekly">
                <button>
                  <Flex direction="row" justify="start" align="center">
                    <IconCalendar size={32} />
                    {show && <Text ml={20}>Weekly</Text>}
                  </Flex>
                </button>
              </Link>
            </Center>
          </Navbar.Section>
        </Navbar>
      }
      padding="md"
      styles={(theme) => ({
        main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
      })}

    >
      <Container>
        <Container className="max-w-md z-10 py-10 m-auto text-center">
          <Text
            size="xl"
            gradient={{ from: "indigo", to: "cyan", deg: 45 }}
          >Welcome</Text>
          <Text className="mb-5">
            Ever went to a ASVZ activity just for it to be packed? Fret no more! With this tool you can
            find out at what time the least people are present.
          </Text>
          <h2 className="mb-2 text-2xl font-bold">Get started</h2>
          <Link href="/history">
            <button className="btn btn-primary m-2">History</button>
          </Link>
          <Link href="/weekly">
            <button className="btn btn-primary m-2">Weekly</button>
          </Link>
        </Container>


        <Center>
          <Skeleton visible={isLoading}>
            {<CalendarChart data={data} />}
          </Skeleton>
        </Center>


      </Container>

    </AppShell >
  )
}

export default Home
