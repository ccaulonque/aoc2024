const path = "../inputs/day12.txt";
const file = Bun.file(path);

const text = await file.text();

const grid = text.split("\n").map((line) => line.split(""));

type Position = {
  x: number;
  y: number;
};

type Edge = {
  dirIndex: number;
} & Position;

const directions = [
  { x: 0, y: 1 },
  { x: 1, y: 0 },
  { x: 0, y: -1 },
  { x: -1, y: 0 },
];

const globalAreas = new Map<string, boolean>();

function inspectNeighbours(
  pos: Position,
  acc: Set<string> = new Set(),
  edges: Edge[] = [],
) {
  let peri = 0;
  const value = grid[pos.y][pos.x];
  globalAreas.set(JSON.stringify(pos), true);
  acc.add(JSON.stringify(pos));
  let i = 0;
  for (const direction of directions) {
    const newPos = { x: pos.x + direction.x, y: pos.y + direction.y };
    try {
      if (grid[newPos.y][newPos.x] === value) {
        if (!acc.has(JSON.stringify(newPos))) {
          const [subperi] = inspectNeighbours(newPos, acc, edges);
          peri += subperi;
        }
      } else {
        edges.push({ ...pos, dirIndex: i });
        peri++;
      }
    } catch {
      edges.push({ ...pos, dirIndex: i });
      peri++;
    }
    i++;
  }
  return [peri, acc.size, edges] as const;
}

let total = 0;

for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[0].length; x++) {
    const pos = { x, y };
    const done = globalAreas.get(JSON.stringify(pos));
    if (!done) {
      const [_, area, edges] = inspectNeighbours(pos);
      const sides = countSidesFromEdges(edges);
      total += sides * area;
    }
  }
}

console.log(total);

function countSidesFromEdges(edges: Edge[]) {
  let sides = 0;

  const downEdges = edges.filter((edge) => edge.dirIndex === 0);
  const rightEdges = edges.filter((edge) => edge.dirIndex === 1);
  const upEdges = edges.filter((edge) => edge.dirIndex === 2);
  const leftEdges = edges.filter((edge) => edge.dirIndex === 3);

  const uniqueDownEdgesY = new Set(downEdges.map((edge) => edge.y));
  const uniqueRightEdgesX = new Set(rightEdges.map((edge) => edge.x));
  const uniqueUpEdgesY = new Set(upEdges.map((edge) => edge.y));
  const uniqueLeftEdgesX = new Set(leftEdges.map((edge) => edge.x));

  for (const y of uniqueDownEdgesY) {
    const edges = downEdges.filter((edge) => edge.y === y);
    edges.sort((a, b) => a.x - b.x);
    sides += edges.reduce((acc, current, i, arr) => {
      if (i < 1) {
        return acc;
      }
      const isNewSegment = current.x - arr[i - 1].x > 1;
      if (isNewSegment) {
        return acc + 1;
      }
      return acc;
    }, 1);
  }

  for (const x of uniqueRightEdgesX) {
    const edges = rightEdges.filter((edge) => edge.x === x);
    edges.sort((a, b) => a.y - b.y);
    sides += edges.reduce((acc, current, i, arr) => {
      if (i < 1) {
        return acc;
      }
      const isNewSegment = current.y - arr[i - 1].y > 1;
      if (isNewSegment) {
        return acc + 1;
      }
      return acc;
    }, 1);
  }

  for (const y of uniqueUpEdgesY) {
    const edges = upEdges.filter((edge) => edge.y === y);
    edges.sort((a, b) => b.x - a.x);
    sides += edges.reduce((acc, current, i, arr) => {
      if (i < 1) {
        return acc;
      }
      const isNewSegment = arr[i - 1].x - current.x > 1;
      if (isNewSegment) {
        return acc + 1;
      }
      return acc;
    }, 1);
  }

  for (const x of uniqueLeftEdgesX) {
    const edges = leftEdges.filter((edge) => edge.x === x);
    edges.sort((a, b) => b.y - a.y);
    sides += edges.reduce((acc, current, i, arr) => {
      if (i < 1) {
        return acc;
      }
      const isNewSegment = arr[i - 1].y - current.y > 1;
      if (isNewSegment) {
        return acc + 1;
      }
      return acc;
    }, 1);
  }
  return sides;
}
