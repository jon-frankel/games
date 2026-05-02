const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');
const overlay = document.getElementById('overlay');
const messageElement = document.getElementById('message');
const restartBtn = document.getElementById('restart-btn');
const pauseOverlay = document.getElementById('pause-overlay');

// Game settings
canvas.width = 800;
canvas.height = 600;

const PLAYER_WIDTH = 50;
const PLAYER_HEIGHT = 30;
const PLAYER_SPEED = 5;
const BULLET_SPEED = 7;
const ALIEN_ROWS = 5;
const ALIEN_COLS = 11;
const ALIEN_WIDTH = 40;
const ALIEN_HEIGHT = 30;
const ALIEN_PADDING = 15;
const ALIEN_SPEED_START = 1;

let score = 0;
let lives = 3;
let gameRunning = true;
let isPaused = false;
let keys = {};

// Game entities
let player = {
    x: canvas.width / 2 - PLAYER_WIDTH / 2,
    y: canvas.height - 50,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
    color: '#0f0'
};

let bullets = [];
let alienBullets = [];
let aliens = [];
let alienDirection = 1;
let alienStepDown = false;
let alienSpeed = ALIEN_SPEED_START;

function initAliens() {
    aliens = [];
    for (let row = 0; row < ALIEN_ROWS; row++) {
        for (let col = 0; col < ALIEN_COLS; col++) {
            aliens.push({
                x: col * (ALIEN_WIDTH + ALIEN_PADDING) + 50,
                y: row * (ALIEN_HEIGHT + ALIEN_PADDING) + 50,
                width: ALIEN_WIDTH,
                height: ALIEN_HEIGHT,
                color: row === 0 ? '#f00' : (row < 3 ? '#ff0' : '#0ff'),
                alive: true
            });
        }
    }
}

function setKey(key, value) {
    keys[key] = value;
}

function shoot() {
    if (gameRunning && !isPaused) {
        bullets.push({
            x: player.x + player.width / 2 - 2,
            y: player.y,
            width: 4,
            height: 10,
            color: '#fff'
        });
    }
}

function drawPlayer(p) {
    ctx.font = '40px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🚀', p.x + p.width / 2, p.y + p.height / 2);
}

function drawAlien(a) {
    ctx.font = '30px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('👾', a.x + a.width / 2, a.y + a.height / 2);
}

function drawBullet(b) {
    ctx.fillStyle = b.color;
    ctx.fillRect(b.x, b.y, b.width, b.height);
}

function update() {
    if (!gameRunning || isPaused) return;

    // Player movement
    if (keys['ArrowLeft'] && player.x > 0) {
        player.x -= PLAYER_SPEED;
    }
    if (keys['ArrowRight'] && player.x < canvas.width - player.width) {
        player.x += PLAYER_SPEED;
    }

    // Bullets movement
    bullets.forEach((bullet, index) => {
        bullet.y -= BULLET_SPEED;
        if (bullet.y < 0) bullets.splice(index, 1);
    });

    alienBullets.forEach((bullet, index) => {
        bullet.y += BULLET_SPEED;
        if (bullet.y > canvas.height) alienBullets.splice(index, 1);
    });

    // Aliens movement
    let hitWall = false;
    aliens.forEach(alien => {
        if (!alien.alive) return;
        alien.x += alienSpeed * alienDirection;
        if (alien.x + alien.width > canvas.width || alien.x < 0) {
            hitWall = true;
        }
    });

    if (hitWall) {
        alienDirection *= -1;
        aliens.forEach(alien => {
            alien.y += 20;
            if (alien.y + alien.height >= player.y) {
                gameOver(false);
            }
        });
    }

    // Collision: Player bullets vs Aliens
    bullets.forEach((bullet, bIndex) => {
        aliens.forEach((alien, aIndex) => {
            if (alien.alive && 
                bullet.x < alien.x + alien.width &&
                bullet.x + bullet.width > alien.x &&
                bullet.y < alien.y + alien.height &&
                bullet.y + bullet.height > alien.y) {
                
                alien.alive = false;
                bullets.splice(bIndex, 1);
                score += 10;
                scoreElement.textContent = score;
                
                // Increase speed as aliens are destroyed
                const aliveCount = aliens.filter(a => a.alive).length;
                alienSpeed = ALIEN_SPEED_START + ( (ALIEN_ROWS * ALIEN_COLS - aliveCount) * 0.02 );
            }
        });
    });

    // Collision: Alien bullets vs Player
    alienBullets.forEach((bullet, bIndex) => {
        if (bullet.x < player.x + player.width &&
            bullet.x + bullet.width > player.x &&
            bullet.y < player.y + player.height &&
            bullet.y + bullet.height > player.y) {
            
            alienBullets.splice(bIndex, 1);
            lives--;
            livesElement.textContent = lives;
            if (lives <= 0) {
                gameOver(false);
            }
        }
    });

    // Alien shooting
    if (Math.random() < 0.02) {
        const aliveAliens = aliens.filter(a => a.alive);
        if (aliveAliens.length > 0) {
            const randomAlien = aliveAliens[Math.floor(Math.random() * aliveAliens.length)];
            alienBullets.push({
                x: randomAlien.x + randomAlien.width / 2 - 2,
                y: randomAlien.y + randomAlien.height,
                width: 4,
                height: 10,
                color: '#fff'
            });
        }
    }

    // Win condition
    if (aliens.filter(a => a.alive).length === 0) {
        gameOver(true);
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPlayer(player);

    bullets.forEach(bullet => drawBullet(bullet));
    alienBullets.forEach(bullet => drawBullet(bullet));
    aliens.forEach(alien => {
        if (alien.alive) drawAlien(alien);
    });
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

function gameOver(win) {
    gameRunning = false;
    messageElement.textContent = win ? "YOU WIN!" : "GAME OVER";
    messageElement.style.color = win ? "#0f0" : "#f00";
    overlay.classList.remove('hidden');
}

function restartGame() {
    score = 0;
    lives = 3;
    alienSpeed = ALIEN_SPEED_START;
    alienDirection = 1;
    scoreElement.textContent = score;
    livesElement.textContent = lives;
    bullets = [];
    alienBullets = [];
    initAliens();
    gameRunning = true;
    overlay.classList.add('hidden');
}

window.addEventListener('keydown', e => {
    keys[e.code] = true;
    if (e.code === 'KeyP') {
        togglePause();
    }
    if (e.code === 'Space' && gameRunning && !isPaused) {
        bullets.push({
            x: player.x + player.width / 2 - 2,
            y: player.y,
            width: 4,
            height: 10,
            color: '#fff'
        });
    }
});

function togglePause() {
    if (!gameRunning) return;
    isPaused = !isPaused;
    if (isPaused) {
        pauseOverlay.classList.remove('hidden');
    } else {
        pauseOverlay.classList.add('hidden');
    }
}

window.addEventListener('keyup', e => {
    keys[e.code] = false;
});

restartBtn.addEventListener('click', restartGame);

initAliens();
gameLoop();
