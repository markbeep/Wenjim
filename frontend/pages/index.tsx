import Link from 'next/link'
import { useCountDay } from './api/hooks'
import { CalendarChart } from '../components/calendarChart'
import { Container, Text, Center, Skeleton } from '@mantine/core';

const Home = () => {
  const { data, isLoading } = useCountDay();

  return (
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
  )
}

export default Home
