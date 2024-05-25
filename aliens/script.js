const Scene = require("Scene"); // This si how to load in modules
const Diagnostics = require("Diagnostics");
const Patches = require("Patches");
const Persitence = require("Persistence");
const Reactive = require("Reactive");

(async function () {
  // Enables async/await in JS [part 1]

  // To access the scene objects
  const [
    livesText,
    scoreText,
    highScoreText,
    blueAlien1,
    blueAlien2,
    pinkAlien1,
  ] = await Promise.all([
    Scene.root.findFirst("livesText"),
    Scene.root.findFirst("scoreText"),
    Scene.root.findFirst("highScoreText"),

    // Obtain signals from the patch editor
    Patches.outputs.getPulse("BlueAlien1"),
    Patches.outputs.getPulse("BlueAlien2"),
    Patches.outputs.getPulse("PinkAlien1"),
  ]);

  // Set initial text in the UI
  livesText.text = "Lives: 3";
  scoreText.text = "Score: 0";

  // Set initial values for the rest of the variables
  let score = 0;
  let lives = 3;
  let highScore = 0;
  let updatedScoreText = "";

  try {
    // To get user scope data stored as 'highScore'
    highScore = await Persitence.userScope.get("highScore");

    // Check if there is a highScore data to be displayed in the console
    if (highScore) {
      Diagnostics.log("Score from previous session: " + highScore.value);
    }
  } catch (error) {
    // Display errors in the console
    Diagnostics.log("Error: " + error);
  }

  // Score points incrementally
  function scorePoints() {
    score++;

    Diagnostics.log("Score: " + score);

    // Display the score dynamically
    scoreText.text = "Score: " + score.toString();

    // Save current score as high score
    Persitence.userScope.set("highScore", { value: score });
  }

  // Lose life
  function loseLives() {
    lives--;

    Diagnostics.log("Lives: " + lives);

    // Display number of lives dynamically
    livesText.text = "Lives: " + lives.toString();

    // Check if the game is over
    if (lives === 0) {
      // If yes, hide the lives and score texts
      livesText.hidden = scoreText.hidden = true;

      // Set the score to be the comparison between high score and current score
      if (highScore && highScore.value > score) {
        updatedScoreText = `Your score was higher in the previous session: ${highScore.value}`;
      } else {
        updatedScoreText = `This is your new high score: ${score}`;
      }

      // Display the updated score message
      highScoreText.text = updatedScoreText;

      // Send pulse to the patch editor to indicate the game is over
      Patches.inputs.setPulse("GameOver", Reactive.once());
    }
  }

  // Execute function every time a signal is sent from the patch editor to the script
  blueAlien1.subscribe(scorePoints);
  blueAlien2.subscribe(scorePoints);
  pinkAlien1.subscribe(loseLives);
})(); // Enables async/await in JS [part 2] -- call the function immediately
