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

function getBridsonPoissonDisk(
  k: number,
  sliderHeight: number,
  sliderWidth: number,
  iconSize: number,
): { x: number; y: number }[] {
  let active = [0];
  let grid = new Array(sliderHeight * sliderWidth).fill(false);
  const indexToCoords = (i: number) => ({
    y: Math.floor(i / sliderWidth),
    x: grid.length - Math.floor(i / sliderWidth),
  });
  let index = active[0];

  while (active.length > 0) {
    const newPoint = getNewPoint(
      indexToCoords(index),
      grid,
      k,
      sliderWidth,
      iconSize,
    );
    if (newPoint === null) {
      active = active.filter(v => v === index);
    } else {
      active.push(newPoint);
      index = newPoint;
    }
  }

  return grid.map((_, i) => indexToCoords(i));
}

function getNewPoint(
  point: { x: number; y: number },
  grid: boolean[],
  k: number,
  sliderWidth: number,
  iconSize: number,
): null | number {
  for (let j = 0; j < k; j++) {
    const rad = Math.random() * 2 * Math.PI;
    const radius = ((Math.random() + 1) * iconSize) / 2;
    const x = Math.round(radius * Math.sin(rad) + point.x);
    const y = Math.round(radius * Math.cos(rad) + point.y);
    if (x + y * sliderWidth >= grid.length || x + y * sliderWidth < 0) continue;

    // check if the point has enough space
    if (isValidPoint(point, iconSize, grid, sliderWidth)) {
      return x + y * sliderWidth;
    }
  }
  return null;
}

function isValidPoint(
  point: { x: number; y: number },
  iconSize: number,
  grid: boolean[],
  sliderWidth: number,
): boolean {
  const radius = Math.round(iconSize / 2);
  for (let ix = point.x - radius; ix < point.x + radius; ix++) {
    for (let iy = point.y - radius; iy < point.y + radius; iy++) {
      if (!grid[ix + iy * sliderWidth]) continue; // no point here (false or undefined)
      if (
        grid[ix + iy * sliderWidth] &&
        dist2({ x: ix, y: iy }, point) < radius
      )
        return false;
    }
  }
  return true;
}

function dist2(
  p1: { x: number; y: number },
  p2: { x: number; y: number },
): number {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}
