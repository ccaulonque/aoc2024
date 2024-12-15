const path = "../inputs/day1.txt";
const file = Bun.file(path);

const text = await file.text();

const columnA: number[] = [];
const columnB: number[] = [];
for (const line of text.split("\n")) {
  if (line) {
    const [_, left, right] = line.match(/(\d+)\s+(\d+)/);
    columnA.push(parseInt(left));
    columnB.push(parseInt(right));
  }
}

let totalSimilarity = 0;

columnA.forEach((a, i) => {
  const simi = columnB.filter((b) => b === a).length;
  totalSimilarity += simi * a;
});

console.log("total", totalSimilarity);
