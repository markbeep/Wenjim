import { Flex, Text, Accordion } from "@mantine/core";
import { WeeklyHour } from "../../../generated/countday_pb";
import FreeChart from "./freeChart";

export default function DetailedView({
  eventId,
  data,
  dateFrom,
  dateTo,
}: {
  eventId: number;
  data: WeeklyHour;
  dateFrom: Date;
  dateTo: Date;
}) {
  return (
    <Accordion variant="separated">
      {data.getDetailsList().length === 0 && "There's no lesson here"}
      {data.getDetailsList().map((d, i) => (
        <Accordion.Item value={i.toString()} key={i}>
          <Accordion.Control>
            <Flex
              w="100%"
              direction="row"
              align="center"
              justify="center"
              my="sm"
            >
              <Flex
                w="100%"
                direction="column"
                align="flex-start"
                justify="flex-start"
                mr="sm"
              >
                <Text>Time</Text>
                <Text>Average Free Spots</Text>
                <Text>Average Total Spots</Text>
                <Text>Average Free</Text>
              </Flex>
              <Flex
                w="100%"
                direction="column"
                align="flex-end"
                justify="flex-start"
              >
                <Text>
                  {d.getTimefrom()} - {d.getTimeto()}
                </Text>
                <Text>{Math.round(d.getAvgfree())}</Text>
                <Text>{Math.round(d.getAvgmax())}</Text>
                <Text>
                  {Math.round((10000 * d.getAvgfree()) / d.getAvgmax()) / 100}%
                </Text>
              </Flex>
            </Flex>
          </Accordion.Control>
          <Accordion.Panel>
            <FreeChart
              eventId={eventId}
              timeFrom={d.getTimefrom()}
              timeTo={d.getTimeto()}
              weekday={d.getWeekday()}
              dateFrom={dateFrom}
              dateTo={dateTo}
            />
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
