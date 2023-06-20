import {
  ScrollArea,
  Skeleton,
  Text,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { useFreeGraph } from "../../../api/grpc";
import { Tooltip, YAxis, XAxis, BarChart, Bar } from "recharts";
import { useEffect, useState } from "react";

export default function FreeChart({
  eventId,
  timeFrom,
  timeTo,
  weekday,
  dateTo,
  dateFrom,
}: {
  eventId: number;
  timeFrom: string;
  timeTo: string;
  weekday: string;
  dateTo: Date;
  dateFrom: Date;
}) {
  const { data } = useFreeGraph(
    eventId,
    timeFrom,
    timeTo,
    weekday,
    dateFrom,
    dateTo,
  );
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();

  const light = theme.colors.gray[3];
  const dark = theme.colors.dark[7];
  const [fg, setFg] = useState(colorScheme === "dark" ? light : dark);
  const [bg, setBg] = useState(colorScheme === "dark" ? dark : light);
  useEffect(() => {
    setBg(colorScheme === "dark" ? dark : light);
    setFg(colorScheme === "dark" ? light : dark);
  }, [theme]);
  return (
    <>
      <ScrollArea>
        <Skeleton
          visible={!data}
          width={350}
          height={(data?.getDataList().length ?? 1) > 0 ? 200 : undefined}
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
                    return { x: v.getX(), "Spots Free": v.getY() };
                  })}
                >
                  <Bar dataKey="Spots Free" fill={fg} />
                  <YAxis
                    dataKey="Spots Free"
                    label={{
                      value: "Average free spots",
                      angle: -90,
                      dx: -10,
                    }}
                  />
                  <XAxis
                    dataKey="x"
                    label={{
                      value: "Hours before slot",
                      dy: 12,
                    }}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: bg }}
                    formatter={(v: number, _) => v.toFixed(2)}
                  />
                </BarChart>
              )}
            </>
          )}
        </Skeleton>
      </ScrollArea>
    </>
  );
}
