"use client";

import { Flex, SimpleGrid, Tabs, Title, rem } from "@mantine/core";
import { useMove } from "@mantine/hooks";
import { useState } from "react";

export default function Fullness() {
  const [value, setValue] = useState({ x: 0, y: 1 });
  const { ref, active } = useMove(({ y }) => setValue({ x: 0, y }));

  const locations = [
    "Sport Center Polyterrasse",
    "Sport Center Irchel",
    "Sport Center Gloriarank",
  ];
  return (
    <>
      <Flex direction="column" align="center" justify="center">
        <Title>How full is it in the Gym right now?</Title>
        <Tabs
          variant="pills"
          orientation="vertical"
          defaultValue={locations[0]}
          my="md"
        >
          <Tabs.List>
            <SimpleGrid cols={2}>
              {locations.map(v => (
                <Tabs.Tab key={v} value={v}>
                  {v}
                </Tabs.Tab>
              ))}
            </SimpleGrid>
          </Tabs.List>
        </Tabs>
        <div
          ref={ref}
          style={{
            height: rem(500),
            width: rem(300),
            backgroundColor: "darkgray",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              top: `${value.y * 100}%`,
              height: rem(5),
              width: rem(300),
              backgroundColor: "green",
              zIndex: 1,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              top: `${value.y * 100}%`,
              height: rem(500 * (1 - value.y)),
              width: rem(300),
              backgroundColor: "red",
              overflow: "hidden",
            }}
          />
        </div>
      </Flex>
    </>
  );
}
