import Link from 'next/link'
import { useCountDay } from './api/hooks'
import { CalendarChart } from '../components/calendarChart'
import { Container, Text, Center, Skeleton, Paper, Title, Button } from '@mantine/core';

const Home = () => {
  const { data, isLoading } = useCountDay();

  return (
    <Container fluid mt="xl">
      <Center>
        <Paper className='text-center' w="600px" p="sm" radius={10}>
          <Title size={50}>Welcome</Title>
          <Text className="mb-5">
            Ever went to a ASVZ activity just for it to be packed? Fret no more! With this tool you can
            find out at what time the least people are present and whatever event you want. With the history
            view you can get a glimpse from every single day. With the weekly view you get the average taken spots
            per weekday. Simply switch up the date to get an average more fitting to the semester.
          </Text>
          <Title>Get started</Title>
          <Link href="/history">
            <Button m="sm" variant='outline'>History</Button>
          </Link>
          <Link href="/weekly">
            <Button m="sm" variant='outline'>Weekly</Button>
          </Link>
        </Paper>
      </Center>


      <Center mt="md">
        <Skeleton visible={isLoading}>
          {<CalendarChart data={data} />}
        </Skeleton>
      </Center>


    </Container>
  )
}

export default Home
