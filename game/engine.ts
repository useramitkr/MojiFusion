// Enhanced game/engine.ts with special tile combinations
export const GRID_SIZE = 4;

// Special tile constants
export const SPECIAL_TILES = {
  BOMB: -1,
  COIN: -2,
  REWARD: -3,
};

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
        // 90% chance for 2, 10% for 4, small chance for special tiles
        const rand = Math.random();
        if (rand < 0.85) {
          board[i][j] = 2;
        } else if (rand < 0.95) {
          board[i][j] = 4;
        } else if (rand < 0.97) {
          board[i][j] = SPECIAL_TILES.COIN; // 2% chance for coin
        } else if (rand < 0.99) {
          board[i][j] = SPECIAL_TILES.REWARD; // 2% chance for reward
        } else {
          board[i][j] = SPECIAL_TILES.BOMB; // 1% chance for bomb
        }
      }
    }
  } catch (error) {
    console.error("Error adding random tile:", error);
  }
}

// Get the highest tiles from current board
function getBoardHighestTiles(board: number[][]): number[] {
  const regularTiles = board.flat().filter(val => val > 0);
  const uniqueTiles = [...new Set(regularTiles)].sort((a, b) => b - a);
  return uniqueTiles;
}

// Handle special tile combinations
function handleSpecialCombination(tile1: number, tile2: number, board: number[][]): number {
  const highestTiles = getBoardHighestTiles(board);
  
  // Coin + Coin = 3rd highest emoji (or 16 if less than 3 tiles)
  if (tile1 === SPECIAL_TILES.COIN && tile2 === SPECIAL_TILES.COIN) {
    return highestTiles[2] || 16;
  }
  
  // Gift + Gift = Highest emoji (or 64 if no tiles)
  if (tile1 === SPECIAL_TILES.REWARD && tile2 === SPECIAL_TILES.REWARD) {
    return highestTiles[0] || 64;
  }
  
  // Coin + Gift = 4th highest emoji (or 32 if less than 4 tiles)
  if ((tile1 === SPECIAL_TILES.COIN && tile2 === SPECIAL_TILES.REWARD) ||
      (tile1 === SPECIAL_TILES.REWARD && tile2 === SPECIAL_TILES.COIN)) {
    return highestTiles[3] || 32;
  }
  
  // Bomb + Bomb = Clear and create highest tile
  if (tile1 === SPECIAL_TILES.BOMB && tile2 === SPECIAL_TILES.BOMB) {
    return highestTiles[0] || 128;
  }
  
  // Bomb + Coin = Random medium tile
  if ((tile1 === SPECIAL_TILES.BOMB && tile2 === SPECIAL_TILES.COIN) ||
      (tile1 === SPECIAL_TILES.COIN && tile2 === SPECIAL_TILES.BOMB)) {
    const mediumTiles = [32, 64, 128];
    return mediumTiles[Math.floor(Math.random() * mediumTiles.length)];
  }
  
  // Bomb + Gift = Random high tile
  if ((tile1 === SPECIAL_TILES.BOMB && tile2 === SPECIAL_TILES.REWARD) ||
      (tile1 === SPECIAL_TILES.REWARD && tile2 === SPECIAL_TILES.BOMB)) {
    const highTiles = [128, 256, 512];
    return highTiles[Math.floor(Math.random() * highTiles.length)];
  }
  
  return 0; // No combination possible
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

function moveLeft(board: number[][]): { newBoard: number[][]; gained: number; specialEffects: any[] } {
  try {
    if (!board || !Array.isArray(board)) {
      console.error("Invalid board in moveLeft");
      return { newBoard: board, gained: 0, specialEffects: [] };
    }

    let gained = 0;
    const specialEffects: any[] = [];
    
    const newBoard = board.map((row) => {
      if (!Array.isArray(row)) {
        return Array(GRID_SIZE).fill(0);
      }

      const filtered = row.filter((x) => typeof x === 'number' && x !== 0);
      const merged: number[] = [];
      
      for (let i = 0; i < filtered.length; i++) {
        if (i + 1 < filtered.length) {
          const current = filtered[i];
          const next = filtered[i + 1];
          
          // Check for special tile combinations
          if (current < 0 || next < 0) {
            const specialResult = handleSpecialCombination(current, next, board);
            if (specialResult > 0) {
              merged.push(specialResult);
              gained += specialResult;
              
              // Track special effect
              specialEffects.push({
                type: 'special_merge',
                tile1: current,
                tile2: next,
                result: specialResult,
                bonus: specialResult
              });
              
              i++; // Skip the next element as it's been merged
              continue;
            }
          }
          
          // Regular tile merging
          if (current === next && current > 0) {
            const mergedValue = current * 2;
            merged.push(mergedValue);
            gained += mergedValue;
            i++; // Skip the next element as it's been merged
          } else {
            merged.push(current);
          }
        } else {
          merged.push(filtered[i]);
        }
      }
      
      // Fill remaining positions with zeros
      while (merged.length < GRID_SIZE) {
        merged.push(0);
      }
      
      return merged;
    });
    
    return { newBoard, gained, specialEffects };
  } catch (error) {
    console.error("Error in moveLeft:", error);
    return { newBoard: board, gained: 0, specialEffects: [] };
  }
}

export function moveBoard(
  board: number[][],
  direction: "up" | "down" | "left" | "right"
): { newBoard: number[][]; gained: number; specialEffects: any[] } {
  try {
    if (!board || !Array.isArray(board)) {
      console.error("Invalid board in moveBoard");
      return { newBoard: initBoard(), gained: 0, specialEffects: [] };
    }

    if (!["up", "down", "left", "right"].includes(direction)) {
      console.error("Invalid direction in moveBoard:", direction);
      return { newBoard: board, gained: 0, specialEffects: [] };
    }

    // Deep clone the board to avoid mutations
    let newBoard = board.map((row) => Array.isArray(row) ? [...row] : Array(GRID_SIZE).fill(0));
    let gained = 0;
    let specialEffects: any[] = [];

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
    specialEffects = result.specialEffects;

    // Rotate back
    for (let i = 0; i < (4 - rotateTimes) % 4; i++) {
      newBoard = rotateBoard(newBoard);
    }

    // Add new tile if the board changed
    const boardChanged = JSON.stringify(board) !== JSON.stringify(newBoard);
    if (boardChanged) {
      addRandomTile(newBoard);
    }

    return { newBoard, gained, specialEffects };
  } catch (error) {
    console.error("Error in moveBoard:", error);
    return { newBoard: board, gained: 0, specialEffects: [] };
  }
}