import { AspectRatio, Center, ScrollArea, Text } from '@mantine/core'
import { CalendarDatum, ResponsiveCalendar } from '@nivo/calendar'

interface Data {
  data: CalendarDatum[] | undefined
}

export function CalendarChart({ data }: Data) {
  return (
    <ScrollArea type="auto">
      <AspectRatio ratio={1080 / 240} sx={{ minWidth: "1080px", minHeight: "240px" }}>
        {data &&
          <ResponsiveCalendar
            data={data}
            from="2022-01-01"
            to="2022-12-12"
            emptyColor="#555555"
            colors={['#61cdbb', '#97e3d5', '#e8c1a0', '#f47560']}
            margin={{ right: 40, left: 40 }}
            yearSpacing={40}
            monthBorderColor="#000000"
            dayBorderWidth={2}
            dayBorderColor="#000000"
            theme={{ textColor: '#ffffff' }}
            legends={[
              {
                anchor: "bottom",
                direction: "row",
                itemWidth: 100,
                itemHeight: 100,
                itemCount: 10,
              }
            ]}
          />
        }
      </AspectRatio>
      <Center mt="-30px">
        <Text>Total signups per day</Text>
      </Center>
    </ScrollArea>
  )
}
