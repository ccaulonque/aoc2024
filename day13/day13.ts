const path = "../inputs/day13.txt";
const file = Bun.file(path);

function gcd(a: number, b: number) {
  if (!b) {
    return a;
  }

  return gcd(b, a % b);
}

function arePrime(a: number, b: number) {
  return gcd(a, b) === 1;
}

// text input looks like this:
// Button A: X+94, Y+34
// Button B: X+22, Y+67
// Prize: X=8400, Y=5400

const text = await file.text();

const lines = text.split("\n");
const batches = [];
for (let i = 0; i < lines.length; i += 4) {
  batches.push(lines.slice(i, i + 3));
}

type Solution = {
  a: number;
  b: number;
  cost: number;
};

let total = 0;

for (const batch of batches) {
  const [buttonA, buttonB, prize] = batch;
  const [, buttonAPosX, buttonAPosY] = buttonA.match(/X\+(\d+), Y\+(\d+)/);
  const [, buttonBPosX, buttonBPosY] = buttonB.match(/X\+(\d+), Y\+(\d+)/);
  const [, prizeX, prizeY] = prize.match(/X=(\d+), Y=(\d+)/);

  const Px = Number(prizeX) + 10000000000000;
  const Py = Number(prizeY) + 10000000000000;
  const Ax = Number(buttonAPosX);
  const Ay = Number(buttonAPosY);
  const Bx = Number(buttonBPosX);
  const By = Number(buttonBPosY);

  const gcdX = gcd(Ax, Bx);
  const gcdY = gcd(Ay, By);

  const restX = Px % gcdX;
  const restY = Py % gcdY;

  if (restX || restY) {
    console.log("not solvable", { prizeX, prizeY });
    continue;
  }

  // ((Px - b*Bx)/Ax)*Ay + b*By = Py
  // b = (PxAy - PyAx) / (BxAy - ByAx)

  const b = (Px * Ay - Py * Ax) / (Bx * Ay - By * Ax);
  const a = (Px - b * Bx) / Ax;

  if (a < 0 || b < 0) {
    console.log("not solvable", { prizeX, prizeY });
    continue;
  }
  if (a % 1 || b % 1) {
    console.log("not solvable", { prizeX, prizeY });
    continue;
  }

  total += 3 * a + b;
}
console.log({ total });

function extendedEuclidean(a: number, b: number): [number, number] {
  const rest = a % b;
  const q = Math.floor(a / b);

  if (!rest) {
    return [0, 1];
  }

  const [x, y] = extendedEuclidean(b, rest);

  return [y, x - q * y];
}

function otherSolution(x1: number, y1: number, a: number, b: number, k = 2) {
  return [x1 + b * k, y1 - a * k];
}
