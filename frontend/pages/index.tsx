import Link from "next/link";
import Image from "next/image";
import { useCountDay } from "./api/hooks";
import { CalendarChart } from "../components/calendarChart";
import { Container, Text, Center, Skeleton } from "@mantine/core";

const Home = () => {
  const { data, isLoading } = useCountDay();

  return (
    <Container fluid mt="xl">
      <Center>
        <Container className="text-center" w="600px">
          <Image
            src="/assets/wenjim_dark.svg"
            height={80}
            width={80}
            placeholder="blur"
            blurDataURL="/assets/favicon.png"
          />
          <Text my="xl">
            Welcome to Wenjim, the ultimate destination for ASVZ enthusiasts
            looking to stay up to date on the availability of free spots at
            their favorite activities and locations.
          </Text>
        </Container>
      </Center>

      <Center>
        <Skeleton visible={isLoading}>{<CalendarChart data={data} />}</Skeleton>
      </Center>
    </Container>
  );
};

export default Home;
