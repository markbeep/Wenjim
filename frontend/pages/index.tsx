import Image from "next/image";
import { Container, Text, Center } from "@mantine/core";
import { GetServerSideProps } from "next";
import { UtilityService } from "../api/service";
import Shell from "../components/shell";
import { Event } from "../generated/Event";

export default function Home({
  events,
  error,
}: {
  events: Event[];
  error: string;
}) {
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
            <Text my="xl">
              Welcome to Wenjim, the ultimate destination for ASVZ enthusiasts
              looking to stay up to date on the availability of free spots at
              their favorite activities and locations.
            </Text>
          </Container>
        </Center>
      </Container>
    </Shell>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  try {
    const utilityService = new UtilityService();
    const { events, error } = await utilityService.getEvents();

    if (events) {
      return {
        props: {
          events: events.events,
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
