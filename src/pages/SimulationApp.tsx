import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Stage, Graphics, Text, Container, useTick, useApp } from '@pixi/react';
import { EventSystem } from 'pixi.js';
import * as PIXI from 'pixi.js';

// --- Type Definitions (TypeScript) ---
interface DistrictData {
  id: number;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface CitizenData {
  id: number;
  districtId: number;
  color: number;
}

interface CitizenProps {
  id: number;
  color: number;
  bounds: DistrictData;
  onClick: (id: number) => void;
}

interface DistrictProps extends DistrictData {}

interface Point {
    x: number;
    y: number;
}

// --- Constants ---
const STAGE_WIDTH: number = 800;
const STAGE_HEIGHT: number = 600;
const DISTRICT_GAP: number = 20;
const DISTRICT_WIDTH: number = (STAGE_WIDTH - DISTRICT_GAP * 3) / 2;
const DISTRICT_HEIGHT: number = (STAGE_HEIGHT - DISTRICT_GAP * 3) / 2;
const CITIZEN_RADIUS: number = 10;
const CITIZEN_SPEED: number = 2.5;

// --- Data Definitions ---
const DISTRICT_DEFINITIONS: DistrictData[] = [
    { id: 1, name: "BAY STREET RESIDENTIAL", x: DISTRICT_GAP, y: DISTRICT_GAP, width: DISTRICT_WIDTH, height: DISTRICT_HEIGHT },
    { id: 2, name: "CORPORATE PARK", x: DISTRICT_WIDTH + DISTRICT_GAP * 2, y: DISTRICT_GAP, width: DISTRICT_WIDTH, height: DISTRICT_HEIGHT },
    { id: 3, name: "THE ORANGETORIUM", x: DISTRICT_GAP, y: DISTRICT_HEIGHT + DISTRICT_GAP * 2, width: DISTRICT_WIDTH, height: DISTRICT_HEIGHT },
    { id: 4, name: "IDLE ENCLAVE", x: DISTRICT_WIDTH + DISTRICT_GAP * 2, y: DISTRICT_HEIGHT + DISTRICT_GAP * 2, width: DISTRICT_WIDTH, height: DISTRICT_HEIGHT }
];

const generateInitialCitizens = (count: number): CitizenData[] => {
    return Array.from({ length: count }, (_, i) => ({
        id: i,
        districtId: Math.floor(Math.random() * 4) + 1,
        color: Math.random() > 0.4 ? 0x4299e1 : 0xf6ad55,
    }));
};

// --- Main App Component ---
export default function SimulationApp() {
  return (
    <div className="bg-[#0b0c1e] min-h-screen flex flex-col items-center justify-center font-mono p-4">
      <h1 className="text-3xl text-cyan-300 mb-2">SIMPLOLIS POLITICAL MAP</h1>
      <div className="bg-gray-800 p-6 rounded-lg shadow-2xl border-4 border-gray-700 w-full max-w-5xl">
        <Simulation />
      </div>
      <div className="text-gray-400 mt-4 text-sm">
          <p>Phase 4 Complete: Rendering issue fixed by memoizing the TextStyle object.</p>
      </div>
    </div>
  );
}

// --- Interaction Enabler Component ---
const InteractionEnabler = (): null => {
  const app = useApp();
  useEffect(() => {
    if (app && app.renderer && !('events' in app.renderer)) {
      (app.renderer as any).addSystem(EventSystem, 'events');
    }
  }, [app]);
  return null;
};


// --- Simulation Component ---
function Simulation() {
  const [citizens, setCitizens] = useState<CitizenData[]>(() => generateInitialCitizens(40));

  const handleCitizenClick = (citizenId: number): void => {
      console.log(`Clicked citizen with ID: ${citizenId}`);
  };

  return (
    <Stage width={STAGE_WIDTH} height={STAGE_HEIGHT} options={{ backgroundColor: 0x1d233a }}>
      <InteractionEnabler />
      {DISTRICT_DEFINITIONS.map(district => (
          <District key={district.id} {...district} />
      ))}
      {citizens.map(citizen => {
          const district = DISTRICT_DEFINITIONS.find(d => d.id === citizen.districtId);
          if (!district) return null;
          return (
              <Citizen
                  key={citizen.id}
                  id={citizen.id}
                  color={citizen.color}
                  bounds={district}
                  onClick={handleCitizenClick}
              />
          );
      })}
    </Stage>
  );
}

// --- Citizen Component ---
function Citizen({ id, color, bounds, onClick }: CitizenProps) {
    const [position, setPosition] = useState<Point>({
        x: bounds.x + CITIZEN_RADIUS + Math.random() * (bounds.width - CITIZEN_RADIUS * 2),
        y: bounds.y + CITIZEN_RADIUS + Math.random() * (bounds.height - CITIZEN_RADIUS * 2)
    });
    const [isHovered, setIsHovered] = useState<boolean>(false);

    const velocityRef = useRef<Point>({
        x: (Math.random() - 0.5) * CITIZEN_SPEED,
        y: (Math.random() - 0.5) * CITIZEN_SPEED
    });

    useTick((delta: number) => {
        if (isHovered) {
            return;
        }

        setPosition(prevPosition => {
            let newX = prevPosition.x + velocityRef.current.x * delta;
            let newY = prevPosition.y + velocityRef.current.y * delta;
            
            const leftBound = bounds.x + CITIZEN_RADIUS;
            const rightBound = bounds.x + bounds.width - CITIZEN_RADIUS;
            const topBound = bounds.y + CITIZEN_RADIUS;
            const bottomBound = bounds.y + bounds.height - CITIZEN_RADIUS;

            if (newX < leftBound) { newX = leftBound; velocityRef.current.x *= -1; }
            else if (newX > rightBound) { newX = rightBound; velocityRef.current.x *= -1; }

            if (newY < topBound) { newY = topBound; velocityRef.current.y *= -1; }
            else if (newY > bottomBound) { newY = bottomBound; velocityRef.current.y *= -1; }
            
            return { x: newX, y: newY };
        });
    });

    const draw = useCallback((g: PIXI.Graphics) => {
        g.clear();
        g.beginFill(color);
        if (isHovered) {
            g.lineStyle(2, 0xffffff, 1);
        } else {
            g.lineStyle(0);
        }
        g.drawCircle(0, 0, CITIZEN_RADIUS);
        g.endFill();
    }, [color, isHovered]);

    return (
        <Graphics
            x={position.x}
            y={position.y}
            eventMode={'static'}
            draw={draw}
            pointerover={() => setIsHovered(true)}
            pointerout={() => setIsHovered(false)}
            click={() => onClick(id)}
        />
    );
}

// --- District Component (FIXED) ---
function District({ x, y, width, height, name }: DistrictProps) {
  const draw = useCallback((g: PIXI.Graphics) => {
    g.clear();
    g.lineStyle(2, 0x3399ff, 1);
    g.drawRect(0, 0, width, height);
    g.endFill();
  }, [width, height]);
  
  // THE FIX: Create the TextStyle object with useMemo.
  // This prevents a new object from being created on every render,
  // which stabilizes the component and prevents rendering errors.
  const textStyle = useMemo(() => new PIXI.TextStyle({
      fontFamily: 'Arial',
      fontSize: 14,
      fill: 'cyan',
      align: 'center',
  }), []);

  return (
    <Container x={x} y={y}>
      <Graphics draw={draw} />
      <Text
        text={name}
        x={width / 2}
        y={15}
        anchor={0.5}
        style={textStyle} // Use the memoized style object
      />
    </Container>
  );
}
