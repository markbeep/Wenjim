import React from 'react'
import { useLocations, useMinMaxDate, useSports } from '../pages/api/hooks'
import { DateRangePicker, DateRangePickerValue } from '@mantine/dates'
import { Button, Flex, MultiSelect, Skeleton, Container } from '@mantine/core'

interface SearchData {
  activities: string[],
  setActivities: React.Dispatch<React.SetStateAction<string[]>>,
  locations: string[],
  setLocations: React.Dispatch<React.SetStateAction<string[]>>,
  date: DateRangePickerValue | undefined,
  setDate: React.Dispatch<React.SetStateAction<DateRangePickerValue | undefined>>,
}

const Search = ({ activities, setActivities, locations, setLocations, date, setDate }: SearchData) => {
  const { isLoading: l1, data: d1, isError: e1 } = useSports()
  const { isLoading: l2, data: d2, isError: e2 } = useLocations()
  const { data: d3 } = useMinMaxDate()

  return (
    <Container fluid>
      <Flex direction="row" align="center" justify="center" gap="sm">
        <MultiSelect
          label="Pick your activities"
          w="100%"
          placeholder='Fitness'
          searchable
          required
          value={activities}
          nothingFound="Nothing found"
          data={d1?.map(v => ({ label: v, value: v })) ?? []}
          onChange={e => setActivities(_ => Array.from(new Set(e)))}
        />
        <MultiSelect
          label="Pick your locations"
          w="100%"
          placeholder='Sport Center Polyterasse'
          searchable
          required
          value={locations}
          nothingFound="Nothing found"
          data={d2?.map(v => ({ label: v, value: v })) ?? []}
          onChange={e => { setLocations(_ => Array.from(new Set(e))); }}
        />
        <DateRangePicker
          label="Date Range"
          w="100%"
          placeholder='2022-01-01 - 2022-12-31'
          defaultValue={date}
          value={date}
          onChange={setDate}
          required
          minDate={d3?.from}
          maxDate={d3?.to}
        />
      </Flex>

      <Button w="100%" mt="sm" variant='outline' onClick={() => { setLocations([]); setActivities([]); setDate(undefined) }}>
        Clear Selection
      </Button>
    </Container>
  )
}

export default Search
