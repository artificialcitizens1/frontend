import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Stats } from "@react-three/drei";
import * as THREE from "three";
import CameraController from "./canvas/CameraController";
import LightingSystem from "./canvas/LightingSystem";
import WorldTerrain from "./canvas/WorldTerrain";
import LowPolyElements from "./canvas/LowPolyElements";
import RoadSystem from "./canvas/RoadSystem";
import PopulationSystem from "./canvas/PopulationSystem";
import MovementControllerUI from "./canvas/MovementControllerUI";

// Y offset for capsule center from ground level. (radius 0.4 + half length 0.4 + visual_offset_from_ground 0.1)
const capsuleBaseHeightOffset = 0.9;

// Define the very initial ground positions for each person
const trueInitialGroundPositions: Record<string, THREE.Vector3> = {
  person1: new THREE.Vector3(31, 0, 30), // Near Housing
  person2: new THREE.Vector3(-30, 0, 22), // Near Media House
};

// Helper to calculate capsule center Y from ground Y
const getCapsuleCenterFromGround = (
  groundPos: THREE.Vector3,
  offset: number,
): THREE.Vector3 => {
  return new THREE.Vector3(groundPos.x, groundPos.y + offset, groundPos.z);
};

const App: React.FC = () => {
  const [person1CurrentPosition, setPerson1CurrentPosition] =
    useState<THREE.Vector3>(() =>
      getCapsuleCenterFromGround(
        trueInitialGroundPositions.person1,
        capsuleBaseHeightOffset,
      ),
    );
  const [person2CurrentPosition, setPerson2CurrentPosition] =
    useState<THREE.Vector3>(() =>
      getCapsuleCenterFromGround(
        trueInitialGroundPositions.person2,
        capsuleBaseHeightOffset,
      ),
    );

  const [person1Target, setPerson1Target] = useState<THREE.Vector3 | null>(
    null,
  );
  const [person2Target, setPerson2Target] = useState<THREE.Vector3 | null>(
    null,
  );

  const handleTargetsSet = (targets: {
    person1?: { x: number; y: number; z: number };
    person2?: { x: number; y: number; z: number };
  }) => {
    if (targets.person1) {
      setPerson1Target(
        new THREE.Vector3(
          targets.person1.x,
          targets.person1.y + capsuleBaseHeightOffset,
          targets.person1.z,
        ),
      );
    }
    if (targets.person2) {
      setPerson2Target(
        new THREE.Vector3(
          targets.person2.x,
          targets.person2.y + capsuleBaseHeightOffset,
          targets.person2.z,
        ),
      );
    }
  };

  const handleTargetReached = (
    personId: string,
    reachedPosition: THREE.Vector3,
  ) => {
    console.log(`${personId} reached target at`, reachedPosition);
    if (personId === "person1") {
      setPerson1CurrentPosition(reachedPosition.clone());
      setPerson1Target(null); // Clear target
    } else if (personId === "person2") {
      setPerson2CurrentPosition(reachedPosition.clone());
      setPerson2Target(null); // Clear target
    }
  };

  return (
    <div className="w-screen relative h-screen min-h-screen">
      <MovementControllerUI onTargetsSet={handleTargetsSet} />
      <Canvas shadows gl={{ antialias: true }} dpr={[1, 2]}>
        <color attach="background" args={["#87CEEB"]} />
        <CameraController initialPosition={[75, 75, 75]} fov={50} />
        <LightingSystem />
        <WorldTerrain size={100} divisions={100} />
        <LowPolyElements />
        <RoadSystem />
        <PopulationSystem
          person1InitialPosition={person1CurrentPosition}
          person2InitialPosition={person2CurrentPosition}
          person1TargetPosition={person1Target}
          person2TargetPosition={person2Target}
          onTargetReached={handleTargetReached}
        />
        <Stats className="!absolute !bottom-0 !left-0" />
        <React.Suspense fallback={null} />
      </Canvas>
    </div>
  );
};

export default App;
