import React, { useCallback, useEffect, useState } from 'react'
import { useLocations, useMinMaxDate, useSports } from '../pages/api/hooks'
import { DateRangePicker, DateRangePickerValue } from '@mantine/dates'
import { Flex, MultiSelect, Container, useMantineTheme, Tooltip, Select, SegmentedControl, Input, FocusTrap } from '@mantine/core'
import { resetNavigationProgress, startNavigationProgress } from '@mantine/nprogress'

interface SearchData {
    activity: string | null,
    setActivity: React.Dispatch<React.SetStateAction<string | null>>,
    location: string | null,
    setLocation: React.Dispatch<React.SetStateAction<string | null>>,
    date: DateRangePickerValue | undefined,
    setDate: React.Dispatch<React.SetStateAction<DateRangePickerValue | undefined>>,
}

const SingleSearch = ({ activity, setActivity, location, setLocation, date, setDate }: SearchData) => {
    const { data: d1, isError: e1, isLoading: l1 } = useSports()
    const { data: d2, isError: e2, isLoading: l2 } = useLocations(activity ? [activity] : [])
    const { data: d3 } = useMinMaxDate()
    const theme = useMantineTheme()
    const [show, setShow] = useState(false);
    const [showDate, setShowDate] = useState(false);

    const startLoading = () => { resetNavigationProgress(); startNavigationProgress(); }

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

    return (
        <Container fluid>
            <Flex direction={show ? "row" : "column"} align="center" justify="center" gap="sm">
                <FocusTrap active>
                    <Select
                        data-autoFocus
                        label="Pick an activity"
                        w="100%"
                        placeholder='Fitness'
                        searchable
                        required
                        value={activity}
                        disabled={l1 || e1}
                        nothingFound="Nothing found"
                        data={d1?.map(v => ({ label: v, value: v })) ?? []}
                        onChange={e => { setActivity(_ => e); setLocation(null); startLoading() }}
                        clearButtonLabel="Clear Activities"
                        clearable
                    />
                </FocusTrap>
                <FocusTrap active={!(l2 || e2 || d2?.length === 0)}>
                    <Tooltip label="Pick an activity first" position='bottom' events={{ hover: l2 || e2 || d2?.length === 0, focus: l2 || e2 || d2?.length === 0, touch: l2 || e2 || d2?.length === 0 }}>
                        <Select
                            data-autoFocus
                            label="Pick a location"
                            w="100%"
                            placeholder='Sport Center Polyterasse'
                            searchable
                            required
                            disabled={l2 || e2 || d2?.length === 0}
                            value={location}
                            nothingFound="Nothing found"
                            data={d2?.map(v => ({ label: v, value: v })) ?? []}
                            onChange={e => { setLocation(_ => e); }}
                            clearButtonLabel="Clear Locations"
                            clearable
                        />
                    </Tooltip>
                </FocusTrap>

                <Input.Wrapper label="Date Range" required>
                    <SegmentedControl
                        w="100%"
                        onChange={v => {
                            if (v === "manual") {
                                setShowDate(true);
                                return
                            }
                            setShowDate(false);
                            if (v === "semester") {
                                setDate([  // TODO: remove this hardcode
                                    new Date("2022-09-19"),
                                    new Date("2022-12-24"),
                                ]);
                            } else if (v === "holidays") {
                                setDate([
                                    new Date("2022-06-01"),
                                    new Date("2022-09-18"),
                                ]);
                            }
                        }}
                        data={[
                            { label: "Semester", value: "semester" },
                            { label: "Holidays", value: "holidays" },
                            { label: "Manual", value: "manual" },
                        ]}
                    />
                </Input.Wrapper>
            </Flex>
            {showDate && <DateRangePicker
                label="Manual Date Range"
                w="100%"
                placeholder='2022-01-01 - 2022-12-31'
                defaultValue={date}
                value={date}
                onChange={setDate}
                required
                minDate={d3?.from}
                maxDate={d3?.to}
            />}
        </Container>
    )
}

export default SingleSearch
