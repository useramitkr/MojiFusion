// Enhanced game/engine.ts with special tile combinations and animations
export const GRID_SIZE = 4;

// Special tile constants
export const SPECIAL_TILES = {
  BOMB: -1,
  COIN: -2,
  REWARD: -3, // This is the key emoji
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
        const rand = Math.random();
        if (rand < 0.85) {
          board[i][j] = 2;
        } else if (rand < 0.95) {
          board[i][j] = 4;
        } else if (rand < 0.97) {
          board[i][j] = SPECIAL_TILES.COIN;
        } else if (rand < 0.99) {
          board[i][j] = SPECIAL_TILES.REWARD;
        } else {
          board[i][j] = SPECIAL_TILES.BOMB;
        }
      }
    }
  } catch (error) {
    console.error("Error adding random tile:", error);
  }
}

function getBoardHighestTiles(board: number[][]): number[] {
  const regularTiles = board.flat().filter(val => val > 0);
  const uniqueTiles = [...new Set(regularTiles)].sort((a, b) => b - a);
  return uniqueTiles;
}

function handleSpecialCombination(tile1: number, tile2: number, board: number[][]): number {
  const highestTiles = getBoardHighestTiles(board);
  
  if (tile1 === SPECIAL_TILES.COIN && tile2 === SPECIAL_TILES.COIN) return highestTiles[2] || 16;
  if (tile1 === SPECIAL_TILES.REWARD && tile2 === SPECIAL_TILES.REWARD) return highestTiles[0] || 64;
  if ((tile1 === SPECIAL_TILES.COIN && tile2 === SPECIAL_TILES.REWARD) || (tile1 === SPECIAL_TILES.REWARD && tile2 === SPECIAL_TILES.COIN)) return highestTiles[3] || 32;
  if (tile1 === SPECIAL_TILES.BOMB && tile2 === SPECIAL_TILES.BOMB) return highestTiles[0] || 128;
  if ((tile1 === SPECIAL_TILES.BOMB && tile2 === SPECIAL_TILES.COIN) || (tile1 === SPECIAL_TILES.COIN && tile2 === SPECIAL_TILES.BOMB)) {
    const mediumTiles = [32, 64, 128];
    return mediumTiles[Math.floor(Math.random() * mediumTiles.length)];
  }
  if ((tile1 === SPECIAL_TILES.BOMB && tile2 === SPECIAL_TILES.REWARD) || (tile1 === SPECIAL_TILES.REWARD && tile2 === SPECIAL_TILES.BOMB)) {
    const highTiles = [128, 256, 512];
    return highTiles[Math.floor(Math.random() * highTiles.length)];
  }
  return 0;
}

function rotateBoard(board: number[][]): number[][] {
  const size = board.length;
  const newBoard = Array(size).fill(null).map(() => Array(size).fill(0));
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      newBoard[i][j] = board[j][size - 1 - i];
    }
  }
  return newBoard;
}

function moveLeft(board: number[][]): { newBoard: number[][]; gained: number; specialEffects: any[]; newAnimations: any[]; coinsGained: number } {
    let gained = 0;
    const specialEffects: any[] = [];
    const newAnimations: any[] = [];
    let coinsGained = 0;

    const newBoard = board.map((row, rowIndex) => {
        const filtered = row.filter((x) => x !== 0);
        const merged: number[] = [];
        for (let i = 0; i < filtered.length; i++) {
            const current = filtered[i];
            if (i + 1 < filtered.length) {
                const next = filtered[i + 1];
                let mergedSpecial = false;

                if (current < 0 || next < 0) {
                    const specialResult = handleSpecialCombination(current, next, board);
                    if (specialResult > 0) {
                        merged.push(specialResult);
                        gained += specialResult;
                        const position = { row: rowIndex, col: merged.length - 1 };
                        specialEffects.push({ type: 'special_merge', tile1: current, tile2: next, result: specialResult, bonus: specialResult });
                        
                        // Prioritize key animation
                        if (current === SPECIAL_TILES.REWARD || next === SPECIAL_TILES.REWARD) {
                            newAnimations.push({ id: `anim_${Date.now()}_${Math.random()}`, type: 'key', position });
                        } else if (current === SPECIAL_TILES.COIN && next === SPECIAL_TILES.COIN) {
                            coinsGained += 100;
                            newAnimations.push({ id: `anim_${Date.now()}_${Math.random()}`, type: 'coin', amount: 100, position });
                        } else if ((current === SPECIAL_TILES.COIN && next === SPECIAL_TILES.BOMB) || (current === SPECIAL_TILES.BOMB && next === SPECIAL_TILES.COIN)) {
                            coinsGained += 50;
                            newAnimations.push({ id: `anim_${Date.now()}_${Math.random()}`, type: 'coin', amount: 50, position });
                        } else if (current === SPECIAL_TILES.BOMB && next === SPECIAL_TILES.BOMB) {
                             newAnimations.push({ id: `anim_${Date.now()}_${Math.random()}`, type: 'fire', position });
                        }
                        i++;
                        mergedSpecial = true;
                    }
                }

                if (!mergedSpecial) {
                    if (current === next && current > 0) {
                        const mergedValue = current * 2;
                        merged.push(mergedValue);
                        gained += mergedValue;
                        i++;
                    } else {
                        merged.push(current);
                    }
                }
            } else {
                merged.push(current);
            }
        }
        while (merged.length < GRID_SIZE) {
            merged.push(0);
        }
        return merged;
    });

    return { newBoard, gained, specialEffects, newAnimations, coinsGained };
}

export function moveBoard(
  board: number[][],
  direction: "up" | "down" | "left" | "right"
): { newBoard: number[][]; gained: number; specialEffects: any[]; newAnimations: any[]; coinsGained: number } {
  try {
    let boardAfterRotation = board.map(row => [...row]);
    let gained = 0, specialEffects: any[] = [], coinsGained = 0;
    
    const rotateTimes = direction === "up" ? 1 : direction === "right" ? 2 : direction === "down" ? 3 : 0;
    for (let i = 0; i < rotateTimes; i++) boardAfterRotation = rotateBoard(boardAfterRotation);
    
    const result = moveLeft(boardAfterRotation);
    let boardAfterMove = result.newBoard;
    gained = result.gained;
    specialEffects = result.specialEffects;
    coinsGained = result.coinsGained;

    const newAnimations = result.newAnimations.map(anim => {
        const { row: r, col: c } = anim.position;
        let newPos = { row: r, col: c };

        if (direction === 'up') newPos = { row: 3 - c, col: r };
        else if (direction === 'right') newPos = { row: 3 - r, col: 3 - c };
        else if (direction === 'down') newPos = { row: c, col: 3 - r };
        
        return { ...anim, position: newPos };
    });

    for (let i = 0; i < (4 - rotateTimes) % 4; i++) boardAfterMove = rotateBoard(boardAfterMove);
    
    if (JSON.stringify(board) !== JSON.stringify(boardAfterMove)) addRandomTile(boardAfterMove);

    return { newBoard: boardAfterMove, gained, specialEffects, newAnimations, coinsGained };
  } catch (error) {
    console.error("Error in moveBoard:", error);
    return { newBoard: board, gained: 0, specialEffects: [], newAnimations: [], coinsGained: 0 };
  }
}
