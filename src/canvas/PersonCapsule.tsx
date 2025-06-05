import React, { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface PersonCapsuleProps {
  id: string;
  initialPosition: THREE.Vector3; // Current "resting" position from App state
  targetPosition: THREE.Vector3 | null; // Commanded destination
  speed?: number;
  color?: string;
  capsuleArgs?: [number, number, number, number];
  onTargetReached: (id: string, reachedPosition: THREE.Vector3) => void;
}

const PersonCapsule: React.FC<PersonCapsuleProps> = ({
  id,
  initialPosition,
  targetPosition,
  speed = 1.5,
  color = "#FF0000",
  capsuleArgs = [0.4, 0.8, 4, 8],
  onTargetReached,
}) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  // Internal state for the destination we are actively moving towards.
  const [activeMovementTarget, setActiveMovementTarget] = useState<THREE.Vector3 | null>(null);

  // Effect 1: Set the capsule's physical position based on initialPosition prop.
  // This runs when initialPosition changes (i.e., after reaching a target and App updates the person's current position).
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.position.copy(initialPosition);
      // If the new initialPosition is the same as the activeMovementTarget,
      // it means we've effectively "snapped" to the target via prop update.
      // So, clear activeMovementTarget. This can happen if onTargetReached leads to initialPosition
      // being set to the activeMovementTarget.
      if (activeMovementTarget && activeMovementTarget.equals(initialPosition)) {
        setActiveMovementTarget(null);
      }
    }
  }, [initialPosition]); // Removed activeMovementTarget from deps as it might cause loop; initialPosition is the source of truth for rest.

  // Effect 2: Handle changes to the commanded targetPosition prop.
  useEffect(() => {
    if (targetPosition) {
      // If a new target is commanded, and it's different from where the capsule currently is...
      if (meshRef.current && !meshRef.current.position.equals(targetPosition)) {
        setActiveMovementTarget(targetPosition.clone()); // Start moving to this new target.
      } else if (meshRef.current && meshRef.current.position.equals(targetPosition)) {
        // Commanded target is where we already are.
        // Consider it "reached". This handles cases where target is set to current location.
        // Only call onTargetReached if we weren't already "not moving" or if the external target command is new.
        // This ensures we don't spam onTargetReached if target prop is repeatedly set to current location.
        if (activeMovementTarget !== null || (targetPosition && !activeMovementTarget)) {
          // if we were moving, or if we get a new target that is current pos
          onTargetReached(id, meshRef.current.position.clone());
        }
        setActiveMovementTarget(null); // Stop any theoretical movement.
      }
    } else {
      // targetPosition prop is null (e.g., command cleared by App).
      // If we *were* moving (activeMovementTarget was not null), then we've "reached" our current spot.
      // This signifies the end of the current movement leg.
      if (activeMovementTarget && meshRef.current) {
        onTargetReached(id, meshRef.current.position.clone());
      }
      setActiveMovementTarget(null); // Stop.
    }
  }, [targetPosition, id, onTargetReached]);

  // Effect 3: The movement loop (useFrame)
  useFrame((state, delta) => {
    if (!meshRef.current || !activeMovementTarget) {
      return; // Not actively moving
    }

    const currentPos = meshRef.current.position;
    const distanceToTarget = currentPos.distanceTo(activeMovementTarget);

    if (distanceToTarget < 0.1) {
      // Threshold for reaching the target
      meshRef.current.position.copy(activeMovementTarget); // Snap to exact target
      onTargetReached(id, activeMovementTarget.clone());
      setActiveMovementTarget(null); // Stop movement
    } else {
      // Move towards activeMovementTarget
      const direction = activeMovementTarget.clone().sub(currentPos).normalize();
      const moveDistance = speed * delta;
      meshRef.current.position.add(
        direction.multiplyScalar(Math.min(moveDistance, distanceToTarget))
      );

      // Orient the capsule to look where it's going (Y-axis fixed)
      const lookAtPosition = currentPos.clone().add(direction);
      meshRef.current.lookAt(new THREE.Vector3(lookAtPosition.x, currentPos.y, lookAtPosition.z));
    }
  });

  return (
    <mesh ref={meshRef} castShadow>
      <capsuleGeometry args={capsuleArgs} />
      <meshStandardMaterial color={color} flatShading />
    </mesh>
  );
};

export default PersonCapsule;
