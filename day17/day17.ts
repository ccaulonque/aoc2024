const path = "../inputs/day17.txt";
const file = Bun.file(path);
const text = await file.text();

const state = {
  A: 62769524,
  B: 0,
  C: 0,
  pointer: 0,
};

const numbers = text.split(",").map(Number);
let output: number[] = [];

function getComboOperand(operand: number) {
  switch (operand) {
    case 0:
    case 1:
    case 2:
    case 3:
      return operand;
    case 4:
      return state.A;
    case 5:
      return state.B;
    case 6:
      return state.C;
    default:
      throw new Error(`Invalid operand ${operand}`);
  }
}

try {
  while (true) {
    const [opcode, operand] = numbers.slice(state.pointer, state.pointer + 2);
    switch (opcode) {
      case 0:
        adv(operand);
        break;
      case 1:
        bxl(operand);
        break;
      case 2:
        bst(operand);
        break;
      case 3:
        jnz(operand);
        break;
      case 4:
        bxc();
        break;
      case 5:
        out(operand);
        break;
      case 6:
        bdv(operand);
        break;
      case 7:
        cdv(operand);
        break;
      default:
        throw new Error(`Invalid opcode ${opcode}`);
    }
  }
} catch (e) {
  console.log(state);
  console.log(output.join(","));
}

function adv(operand: number) {
  const comboOperand = getComboOperand(operand);
  state.A = Math.floor(state.A / 2 ** comboOperand);
  state.pointer += 2;
}

function bxl(operand: number) {
  state.B = state.B ^ operand;
  state.pointer += 2;
}

function bst(operand: number) {
  const comboOperand = getComboOperand(operand);
  state.B = comboOperand % 8;
  state.pointer += 2;
}

function jnz(operand: number) {
  if (state.A === 0) {
    state.pointer += 2;
    return;
  }
  state.pointer = operand;
}

function bxc() {
  state.B = state.B ^ state.C;
  state.pointer += 2;
}

function out(operand: number) {
  const comboOperand = getComboOperand(operand);
  const res = comboOperand % 8;
  output.push(res);
  state.pointer += 2;
}

function bdv(operand: number) {
  const comboOperand = getComboOperand(operand);
  state.B = Math.floor(state.A / 2 ** comboOperand);
  state.pointer += 2;
}

function cdv(operand: number) {
  const comboOperand = getComboOperand(operand);
  state.C = Math.floor(state.A / 2 ** comboOperand);
  state.pointer += 2;
}
