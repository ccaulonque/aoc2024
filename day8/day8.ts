const path = "../inputs/day8.txt";
const file = Bun.file(path);

const text = await file.text();

const lines = text.split("\n");

const antennasSet = new Set<string>();
const takenPositions = new Set<string>();
const antennasMap = new Map<string, Position[]>();
let width = 0;
let height = lines.length;
let total = 0;

lines.forEach((line, y) => {
  const chars = line.split("");
  width = chars.length;
  chars.forEach((char, x) => {
    if (char !== ".") {
      const pos = new Position(x, y);
      antennasSet.add(char);
      takenPositions.add(pos.toString());
      total++;
      antennasMap.set(char, [...(antennasMap.get(char) || []), pos]);
    }
  });
});

antennasSet.forEach((antenna) => {
  const allPositions = antennasMap.get(antenna) ?? [];
  for (let i = 0; i < allPositions.length - 1; i++) {
    const pos1 = allPositions[i];
    for (let j = i + 1; j < allPositions.length; j++) {
      const pos2 = allPositions[j];
      const diffX = pos1.x - pos2.x;
      const diffY = pos1.y - pos2.y;
      let newX1 = pos1.x;
      let newY1 = pos1.y;
      while (true) {
        newX1 += diffX;
        newY1 += diffY;
        if (newX1 < 0 || newX1 >= width || newY1 < 0 || newY1 >= height) {
          break;
        }
        const newPos1 = new Position(newX1, newY1, height, width);
        if (!takenPositions.has(newPos1.toString())) {
          total++;
          takenPositions.add(newPos1.toString());
        }
      }
      let newX2 = pos1.x;
      let newY2 = pos1.y;
      while (true) {
        newX2 -= diffX;
        newY2 -= diffY;
        if (newX2 < 0 || newX2 >= width || newY2 < 0 || newY2 >= height) {
          break;
        }
        const newPos2 = new Position(newX2, newY2, height, width);
        if (!takenPositions.has(newPos2.toString())) {
          total++;
          takenPositions.add(newPos2.toString());
        }
      }
    }
  }
});
console.log(total);

class Position {
  private _x: number;
  private _y: number;
  constructor(x: number, y: number, height?: number, width?: number) {
    if (typeof height !== "undefined" && typeof width !== "undefined") {
      if (x < 0 || x >= width || y < 0 || y >= height) {
        throw new Error(`Position (${x}, ${y}) is out of bounds`);
      }
    }
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
