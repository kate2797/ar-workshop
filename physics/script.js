const Scene = require("Scene")
const FaceTracking = require("FaceTracking")

(async function() {

  const antennaBones = await Scene.root.findByPath("**/Bone*") // Find all bones in the scene by folder name

  // Describes the movement of the X axis
  const faceSignalX = FaceTracking.face(0).cameraTransform.x.expSmooth(90)
  const faceSignalXDupl = FaceTracking.face(0).cameraTransform.x.expSmooth(100)

  // Describes the movement of the Y axis
  const faceSignalY = FaceTracking.face(0).cameraTransform.y.expSmooth(90)
  const faceSignalYDupl = FaceTracking.face(0).cameraTransform.y.expSmooth(100)

  const scaleFactor = 120 // The value by which the bone objects will be scaled

  // Now, bind all the bones to face movements
  antennaBones.forEach(bone => {
    bone.transform.rotationZ = faceSignalX.sub(faceSignalXDupl).mul(scaleFactor)
    bone.transform.rotationX = faceSignalY.sub(faceSignalYDupl).mul(scaleFactor)
  })
})()

