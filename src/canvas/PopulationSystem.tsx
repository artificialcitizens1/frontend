
import React from 'react';
import * as THREE from 'three';
import PersonCapsule from './PersonCapsule';

// Static configuration for people (ID, color, speed)
// Initial positions are now managed by App.tsx
const peopleConfig = [
  {
    id: 'person1',
    color: '#FF4500', // OrangeRed
    speed: 2,
  },
  {
    id: 'person2',
    color: '#1E90FF', // DodgerBlue
    speed: 1.8,
  },
];

interface PopulationSystemProps {
  person1InitialPosition: THREE.Vector3;
  person2InitialPosition: THREE.Vector3;
  person1TargetPosition: THREE.Vector3 | null;
  person2TargetPosition: THREE.Vector3 | null;
  onTargetReached: (id: string, reachedPosition: THREE.Vector3) => void;
}

const PopulationSystem: React.FC<PopulationSystemProps> = ({
  person1InitialPosition,
  person2InitialPosition,
  person1TargetPosition,
  person2TargetPosition,
  onTargetReached,
}) => {
  return (
    <>
      {peopleConfig.map((personData) => {
        let initialPos: THREE.Vector3;
        let targetPos: THREE.Vector3 | null;

        if (personData.id === 'person1') {
          initialPos = person1InitialPosition;
          targetPos = person1TargetPosition;
        } else if (personData.id === 'person2') {
          initialPos = person2InitialPosition;
          targetPos = person2TargetPosition;
        } else {
          // Should not happen with current config
          initialPos = new THREE.Vector3(); 
          targetPos = null;
        }

        return (
          <PersonCapsule
            key={personData.id}
            id={personData.id}
            initialPosition={initialPos}
            targetPosition={targetPos}
            speed={personData.speed}
            color={personData.color}
            capsuleArgs={[0.4, 0.8, 4, 8]} // Default [radius, length, capSegments, radialSegments]
            onTargetReached={onTargetReached}
          />
        );
      })}
    </>
  );
};

export default PopulationSystem;
    