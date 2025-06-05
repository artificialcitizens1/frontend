import React from "react";

interface RoadPoint {
  x: number;
  z: number;
}

interface RoadData {
  id: string;
  start: RoadPoint;
  end: RoadPoint;
  width: number;
}

const roadsData: RoadData[] = [
  // Main East-West Road
  { id: "main-ew", start: { x: -48, z: 0 }, end: { x: 48, z: 0 }, width: 7 },

  // Spur to Media House (Cluster at [-30, 0, 25])
  { id: "spur-media", start: { x: -30, z: 0 }, end: { x: -30, z: 22 }, width: 5 },

  // Spur to I.T. Campus (Cluster at [25, 0, -20])
  { id: "spur-it", start: { x: 25, z: 0 }, end: { x: 25, z: -17 }, width: 5 },

  // Spur to Housing Complex (Cluster at [40, 0, 35])
  { id: "spur-housing", start: { x: 40, z: 0 }, end: { x: 40, z: 32 }, width: 5 },

  // Spur to Amphitheater (Cluster at [-15, 0, -40])
  { id: "spur-arena", start: { x: -15, z: 0 }, end: { x: -15, z: -37 }, width: 6 },
];

const roadLevelY = 0.015; // Y-level for the road base
const dividerLevelY = 0.02; // Y-level for the divider line
const roadColor = "#424242"; // Dark grey
const dividerColor = "#FFFFFF"; // White
const dividerWidthFactor = 0.05; // Divider width as a factor of road width
const dividerLengthPadding = 0.5; // Padding from each end of the road for the divider

const RoadSystem: React.FC = () => {
  return (
    <>
      {roadsData.map((road) => {
        const dx = road.end.x - road.start.x;
        const dz = road.end.z - road.start.z;

        const length = Math.sqrt(dx * dx + dz * dz);
        const midpointX = (road.start.x + road.end.x) / 2;
        const midpointZ = (road.start.z + road.end.z) / 2;

        // Calculate angle with respect to the positive Z-axis for Y rotation
        const angle = Math.atan2(dx, dz);

        const actualDividerWidth = road.width * dividerWidthFactor;
        const actualDividerLength = Math.max(0, length - 2 * dividerLengthPadding);

        return (
          <group key={road.id}>
            {/* Road Base */}
            <mesh
              position={[midpointX, roadLevelY, midpointZ]}
              rotation={[-Math.PI / 2, 0, angle]} // Rotate to lay flat, then align with Y
              receiveShadow
            >
              <planeGeometry args={[road.width, length]} />
              <meshStandardMaterial color={roadColor} flatShading={true} />
            </mesh>

            {/* Divider Line (if long enough) */}
            {actualDividerLength > 0 && (
              <mesh
                position={[midpointX, dividerLevelY, midpointZ]}
                rotation={[-Math.PI / 2, 0, angle]}
              >
                <planeGeometry args={[actualDividerWidth, actualDividerLength]} />
                <meshStandardMaterial color={dividerColor} flatShading={true} />
              </mesh>
            )}
          </group>
        );
      })}
    </>
  );
};

export default RoadSystem;
