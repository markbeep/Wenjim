import { Card, Text, Flex } from "@mantine/core";
import Link from "next/link";
import { Event } from "../generated/countday_pb";

export default function EventCard({ event }: { event: Event }) {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Link href={`/lessons/${event.getId()}`}>
        <Card shadow="sm" p={4} radius="md" withBorder h="100%" w="100%">
          <Flex direction="column" justify="center" h="100%">
            <Text align="center" size="sm" lineClamp={1}>
              {event.getSport()}
            </Text>
            <Text align="center" color="dimmed" size="sm" lineClamp={3}>
              {event.getTitle()}
              <br/>
              {event.getLocation()}
            </Text>
          </Flex>
        </Card>
      </Link>
    </div>
  );
}
