const Scene = require("Scene")
const Patches = require("Patches")
const Persistence = require("Persistence")
const Reactive = require("Reactive")
const Diagnostics = require("Diagnostics")

(async function() {

  // Fetch the objects we want from the Scene
  const [livesText, scoreText, highScoreText, blA1, blA2, pinkA, updatedScoreText] = await Promise.all([
    Scene.root.findFirst("livesText"),
    Scene.root.findFirst("scoreText"),
    Scene.root.findFirst("highScoreText"),
    Scene.root.findFirst("updatedScoreText"),

    Patches.outputs.getPulse("BlueAlien1"),
    Patches.outputs.getPulse("BlueAlien2"),
    Patches.outputs.getPulse("PinkAlien1"),
  ])

  // Set initial values for our objects
  let score = 0
  let lives = 3
  scoreText.text = `Score: ${score}`
  livesText.text = `Lives: ${lives}`
  let highScore = 0
  let updatedScore = ""

  try {
    // Show the score if played previously
    // Get previous score from the Persistence code block
    highScore = await Persistence.userScope.get("highScore")

    if (highScore) {
      updatedScoreText.text = `Previous highest score: ${highScore.value}`
    }
  } catch(err) {
    Diagnostics.console.log(err);
  }

  function incrementScore() {
    score++
  }

  function decrementLives() {
    if (lives === 0) {

      // Hide the text in the UI
      scoreText.hidden = true
      livesText.hidden = true

      // Show the score
      if (highScore && highScore.value > score) {
        updatedScoreText = `Previous high score: ${highScore.value}`
      } else {
        updatedScoreText = `Your new high score: ${highScore.value}`
      }

      highScoreText.text = updatedScoreText
      Patches.inputs.setPulse("GameOver", Reactive.once())
    }
    lives--
  }

  // Associate these objects with a handler function
  // Note: the onTap() event was set up via the path editor
  blA1.subscribe(incrementScore)
  blA2.subscribe(incrementScore)
  pinkA.subscribe(decrementLives)
})()

/*

  Note: It is possible to send signals from the patch editor into the script

  Effects can be developed in both ways

  - By sending variables from the patch editor into the script
  - Access the variables defined in the editor in your script via the Patches module

  - Or by sending variables from the script into the editor
  - Register script variables via the editor (right panel)

   - Score increases when one taps on `blueA`
   - We then access the score text
   - We create a permanent variable for the score, via Persistence
   - When the tap signal is received, fire the incrementScore() function

*/
