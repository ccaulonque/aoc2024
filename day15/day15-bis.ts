const path = "../inputs/day15.txt";
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

enum Tile {
  Blank,
  Wall,
  Box,
}

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
let charaPos = { x: 0, y: 0 };

const grid = firstPart.split("\n").map((line, lineN) =>
  line.split("").reduce<string[]>((acc, current) => {
    if (current === "#") {
      acc.push("#", "#");
    }
    if (current === ".") {
      acc.push(".", ".");
    }
    if (current === "@") {
      charaPos = { x: acc.length, y: lineN };
      acc.push("@", ".");
    }
    if (current === "O") {
      acc.push("[", "]");
    }
    return acc;
  }, []),
);

function getTile(values: string[]): Tile {
  switch (true) {
    case values.includes("#"):
      return Tile.Wall;
    case values.includes("[") || values.includes("]"):
      return Tile.Box;
    default:
      return Tile.Blank;
  }
}

function getBoxPositions(pos: Position): [Position, Position] {
  const { x, y } = pos;
  if (grid[y][x] === "[") {
    return [
      { x, y },
      { x: x + 1, y },
    ];
  }
  return [
    { x: x - 1, y },
    { x, y },
  ];
}

function checkMoveBox(pos: Position, direction: Direction): boolean {
  if (grid[pos.y][pos.x] === ".") {
    return true;
  }
  const [boxPos1, boxPos2] = getBoxPositions(pos);
  if (direction === Direction.North) {
    const nextPos1 = { x: boxPos1.x, y: boxPos1.y - 1 };
    const nextPos2 = { x: boxPos2.x, y: boxPos2.y - 1 };
    const nextTile = getTile([
      grid[nextPos1.y][nextPos1.x],
      grid[nextPos2.y][nextPos2.x],
    ]);

    if (nextTile === Tile.Wall) {
      return false;
    }

    if (nextTile === Tile.Blank) {
      return true;
    }
    if (
      checkMoveBox(nextPos1, direction) &&
      checkMoveBox(nextPos2, direction)
    ) {
      return true;
    }
    return false;
  }

  if (direction === Direction.South) {
    const nextPos1 = { x: boxPos1.x, y: boxPos1.y + 1 };
    const nextPos2 = { x: boxPos2.x, y: boxPos2.y + 1 };
    const nextTile = getTile([
      grid[nextPos1.y][nextPos1.x],
      grid[nextPos2.y][nextPos2.x],
    ]);

    if (nextTile === Tile.Wall) {
      return false;
    }

    if (nextTile === Tile.Blank) {
      return true;
    }

    if (
      checkMoveBox(nextPos1, direction) &&
      checkMoveBox(nextPos2, direction)
    ) {
      return true;
    }
    return false;
  }
  return false;
}

function moveBox(pos: Position, direction: Direction): boolean {
  if (grid[pos.y][pos.x] === ".") {
    return true;
  }
  const [boxPos1, boxPos2] = getBoxPositions(pos);
  if (direction === Direction.East) {
    const nextPos = { x: boxPos2.x + 1, y: boxPos2.y };
    if (grid[nextPos.y][nextPos.x] === "#") {
      return false;
    }
    if (
      grid[nextPos.y][nextPos.x] === "." ||
      (getTile([grid[nextPos.y][nextPos.x]]) === Tile.Box &&
        moveBox(nextPos, direction))
    ) {
      grid[nextPos.y][nextPos.x] = "]";
      grid[boxPos2.y][boxPos2.x] = "[";
      grid[boxPos1.y][boxPos1.x] = ".";
      return true;
    }
    return false;
  }

  if (direction === Direction.West) {
    const nextPos = { x: boxPos1.x - 1, y: boxPos1.y };
    if (grid[nextPos.y][nextPos.x] === "#") {
      return false;
    }

    if (
      grid[nextPos.y][nextPos.x] === "." ||
      (getTile([grid[nextPos.y][nextPos.x]]) === Tile.Box &&
        moveBox(nextPos, direction))
    ) {
      grid[nextPos.y][nextPos.x] = "[";
      grid[boxPos1.y][boxPos1.x] = "]";
      grid[boxPos2.y][boxPos2.x] = ".";
      return true;
    }
  }

  if (direction === Direction.North) {
    const nextPos1 = { x: boxPos1.x, y: boxPos1.y - 1 };
    const nextPos2 = { x: boxPos2.x, y: boxPos2.y - 1 };
    const nextTile = getTile([
      grid[nextPos1.y][nextPos1.x],
      grid[nextPos2.y][nextPos2.x],
    ]);

    if (nextTile === Tile.Wall) {
      return false;
    }

    if (!checkMoveBox(pos, direction)) {
      return false;
    }

    if (
      nextTile === Tile.Blank ||
      (moveBox(nextPos1, direction) && moveBox(nextPos2, direction))
    ) {
      grid[nextPos1.y][nextPos1.x] = "[";
      grid[nextPos2.y][nextPos2.x] = "]";
      grid[boxPos1.y][boxPos1.x] = ".";
      grid[boxPos2.y][boxPos2.x] = ".";
      return true;
    }
    return false;
  }

  if (direction === Direction.South) {
    const nextPos1 = { x: boxPos1.x, y: boxPos1.y + 1 };
    const nextPos2 = { x: boxPos2.x, y: boxPos2.y + 1 };
    const nextTile = getTile([
      grid[nextPos1.y][nextPos1.x],
      grid[nextPos2.y][nextPos2.x],
    ]);

    if (nextTile === Tile.Wall) {
      return false;
    }

    if (!checkMoveBox(pos, direction)) {
      return false;
    }

    if (
      nextTile === Tile.Blank ||
      (moveBox(nextPos1, direction) && moveBox(nextPos2, direction))
    ) {
      grid[nextPos1.y][nextPos1.x] = "[";
      grid[nextPos2.y][nextPos2.x] = "]";
      grid[boxPos1.y][boxPos1.x] = ".";
      grid[boxPos2.y][boxPos2.x] = ".";
      return true;
    }
    return false;
  }
  return false;
}

function move(direction: Direction): boolean {
  let nextPos = { ...charaPos };
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
  const neighbourTile = getTile([grid[nextPos.y][nextPos.x]]);
  if (neighbourTile === Tile.Wall) {
    return false;
  }
  if (
    neighbourTile === Tile.Blank ||
    (neighbourTile === Tile.Box && moveBox(nextPos, direction))
  ) {
    grid[nextPos.y][nextPos.x] = "@";
    grid[charaPos.y][charaPos.x] = ".";
    charaPos = nextPos;
    return true;
  }
  return false;
}

for (const instruction of instructions) {
  move(instruction);
}

let total = 0;

for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[y].length; x++) {
    if (grid[y][x] === "[") {
      total += x + 100 * y;
    }
  }
}

console.log({ total });

function display() {
  for (const row of grid) {
    console.log(row.join(""));
  }
}
