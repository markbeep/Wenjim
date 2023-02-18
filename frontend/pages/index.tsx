import Image from "next/image";
import {
  Container,
  Text,
  Center,
  SimpleGrid,
  Card,
  Kbd,
  UnstyledButton,
  Title,
} from "@mantine/core";
import { GetServerSideProps } from "next";
import { UtilityService } from "../api/service";
import Shell from "../components/shell";
import { Event } from "../generated/Event";
import { useRouter } from "next/router";
import { useHotkeys } from "@mantine/hooks";
import useResize from "../components/resize";
import Link from "next/link";
import { showNotification } from "@mantine/notifications";

export default function Home({
  events,
  top,
  error,
}: {
  events: Event[];
  top: Event[];
  error: string;
}) {
  if (error) {
    showNotification({ title: "Error", message: error, color: "red" });
  }

  const router = useRouter();
  const keybinds = ["H", "J", "K", "L"];
  useHotkeys([
    [keybinds[0], () => router.push(`/lessons/${top[0].id}`)],
    [keybinds[1], () => router.push(`/lessons/${top[1].id}`)],
    [keybinds[2], () => router.push(`/lessons/${top[2].id}`)],
    [keybinds[3], () => router.push(`/lessons/${top[3].id}`)],
  ]);

  return (
    <Shell events={events}>
      <Container fluid mt="xl">
        <Center>
          <Container className="text-center" w="600px">
            <Image
              src="/assets/wenjim_dark.svg"
              height={80}
              width={80}
              blurDataURL="/assets/favicon.png"
              alt="Logo"
            />
            <Title>Wenjim, the open source ASVZ data spot</Title>
            <Text my="xl">
              Ever wanted to sign up for an ASVZ event but it was full? Fret no
              more! With Wenjim you can lookup all the events you want and find
              out at what time the least people go and how early you have to
              enroll to still get a job.
            </Text>
            <Title size={20}>Top Events</Title>
            <SimpleGrid cols={2} mt="sm">
              {top.map((e, i) => TopCard(e, keybinds[i]))}
            </SimpleGrid>
          </Container>
        </Center>
      </Container>
    </Shell>
  );
}

const TopCard = (event: Event, keybind: string) => {
  const [show] = useResize();
  return (
    <Link href={`/lessons/${event.id}`}>
      <UnstyledButton>
        <Card shadow="sm" p="lg" radius="md" withBorder>
          {show && (
            <Kbd right={5} top={5} pos="absolute">
              {keybind}
            </Kbd>
          )}
          <Text align="center">{event.sport}</Text>
          <Text align="center" color="dimmed">
            {event.title}
          </Text>
          <Text align="center" color="dimmed">
            {event.location}
          </Text>
          <Text align="center" color="dimmed">
            {event.niveau}
          </Text>
        </Card>
      </UnstyledButton>
    </Link>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  try {
    const utilityService = new UtilityService();
    const { events, error } = await utilityService.getEvents();

    if (events) {
      return {
        props: {
          events: events.events,
          top: [
            {
              sport: "Fitness",
              title: "Individuelles Training",
              location: "Sport Center Polyterrasse",
              niveau: "Alle",
            },
            {
              sport: "Fitness",
              title: "Individuelles Training",
              location: "Sport Center Hönggerberg",
              niveau: "Alle",
            },
            {
              sport: "Fitness",
              title: "Individuelles Training",
              location: "Sport Center Irchel",
              niveau: "Alle",
            },
            {
              sport: "Fitness",
              title: "Individuelles Training",
              location: "Sport Center Rämistrasse",
              niveau: "Alle",
            },
          ],
          error,
        },
      };
    } else {
      throw "No result";
    }
  } catch (error) {
    return {
      props: { error },
    };
  }
};
