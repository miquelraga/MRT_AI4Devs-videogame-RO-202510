# 🎮 Arkanoid Clone - How to Play

## 🎯 Objective
Break all the bricks on the screen to advance to the next level. Complete as many levels as you can before running out of lives!

## 🕹️ Controls

### Paddle Movement
- **Mouse/Touch:** Move your cursor or finger across the screen - the paddle follows automatically
- **Arrow Keys:** Use ← (Left) and → (Right) arrow keys to move the paddle
- **Note:** The paddle cannot move beyond the screen boundaries

### Game Actions
- **SPACE or Click:** Launch the ball to start playing or continue after losing a life
- **R Key:** Restart the game after Game Over

## 🧱 Brick Types

### 🔵 Normal Bricks
- **Appearance:** Colored rectangles (red, orange, yellow, green, blue, purple)
- **Points:** 10 points per brick
- **Behavior:** Break on impact with the ball

### 💣 Bomb Bricks
- **Appearance:** Dark brick with bomb icon (black bomb with red fuse and orange spark)
- **Spawn Rate:** 15% chance
- **Special Effect:** When hit, destroys all 8 surrounding bricks (up, down, left, right, and diagonals)
- **Points:** 10 points for the bomb + 10 points for each destroyed surrounding brick
- **Note:** Bombs never spawn adjacent to each other

### 🔄 Spring Bricks
- **Appearance:** Teal/green brick with spring coil pattern
- **Spawn Rate:** 10% chance
- **Special Effect:** Sends the ball in a completely random direction (0-360 degrees)
- **Points:** 10 points
- **Strategy:** Adds unpredictability - use with caution!

## 📊 Game Information

### Lives System
- **Starting Lives:** 3
- **Lose a Life:** When the ball falls below the paddle and hits the bottom of the screen
- **After Losing a Life:** 
  - All bricks are recreated in the same level pattern
  - Ball resets to starting position
  - Press SPACE or click to continue

### Level Progression
The game features **6 unique level layouts** that cycle continuously:

1. **Level 1 - Classic Rows:** Traditional horizontal rows of bricks
2. **Level 2 - Pyramid:** Triangular pyramid formation
3. **Level 3 - Checkerboard:** Alternating brick pattern
4. **Level 4 - Diamond:** Diamond-shaped formation
5. **Level 5 - Walls:** Side walls with top rows
6. **Level 6 - Cross:** Plus sign pattern

After Level 6, the patterns repeat but with increased difficulty.

### Difficulty Scaling
- **Ball Speed:** Increases by 25% after completing each level
  - Level 1: 200 pixels/second
  - Level 2: 250 pixels/second
  - Level 3: 312 pixels/second
  - Level 4: 390 pixels/second
  - And so on...

### Scoring
- Each brick destroyed: **10 points**
- Bomb explosions destroy multiple bricks for bonus points
- Score accumulates across all levels

## 💡 Tips & Strategies

1. **Aim for Bomb Bricks:** Strategically hit bombs to clear large sections of bricks quickly
2. **Be Cautious with Springs:** Spring bricks can help or hinder - the random direction can be unpredictable
3. **Paddle Positioning:** Try to position the paddle to angle the ball toward remaining bricks
4. **Edge Hits:** Hitting the ball on the paddle's edges changes its horizontal velocity for better control
5. **Speed Management:** As levels progress, anticipate faster ball movement and adjust your reflexes

## 🎬 Getting Started

1. Open `index.html` in any modern web browser
2. The game will load automatically
3. Click anywhere or press SPACE to launch the first ball
4. Use mouse/touch or arrow keys to control the paddle
5. Break all bricks to advance!

## 🎮 Game Over & Restart

- **Game Over:** Occurs when you lose all 3 lives
- **Restart:** Press **R** key to start a new game
- **Reset Values:** Score returns to 0, lives reset to 3, level resets to 1, ball speed resets to 200

## 🏆 Challenge Yourself

- Try to achieve the highest score possible
- See how many levels you can complete before the ball becomes too fast
- Master the art of using bomb bricks strategically
- Adapt to the unpredictability of spring bricks

---

**Good luck and have fun playing Arkanoid!** 🚀
