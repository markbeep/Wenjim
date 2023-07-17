"use client";

import {
  Center,
  Flex,
  SimpleGrid,
  Tabs,
  Text,
  Title,
  Transition,
  rem,
} from "@mantine/core";
import { useMove } from "@mantine/hooks";
import { IconMenu2, IconUser } from "@tabler/icons-react";
import { useState } from "react";

export default function Fullness() {
  const [value, setValue] = useState({ x: 0, y: 1 });
  const { ref, active } = useMove(({ y }) => setValue({ x: 0, y }));
  const [sliderHeight, sliderWidth] = [500, 300];

  const [people] = useState(
    new Array(100)
      .fill(0)
      .map(_ => getRandomPos(sliderHeight, sliderWidth, 20)),
  );

  const locations = [
    "Sport Center Polyterrasse",
    "Sport Center Irchel",
    "Sport Center Gloriarank",
  ];
  return (
    <>
      <Flex direction="column" align="center" justify="center">
        <Title>
          How full is{" "}
          <Text c="blue" inherit span>
            jim
          </Text>
          ?
        </Title>
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
            height: rem(sliderHeight),
            width: rem(sliderWidth),
            backgroundColor: `#222222`,
            position: "relative",
          }}
        >
          {new Array(4).fill(0).map((_, i) => (
            <div
              key={`line-${i}`}
              style={{
                position: "absolute",
                left: 0,
                top: (i / 4) * sliderHeight,
                height: rem(3),
                width: rem(sliderWidth),
                backgroundColor: "#111111",
                zIndex: 5,
              }}
            />
          ))}

          {people.map(({ x, y }, i) => (
            <Transition
              key={i}
              transition="scale"
              mounted={(1 - value.y) * people.length > i}
              duration={300}
            >
              {styles => (
                <IconUser
                  size={20}
                  style={{ position: "absolute", left: x, top: y, ...styles }}
                />
              )}
            </Transition>
          ))}

          <div
            style={{
              position: "absolute",
              left: 0,
              top: `calc(${value.y * 100}%)`,
              height: rem(30),
              width: rem(sliderWidth),
              opacity: 0.3,
              backgroundColor: "#444444",
              zIndex: 50,
            }}
          >
            <Center>
              <IconMenu2 size={30} />
            </Center>
          </div>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: `${value.y * 100}%`,
              height: rem(sliderHeight * (1 - value.y)),
              width: rem(sliderWidth),
              zIndex: 10,
            }}
          />
        </div>
      </Flex>
    </>
  );
}

function getRandomPos(
  sliderHeight: number,
  sliderWidth: number,
  iconSize: number,
): { x: number; y: number } {
  return {
    x: Math.round(Math.random() * (sliderWidth - 2 * iconSize) + iconSize),
    y: Math.round(Math.random() * (sliderHeight - 2 * iconSize) + iconSize),
  };
}
