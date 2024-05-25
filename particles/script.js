import { TouchGestures } from "TouchGestures";
import { Scene } from "Scene";
import { Animation } from "Animation";
import { FaceTracking } from "FaceTracking";

const parameters = {
  durationMilliseconds: 800,
  loopCount: Infinity,
  mirror: true,
};

(async function () {
  try {
    // Particle code: it will emit particles when a screen is tapped
    const emitter = await Scene.root.findFirst("emitter0");
    TouchGestures.onTap().subscribe(() => emitter);

    // Animation code
    const text = Scene.root.findFirst("Cylinder");
    // Create a driver to start the animation
    const driver = Animation.timeDriver(parameters);
    driver.start();
    // Create a sampler to define the sample rate, or speed of the animation
    const sampler = Animation.samplers.easeInBounce(1.0, 1.2);
    // Combine driver and sampler
    const animation = Animation.animate(driver, sampler);
    // Apply the animation to the desired object
    text.transform.scaleX = animation;
    text.transform.scaleY = animation;
    text.transform.scaleZ = animation;

    // We want to emit the text effect on mouthOpen
    const mouthTreshold = FaceTracking.face(0).mouth.opennesss;
    const valueDriver = Animation.valueDriver(mouthTreshold, 0.1, 0.5);
    // Create a sampler
    const valueSampler = Animation.samplers.linear(0, 1.0);
    // Combine driver and sampler to create the animation
    const mouthAnimation = Animation.animate(driver, sampler);
    // Apply the animation to the text object
    text.transform.scaleX = animation;
    text.transform.scaleZ = animation;
    text.transform.scaleY = animation;
  } catch (error) {
    console.log(error);
  }
})();
