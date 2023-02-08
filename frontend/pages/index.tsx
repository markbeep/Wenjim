import Image from "next/image";
import { CalendarChart } from "../components/calendarChart";
import { Container, Text, Center, Skeleton } from "@mantine/core";
import { GetServerSideProps } from "next";
import { UtilityService } from "../api/service";
import { CalendarData, CalendarDatum } from "@nivo/calendar";

interface Props {
  day: { day: string; value: number }[];
}

export default function Home({ day }: Props) {
  const formatted = day as CalendarDatum[];

  return (
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

      <Center>
        <Skeleton visible={false}>
          {<CalendarChart data={formatted} />}
        </Skeleton>
      </Center>
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  try {
    const utilityService = new UtilityService();
    const { day, error } = await utilityService.getTotalDay();
    return {
      props: { day, error },
    };
  } catch (error) {
    return {
      props: { error },
    };
  }
};
