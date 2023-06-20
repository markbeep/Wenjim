import { Skeleton, Text, useMantineTheme } from "@mantine/core";
import { useFreeGraph } from "../../../api/grpc";
import { Tooltip, YAxis, XAxis, BarChart, Bar } from "recharts";
import { useEffect, useState } from "react";
import { useColorScheme } from "@mantine/hooks";

export default function FreeChart({
  eventId,
  timeFrom,
  timeTo,
  weekday,
}: {
  eventId: number;
  timeFrom: string;
  timeTo: string;
  weekday: string;
}) {
  const { data } = useFreeGraph(eventId, timeFrom, timeTo, weekday);
  const colorScheme = useColorScheme();
  const theme = useMantineTheme();
  const [fg, setFg] = useState(
    colorScheme === "dark" ? theme.colors.gray[3] : theme.colors.dark[7],
  );
  const [bg, setBg] = useState(
    colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[3],
  );
  useEffect(() => {
    setBg(colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[3]);
    setFg(colorScheme === "dark" ? theme.colors.gray[3] : theme.colors.dark[7]);
  }, [theme]);
  return (
    <>
      <Skeleton
        visible={!data}
        width={350}
        height={data?.getDataList().length ?? 0 > 0 ? 200 : undefined}
      >
        {data && (
          <>
            {data.getDataList().length === 0 && (
              <Text align="center">Not enough data available currently.</Text>
            )}
            {data.getDataList().length > 0 && (
              <BarChart
                width={350}
                height={200}
                data={data?.getDataList().map(v => {
                  return { x: v.getX(), y: v.getY() };
                })}
              >
                <Bar dataKey="y" fill={fg} />
                <YAxis dataKey="y" />
                <XAxis dataKey="x" />
                <Tooltip contentStyle={{ backgroundColor: bg }} />
              </BarChart>
            )}
          </>
        )}
      </Skeleton>
    </>
  );
}
