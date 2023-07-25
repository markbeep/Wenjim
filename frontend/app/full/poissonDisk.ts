"use client";

export default function getBridsonPoissonDisk(
  k: number,
  sliderHeight: number,
  sliderWidth: number,
  iconSize: number,
): { x: number; y: number }[] {
  let active = [Math.floor(Math.random() * sliderHeight * sliderWidth)];
  let grid = new Array(sliderHeight * sliderWidth).fill(false);
  const indexToCoords = (i: number) => ({
    y: Math.floor(i / sliderWidth),
    x: i % sliderWidth,
  });
  let index = active[0];
  grid[index] = true;

  // upper limit to avoid infinite loop just in case
  // also prevents nextjs from timing out when compiling
  for (let i = 0; i < 1000 && active.length > 0; i++) {
    const newPoint = getNewPoint(
      indexToCoords(index),
      grid,
      k,
      sliderWidth,
      iconSize,
    );
    if (newPoint === null) {
      console.log("impossible");
      active = active.filter(v => v !== index);
      index = active[Math.floor(Math.random() * active.length)];
    } else {
      grid[newPoint] = true;
      active.push(newPoint);
      index = newPoint;
    }
  }
  console.log("Actives", active.length);

  const finalPoints: { x: number; y: number }[] = [];
  for (let i = 0; i < grid.length; i++) {
    if (grid[i]) {
      finalPoints.push(indexToCoords(i));
    }
  }
  return finalPoints;
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
    const newPoint = { x, y };
    if (x + y * sliderWidth >= grid.length || x + y * sliderWidth < 0) continue;
    // check if the point has enough space
    if (isValidPoint(newPoint, iconSize, grid, sliderWidth)) {
      return newPoint.x + newPoint.y * sliderWidth;
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
      if (ix === point.x && iy === point.y) continue; // same point
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

const [sliderWidth, sliderHeight] = [20, 20];
const points = getBridsonPoissonDisk(30, sliderHeight, sliderWidth, 4);
console.log("Length", points.length);
const grid = new Array(50 * 100).fill(false);
for (let p of points) {
  grid[p.x + p.y * sliderWidth] = true;
}
for (let y = 0; y < sliderHeight; y++) {
  for (let x = 0; x < sliderWidth; x++) {
    process.stdout.write(grid[x + y * sliderWidth] ? "#" : " ");
  }
  process.stdout.write("\n");
}
