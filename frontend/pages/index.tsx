import { CircularProgress } from '@mui/material'
import Link from 'next/link'
import { useCountDay } from './api/hooks'
import { CalendarChart } from '../components/calendarChart'
import ErrorIcon from '@mui/icons-material/Error'
import Image from 'next/image'
import { useTheme } from '../context/themeProvider'
import HomeIcon from '@mui/icons-material/Home'
import { AppShell, Header, Container, Text, MediaQuery, Aside } from '@mantine/core';
import NavBar from '../components/navBar'
import { useState } from 'react'

export const CardStyle = "card border-solid border-neutral-focus border-2 bg-base";

const Home = () => {
  const { data, isLoading, isError } = useCountDay()
  return (
    <AppShell
      navbar={<NavBar />}
      header={<Header height={60} p="xs">{
        <Link href="/">
          <button className="btn btn-ghost">
            <HomeIcon fontSize='large' />
          </button>
        </Link>
      }</Header>}
      padding="md"
      styles={(theme) => ({
        main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
      })}

      aside={
        <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
          <Aside p="md" hiddenBreakpoint="sm" width={{ sm: 200, lg: 300 }}>
            <Text>Application sidebar</Text>
          </Aside>
        </MediaQuery>
      }

    >
      <Container>
        <span className='fixed -z-50 top-0 w-full h-full bg-base-100'>
          <Image
            alt="mountain"
            src="/dark-bg.jpg"
            quality={100}
            layout="fill"
            objectFit='cover'
            className='opacity-40 w-full h-full fixed top-0'
          />
        </span>

        <div className="pt-10 relative align-center flex flex-col h-full">
          <div className={`w-full h-full`}>
            <div className="max-w-md z-10 py-10 m-auto text-center">
              <h1 className="mb-5 text-5xl font-bold">Welcome</h1>
              <p className="mb-5">
                Ever went to a ASVZ activity just for it to be packed? Fret no more! With this tool you can
                find out at what time the least people are present.
              </p>
              <h2 className="mb-2 text-2xl font-bold">Get started</h2>
              <Link href="/history">
                <button className="btn btn-primary m-2">History</button>
              </Link>
              <Link href="/weekly">
                <button className="btn btn-primary m-2">Weekly</button>
              </Link>
            </div>
          </div>

          <div className={`w-full pb-20`} style={{ height: "40vw" }}>
            {/* {isLoading && <CircularProgress />} */}
            {isError && <ErrorIcon />}
            {data && <CalendarChart data={data} />}
          </div>

        </div>

      </Container>

    </AppShell >
  )
}

export default Home
