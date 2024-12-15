const path = "inputs/day15.txt";
const file = Bun.file(path);

const text = await file.text();

enum Direction {
  North = "N",
  East = "E",
  South = "S",
  West = "W",
}

type Position = {
  x: number;
  y: number;
};

function mapInput(input: string) {
  switch (input) {
    case "<":
      return Direction.West;
    case ">":
      return Direction.East;
    case "^":
      return Direction.North;
    case "v":
      return Direction.South;
    default:
      throw new Error("Invalid input");
  }
}

const [firstPart, secondPart] = text.split("\n\n");

const instructions = secondPart.split("\n").join("").split("").map(mapInput);

const grid = firstPart.split("\n").map((line) => line.split(""));

let charaPos = { x: 0, y: 0 };

for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[y].length; x++) {
    if (grid[y][x] === "@") {
      charaPos = { x, y };
      break;
    }
  }
}

function move(pos: Position, direction: Direction): boolean {
  let nextPos = { ...pos };
  switch (direction) {
    case Direction.North:
      nextPos.y -= 1;
      break;
    case Direction.South:
      nextPos.y += 1;
      break;
    case Direction.West:
      nextPos.x -= 1;
      break;
    case Direction.East:
      nextPos.x += 1;
      break;
  }
  const neighbourValue = grid[nextPos.y][nextPos.x];
  if (neighbourValue === "#") {
    return false;
  }
  if (
    neighbourValue === "." ||
    (neighbourValue === "O" && move(nextPos, direction))
  ) {
    const value = grid[pos.y][pos.x];
    grid[nextPos.y][nextPos.x] = value;
    if (value === "@") {
      charaPos = nextPos;
    }
    grid[pos.y][pos.x] = ".";
    return true;
  }
  return false;
}
for (const instruction of instructions) {
  move(charaPos, instruction);
}

let total = 0;
for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[y].length; x++) {
    if (grid[y][x] === "O") {
      total += x + 100 * y;
    }
  }
}

console.log(total);

function display() {
  for (const row of grid) {
    console.log(row.join(""));
  }
}
