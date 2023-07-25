"use client";

import {
  Flex,
  SimpleGrid,
  Tabs,
  Text,
  Title,
  Transition,
  rem,
} from "@mantine/core";
import { useMove } from "@mantine/hooks";
import { IconUser } from "@tabler/icons-react";
import { useCallback, useState } from "react";
import getBridsonPoissonDisk from "./poissonDisk";

export default function Fullness() {
  const [value, setValue] = useState({ x: 0, y: 1 });
  const { ref } = useMove(({ y }) => setValue({ x: 0, y }));
  const [sliderHeight, sliderWidth] = [500, 300];

  const bridsonCallback = useCallback(
    () => getBridsonPoissonDisk(1, sliderHeight, sliderWidth, 10),
    [sliderHeight, sliderWidth],
  );

  const [people] = useState(bridsonCallback);

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
            backgroundColor: `#555555`,
            position: "relative",
          }}
        >
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
              top: `${value.y * 100}%`,
              height: rem(30),
              width: rem(sliderWidth),
              opacity: 0.3,
              backgroundColor: "#444444",
              zIndex: 50,
            }}
          />
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
