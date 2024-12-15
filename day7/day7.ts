const path = "../inputs/day7.txt";
const file = Bun.file(path);

const text = await file.text();

function getCombinations(max: number): string[][] {
  const n = max.toString(3).length;
  const combi = [];
  for (let i = 0; i <= max; i++) {
    const val = i.toString(3);
    const padded = "0".repeat(n - val.length) + val;
    combi.push(padded.split(""));
  }
  return combi;
}

function getOperator(s: string) {
  if (s === "0") return "+";
  if (s === "1") return "*";
  return "";
}

function computeLine(operands: number[], combi: string[]): number {
  return operands.reduce((acc, operand, i) => {
    if (i === 0) {
      return operand;
    }
    return eval(`${acc}${getOperator(combi[i - 1])}${operand}`) as number;
  }, 0);
}

let total = 0;
let count = 0;

for (const line of text.split("\n")) {
  const [result, operandsStr] = line.split(": ");
  console.log("evaluating", result);
  const operands = operandsStr.split(" ").map(Number);

  const operationsN = operands.length - 1;
  const n = 3 ** operationsN - 1;
  const combis = getCombinations(n);
  for (const combi of combis) {
    const res = computeLine(operands, combi);
    if (res === Number(result)) {
      total += res;
      count++;
      break;
    }
  }
}
console.log(total);
console.log(count);
