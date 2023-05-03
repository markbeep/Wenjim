import {
  Container,
  Divider,
  Flex,
  ScrollArea,
  SimpleGrid,
  Text,
  useMantineTheme,
  Center,
  Modal,
  Loader,
} from "@mantine/core";
import React, { useState } from "react";
import { useWeekly } from "../api/grpc";
import { WeeklyHour } from "../generated/countday_pb";
import { useRouter } from "next/router";
import { useDisclosure } from "@mantine/hooks";

const Hour = ({ data }: { data: WeeklyHour | undefined }) => {
  const theme = useMantineTheme();
  const [opened, { open, close }] = useDisclosure(false);

  if (!data) {
    return (
      <Container
        mt={5}
        bg={theme.colors.dark[7]}
        mih={25}
        w="100%"
        sx={{ borderRadius: "5%" }}
      />
    );
  }
  const avgFree =
    data.getDetailsList().reduce((a, b) => a + b.getAvgfree(), 0) /
    data.getDetailsList().length;
  const avgMax =
    data.getDetailsList().reduce((a, b) => a + b.getAvgmax(), 0) /
    data.getDetailsList().length;
  const c = theme.colors;
  const colors = [c.red, c.orange, c.yellow, c.lime, c.teal, c.lime];
  const ind = Math.floor((avgFree / avgMax) * (colors.length - 1));

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        overlayBlur={2}
        title="Detailed View"
      >
        {data.getDetailsList().length === 0 && "There's no lesson here"}
        {data.getDetailsList().map((d, i) => (
          <Container key={i}>
            {i > 0 && <Divider size="sm" />}
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
              </Flex>
            </Flex>
          </Container>
        ))}
      </Modal>
      <button style={{ width: "100%", height: "100%" }} onClick={open}>
        <Container
          mt={5}
          bg={colors[ind] ? colors[ind][4] : c.dark[6]}
          mih={25}
          w="100%"
          pt={4}
          c={c.dark[4]}
          sx={{ borderRadius: "5%" }}
        >
          {Math.round(avgFree)}
        </Container>
      </button>
    </>
  );
};

const Weekly = () => {
  const router = useRouter();
  const eventId = Number(router.query.eventId ?? "-1");
  const [dateFrom] = useState(
    new Date(
      router.query.dateFrom ? String(router.query.dateFrom) : "2022-01-01",
    ),
  );
  const [dateTo] = useState(
    new Date(router.query.dateTo ? String(router.query.dateTo) : "2030-12-31"),
  );

  const { data, isLoading } = useWeekly(eventId, dateFrom, dateTo);

  return (
    <Container fluid>
      <Center>
        {!data && <Loader variant="dots" />}
        {data && (
          <ScrollArea type="auto">
            <SimpleGrid cols={8} w={800}>
              <Center>Time</Center>
              <Center>Monday</Center>
              <Center>Tuesday</Center>
              <Center>Wednesday</Center>
              <Center>Thursday</Center>
              <Center>Friday</Center>
              <Center>Saturday</Center>
              <Center>Sunday</Center>
            </SimpleGrid>
            <Divider />
            <SimpleGrid cols={8} w={800}>
              <Flex direction="column" align="center">
                {
                  // to set the times on the left column
                  Array(24)
                    .fill(0)
                    .map((_, i) => (
                      <Container key={i} mt={5} w="100%" mih={25}>
                        <Center>{i}:00</Center>
                      </Container>
                    ))
                }
              </Flex>
              <Flex direction="column" align="center">
                {data.getMondayList().map((e, i) => (
                  <Hour key={"monday" + i} data={e} />
                ))}
              </Flex>
              <Flex direction="column" align="center">
                {data.getTuesdayList().map((e, i) => (
                  <Hour key={"tuesday" + i} data={e} />
                ))}
              </Flex>
              <Flex direction="column" align="center">
                {data.getWednesdayList().map((e, i) => (
                  <Hour key={"wednesday" + i} data={e} />
                ))}
              </Flex>
              <Flex direction="column" align="center">
                {data.getThursdayList().map((e, i) => (
                  <Hour key={"thursday" + i} data={e} />
                ))}
              </Flex>
              <Flex direction="column" align="center">
                {data.getFridayList().map((e, i) => (
                  <Hour key={"friday" + i} data={e} />
                ))}
              </Flex>
              <Flex direction="column" align="center">
                {data.getSaturdayList().map((e, i) => (
                  <Hour key={"saturday" + i} data={e} />
                ))}
              </Flex>
              <Flex direction="column" align="center">
                {data.getSundayList().map((e, i) => (
                  <Hour key={"sunday" + i} data={e} />
                ))}
              </Flex>
            </SimpleGrid>
            <Center>
              {
                <Text>
                  Hourly average free spots. Click to view in more detail.
                </Text>
              }
            </Center>
          </ScrollArea>
        )}
      </Center>
    </Container>
  );
};

export default Weekly;
