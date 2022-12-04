import Link from 'next/link'
import { Affix, AppShell, Button, Center, Flex, Navbar, NavLink, Text, Transition, useMantineTheme } from '@mantine/core'
import { ReactNode, useEffect, useState } from 'react'
import { IconArrowUp, IconBook, IconBrandGithub, IconCalendar, IconHome } from '@tabler/icons'
import { useWindowScroll } from '@mantine/hooks'

const Shell = ({ children }: { children: ReactNode }) => {
  const theme = useMantineTheme();
  const [show, setShow] = useState(false);
  const [scroll, scrollTo] = useWindowScroll();

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
      handleResize(window.innerWidth);
    })
  }

  return (
    <AppShell
      navbar={
        <Navbar p="md" width={{ base: 50, sm: 150 }}>

          <Navbar.Section mt="lg">
            <Center>
              <Link href="/">
                <Button variant='light'>
                  <Flex direction="row" justify="start" align="center">
                    <IconHome size={32} />
                    {show && <Text ml={20}>Home</Text>}
                  </Flex>
                </Button>
              </Link>
            </Center>
          </Navbar.Section>

          <Navbar.Section mt="lg">
            <Center>
              <Link href="/history">
                <Button variant='light'>
                  <Flex direction="row" justify="start" align="center">
                    <IconBook size={32} />
                    {show && <Text ml={20}>History</Text>}
                  </Flex>
                </Button>
              </Link>
            </Center>
          </Navbar.Section>

          <Navbar.Section mt="lg" grow>
            <Center>
              <Link href="/weekly">
                <Button variant='light'>
                  <Flex direction="row" justify="start" align="center">
                    <IconCalendar size={32} />
                    {show && <Text ml={20}>Weekly</Text>}
                  </Flex>
                </Button>
              </Link>
            </Center>
          </Navbar.Section>

          <Navbar.Section mt="lg">
            <Center>
              <Link href="https://github.com/markbeep/ASVZ-Graph-Website/issues">
                <Button variant='light'>
                  <Flex direction="row" justify="start" align="center">
                    <IconBrandGithub size={32} />
                    {show && <Text ml={10}>Report bug</Text>}
                  </Flex>
                </Button>
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
      {children}

      <Affix position={{ bottom: 20, right: 20 }}>
        <Transition transition="slide-up" mounted={scroll.y > 0}>
          {(transitionStyles) => (
            <Button
              leftIcon={<IconArrowUp size={16} />}
              onClick={() => scrollTo({ y: 0 })}
              style={transitionStyles}
              variant="outline"
            >
              Scroll to the top
            </Button>
          )}
        </Transition>
      </Affix>
    </AppShell>
  )
}

export default Shell
