const { canMove, TILE_SIZE } = require('./game-logic');

// Mock map: 1 is wall, 0 is path
const mockMap = [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
];

function test() {
    console.log("Running Movement Tests...");

    // Test 1: Can move in open space
    const pos1 = { x: TILE_SIZE, y: TILE_SIZE }; // Tile (1,1)
    console.assert(canMove(mockMap, pos1.x, pos1.y, 'RIGHT') === true, "Should move RIGHT from (1,1)");
    console.assert(canMove(mockMap, pos1.x, pos1.y, 'DOWN') === true, "Should move DOWN from (1,1)");
    console.assert(canMove(mockMap, pos1.x, pos1.y, 'UP') === false, "Should NOT move UP from (1,1)");

    // Test 2: Stuck at wall?
    // If Pac-Man is at x=19, y=20 (nearly at the edge of tile 0,0)
    const pos2 = { x: 19, y: 20 }; 
    console.log(`Pos 2: x=${pos2.x}, y=${pos2.y} | UP: ${canMove(mockMap, pos2.x, pos2.y, 'UP')}, DOWN: ${canMove(mockMap, pos2.x, pos2.y, 'DOWN')}, LEFT: ${canMove(mockMap, pos2.x, pos2.y, 'LEFT')}, RIGHT: ${canMove(mockMap, pos2.x, pos2.y, 'RIGHT')}`);
    
    // Test 3: Intersection check
    // Tile (1,1) is open. Let's see if we can move in all valid directions.
    const pos3 = { x: TILE_SIZE + 5, y: TILE_SIZE + 5 };
    console.assert(canMove(mockMap, pos3.x, pos3.y, 'RIGHT') === true, "Should move RIGHT from center of (1,1)");
    console.assert(canMove(mockMap, pos3.x, pos3.y, 'DOWN') === true, "Should move DOWN from center of (1,1)");
    
    console.log("Tests completed.");
}

test();
