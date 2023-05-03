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
import { Event } from "../generated/countday_pb";

export default function Home() {
  const router = useRouter();
  const keybinds = ["H", "J", "K", "L"];
  const { data, isLoading } = useTopEvents();
  const [show] = useResize();

  useHotkeys([
    [keybinds[0], () => data[0] && router.push(`/lessons/${data[0].getId()}`)],
    [keybinds[1], () => data[1] && router.push(`/lessons/${data[1].getId()}`)],
    [keybinds[2], () => data[2] && router.push(`/lessons/${data[2].getId()}`)],
    [keybinds[3], () => data[3] && router.push(`/lessons/${data[3].getId()}`)],
  ]);

  return (
    <>
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
          <Title>Wenjim, the open source ASVZ statistics website</Title>
          <Text my="xl">
            Ever wanted to sign up for an ASVZ event only for it to be full?
            Fret no more! With Wenjim you can lookup all the events you want and
            find out at what time the least people go and how early you have to
            enroll to still get a spot.
          </Text>
          <Title size={20}>Top Events</Title>
          <Center mt="sm">{isLoading && <Loader variant="dots" />}</Center>
          {data && (
            <SimpleGrid cols={2}>
              {data.map((e, i) => e && TopCard(e, i, keybinds[i], show))}
            </SimpleGrid>
          )}
        </Container>
      </Center>
    </>
  );
}

const TopCard = (
  event: Event,
  index: number,
  keybind: string,
  show: boolean,
) => {
  return (
    <Link href={`/lessons/${event.getId()}`} key={index}>
      <UnstyledButton h="100%" w="100%">
        <Card shadow="sm" p={4} radius="md" withBorder h="100%" w="100%">
          {show && (
            <Kbd right={5} top={5} pos="absolute">
              {keybind}
            </Kbd>
          )}
          <Text align="center">{event.getSport()}</Text>
          <Text align="center" color="dimmed">
            {event.getTitle()}
          </Text>
          <Text align="center" color="dimmed">
            {event.getLocation()}
          </Text>
        </Card>
      </UnstyledButton>
    </Link>
  );
};
