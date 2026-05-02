const { canMove, TILE_SIZE } = require('./game-logic');

const mockMap = [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
];

function simulateMovement(player, nextDir, dir, speed) {
    // This is the logic from the current update() function
    if (nextDir !== 'STOP' && nextDir !== dir) {
        const centerX = Math.round(player.x / TILE_SIZE) * TILE_SIZE;
        const centerY = Math.round(player.y / TILE_SIZE) * TILE_SIZE;
        const distToCenter = Math.sqrt(Math.pow(player.x - centerX, 2) + Math.pow(player.y - centerY, 2));

        if (distToCenter < TILE_SIZE / 2) {
            if (canMove(mockMap, centerX, centerY, nextDir)) {
                player.x = centerX;
                player.y = centerY;
                dir = nextDir;
            }
        }
    }

    if (canMove(mockMap, player.x, player.y, dir)) {
        if (dir === 'UP') player.y -= speed;
        if (dir === 'DOWN') player.y += speed;
        if (dir === 'LEFT') player.x -= speed;
        if (dir === 'RIGHT') player.x += speed;
    }
    
    return { player, dir };
}

function test() {
    console.log("Testing Snapping Logic...");
    
    let player = { x: TILE_SIZE + 2, y: TILE_SIZE }; // Slightly offset from center of (1,1)
    let dir = 'RIGHT';
    let nextDir = 'DOWN';
    let speed = 2;

    console.log(`Start: x=${player.x}, y=${player.y}, dir=${dir}, nextDir=${nextDir}`);
    
    for (let i = 0; i < 10; i++) {
        const result = simulateMovement(player, nextDir, dir, speed);
        player = result.player;
        dir = result.dir;
        console.log(`Step ${i+1}: x=${player.x.toFixed(2)}, y=${player.y.toFixed(2)}, dir=${dir}`);
    }
}

test();
