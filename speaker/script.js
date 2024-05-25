import Scene from "Scene";
import Animation from "Animation";
import TouchGestures from "TouchGestures";

/*

 Creating a scaling effect on the base

 We need to create the animation by:
 - Creating a driver, defining when and how to trigger the animation
 - Creating a sampler, specifying image rate etc.
 - Bind our driver to a given sampler as to create an Animation object
 - The animation is then applied onto an object we grabbed from our scene

*/

const sceneRoot = Scene.root;

// Accessing all scene objects at once
Promise.all([
  sceneRoot.findFirst("base_jnt"),
  sceneRoot.findFirst("speaker_left_jnt"),
  sceneRoot.findFirst("speaker_right_jnt"),
  sceneRoot.findFirst("planeTracker0"),
  sceneRoot.findFirst("placer"),
]).then((response) => {
  const base = response[0]; // Store each object into a local variable
  const speakerL = response[1];
  const speakerR = response[2];
  const planeTracker = response[3];
  const placer = response[4];

  // What we need to do:
  //  - Pass a driver to the base
  //  - Set up the animation within the scope of our base/floor

  // Configure the base driver
  const baseDriverParameters = {
    durationMilliseconds: 400,
    loopCount: Infinity,
    mirror: true,
  };

  // Configure the speaker driver
  const speakerDriverParameters = {
    durationMilliseconds: 200,
    loopCount: Infinity,
    mirror: true,
  };

  // Start the drivers
  const baseDriver = Animation.timeDriver(baseDriverParameters);
  const speakerDriver = Animation.timeDriver(speakerDriverParameters);
  baseDriver.start();
  speakerDriver.start();

  // Create samplers
  const baseSampler = Animation.samplers.easeInQuint(0.9, 1);
  const speakerSampler = Animation.samplers.easeOutElastic(0.7, 0.85);

  // Bind drivers to samplers in order to create animations
  const baseAnimation = Animation.animate(baseDriver, baseSampler);
  const speakerAnimation = Animation.animate(speakerDriver, speakerSampler);

  // Now, bind the animations to object coords (to enable scaling)
  const baseTransform = base.transform;
  baseTransform.scaleX = baseAnimation;
  baseTransform.scaleY = baseAnimation;
  baseTransform.scaleZ = baseAnimation;

  const speakerLTransform = speakerL.transform;
  speakerLTransform.scaleX = speakerAnimation;
  speakerLTransform.scaleY = speakerAnimation;
  speakerLTransform.scaleZ = speakerAnimation;

  const speakerRTransform = speakerR.transform;
  speakerRTransform.scaleX = speakerAnimation;
  speakerRTransform.scaleY = speakerAnimation;
  speakerRTransform.scaleZ = speakerAnimation;

  const placerTransform = placer.transform;

  // Implement the pan functionality
  TouchGestures.onPan().subscribe((gesture) => {
    planeTracker.trackPoint(gesture.location, gesture.state);
    // When a pan occurs, we want to get the new coordinates, and adjust plane's coordinates
  });

  // Implement the pinch functionality
  TouchGestures.onPinch().subscribeWithSnapshot(
    {
      lastScaleX: placerTransform.scaleX,
      lastScaleY: placerTransform.scaleY,
      lastScaleZ: placerTransform.scaleZ,
    },
    (gesture, snapshot) => {
      // Snapshot is capturing additional values related to the event (e.g., last scale)
      // Then, scale the placer
      placerTransform.scaleX = gesture.scale.mul(snapshot.lastScaleX);
      placerTransform.scaleY = gesture.scale.mul(snapshot.lastScaleY);
      placerTransform.scaleZ = gesture.scale.mul(snapshot.lastScaleZ);
    }
  );

  // Implement the rotation functionality
  TouchGestures.onRotate().subscribeWithSnapshot(
    { lastRotationY: placerTransform.rotationY },
    (gesture, snapshot) => {
      const correctRotation = gesture.rotation.mul(-1);
      placerTransform.rotationY = correctRotation.add(snapshot.lastRotationY);
      // Bind the base with one's finger rotation
      // Note: the coordinates where we should rotate our object to are stored in the snapshot
    }
  );
});
