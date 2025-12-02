// Arkanoid Clone - Game Configuration
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    backgroundColor: '#1a1a2e',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// Global game variables
let paddle;
let ball;
let bricks;
let cursors;
let score = 0;
let scoreText;
let livesText;
let levelText;
let lives = 3;
let level = 1;
let ballSpeed = 200;
let gameStarted = false;
let startText;
let gameScene;
let ballBrickCollider;

// Initialize the Phaser game
const game = new Phaser.Game(config);

function preload() {
    // Create bomb texture programmatically instead of loading SVG
    // This will be created in the create function
}

function create() {
    // Store scene reference
    gameScene = this;
    
    // Create bomb texture programmatically
    const graphics = this.add.graphics();
    graphics.fillStyle(0x2c3e50, 1);
    graphics.fillRoundedRect(0, 0, 70, 25, 3);
    
    // Bomb body
    graphics.fillStyle(0x1a1a1a, 1);
    graphics.fillCircle(35, 12.5, 7);
    
    // Highlight
    graphics.fillStyle(0x7f8c8d, 0.6);
    graphics.fillCircle(33, 10, 2);
    
    // Fuse (using lineTo instead of quadraticCurveTo)
    graphics.lineStyle(2, 0xe74c3c);
    graphics.beginPath();
    graphics.moveTo(35, 5);
    graphics.lineTo(38, 2);
    graphics.lineTo(40, 0);
    graphics.strokePath();
    
    // Spark
    graphics.fillStyle(0xf39c12, 1);
    graphics.fillCircle(40, 0, 2);
    
    graphics.generateTexture('bomb', 70, 25);
    graphics.destroy();
    
    // Create spring texture programmatically
    const springGraphics = this.add.graphics();
    springGraphics.fillStyle(0x16a085, 1);
    springGraphics.fillRoundedRect(0, 0, 70, 25, 3);
    
    // Draw spring coils
    springGraphics.lineStyle(3, 0x1abc9c);
    for (let i = 0; i < 5; i++) {
        const startX = 15 + i * 10;
        const y = 12.5;
        springGraphics.beginPath();
        springGraphics.arc(startX, y, 5, Math.PI, 0, false);
        springGraphics.strokePath();
    }
    
    // Draw spring base lines
    springGraphics.lineStyle(2, 0x0e8c73);
    springGraphics.beginPath();
    springGraphics.moveTo(10, 12.5);
    springGraphics.lineTo(15, 12.5);
    springGraphics.strokePath();
    springGraphics.beginPath();
    springGraphics.moveTo(55, 12.5);
    springGraphics.lineTo(60, 12.5);
    springGraphics.strokePath();
    
    springGraphics.generateTexture('spring', 70, 25);
    springGraphics.destroy();
    
    // Create paddle
    paddle = this.add.rectangle(400, 550, 100, 20, 0x4a90e2);
    this.physics.add.existing(paddle);
    paddle.body.setImmovable(true);
    paddle.body.setCollideWorldBounds(true);

    // Create ball
    ball = this.add.circle(400, 530, 8, 0xffffff);
    this.physics.add.existing(ball);
    ball.body.setCollideWorldBounds(true);
    ball.body.setBounce(1, 1);
    ball.body.setVelocity(0, 0);
    ball.body.onWorldBounds = true;
    
    // Listen for ball hitting bottom boundary
    this.physics.world.on('worldbounds', (body) => {
        if (body.gameObject === ball && body.blocked.down) {
            lives--;
            livesText.setText('Lives: ' + lives);
            
            if (lives === 0) {
                gameOver.call(this);
            } else {
                resetBallAndBricks.call(this);
            }
        }
    });

    // Create bricks
    createBricks.call(this);

    // Enable cursor keys for paddle control
    cursors = this.input.keyboard.createCursorKeys();

    // Add mouse/touch control
    this.input.on('pointermove', (pointer) => {
        paddle.x = Phaser.Math.Clamp(pointer.x, 50, 750);
    });

    // Setup collisions
    this.physics.add.collider(ball, paddle, hitPaddle, null, this);
    ballBrickCollider = this.physics.add.collider(ball, bricks, hitBrick, null, this);

    // Score text
    scoreText = this.add.text(16, 16, 'Score: 0', {
        fontSize: '24px',
        fill: '#fff',
        fontFamily: 'Arial'
    });

    // Lives text
    livesText = this.add.text(680, 16, 'Lives: ' + lives, {
        fontSize: '24px',
        fill: '#fff',
        fontFamily: 'Arial'
    });

    // Level text
    levelText = this.add.text(350, 16, 'Level: ' + level, {
        fontSize: '24px',
        fill: '#fff',
        fontFamily: 'Arial'
    });

    // Start instruction text
    startText = this.add.text(400, 300, 'Click or Press SPACE to Start', {
        fontSize: '28px',
        fill: '#fff',
        fontFamily: 'Arial'
    });
    startText.setOrigin(0.5);

    // Start game on space or click
    this.input.keyboard.on('keydown-SPACE', startGame, this);
    this.input.on('pointerdown', startGame, this);
}

function update() {
    if (!gameStarted) {
        return;
    }

    // Keyboard paddle control
    if (cursors.left.isDown) {
        paddle.x -= 8;
        paddle.x = Math.max(50, paddle.x);
    } else if (cursors.right.isDown) {
        paddle.x += 8;
        paddle.x = Math.min(750, paddle.x);
    }
}

function createBricks() {
    bricks = this.physics.add.staticGroup();

    const brickWidth = 70;
    const brickHeight = 25;
    const colors = [0xe74c3c, 0xe67e22, 0xf39c12, 0x2ecc71, 0x3498db, 0x9b59b6];
    
    // Track bomb positions to prevent adjacent bombs
    const bombPositions = new Set();
    
    // Helper function to check if adjacent positions have bombs
    const hasAdjacentBomb = (gridX, gridY) => {
        const offsets = [
            {dx: -1, dy: 0}, {dx: 1, dy: 0},
            {dx: 0, dy: -1}, {dx: 0, dy: 1},
            {dx: -1, dy: -1}, {dx: 1, dy: -1},
            {dx: -1, dy: 1}, {dx: 1, dy: 1}
        ];
        for (const offset of offsets) {
            if (bombPositions.has(`${gridX + offset.dx},${gridY + offset.dy}`)) {
                return true;
            }
        }
        return false;
    };

    // Different level layouts
    const layouts = [
        // Level 1: Classic rows
        () => {
            const rows = 5;
            const cols = 10;
            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    const x = 55 + col * (brickWidth + 5);
                    const y = 80 + row * (brickHeight + 5);
                    const rand = Math.random();
                    // 15% chance for bomb brick (if no adjacent bombs), 10% for spring brick
                    if (rand < 0.15 && !hasAdjacentBomb(col, row)) {
                        const brick = this.add.image(x, y, 'bomb');
                        this.physics.add.existing(brick, true);
                        brick.setData('isBomb', true);
                        brick.setData('isSpring', false);
                        brick.setData('gridX', col);
                        brick.setData('gridY', row);
                        bricks.add(brick);
                        bombPositions.add(`${col},${row}`);
                    } else if (rand < 0.25) {
                        const brick = this.add.image(x, y, 'spring');
                        this.physics.add.existing(brick, true);
                        brick.setData('isBomb', false);
                        brick.setData('isSpring', true);
                        brick.setData('gridX', col);
                        brick.setData('gridY', row);
                        bricks.add(brick);
                    } else {
                        const brick = this.add.rectangle(x, y, brickWidth, brickHeight, colors[row]);
                        brick.setData('isBomb', false);
                        brick.setData('isSpring', false);
                        brick.setData('gridX', col);
                        brick.setData('gridY', row);
                        bricks.add(brick);
                    }
                }
            }
        },
        // Level 2: Pyramid
        () => {
            for (let row = 0; row < 8; row++) {
                const bricksInRow = 10 - row;
                for (let col = 0; col < bricksInRow; col++) {
                    const x = 55 + (row * 37.5) + col * (brickWidth + 5);
                    const y = 80 + row * (brickHeight + 5);
                    const rand = Math.random();
                    const gridX = col + row;
                    if (rand < 0.15 && !hasAdjacentBomb(gridX, row)) {
                        const brick = this.add.image(x, y, 'bomb');
                        this.physics.add.existing(brick, true);
                        brick.setData('isBomb', true);
                        brick.setData('isSpring', false);
                        brick.setData('gridX', gridX);
                        brick.setData('gridY', row);
                        bricks.add(brick);
                        bombPositions.add(`${gridX},${row}`);
                    } else if (rand < 0.25) {
                        const brick = this.add.image(x, y, 'spring');
                        this.physics.add.existing(brick, true);
                        brick.setData('isBomb', false);
                        brick.setData('isSpring', true);
                        brick.setData('gridX', gridX);
                        brick.setData('gridY', row);
                        bricks.add(brick);
                    } else {
                        const brick = this.add.rectangle(x, y, brickWidth, brickHeight, colors[row % colors.length]);
                        brick.setData('isBomb', false);
                        brick.setData('isSpring', false);
                        brick.setData('gridX', gridX);
                        brick.setData('gridY', row);
                        bricks.add(brick);
                    }
                }
            }
        },
        // Level 3: Checkerboard
        () => {
            const rows = 6;
            const cols = 10;
            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    if ((row + col) % 2 === 0) {
                        const x = 55 + col * (brickWidth + 5);
                        const y = 80 + row * (brickHeight + 5);
                        const rand = Math.random();
                        if (rand < 0.15) {
                            const brick = this.add.image(x, y, 'bomb');
                            this.physics.add.existing(brick, true);
                            brick.setData('isBomb', true);
                            brick.setData('isSpring', false);
                            brick.setData('gridX', col);
                            brick.setData('gridY', row);
                            bricks.add(brick);
                        } else if (rand < 0.25) {
                            const brick = this.add.image(x, y, 'spring');
                            this.physics.add.existing(brick, true);
                            brick.setData('isBomb', false);
                            brick.setData('isSpring', true);
                            brick.setData('gridX', col);
                            brick.setData('gridY', row);
                            bricks.add(brick);
                        } else {
                            const brick = this.add.rectangle(x, y, brickWidth, brickHeight, colors[row % colors.length]);
                            brick.setData('isBomb', false);
                            brick.setData('isSpring', false);
                            brick.setData('gridX', col);
                            brick.setData('gridY', row);
                            bricks.add(brick);
                        }
                    }
                }
            }
        },
        // Level 4: Diamond
        () => {
            const centerRow = 4;
            for (let row = 0; row < 9; row++) {
                const distance = Math.abs(row - centerRow);
                const bricksInRow = 9 - distance * 2;
                for (let col = 0; col < bricksInRow; col++) {
                    const x = 55 + (distance * (brickWidth + 5)) + col * (brickWidth + 5);
                    const y = 80 + row * (brickHeight + 5);
                    const rand = Math.random();
                    const gridX = col + distance;
                    if (rand < 0.15 && !hasAdjacentBomb(gridX, row)) {
                        const brick = this.add.image(x, y, 'bomb');
                        this.physics.add.existing(brick, true);
                        brick.setData('isBomb', true);
                        brick.setData('isSpring', false);
                        brick.setData('gridX', gridX);
                        brick.setData('gridY', row);
                        bricks.add(brick);
                        bombPositions.add(`${gridX},${row}`);
                    } else if (rand < 0.25) {
                        const brick = this.add.image(x, y, 'spring');
                        this.physics.add.existing(brick, true);
                        brick.setData('isBomb', false);
                        brick.setData('isSpring', true);
                        brick.setData('gridX', gridX);
                        brick.setData('gridY', row);
                        bricks.add(brick);
                    } else {
                        const brick = this.add.rectangle(x, y, brickWidth, brickHeight, colors[distance % colors.length]);
                        brick.setData('isBomb', false);
                        brick.setData('isSpring', false);
                        brick.setData('gridX', gridX);
                        brick.setData('gridY', row);
                        bricks.add(brick);
                    }
                }
            }
        },
        // Level 5: Walls
        () => {
            const rows = 7;
            const cols = 10;
            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    if (col === 0 || col === 9 || row < 3) {
                        const x = 55 + col * (brickWidth + 5);
                        const y = 80 + row * (brickHeight + 5);
                        const rand = Math.random();
                        if (rand < 0.15 && !hasAdjacentBomb(col, row)) {
                            const brick = this.add.image(x, y, 'bomb');
                            this.physics.add.existing(brick, true);
                            brick.setData('isBomb', true);
                            brick.setData('isSpring', false);
                            brick.setData('gridX', col);
                            brick.setData('gridY', row);
                            bricks.add(brick);
                            bombPositions.add(`${col},${row}`);
                        } else if (rand < 0.25) {
                            const brick = this.add.image(x, y, 'spring');
                            this.physics.add.existing(brick, true);
                            brick.setData('isBomb', false);
                            brick.setData('isSpring', true);
                            brick.setData('gridX', col);
                            brick.setData('gridY', row);
                            bricks.add(brick);
                        } else {
                            const brick = this.add.rectangle(x, y, brickWidth, brickHeight, colors[row % colors.length]);
                            brick.setData('isBomb', false);
                            brick.setData('isSpring', false);
                            brick.setData('gridX', col);
                            brick.setData('gridY', row);
                            bricks.add(brick);
                        }
                    }
                }
            }
        },
        // Level 6: Cross pattern
        () => {
            const rows = 7;
            const cols = 10;
            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    if (col === 4 || col === 5 || row === 3) {
                        const x = 55 + col * (brickWidth + 5);
                        const y = 80 + row * (brickHeight + 5);
                        const rand = Math.random();
                        if (rand < 0.15 && !hasAdjacentBomb(col, row)) {
                            const brick = this.add.image(x, y, 'bomb');
                            this.physics.add.existing(brick, true);
                            brick.setData('isBomb', true);
                            brick.setData('isSpring', false);
                            brick.setData('gridX', col);
                            brick.setData('gridY', row);
                            bricks.add(brick);
                            bombPositions.add(`${col},${row}`);
                        } else if (rand < 0.25) {
                            const brick = this.add.image(x, y, 'spring');
                            this.physics.add.existing(brick, true);
                            brick.setData('isBomb', false);
                            brick.setData('isSpring', true);
                            brick.setData('gridX', col);
                            brick.setData('gridY', row);
                            bricks.add(brick);
                        } else {
                            const brick = this.add.rectangle(x, y, brickWidth, brickHeight, colors[(row + col) % colors.length]);
                            brick.setData('isBomb', false);
                            brick.setData('isSpring', false);
                            brick.setData('gridX', col);
                            brick.setData('gridY', row);
                            bricks.add(brick);
                        }
                    }
                }
            }
        }
    ];

    // Get current level layout (cycle through layouts if level exceeds available layouts)
    const layoutIndex = (level - 1) % layouts.length;
    layouts[layoutIndex].call(this);

    bricks.refresh();
}

function startGame() {
    if (!gameStarted) {
        gameStarted = true;
        startText.setVisible(false);
        ball.body.setVelocity(ballSpeed, -ballSpeed);
    }
}

function hitPaddle(ball, paddle) {
    // Add some variation to ball direction based on where it hits the paddle
    const diff = ball.x - paddle.x;
    ball.body.setVelocityX(diff * 5);
}

function hitBrick(ball, brick) {
    const isBomb = brick.getData('isBomb');
    const isSpring = brick.getData('isSpring');
    const brickGridX = brick.getData('gridX');
    const brickGridY = brick.getData('gridY');
    
    brick.destroy();
    score += 10;
    scoreText.setText('Score: ' + score);
    
    // If it's a spring brick, send ball in random direction
    if (isSpring) {
        const angle = Math.random() * Math.PI * 2; // Random angle 0 to 360 degrees
        const speed = Math.sqrt(ball.body.velocity.x ** 2 + ball.body.velocity.y ** 2); // Maintain current speed
        ball.body.setVelocity(
            Math.cos(angle) * speed,
            Math.sin(angle) * speed
        );
    }
    
    // If it's a bomb brick, destroy all 8 surrounding bricks
    if (isBomb) {
        // Explosion effect - destroy all surrounding bricks
        const surroundingOffsets = [
            {dx: -1, dy: 0},   // left
            {dx: 1, dy: 0},    // right
            {dx: 0, dy: -1},   // up
            {dx: 0, dy: 1},    // down
            {dx: -1, dy: -1},  // up-left
            {dx: 1, dy: -1},   // up-right
            {dx: -1, dy: 1},   // down-left
            {dx: 1, dy: 1}     // down-right
        ];
        
        // Destroy all surrounding bricks in all 8 directions
        surroundingOffsets.forEach(offset => {
            bricks.children.entries.forEach(otherBrick => {
                if (otherBrick && otherBrick.active) {
                    const otherX = otherBrick.getData('gridX');
                    const otherY = otherBrick.getData('gridY');
                    
                    // Check if brick is in this direction
                    if (otherX === brickGridX + offset.dx && 
                        otherY === brickGridY + offset.dy) {
                        otherBrick.destroy();
                        score += 10;
                        scoreText.setText('Score: ' + score);
                    }
                }
            });
        });
    }

    // Check if all bricks are destroyed
    if (bricks.countActive() === 0) {
        winGame.call(this);
    }
}

function resetBallAndBricks() {
    gameStarted = false;
    ball.setPosition(400, 530);
    ball.body.setVelocity(0, 0);
    
    // Recreate all bricks
    bricks.clear(true, true);
    createBricks.call(this);
    
    // Destroy old collider and create new one
    if (ballBrickCollider) {
        ballBrickCollider.destroy();
    }
    ballBrickCollider = gameScene.physics.add.collider(ball, bricks, hitBrick, null, gameScene);
    
    startText.setText('Click or Press SPACE to Continue');
    startText.setVisible(true);
}

function gameOver() {
    gameStarted = false;
    ball.body.setVelocity(0, 0);
    
    const gameOverText = this.add.text(400, 300, 'GAME OVER', {
        fontSize: '48px',
        fill: '#e74c3c',
        fontFamily: 'Arial',
        fontStyle: 'bold'
    });
    gameOverText.setOrigin(0.5);
    
    const restartText = this.add.text(400, 360, 'Press R to Restart', {
        fontSize: '24px',
        fill: '#fff',
        fontFamily: 'Arial'
    });
    restartText.setOrigin(0.5);
    
    this.input.keyboard.on('keydown-R', () => {
        this.scene.restart();
        score = 0;
        lives = 3;
        level = 1;
        ballSpeed = 200;
        gameStarted = false;
    });
}

function winGame() {
    gameStarted = false;
    ball.body.setVelocity(0, 0);
    
    // Advance to next level
    level++;
    ballSpeed = Math.floor(ballSpeed * 1.25); // Increase speed by 25%
    
    const winText = this.add.text(400, 250, 'LEVEL ' + (level - 1) + ' COMPLETE!', {
        fontSize: '48px',
        fill: '#2ecc71',
        fontFamily: 'Arial',
        fontStyle: 'bold'
    });
    winText.setOrigin(0.5);
    
    const nextLevelText = this.add.text(400, 320, 'Next: Level ' + level, {
        fontSize: '32px',
        fill: '#fff',
        fontFamily: 'Arial'
    });
    nextLevelText.setOrigin(0.5);
    
    const speedText = this.add.text(400, 370, 'Speed: ' + ballSpeed, {
        fontSize: '24px',
        fill: '#f39c12',
        fontFamily: 'Arial'
    });
    speedText.setOrigin(0.5);
    
    const continueText = this.add.text(400, 420, 'Press SPACE to Continue', {
        fontSize: '24px',
        fill: '#fff',
        fontFamily: 'Arial'
    });
    continueText.setOrigin(0.5);
    
    // Reset ball position and recreate bricks for next level
    ball.setPosition(400, 530);
    bricks.clear(true, true);
    createBricks.call(this);
    
    // Update level text
    levelText.setText('Level: ' + level);
    
    // Destroy old collider and create new one
    if (ballBrickCollider) {
        ballBrickCollider.destroy();
    }
    ballBrickCollider = gameScene.physics.add.collider(ball, bricks, hitBrick, null, gameScene);
    
    // Set up continue to next level
    const spaceKey = this.input.keyboard.addKey('SPACE');
    spaceKey.once('down', () => {
        winText.destroy();
        nextLevelText.destroy();
        speedText.destroy();
        continueText.destroy();
        startGame();
    });
}
