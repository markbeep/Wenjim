import Link from 'next/link'
import { Affix, AppShell, Box, Button, Center, Container, Flex, Navbar, NavLink, Text, ThemeIcon, Transition, useMantineTheme } from '@mantine/core'
import { ReactNode, useCallback, useEffect, useState } from 'react'
import { IconArrowUp, IconBook, IconBrandGithub, IconBug, IconCalendar, IconHome } from '@tabler/icons'
import { useWindowScroll } from '@mantine/hooks'

const Shell = ({ children }: { children: ReactNode }) => {
  const theme = useMantineTheme();
  const [show, setShow] = useState(false);
  const [scroll, scrollTo] = useWindowScroll();

  const handleResize = useCallback((width: number) => {
    if (width < theme.breakpoints.sm) {
      setShow(false);
    } else {
      setShow(true);
    }
  }, [theme])

  // initially check for window size
  useEffect(() => {
    if (typeof window !== "undefined") {
      handleResize(window.innerWidth);
    }

  }, [handleResize])

  if (typeof window !== "undefined") {
    window.addEventListener("resize", () => {
      handleResize(window.innerWidth);
    })
  }

  const menus = [
    {
      name: "Home",
      icon: <IconHome />,
      href: "/"
    },
    {
      name: "History",
      icon: <IconBook />,
      href: "/history"
    },
    {
      name: "Weekly",
      icon: <IconCalendar />,
      href: "/weekly"
    },
    {
      name: "Report Bug",
      icon: <IconBug />,
      href: "https://github.com/markbeep/ASVZ-Graph-Website/issues"
    }
  ]

  return (
    <AppShell
      navbar={
        <Navbar
          width={{ base: 50, sm: 150 }}>

          <Navbar.Section grow mt="lg">
            {menus.map(e => (
              <Box key={e.name} my="sm">
                <Link href={e.href}>
                  <Button
                    variant='light'
                    leftIcon={<ThemeIcon>{e.icon}</ThemeIcon>}
                    fullWidth
                    h={40}
                    sx={{
                      "& > .mantine-Button-inner": { justifyContent: "flex-start" },
                    }}
                  >
                    {e.name}
                  </Button>
                </Link>
              </Box>
            ))}
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
