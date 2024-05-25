import { Scene } from "Scene";
import { Animation } from "Animation";
import { FaceTracking } from "FaceTracking";
// import { Diagnostics } from "Diagnostics"; -> Use only for debugging purposes

const parameters = {
  durationMilliseconds: 800,
  loopCount: Infinity,
  mirror: true,
};

(async function () {
  try {
    // Code related to enabling the animation -- make the text rotate round
    const text = Scene.root.findFirst("Cylinder");
    // To drive/start the animation, we need a driver
    const driver = Animation.timeDriver(parameters);
    driver.start(); // Start the animation
    // Now, define a sampler
    const sampler = Animation.samplers.easeInBounce(1.0, 1.2);
    // Finally, combine driver and sampler to create an animation
    const animation = Animation.animate(driver, sampler);
    // Apply the animation into the desired object
    text.transform.scaleX = animation;
    text.transform.scaleY = animation;
    text.transform.scaleZ = animation;

    // Emit the text effect on the mouthOpen event
    const mouthTreshold = FaceTracking.face(0).mouth.opennesss;
    // Define the threshold for starting/stopping our animation
    const valueDriver = Animation.valueDriver(mouthTreshold, 0.1, 0.5);
    // Define the sampler
    const valueSampler = Animation.samplers.linear(0, 1.0);
    // Combine the driver and the sampler
    const mouthAnimation = Animation.animate(driver, sampler);
    // Apply our animation to the text object
    text.transform.scaleX = animation;
    text.transform.scaleZ = animation;
    text.transform.scaleY = animation;
  } catch (error) {
    console.log(error);
  }
})();
