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
  Loader,
} from "@mantine/core";
import { useRouter } from "next/router";
import { useHotkeys } from "@mantine/hooks";
import useResize from "../components/resize";
import Link from "next/link";
import { useTopEvents } from "../api/grpc";

export default function Home() {
  const router = useRouter();
  const keybinds = ["H", "J", "K", "L"];
  const { data, isLoading } = useTopEvents();
  const [show] = useResize();

  useHotkeys([
    [keybinds[0], () => data && router.push(`/lessons/${data[0].eventId}`)],
    [keybinds[1], () => data && router.push(`/lessons/${data[0].eventId}`)],
    [keybinds[2], () => data && router.push(`/lessons/${data[0].eventId}`)],
    [keybinds[3], () => data && router.push(`/lessons/${data[0].eventId}`)],
  ]);

  return (
    <Center>
      <Container className="text-center" w="600px">
        <Center>
          <Image
            src="/assets/wenjim_dark.svg"
            height={80}
            width={80}
            blurDataURL="/assets/favicon.png"
            alt="Logo"
          />
        </Center>
        <Title>Wenjim, the open source ASVZ data spot</Title>
        <Text my="xl">
          Ever wanted to sign up for an ASVZ event but it was full? Fret no
          more! With Wenjim you can lookup all the events you want and find out
          at what time the least people go and how early you have to enroll to
          still get a job.
        </Text>
        <Title size={20}>Top Events</Title>
        <Center mt="md">{isLoading && <Loader variant="dots" />}</Center>
        {data && (
          <SimpleGrid cols={2} mt="sm">
            {data.map((e, i) => TopCard(e, i, keybinds[i], show))}
          </SimpleGrid>
        )}
      </Container>
    </Center>
  );
}

const TopCard = (
  event: {
    sport: string;
    title: string;
    location: string;
    niveau: string;
    eventId: number;
  },
  index: number,
  keybind: string,
  show: boolean,
) => {
  return (
    <Link href={`/lessons/${event.eventId}`} key={index}>
      <UnstyledButton h="100%" w="100%">
        <Card shadow="sm" p={4} radius="md" withBorder h="100%" w="100%">
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
