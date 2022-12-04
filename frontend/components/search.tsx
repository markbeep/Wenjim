import React, { useEffect, useState } from 'react'
import { useLocations, useMinMaxDate, useSports } from '../pages/api/hooks'
import { DateRangePicker, DateRangePickerValue } from '@mantine/dates'
import { Button, Flex, MultiSelect, Skeleton, Container, useMantineTheme, Tooltip } from '@mantine/core'
import { completeNavigationProgress, NavigationProgress, resetNavigationProgress, startNavigationProgress } from '@mantine/nprogress'

interface SearchData {
  activities: string[],
  setActivities: React.Dispatch<React.SetStateAction<string[]>>,
  locations: string[],
  setLocations: React.Dispatch<React.SetStateAction<string[]>>,
  date: DateRangePickerValue | undefined,
  setDate: React.Dispatch<React.SetStateAction<DateRangePickerValue | undefined>>,
}

const Search = ({ activities, setActivities, locations, setLocations, date, setDate }: SearchData) => {
  const { data: d1, isError: e1, isLoading: l1 } = useSports()
  const { data: d2, isError: e2, isLoading: l2 } = useLocations(activities)
  const { data: d3 } = useMinMaxDate()
  const theme = useMantineTheme()
  const [show, setShow] = useState(false);

  const startLoading = () => { resetNavigationProgress(); startNavigationProgress(); }

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
    <Container fluid>
      <Flex direction={show ? "row" : "column"} align="center" justify="center" gap="sm">
        <MultiSelect
          label="Pick your activities"
          w="100%"
          placeholder='Fitness'
          searchable
          required
          value={activities}
          disabled={l1 || e1}
          nothingFound="Nothing found"
          data={d1?.map(v => ({ label: v, value: v })) ?? []}
          onChange={e => { setActivities(_ => [...e]); startLoading() }}
          clearButtonLabel="Clear Activities"
          clearable
        />
        <Tooltip label="Pick an activity first" position='bottom' events={{ hover: l2 || e2 || d2?.length === 0, focus: l2 || e2 || d2?.length === 0, touch: l2 || e2 || d2?.length === 0 }}>
          <MultiSelect
            label="Pick your locations"
            w="100%"
            placeholder='Sport Center Polyterasse'
            searchable
            required
            disabled={l2 || e2 || d2?.length === 0}
            value={locations}
            nothingFound="Nothing found"
            data={d2?.map(v => ({ label: v, value: v })) ?? []}
            onChange={e => { setLocations(_ => [...e]); }}
            clearButtonLabel="Clear Locations"
            clearable
          />
        </Tooltip>
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
    </Container>
  )
}

export default Search
