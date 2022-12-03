import Link from 'next/link'
import { AppShell, Center, Flex, Navbar, Text, useMantineTheme } from '@mantine/core'
import { ReactNode, useEffect, useState } from 'react'
import { IconBook, IconCalendar, IconHome } from '@tabler/icons'

const NavBar = ({ children }: { children: ReactNode }) => {
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
      {children}
    </AppShell>
  )
}

export default NavBar
