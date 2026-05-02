const TILE_SIZE = 20;
const COLS = 19;
const ROWS = 21;

function canMove(map, x, y, dir) {
    const col = Math.floor(x / TILE_SIZE);
    const row = Math.floor(y / TILE_SIZE);
    
    let nextCol = col;
    let nextRow = row;
    
    if (dir === 'UP') nextRow--;
    if (dir === 'DOWN') nextRow++;
    if (dir === 'LEFT') nextCol--;
    if (dir === 'RIGHT') nextCol++;

    // Handle tunnels (sides)
    if (nextCol < 0 || nextCol >= COLS) return true; 
    if (nextRow < 0 || nextRow >= ROWS) return false;

    const result = map[nextRow][nextCol] !== 1;
    // console.log(`canMove: x=${x}, y=${y}, dir=${dir}, nextCol=${nextCol}, nextRow=${nextRow}, result=${result}`);
    return result;
}

function getNextPosition(player, dir, speed) {
    let nextX = player.x;
    let nextY = player.y;
    if (dir === 'UP') nextY -= speed;
    if (dir === 'DOWN') nextY += speed;
    if (dir === 'LEFT') nextX -= speed;
    if (dir === 'RIGHT') nextX += speed;
    return { x: nextX, y: nextY };
}

module.exports = { canMove, getNextPosition, TILE_SIZE, COLS, ROWS };
