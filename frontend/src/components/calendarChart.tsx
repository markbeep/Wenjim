import { CalendarDatum, ResponsiveCalendar } from '@nivo/calendar'
import { ThemeContext } from '../context/themeProvider'

interface Data {
  data: CalendarDatum[]
}

export function CalendarChart({ data }: Data) {
  return (
    <ThemeContext.Consumer>
      {({ theme, handleTheme }) => (
        <div className="w-full m-0 p-0" style={{ height: '30vw' }}>
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
        </div>
      )}
    </ThemeContext.Consumer>
  )
}
