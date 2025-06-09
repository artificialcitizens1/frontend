import { useCallback, useEffect, useRef, useState } from "react";
import { Graphics, Text, Container } from "@pixi/react";
import {
  CANDIDATE_RADIUS,
  CENTRAL_ROAD_X,
  CITIZEN_RADIUS,
  CITIZEN_SPEED,
  TRAVEL_SPEED,
  DISTRICT_DEFINITIONS,
} from "../../pages/GodMode";
import { useTick } from "@pixi/react";
import * as PIXI from "pixi.js";

interface Point {
  x: number;
  y: number;
}

interface DistrictData {
  id: number;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  gateway: Point;
}

interface AnimationPath {
  path: Point[];
  currentPathIndex: number;
}

interface CharacterProps {
  characterId: string;
  color: number;
  type: "citizen" | "candidate" | "reporter";
  initialDistrict: "home" | "office" | "amphitheatre" | "outside";
  targetDistrict: "home" | "office" | "amphitheatre" | "outside";
  // currentDistrictId: number;
  // targetDistrictId: number;
  bounds: DistrictData;
  isSelected: boolean;
  onClick: (id: string) => void;
  onTravelComplete: (
    id: string,
    finalDistrict: "home" | "office" | "amphitheatre" | "outside"
  ) => void;
  onNavigateToVoterDetails: (type: "citizen" | "candidate" | "reporter") => void;
  name: string;
}

const getTravelPath = (initialDistrict: string, targetDistrict: string): Point[] => {
  const startDistrict = DISTRICT_DEFINITIONS.find((d) => d.alias === initialDistrict);
  const endDistrict = DISTRICT_DEFINITIONS.find((d) => d.alias === targetDistrict);
  if (!startDistrict || !endDistrict || initialDistrict === targetDistrict) return [];
  const path: Point[] = [];
  const startRoadNode: Point = { x: CENTRAL_ROAD_X, y: startDistrict.gateway.y };
  const endRoadNode: Point = { x: CENTRAL_ROAD_X, y: endDistrict.gateway.y };
  path.push(startDistrict.gateway);
  path.push(startRoadNode);
  if (startRoadNode.y !== endRoadNode.y) path.push(endRoadNode);
  path.push(endDistrict.gateway);
  const settlePoint = { ...endDistrict.gateway };
  if (endDistrict.id === 1 || endDistrict.id === 3) settlePoint.x -= 30;
  else settlePoint.x += 30;
  path.push(settlePoint);
  return path;
};

function Character({
  characterId,
  color,
  bounds,
  isSelected,
  onClick: _onClick,
  onTravelComplete,
  type,
  initialDistrict,
  targetDistrict,
  onNavigateToVoterDetails,
  name,
}: CharacterProps) {
  const radius = type === "candidate" ? CANDIDATE_RADIUS : CITIZEN_RADIUS;
  const [position, setPosition] = useState<Point>(() => ({
    x: bounds.x + radius + Math.random() * (bounds.width - radius * 2),
    y: bounds.y + radius + Math.random() * (bounds.height - radius * 2),
  }));
  const [isHovered, setIsHovered] = useState(false);
  const [animationPath, setAnimationPath] = useState<AnimationPath | null>(null);
  const velocityRef = useRef({
    x: (Math.random() - 0.5) * CITIZEN_SPEED,
    y: (Math.random() - 0.5) * CITIZEN_SPEED,
  });

  useEffect(() => {
    if (initialDistrict !== targetDistrict) {
      const path = getTravelPath(initialDistrict!, targetDistrict!);
      if (path.length > 0) {
        setAnimationPath({ path, currentPathIndex: 0 });
      }
    }
  }, [initialDistrict, targetDistrict]);

  useEffect(() => {
    if (!animationPath) {
      setPosition({
        x: bounds.x + radius + Math.random() * (bounds.width - radius * 2),
        y: bounds.y + radius + Math.random() * (bounds.height - radius * 2),
      });
    }
  }, [bounds, animationPath, radius]);

  useTick((delta) => {
    if (isHovered && !animationPath) return;
    if (animationPath && animationPath.path.length > animationPath.currentPathIndex) {
      const target = animationPath.path[animationPath.currentPathIndex];
      const dx = target.x - position.x,
        dy = target.y - position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < TRAVEL_SPEED * delta) {
        const nextPathIndex = animationPath.currentPathIndex + 1;
        if (nextPathIndex >= animationPath.path.length) {
          onTravelComplete(characterId, targetDistrict!);
          setAnimationPath(null);
        } else {
          setAnimationPath((prev) => (prev ? { ...prev, currentPathIndex: nextPathIndex } : null));
        }
        setPosition(target);
      } else {
        const angle = Math.atan2(dy, dx);
        setPosition((prev) => ({
          x: prev.x + Math.cos(angle) * TRAVEL_SPEED * delta,
          y: prev.y + Math.sin(angle) * TRAVEL_SPEED * delta,
        }));
      }
    } else {
      setPosition((prevPosition) => {
        let newX = prevPosition.x + velocityRef.current.x * delta;
        let newY = prevPosition.y + velocityRef.current.y * delta;
        const left = bounds.x + radius;
        const right = bounds.x + bounds.width - radius;
        const top = bounds.y + radius;
        const bottom = bounds.y + bounds.height - radius;

        if (newX < left) {
          newX = left;
          velocityRef.current.x *= -1;
        } else if (newX > right) {
          newX = right;
          velocityRef.current.x *= -1;
        }

        if (newY < top) {
          newY = top;
          velocityRef.current.y *= -1;
        } else if (newY > bottom) {
          newY = bottom;
          velocityRef.current.y *= -1;
        }

        return { x: newX, y: newY };
      });
    }
  });

  const draw = useCallback(
    (g: PIXI.Graphics) => {
      g.clear();
      g.beginFill(color);
      if (isSelected) g.lineStyle(3, 0xfbbf24, 1);
      else if (isHovered) g.lineStyle(2, 0xffffff, 1);
      else g.lineStyle(0);
      g.drawCircle(0, 0, radius);
      g.endFill();
    },
    [color, isHovered, isSelected, radius]
  );

  const drawTooltipBackground = useCallback((g: PIXI.Graphics) => {
    g.clear();
    g.beginFill(0x111827, 0.95); // Dark background with slight transparency
    g.lineStyle(1, 0x06b6d4, 1); // Cyan border to match theme
    g.drawRoundedRect(-35, -25, 70, 20, 4);
    g.endFill();
  }, []);

  const tooltipTextStyle = new PIXI.TextStyle({
    fontFamily: "monospace",
    fontSize: 8,
    fill: "#FFFFFF",
    align: "center",
  });

  const tooltipTypeStyle = new PIXI.TextStyle({
    fontFamily: "monospace",
    fontSize: 6,
    fill: "#06B6D4",
    align: "center",
  });

  return (
    <Container x={position.x} y={position.y}>
      <Graphics
        eventMode={"static"}
        draw={draw}
        pointerover={() => setIsHovered(true)}
        pointerout={() => setIsHovered(false)}
        // pointerdown={() => onClick(characterId)}
        pointerdown={() => onNavigateToVoterDetails(type)}
      />
      {isHovered && (
        <Container y={-radius - 15}>
          <Graphics draw={drawTooltipBackground} />
          <Text text={name.toUpperCase()} anchor={0.5} x={0} y={-20} style={tooltipTextStyle} />
          <Text text={type.toUpperCase()} anchor={0.5} x={0} y={-10} style={tooltipTypeStyle} />
        </Container>
      )}
    </Container>
  );
}

export default Character;
