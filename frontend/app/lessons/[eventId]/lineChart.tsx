import { Skeleton, Text } from "@mantine/core";

export default function LineChart() {
  return (
    <>
      <Text align="center">Coming soon: Free spots graphed</Text>
      <Skeleton visible={true} width="100%" height={100}></Skeleton>
    </>
  );
}
