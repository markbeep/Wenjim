"use client";

import { Center, Flex, SimpleGrid, Tabs, Title, rem } from "@mantine/core";
import { useMove } from "@mantine/hooks";
import { IconMenu, IconMenu2 } from "@tabler/icons-react";
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
            backgroundColor: "#222222",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              top: `${value.y * 100}%`,
              height: rem(15),
              width: rem(300),
              backgroundColor: "#444444",
              zIndex: 1,
            }}
          >
            <Center>
              <IconMenu2 size={14} />
            </Center>
          </div>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: `${value.y * 100}%`,
              height: rem(500 * (1 - value.y)),
              width: rem(300),
              backgroundColor: "#333333",
              overflow: "hidden",
            }}
          />
        </div>
      </Flex>
    </>
  );
}
