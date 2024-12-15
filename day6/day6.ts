const path = "../inputs/day6.txt";
const file = Bun.file(path);

const text = await file.text();

class Position {
  private _x: number;
  private _y: number;
  constructor(x: number, y: number) {
    this._x = x;
    this._y = y;
  }
  get x(): number {
    return this._x;
  }
  get y(): number {
    return this._y;
  }
  increase(direction: Position) {
    this._x += direction.x;
    this._y += direction.y;
  }
  toString() {
    return `(${this._x}-${this._y})`;
  }
}

const directions = [
  new Position(0, -1),
  new Position(1, 0),
  new Position(0, 1),
  new Position(-1, 0),
];

let d = 0;
function getDir() {
  return directions[d];
}
function changeDir() {
  d = (d + 1) % directions.length;
}

let start = new Position(0, 0);
const grid: string[][] = [];
let w = 0,
  h = 0;

text.split("\n").forEach((line, y, lines) => {
  w = line.length;
  h = lines.length;
  const s = line.split("");
  grid.push(s);
  s.forEach((char, x) => {
    if (char === "^") {
      start = new Position(x, y);
    }
  });
});

function peek(p: Position, grid: string[][]) {
  const dir = getDir();
  const newX = p.x + dir.x;
  const newY = p.y + dir.y;
  if (newX < 0 || newY < 0 || newX >= w || newY >= h) {
    throw new Error("Out of bounds");
  }
  return grid[newY][newX];
}
function move(p: Position, movements: Set<string>) {
  const dir = getDir();
  p.increase(dir);
  const str = p.toString() + dir.toString();
  if (movements.has(str)) {
    throw new Error("Loop detected");
  }
  movements.add(p.toString() + dir.toString());
}

let total = 0;

for (let i = 0; i < h; i++) {
  for (let j = 0; j < w; j++) {
    if (i === start.y && j === start.x) {
      continue;
    }
    const g = grid.map((line) => [...line]);
    g[50][1] = "#";
    d = 0;
    const movements = new Set<string>();

    try {
      let pos = new Position(start.x, start.y);
      movements.add(pos.toString() + getDir().toString());
      while (true) {
        const p = peek(pos, g);
        switch (p) {
          case "#":
            changeDir();
            break;
          case ".":
          case "^":
            move(pos, movements);
            break;
        }
      }
    } catch (e: any) {
      if ("message" in e && e.message === "Loop detected") {
        console.log(j, i);
        total++;
      }
    }
  }
}
