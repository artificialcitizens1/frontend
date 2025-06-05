import React from "react";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei"; // Import PerspectiveCamera

interface CameraControllerProps {
  initialPosition: [number, number, number];
  fov: number;
}

const CameraController: React.FC<CameraControllerProps> = ({ initialPosition, fov }) => {
  return (
    <>
      {/* Perspective camera, set as default for the scene */}
      <PerspectiveCamera // Use the imported PerspectiveCamera component
        makeDefault
        position={initialPosition}
        fov={fov}
        near={0.1} // Near clipping plane
        far={1000} // Far clipping plane
      />
      {/* Orbit controls for camera manipulation (zoom, pan, orbit) */}
      <OrbitControls
        target={[0, 0, 0]} // Point the camera at the center of the scene
        minDistance={20} // Minimum zoom distance
        maxDistance={250} // Maximum zoom distance
        enablePan={true} // Allow panning
        // Optional: Restrict polar angles for a more controlled isometric feel
        // minPolarAngle={Math.PI / 4} // e.g., 45 degrees from vertical
        // maxPolarAngle={Math.PI / 2 - Math.PI / 18} // e.g., prevent looking up from below horizon
      />
    </>
  );
};

export default CameraController;
