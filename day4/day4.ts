const path = "../inputs/day4.txt";
const file = Bun.file(path);

const text = await file.text();

const grid: string[][] = [];

for (const line of text.split("\n")) {
  if (line) {
    // for each character in the line
    const row = [];
    for (const char of line) {
      row.push(char);
    }
    grid.push(row);
  }
}

let total = 0;

grid.forEach((row, y) => {
  row.forEach((_, x) => {
    const subtotal = check(grid, x, y) ? 1 : 0;
    total += subtotal;
  });
});

console.log(total);

function check(grid: string[][], x: number, y: number): boolean {
  try {
    if (grid[y][x] !== "A") return false;
    const topLeftBottomRight = new Set([
      grid[y][x],
      grid[y + 1][x + 1],
      grid[y - 1][x - 1],
    ]);
    const topRightBottomLeft = new Set([
      grid[y][x],
      grid[y + 1][x - 1],
      grid[y - 1][x + 1],
    ]);
    return ["M", "A", "S"].every(
      (letter) =>
        topLeftBottomRight.has(letter) && topRightBottomLeft.has(letter),
    );
  } catch {
    return false;
  }
}

// function getAllDirs(): [number, number][] {
//   const dirs: [number, number][] = [];
//   for (let i = -1; i <= 1; i++) {
//     for (let j = -1; j <= 1; j++) {
//       if (i !== 0 || j !== 0) {
//         dirs.push([i, j]);
//       }
//     }
//   }
//   return dirs;
// }

// function check(
//   grid: string[][],
//   x: number,
//   y: number,
//   [u, v]: [number, number],
// ): boolean {
//   try {
//     if (grid[y][x] !== "X") return false;
//     if (grid[y + u][x + v] !== "M") return false;
//     if (grid[y + 2 * u][x + 2 * v] !== "A") return false;
//     if (grid[y + 3 * u][x + 3 * v] !== "S") return false;
//     return true;
//   } catch {
//     return false;
//   }
// }
