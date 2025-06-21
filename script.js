// Variables to control game state
let gameRunning = false; // Keeps track of whether game is active or not
let dropMaker; // Will store our timer that creates drops regularly
let timer = 30;
let timerInterval;
let score = 0;

const DIFFICULTY_SETTINGS = {
  easy:   { time: 40, dropRate: 700, winScore: 15 }, // Faster drops for Easy
  normal: { time: 30, dropRate: 700, winScore: 20 }, // Match dropRate to Easy
  hard:   { time: 20, dropRate: 700,  winScore: 30 }
};

let difficulty = 'normal';
let winScore = DIFFICULTY_SETTINGS[difficulty].winScore;

// Wait for button click to start the game
document.getElementById("start-btn").addEventListener("click", startGame);

function startGame() {
  // Prevent multiple games from running at once
  if (gameRunning) return;

  gameRunning = true;
  timer = DIFFICULTY_SETTINGS[difficulty].time;
  winScore = DIFFICULTY_SETTINGS[difficulty].winScore;
  updateTimer();
  updateGoalDisplay();
  score = 0;
  updateScore();

  // Start countdown timer
  timerInterval = setInterval(() => {
    timer--;
    updateTimer();
    if (timer <= 0) {
      clearInterval(timerInterval);
      clearInterval(dropMaker);
      gameRunning = false;
      setTimeout(() => {
        if (score >= winScore) {
          alert('You win!');
        } else {
          alert('Time is up! Try again.');
        }
      }, 100);
    }
  }, 1000);

  // Create new drops at the selected rate
  dropMaker = setInterval(createDrop, DIFFICULTY_SETTINGS[difficulty].dropRate);
}

function updateTimer() {
  document.getElementById('time').textContent = timer;
}

function updateGoalDisplay() {
  document.getElementById('goal-display').textContent = `Goal: ${winScore} points`;
}

function updateScore(feedback) {
  const scoreElem = document.getElementById('score');
  scoreElem.textContent = score;
  if (feedback === 'plus') {
    scoreElem.classList.add('score-plus');
    setTimeout(() => scoreElem.classList.remove('score-plus'), 300);
  } else if (feedback === 'minus') {
    scoreElem.classList.add('score-minus');
    setTimeout(() => scoreElem.classList.remove('score-minus'), 300);
  }
}

function createDrop() {
  // Create a new div element that will be our water drop
  const drop = document.createElement("div");
  drop.className = "water-drop";

  // Randomly decide if this is a blue or brown drop (50/50 chance)
  const isBrown = Math.random() < 0.5;
  if (isBrown) {
    drop.classList.add('brown-drop');
  }

  // Make drops different sizes for visual variety
  const initialWidth = 60;
  const sizeMultiplier = Math.random() * 0.8 + 0.5;
  const width = initialWidth * sizeMultiplier;
  const height = width * 1.33; // Keep teardrop aspect ratio
  drop.style.setProperty('--drop-width', `${width}px`);
  drop.style.setProperty('--drop-height', `${height}px`);
  drop.style.width = `${width}px`;
  drop.style.height = `${height}px`;

  // Position the drop randomly across the game width
  // Subtract max width to keep drops fully inside the container
  const gameWidth = document.getElementById("game-container").offsetWidth;
  const xPosition = Math.random() * (gameWidth - width);
  drop.style.left = xPosition + "px";

  // Make drops fall for 4 seconds
  drop.style.animationDuration = "4s";

  // Add the new drop to the game screen
  document.getElementById("game-container").appendChild(drop);

  // Add click event for interactivity
  drop.addEventListener("click", () => {
    if (isBrown) {
      score--;
      updateScore('minus');
    } else {
      score++;
      updateScore('plus');
    }
    drop.remove();
  });

  // Remove drops that reach the bottom (weren't clicked)
  drop.addEventListener("animationend", () => {
    drop.remove(); // Clean up drops that weren't caught
  });
}

// Difficulty setting change listener
document.getElementById('difficulty').addEventListener('change', (e) => {
  difficulty = e.target.value;
  winScore = DIFFICULTY_SETTINGS[difficulty].winScore;
  updateGoalDisplay();
});
