import { Container, Grid } from '@mantine/core'
import { DateRangePickerValue } from '@mantine/dates'
import React, { useState } from 'react'
import Search from '../components/search'
import { useWeekly } from './api/hooks'

const Weekly = () => {
  const [activities, setActivities] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [date, setDate] = useState<DateRangePickerValue>();
  const { isLoading, data } = useWeekly(
    activities,
    locations,
    date?.[0] ?? new Date("2022-08-01"),
    date?.[1] ?? new Date("2022-12-31")
  );

  return (
    <Container fluid>
      <Search
        activities={activities}
        setActivities={setActivities}
        locations={locations}
        setLocations={setLocations}
        date={date}
        setDate={setDate}
      />

      <Grid columns={7}>
        <Grid.Col>Monday</Grid.Col>
        <Grid.Col>Tuesday</Grid.Col>
        <Grid.Col>Wednesday</Grid.Col>
        <Grid.Col>Thursday</Grid.Col>
        <Grid.Col>Friday</Grid.Col>
        <Grid.Col>Saturday</Grid.Col>
        <Grid.Col>Sunday</Grid.Col>
      </Grid>
    </Container>
  )
}

export default Weekly
