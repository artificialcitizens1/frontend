
import React from 'react';

const LightingSystem: React.FC = () => {
  return (
    <>
      {/* Ambient light for overall scene illumination */}
      <ambientLight intensity={0.7} color="#ffffff" />
      
      {/* Directional light simulating sunlight, casting shadows */}
      <directionalLight
        castShadow
        position={[50, 80, 40]} // Position of the light source
        intensity={1.8} // Intensity of the light
        color="#ffffff"
        shadow-mapSize-width={2048} // Shadow map resolution
        shadow-mapSize-height={2048}
        // Define the frustum for the shadow camera to optimize shadow rendering
        shadow-camera-far={250}
        shadow-camera-left={-120}
        shadow-camera-right={120}
        shadow-camera-top={120}
        shadow-camera-bottom={-120}
        shadow-bias={-0.0005} // Adjust to prevent shadow acne
      />
    </>
  );
};

export default LightingSystem;
