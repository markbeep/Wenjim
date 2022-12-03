import React from 'react'
import { useLocations, useMinMaxDate, useSports } from '../pages/api/hooks'
import { IconCircleX } from '@tabler/icons'
import { DateRangePicker, DateRangePickerValue } from '@mantine/dates'
import { Button, LoadingOverlay, MultiSelect, Select } from '@mantine/core'
import { Container } from '@nivo/core'

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

  return <>
    <Container>

      <LoadingOverlay visible={l1 || l2} />
      <MultiSelect
        label="Pick your activities"
        placeholder='Fitness'
        searchable
        required
        data={d1?.map(v => ({ label: v, value: v })) ?? []}
        onChange={e => setActivities(old => Array.from(new Set([...old, ...e])))}
      />
      <MultiSelect
        label="Pick your locations"
        placeholder='Sport Center Polyterasse'
        searchable
        required
        data={d2?.map(v => ({ label: v, value: v })) ?? []}
        onChange={e => { setLocations(old => Array.from(new Set([...old, ...e]))); }}
      />

      <DateRangePicker
        label="Date Range"
        placeholder='Select a range of date here'
        value={date}
        onChange={setDate}
        required
        minDate={d3?.from}
        maxDate={d3?.to}
      />
      <Button variant='outline' onClick={() => { setLocations([]); setActivities([]); setDate(undefined) }}>
        Clear Selection
      </Button>
    </Container>

  </>
}

export default Search
