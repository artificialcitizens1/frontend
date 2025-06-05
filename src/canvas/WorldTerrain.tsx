import React from "react";

interface WorldTerrainProps {
  size: number;
  divisions: number;
}

const WorldTerrain: React.FC<WorldTerrainProps> = ({ size, divisions }) => {
  return (
    <>
      {/* Ground plane mesh that receives shadows */}
      <mesh
        receiveShadow
        rotation={[-Math.PI / 2, 0, 0]} // Rotate plane to be horizontal
        position={[0, -0.01, 0]} // Slightly below grid lines to prevent z-fighting
      >
        <planeGeometry args={[size, size]} />
        {/* Apply a solid color and flat shading for a low poly look */}
        <meshStandardMaterial
          color="#558B2F" // A suitable green for a low poly style
          flatShading={true} // Enable flat shading
        />
      </mesh>

      {/* Grid helper for visual reference of the 100x100 unit grid */}
      <gridHelper
        args={[size, divisions, "#666666", "#888888"]} // Grid size, divisions, center line color, grid line color
        position={[0, 0, 0]} // Ensure grid is at Y=0
      />
    </>
  );
};

export default WorldTerrain;
