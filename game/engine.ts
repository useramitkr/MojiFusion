// game/engine.ts
export const GRID_SIZE = 4;

export function initBoard(): number[][] {
  const board = Array(GRID_SIZE)
    .fill(null)
    .map(() => Array(GRID_SIZE).fill(0));

  addRandomTile(board);
  addRandomTile(board);
  return board;
}

function addRandomTile(board: number[][]) {
  const empty: [number, number][] = [];
  board.forEach((row, i) =>
    row.forEach((cell, j) => {
      if (cell === 0) empty.push([i, j]);
    })
  );
  if (empty.length > 0) {
    const [i, j] = empty[Math.floor(Math.random() * empty.length)];
    board[i][j] = Math.random() < 0.9 ? 2 : 4;
  }
}

function rotateBoard(board: number[][]) {
  const size = board.length;
  const newBoard = Array(size)
    .fill(null)
    .map(() => Array(size).fill(0));
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      newBoard[i][j] = board[j][size - 1 - i];
    }
  }
  return newBoard;
}

function moveLeft(board: number[][]) {
  let gained = 0;
  const newBoard = board.map((row) => {
    const filtered = row.filter((x) => x !== 0);
    const merged: number[] = [];
    for (let i = 0; i < filtered.length; i++) {
      if (filtered[i] === filtered[i + 1]) {
        merged.push(filtered[i] * 2);
        gained += filtered[i] * 2;
        i++;
      } else {
        merged.push(filtered[i]);
      }
    }
    while (merged.length < GRID_SIZE) merged.push(0);
    return merged;
  });
  return { newBoard, gained };
}

export function moveBoard(
  board: number[][],
  direction: "up" | "down" | "left" | "right"
) {
  let newBoard = board.map((row) => [...row]);
  let gained = 0;

  const rotateTimes =
    direction === "up" ? 1 : direction === "right" ? 2 : direction === "down" ? 3 : 0;

  for (let i = 0; i < rotateTimes; i++) newBoard = rotateBoard(newBoard);

  const result = moveLeft(newBoard);
  newBoard = result.newBoard;
  gained = result.gained;

  for (let i = 0; i < (4 - rotateTimes) % 4; i++)
    newBoard = rotateBoard(newBoard);

  if (JSON.stringify(board) !== JSON.stringify(newBoard)) {
    addRandomTile(newBoard);
  }

  return { newBoard, gained };
}
