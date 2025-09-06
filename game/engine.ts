// game/engine.ts
export const GRID_SIZE = 4;

export function initBoard(): number[][] {
  try {
    const board = Array(GRID_SIZE)
      .fill(null)
      .map(() => Array(GRID_SIZE).fill(0));

    addRandomTile(board);
    addRandomTile(board);
    return board;
  } catch (error) {
    console.error("Error initializing board:", error);
    // Return a fallback board
    return [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];
  }
}

function addRandomTile(board: number[][]) {
  try {
    if (!board || !Array.isArray(board) || board.length !== GRID_SIZE) {
      console.error("Invalid board in addRandomTile");
      return;
    }

    const empty: [number, number][] = [];
    board.forEach((row, i) => {
      if (Array.isArray(row)) {
        row.forEach((cell, j) => {
          if (cell === 0) empty.push([i, j]);
        });
      }
    });

    if (empty.length > 0) {
      const [i, j] = empty[Math.floor(Math.random() * empty.length)];
      if (board[i] && typeof board[i][j] === 'number') {
        board[i][j] = Math.random() < 0.9 ? 2 : 4;
      }
    }
  } catch (error) {
    console.error("Error adding random tile:", error);
  }
}

function rotateBoard(board: number[][]): number[][] {
  try {
    if (!board || !Array.isArray(board) || board.length === 0) {
      console.error("Invalid board in rotateBoard");
      return board;
    }

    const size = board.length;
    const newBoard = Array(size)
      .fill(null)
      .map(() => Array(size).fill(0));
    
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (board[j] && typeof board[j][size - 1 - i] === 'number') {
          newBoard[i][j] = board[j][size - 1 - i];
        } else {
          newBoard[i][j] = 0;
        }
      }
    }
    return newBoard;
  } catch (error) {
    console.error("Error rotating board:", error);
    return board;
  }
}

function moveLeft(board: number[][]): { newBoard: number[][]; gained: number } {
  try {
    if (!board || !Array.isArray(board)) {
      console.error("Invalid board in moveLeft");
      return { newBoard: board, gained: 0 };
    }

    let gained = 0;
    const newBoard = board.map((row) => {
      if (!Array.isArray(row)) {
        return Array(GRID_SIZE).fill(0);
      }

      const filtered = row.filter((x) => typeof x === 'number' && x !== 0);
      const merged: number[] = [];
      
      for (let i = 0; i < filtered.length; i++) {
        if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
          merged.push(filtered[i] * 2);
          gained += filtered[i] * 2;
          i++; // Skip the next element as it's been merged
        } else {
          merged.push(filtered[i]);
        }
      }
      
      while (merged.length < GRID_SIZE) {
        merged.push(0);
      }
      
      return merged;
    });
    
    return { newBoard, gained };
  } catch (error) {
    console.error("Error in moveLeft:", error);
    return { newBoard: board, gained: 0 };
  }
}

export function moveBoard(
  board: number[][],
  direction: "up" | "down" | "left" | "right"
): { newBoard: number[][]; gained: number } {
  try {
    if (!board || !Array.isArray(board)) {
      console.error("Invalid board in moveBoard");
      return { newBoard: initBoard(), gained: 0 };
    }

    if (!["up", "down", "left", "right"].includes(direction)) {
      console.error("Invalid direction in moveBoard:", direction);
      return { newBoard: board, gained: 0 };
    }

    // Deep clone the board to avoid mutations
    let newBoard = board.map((row) => Array.isArray(row) ? [...row] : Array(GRID_SIZE).fill(0));
    let gained = 0;

    const rotateTimes =
      direction === "up" ? 1 : direction === "right" ? 2 : direction === "down" ? 3 : 0;

    // Rotate board
    for (let i = 0; i < rotateTimes; i++) {
      newBoard = rotateBoard(newBoard);
    }

    // Move left
    const result = moveLeft(newBoard);
    newBoard = result.newBoard;
    gained = result.gained;

    // Rotate back
    for (let i = 0; i < (4 - rotateTimes) % 4; i++) {
      newBoard = rotateBoard(newBoard);
    }

    // Add new tile if the board changed
    const boardChanged = JSON.stringify(board) !== JSON.stringify(newBoard);
    if (boardChanged) {
      addRandomTile(newBoard);
    }

    return { newBoard, gained };
  } catch (error) {
    console.error("Error in moveBoard:", error);
    return { newBoard: board, gained: 0 };
  }
}