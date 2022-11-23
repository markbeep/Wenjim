import { AspectRatio, ScrollArea } from '@mantine/core'
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
            margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
            yearSpacing={40}
            monthBorderColor="#000000"
            dayBorderWidth={2}
            dayBorderColor="#000000"
            theme={{ textColor: '#ffffff' }}
            legends={[
              {
                anchor: 'bottom-right',
                direction: 'row',
                translateY: 36,
                itemCount: 4,
                itemWidth: 42,
                itemHeight: 36,
                itemsSpacing: 14,
                itemDirection: 'right-to-left',
              },
            ]}
          />
        }
      </AspectRatio>
    </ScrollArea>
  )
}
