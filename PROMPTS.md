# Arkanoid Clone Development - Prompts & Responses Log

## Project Overview
This document contains all the prompts used and responses received during the development of the Arkanoid Clone game using Phaser 3.

---

## Prompt 1: Framework Selection
**User Prompt:**
> Which one is the best framework/library for HTML5/CSS/Javascript browser platform game arkanoid clone?

**Response:**
Recommended **Phaser 3** as the best option because:
- Most popular 2D game framework for HTML5
- Built-in physics, collision detection, and sprite management
- Excellent documentation and large community
- Perfect for arcade-style games like Arkanoid
- Great performance

Alternative options mentioned: PixiJS, Kaboom.js, and Vanilla Canvas API.

---

## Prompt 2: Initial Project Setup
**User Prompt:**
> You are an expert game developer. Your task is to set up the structure for a lightweight Arkanoid Clone using Phaser 3, a popular HTML5 game framework. I don't want to write a line of code myself, so please handle all the necessary file creation and setup.
> 
> First, create the following project structure inside MRT-Arkanoid/
> - index.html
> - main.js
> - assets/
>   - images/
>   - audio/
> 
> Execute the necessary commands using Python to create these directories and files.
> Once the structure is created, populate index.html and main.js and verify Phaser is correctly added.

**Response:**
Created complete project structure with:
- **index.html**: Full HTML5 page with Phaser 3.70.0 loaded from CDN, gradient background styling
- **main.js**: Fully functional Arkanoid game with:
  - 5 rows × 10 columns of colorful bricks
  - Paddle controlled by mouse/touch or arrow keys
  - Ball physics with collision detection
  - Score tracking system (10 points per brick)
  - 3 lives system
  - Win/lose conditions
  - Restart functionality (Press R)
- **Directory structure**: Created using PowerShell commands

---

## Prompt 3: Lives System Implementation
**User Prompt:**
> You are an expert game developer. Your task is to continue setting up the lightweight Arkanoid Clone using Phaser 3. We have already created the basic project structure, and the initial HTML and JavaScript files are set up.
> 
> Next, we need to:
> 1. When ball touches bottom side player loses one live. Discount one live from lives.
> 2. When player loses one live, create all initial bricks
> 3. When result is equal zero shows game over.

**Response:**
Implemented lives management system:
- Modified `update()` function to check if ball y > 600
- Changed condition to `if (lives === 0)` for game over
- Created `resetBallAndBricks()` function that:
  - Resets ball position
  - Clears all existing bricks
  - Recreates full brick grid
  - Shows continue message

---

## Prompt 4: Ball Bottom Collision Fix
**User Prompt:**
> It doesn't work. The ball touches bottom part and no live is discounted

**Response:**
Fixed the collision detection issue:
- Problem: `setCollideWorldBounds(true)` prevented ball from falling below 600
- Solution: Added `ball.body.onWorldBounds = true` and created event listener for `worldbounds` event
- Listened for `body.blocked.down` to detect bottom boundary hit
- Removed old `if (ball.y > 600)` check from update function
- Lives now properly decrease when ball hits bottom

---

## Prompt 5: Brick Collision After Recreation
**User Prompt:**
> You are an expert game developer. Your task is to continue fixing the lightweight Arkanoid Clone using Phaser 3. We have already created the basic project structure, and the initial HTML and JavaScript files are set up. Also a live is discounted when ball hits bottom edge. But when all bricks are recreated the ball doesn't collide them

**Response:**
Fixed collision detection for recreated bricks:
- Added global variables: `gameScene` and `ballBrickCollider`
- Stored scene reference in `create()` function
- Stored collider reference: `ballBrickCollider = this.physics.add.collider(...)`
- In `resetBallAndBricks()`:
  - Destroyed old collider with `ballBrickCollider.destroy()`
  - Created new collider with fresh brick group
- Ball now properly collides with recreated bricks

---

## Prompt 6: Level System and Speed Increase
**User Prompt:**
> You are an expert game developer. Your task is to set up the structure for a lightweight Arkanoid Clone using Phaser 3, a popular HTML5 game framework. I don't want to write a line of code myself, so please handle all the necessary file change.
> 
> Next, we need when all bricks are broken:
> - Create different scenarios where bricks are in different position
> - Speed up the ball a 25%

**Response:**
Implemented level progression system:
- Added global variables: `level`, `levelText`, `ballSpeed = 200`
- Created **6 unique level layouts**:
  1. Classic rows
  2. Pyramid
  3. Checkerboard
  4. Diamond
  5. Walls (side walls + top rows)
  6. Cross pattern
- Modified `winGame()` to:
  - Increment level
  - Increase ball speed by 25% (`ballSpeed = Math.floor(ballSpeed * 1.25)`)
  - Show level complete screen with next level info
  - Recreate bricks with new pattern
  - Continue to next level on SPACE press
- Updated `gameOver()` to reset level and speed
- Levels cycle through patterns infinitely

---

## Prompt 7: Bomb Brick Implementation
**User Prompt:**
> You are an expert game developer. Your task is to set up the structure for a lightweight Arkanoid Clone using Phaser 3, a popular HTML5 game framework. I don't want to write a line of code myself, so please handle all the necessary file creation and setup.
> 
> Next, we need:
> Create a brick with a bomb image. When the ball collides with this bomb destroy all bricks surrounded it in any direction but in one position

**Response:**
Created bomb brick feature:
- Created SVG bomb image in `assets/images/bomb.svg`
- Added bomb texture loading in `preload()`
- Updated all 6 level layouts to include bomb bricks (15% spawn rate)
- Bomb bricks created with `this.add.image()` and physics enabled
- Added `isBomb` data flag to track bomb bricks
- Implemented explosion logic in `hitBrick()`:
  - Checks all 8 surrounding positions
  - Initially destroyed one brick in random direction (later updated to all 8)

---

## Prompt 8: Bomb Image Display and Full Explosion
**User Prompt:**
> You are an expert game developer. Your task is to set up the structure for a lightweight Arkanoid Clone using Phaser 3, a popular HTML5 game framework. I don't want to write a line of code myself, so please handle all the necessary file updates.
> 
> The image bomb is not properly shown
> When a bomb is hit break all eight possible bricks surrounded if there are still active

**Response:**
Fixed bomb display and explosion:
- Added `this.physics.add.existing(brick, true)` to each bomb brick creation (all 6 levels)
- Updated explosion logic to destroy ALL 8 surrounding bricks instead of one random direction
- Used `surroundingOffsets.forEach()` to check and destroy bricks in all directions
- Each destroyed brick awards 10 points

---

## Prompt 9: Programmatic Bomb Texture
**User Prompt:**
> Image bomb is not correctly seen

**Response:**
Replaced SVG loading with programmatic texture generation:
- Removed `this.load.svg()` from preload
- Created bomb texture in `create()` using Graphics API:
  - Dark gray rounded rectangle background (70x25)
  - Black circular bomb body
  - Gray highlight circle
  - Red fuse line using `lineTo()`
  - Orange spark circle
- Generated texture with `graphics.generateTexture('bomb', 70, 25)`

---

## Prompt 10: Graphics API Method Fix
**User Prompt:**
> Uncaught TypeError: graphics.quadraticCurveTo is not a function

**Response:**
Fixed graphics method error:
- Replaced `graphics.quadraticCurveTo()` with `graphics.lineTo()`
- Changed from curved fuse to angled line using two `lineTo()` calls
- Bomb texture now generates without errors

---

## Prompt 11: Spring Brick Implementation
**User Prompt:**
> You are an expert game developer. Your task is to set up the structure for a lightweight Arkanoid Clone using Phaser 3, a popular HTML5 game framework. I don't want to write a line of code myself, so please handle all the necessary file updates.
> 
> Create a brick with a spring. When ball hits the spring the ball should move to a random direction

**Response:**
Added spring brick feature:
- Created programmatic spring texture with Graphics API:
  - Teal/green rounded rectangle background
  - Spring coils drawn with arc loops
  - Base lines on left and right
- Generated texture: `springGraphics.generateTexture('spring', 70, 25)`
- Updated all 6 level layouts with spring brick logic:
  - 15% bomb chance
  - 10% spring chance (after bomb check)
  - 75% normal brick
- Added `isSpring` data flag to all bricks
- Modified `hitBrick()` to handle spring collision:
  - Calculates random angle (0 to 360 degrees)
  - Maintains current ball speed
  - Sets velocity in random direction using trigonometry

---

## Prompt 12: Prevent Adjacent Bombs
**User Prompt:**
> You are an expert game developer. Your task is to set up the structure for a lightweight Arkanoid Clone using Phaser 3, a popular HTML5 game framework. I don't want to write a line of code myself, so please handle all the necessary file updates.
> 
> Bombs can't be together

**Response:**
Implemented bomb separation system:
- Created `bombPositions` Set to track bomb locations
- Added `hasAdjacentBomb(gridX, gridY)` helper function:
  - Checks all 8 surrounding positions
  - Returns true if any adjacent position has a bomb
- Updated all 6 level layouts to check `!hasAdjacentBomb()` before placing bombs
- When bomb is placed, adds position to `bombPositions` Set
- Ensures minimum 1 brick spacing between all bombs

---

## Prompt 13: Game Instructions
**User Prompt:**
> Explain how to play

**Response:**
Created comprehensive instructions in HTML (later changed to separate file):
- Added styled instructions section above game container
- Included sections:
  - Objective
  - Controls (mouse, keyboard, touch)
  - Brick types (Normal, Bomb, Spring)
  - Game info (lives, levels, speed increase)
  - Tips and strategies

---

## Prompt 14: Instructions as Separate File
**User Prompt:**
> In a separate md create a instruction.md and explain how to play in this file

**Response:**
Created `INSTRUCTIONS.md` with detailed game guide:
- **Objective**: Break all bricks to advance
- **Controls**: Mouse/touch, arrow keys, SPACE, R key
- **Brick Types**: 
  - Normal (10 points)
  - Bomb (💣 destroys 8 surrounding, never adjacent)
  - Spring (🔄 random direction)
- **Game Information**:
  - Lives system (3 lives, bricks recreate on loss)
  - 6 level layouts with descriptions
  - 25% speed increase per level
  - Score accumulation
- **Tips & Strategies**
- **Getting Started** instructions
- **Game Over & Restart** details

---

## Prompt 15: Copy to Repository
**User Prompt:**
> Add all file to repository md_AI4DEV_videogame-RO-202510

**Response:**
Copied all game files to target repository:
- Used PowerShell `Copy-Item -Recurse` command
- Copied from `MRT-Arkanoid\*` to `MRT_AI4Devs-videogame-RO-202510\`
- Verified files: index.html, main.js, INSTRUCTIONS.md, assets/

---

## Prompt 16: Git Commit and Push
**User Prompt:**
> Commit to repository

**Response:**
Successfully committed and pushed to remote:
- Staged all changes with `git add .`
- Committed with message: "Add Arkanoid Clone game with Phaser 3 - Features: 6 levels, bomb bricks, spring bricks, progressive difficulty"
- Pushed to remote: `main -> main`
- **4 files changed**: 797 insertions
- Created files: INSTRUCTIONS.md, main.js, assets/images/bomb.svg
- Modified: index.html

---

## Technical Summary

### Final Game Features
1. **Core Gameplay**:
   - Paddle control (mouse/touch/keyboard)
   - Ball physics with bounce
   - Collision detection
   - Score system (10 points per brick)
   - Lives system (3 lives, reset on loss)

2. **Level System**:
   - 6 unique brick patterns
   - Progressive difficulty (25% speed increase)
   - Level cycling

3. **Special Bricks**:
   - Bomb bricks (15% spawn, destroys 8 surrounding, anti-cluster)
   - Spring bricks (10% spawn, random direction)
   - Normal bricks (75% spawn)

4. **UI/UX**:
   - Score display
   - Lives display
   - Level display
   - Start/continue prompts
   - Game over screen
   - Win/level complete screen

5. **Assets**:
   - Programmatically generated textures (bomb, spring)
   - Responsive design
   - Gradient background

### Technologies Used
- **Phaser 3.70.0**: Game framework
- **HTML5/CSS3**: Structure and styling
- **JavaScript ES6**: Game logic
- **Git**: Version control

### Total Development Time
Approximately 16 prompts over one session, with iterative fixes and feature additions.

---

*Document created: December 2, 2025*
