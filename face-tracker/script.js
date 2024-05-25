// Load in modules
const Scene = require('Scene');
const FaceTracking = require('FaceTracking');

(async function () {  // Enables async/await in JS [part 1]

  // In our scene, find the object called 'Cube'
  const cube = await Scene.root.findFirst('Cube')
  // Create a reference of the face
  const face = FaceTracking.face(0)
  // Bind the cube rotation to the face rotation: face movements affect the cube's rotation
  cube.transform.rotation = face.cameraTransform.rotation;

})();
