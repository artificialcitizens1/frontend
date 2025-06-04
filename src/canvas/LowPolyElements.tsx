import React from 'react';

// --- Configuration Interfaces for Details ---
interface DoorConfig {
  side: 'front' | 'back' | 'left' | 'right';
  width: number;
  height: number;
  color: string;
  depth?: number; // How much the door is inset or outset
  positionY?: number; // Custom Y position for the door base, defaults to 0
  offsetX?: number; // X offset from center for the door
}

interface WindowConfig {
  sides: ('front' | 'back' | 'left' | 'right')[];
  countPerFloorPerSide: number;
  numFloors: number; // User-defined number of floors to have windows
  width: number;
  height: number;
  color: string;
  vSpacing: number; // Vertical spacing between windows (from top of one to bottom of next)
  hSpacing: number; // Horizontal spacing between windows on the same floor
  depth?: number; // How much windows are inset or outset
  baseYOffset?: number; // Starting Y for the center of the first floor of windows
}

interface FloorLineConfig {
  sides: ('front' | 'back' | 'left' | 'right')[];
  height: number; // Thickness of the line
  color: string;
  baseYOffset: number; // Starting Y for the center of the first floor line
  floorHeight: number; // The height of one conceptual floor, determining spacing
}

interface BuildingPart {
  id: string;
  shape: 'box' | 'cylinder';
  args: number[]; // Box: [width, height, depth], Cylinder: [radiusTop, radiusBottom, height, radialSegments]
  positionOffset: [number, number, number]; // Base position [x, y_base, z] relative to cluster
  color: string;
  rotation?: [number, number, number];
  door?: DoorConfig;
  windows?: WindowConfig;
  floorLines?: FloorLineConfig;
}

interface BuildingClusterData {
  id: string;
  type: 'media' | 'it' | 'housing' | 'arena';
  basePosition: [number, number, number];
  baseRotation?: [number, number, number];
  parts: BuildingPart[];
}

// --- Helper Functional Components for Rendering Details ---

const RenderDoorDetails: React.FC<{
  config: DoorConfig;
  parentArgs: number[];
  parentShape: 'box' | 'cylinder';
}> = ({ config, parentArgs, parentShape }) => {
  if (parentShape === 'cylinder') return null;

  const [parentWidth, , parentDepth] = parentArgs;
  const doorDepth = config.depth || 0.1;
  const doorBaseY = config.positionY !== undefined ? config.positionY : 0;
  const doorOffsetX = config.offsetX || 0;

  let position: [number, number, number] = [0,0,0];
  const rotation: [number, number, number] = [0, 0, 0];

  switch (config.side) {
    case 'front':
      position = [doorOffsetX, doorBaseY + config.height / 2, parentDepth / 2 + doorDepth / 2];
      break;
    case 'back':
      position = [doorOffsetX, doorBaseY + config.height / 2, -parentDepth / 2 - doorDepth / 2];
      break;
    case 'left':
      position = [-parentWidth / 2 - doorDepth / 2, doorBaseY + config.height / 2, doorOffsetX];
      rotation[1] = Math.PI / 2;
      break;
    case 'right':
      position = [parentWidth / 2 + doorDepth / 2, doorBaseY + config.height / 2, doorOffsetX];
      rotation[1] = Math.PI / 2;
      break;
  }

  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={[config.width, config.height, doorDepth]} />
      <meshStandardMaterial color={config.color} flatShading />
    </mesh>
  );
};

const RenderWindowDetails: React.FC<{
  config: WindowConfig;
  parentArgs: number[];
  parentShape: 'box' | 'cylinder';
}> = ({ config, parentArgs, parentShape }) => {
  if (parentShape === 'cylinder') return null; // Windows for boxes

  const [parentWidth, parentActualHeight, parentDepth] = parentArgs;
  const windowDepth = config.depth || 0.1;
  const windows: JSX.Element[] = [];
  
  // Ensure baseYOffset is defined, default to a reasonable value if not
  const baseY = config.baseYOffset !== undefined ? config.baseYOffset : config.height / 2 + config.vSpacing;


  for (let floor = 0; floor < config.numFloors; floor++) {
    const currentFloorCenterY = baseY + floor * (config.height + config.vSpacing);

    // Stop if windows go above parent height
    if (currentFloorCenterY + config.height / 2 > parentActualHeight) break;
    // Stop if windows go below parent base (unless baseY is explicitly low)
    if (currentFloorCenterY - config.height / 2 < 0 && baseY > 0) continue;


    config.sides.forEach(side => {
      const totalWidthForWindows = config.countPerFloorPerSide * config.width + Math.max(0, config.countPerFloorPerSide - 1) * config.hSpacing;
      let startOffset = -totalWidthForWindows / 2 + config.width / 2;

      for (let i = 0; i < config.countPerFloorPerSide; i++) {
        const windowX = startOffset + i * (config.width + config.hSpacing);
        let position: [number, number, number] = [0,0,0];
        const rotation: [number, number, number] = [0,0,0];

        let currentSideDimension = 0;
        switch (side) {
          case 'front':
          case 'back':
            currentSideDimension = parentWidth;
            position = [windowX, currentFloorCenterY, (side === 'front' ? parentDepth / 2 : -parentDepth / 2) + (side === 'front' ? windowDepth / 2 : -windowDepth / 2)];
            break;
          case 'left':
          case 'right':
            currentSideDimension = parentDepth;
            position = [(side === 'left' ? -parentWidth / 2 : parentWidth / 2) + (side === 'left' ? -windowDepth / 2 : windowDepth/2) , currentFloorCenterY, windowX];
            rotation[1] = Math.PI / 2;
            break;
        }
        
        // Boundary check for windows on the current side
        if (Math.abs(windowX) + config.width / 2 > currentSideDimension / 2) continue;

        windows.push(
          <mesh key={`win-${floor}-${side}-${i}`} position={position} rotation={rotation}>
            <boxGeometry args={[config.width, config.height, windowDepth]} />
            <meshStandardMaterial color={config.color} flatShading />
          </mesh>
        );
      }
    });
  }
  return <>{windows}</>;
};

const RenderFloorLineDetails: React.FC<{
  config: FloorLineConfig;
  parentArgs: number[];
  parentShape: 'box' | 'cylinder';
}> = ({ config, parentArgs, parentShape }) => {
  if (parentShape === 'cylinder') return null;

  const [parentWidth, parentActualHeight, parentDepth] = parentArgs;
  const lineDepth = 0.1; // Thickness of the line protruding from surface
  const lines: JSX.Element[] = [];
  
  // Ensure baseYOffset and floorHeight are defined
  const firstLineY = config.baseYOffset; 
  const { floorHeight } = config; // Vertical distance between the centers of lines

  for (let i = 0; ; i++) {
    const currentLineCenterY = firstLineY + i * floorHeight;

    if (currentLineCenterY - config.height / 2 < 0) continue; // Line starts below parent base
    if (currentLineCenterY + config.height / 2 > parentActualHeight) break; // Line ends above parent top

    config.sides.forEach(side => {
      let position: [number, number, number] = [0,0,0];
      let lineLength = 0;
      const rotation: [number, number, number] = [0,0,0];

      switch (side) {
        case 'front':
          position = [0, currentLineCenterY, parentDepth / 2 + lineDepth / 2];
          lineLength = parentWidth;
          break;
        case 'back':
          position = [0, currentLineCenterY, -parentDepth / 2 - lineDepth / 2];
          lineLength = parentWidth;
          break;
        case 'left':
          position = [-parentWidth / 2 - lineDepth / 2, currentLineCenterY, 0];
          lineLength = parentDepth;
          rotation[1] = Math.PI / 2;
          break;
        case 'right':
          position = [parentWidth / 2 + lineDepth / 2, currentLineCenterY, 0];
          lineLength = parentDepth;
          rotation[1] = Math.PI / 2;
          break;
      }
      lines.push(
        <mesh key={`fl-${i}-${side}`} position={position} rotation={rotation}>
          <boxGeometry args={[lineLength, config.height, lineDepth]} />
          <meshStandardMaterial color={config.color} flatShading />
        </mesh>
      );
    });
  }
  return <>{lines}</>;
};


// --- Building Cluster Data ---
const buildingClusters: BuildingClusterData[] = [
  {
    id: 'media-house-1',
    type: 'media',
    basePosition: [-30, 0, 25],
    parts: [
      { 
        id: 'mt1', shape: 'box', args: [8, 25, 8], positionOffset: [0, 0, 0], color: '#607D8B', // Main Tower
        door: { side: 'front', width: 2, height: 3, color: '#37474F', depth: 0.2, positionY: 0.1 },
        windows: {
          sides: ['front', 'left', 'right'],
          countPerFloorPerSide: 2,
          numFloors: 7, // Calculated based on height
          width: 1, height: 1.5, color: '#B0BEC5',
          vSpacing: 1.5, hSpacing: 1, depth: 0.1,
          baseYOffset: 2.5, // Center of first row of windows
        },
        floorLines: {
          sides: ['front', 'left', 'right'],
          height: 0.2, color: '#546E7A',
          baseYOffset: 3.25, // Approx (windowBaseY + windowHeight/2 + vSpacing/2) or simply floorHeight
          floorHeight: 3, // windowHeight + vSpacing
        }
      },
      { 
        id: 'cb1', shape: 'box', args: [12, 10, 6], positionOffset: [0, 0, -7], color: '#90A4AE', // Comms Block
        door: { side: 'front', width: 2, height: 3, color: '#455A64', depth: 0.2, positionY: 0.1, offsetX: -3 },
        windows: {
          sides: ['front', 'left', 'right'],
          countPerFloorPerSide: 3,
          numFloors: 2,
          width: 1.2, height: 1.5, color: '#CFD8DC',
          vSpacing: 1, hSpacing: 0.8, depth: 0.1,
          baseYOffset: 2.25,
        },
        floorLines: {
          sides: ['front', 'left', 'right'],
          height: 0.2, color: '#78909C',
          baseYOffset: 3,
          floorHeight: 2.5,
        }
      },
      { id: 'ab1', shape: 'box', args: [1, 1, 1], positionOffset: [0, 25, 0], color: '#CFD8DC' }, 
      { id: 'am1', shape: 'cylinder', args: [0.3, 0.3, 5, 8], positionOffset: [0, 26, 0], color: '#03A9F4' },
    ],
  },
  {
    id: 'it-campus-1',
    type: 'it',
    basePosition: [25, 0, -20],
    parts: [
      { 
        id: 'itb1', shape: 'box', args: [15, 12, 10], positionOffset: [0, 0, 0], color: '#00BCD4', // Main IT Building
        door: { side: 'front', width: 2.5, height: 3.5, color: '#006064', depth: 0.2, positionY: 0.1 },
        windows: {
          sides: ['front', 'back', 'left', 'right'],
          countPerFloorPerSide: 3,
          numFloors: 3,
          width: 1.2, height: 1.8, color: '#E0F7FA',
          vSpacing: 1, hSpacing: 1, depth: 0.1,
          baseYOffset: 2.4,
        },
        floorLines: {
          sides: ['front', 'back', 'left', 'right'],
          height: 0.2, color: '#00838F',
          baseYOffset: 3.3, // windowBaseY + windowH/2 + vSpacing/2
          floorHeight: 2.8, // windowH + vSpacing
        }
      },
      { 
        id: 'itb2', shape: 'box', args: [10, 8, 18], positionOffset: [-12, 0, 2], color: '#4DD0E1',
        door: { side: 'right', width: 2, height: 3, color: '#006064', depth: 0.2, positionY: 0.1, offsetX: 5}, // offsetX on Z axis for side door
        windows: {
          sides: ['front', 'back', 'left', 'right'],
          countPerFloorPerSide: 2,
          numFloors: 2,
          width: 1, height: 1.5, color: '#E0F7FA',
          vSpacing: 1, hSpacing: 1, depth: 0.1,
          baseYOffset: 2.25,
        },
        floorLines: {
          sides: ['front', 'back', 'left', 'right'],
          height: 0.15, color: '#00838F',
          baseYOffset: 3,
          floorHeight: 2.5,
        }
      }, 
      { 
        id: 'itb3', shape: 'box', args: [7, 10, 7], positionOffset: [10, 0, -10], color: '#B2EBF2',
        door: { side: 'front', width: 1.8, height: 2.8, color: '#006064', depth: 0.2, positionY: 0.1 },
        windows: {
          sides: ['front', 'left', 'right'],
          countPerFloorPerSide: 2,
          numFloors: 2, // Max for 10 unit height
          width: 0.8, height: 1.2, color: '#E0F7FA',
          vSpacing: 0.8, hSpacing: 0.8, depth: 0.1,
          baseYOffset: 2.1,
        },
        floorLines: {
          sides: ['front', 'left', 'right'],
          height: 0.15, color: '#00838F',
          baseYOffset: 2.8,
          floorHeight: 2.0,
        }
      },
      { id: 'itc1', shape: 'box', args: [8, 2, 2], positionOffset: [-7.5, 7, 1], color: '#78909C', rotation: [0, Math.PI / 18, 0] },
    ],
  },
  {
    id: 'housing-complex-1',
    type: 'housing',
    basePosition: [31, 0, 34],
    parts: [
      { 
        id: 'hb1', shape: 'box', args: [10, 15, 7], positionOffset: [0, 0, 0], color: '#FFAB91',
        door: { side: 'front', width: 1.5, height: 2.5, color: '#BF360C', depth: 0.2, positionY: 0.1 },
        windows: {
          sides: ['front', 'back', 'left', 'right'],
          countPerFloorPerSide: 2,
          numFloors: 4,
          width: 1, height: 1.2, color: '#FFCCBC',
          vSpacing: 0.8, hSpacing: 0.8, depth: 0.1,
          baseYOffset: 2.1,
        },
        floorLines: {
          sides: ['front', 'back', 'left', 'right'],
          height: 0.15, color: '#E64A19',
          baseYOffset: 2.8,
          floorHeight: 2.0,
        }
      },
      { 
        id: 'hb2', shape: 'box', args: [8, 12, 6], positionOffset: [9, 0, 1], color: '#FFCCBC',
        door: { side: 'front', width: 1.5, height: 2.5, color: '#BF360C', depth: 0.2, positionY: 0.1 },
        windows: {
          sides: ['front', 'back', 'left', 'right'],
          countPerFloorPerSide: 2,
          numFloors: 3,
          width: 1, height: 1.2, color: '#FBE9E7',
          vSpacing: 0.8, hSpacing: 0.8, depth: 0.1,
          baseYOffset: 2.1,
        },
        floorLines: {
          sides: ['front', 'back', 'left', 'right'],
          height: 0.15, color: '#E64A19',
          baseYOffset: 2.8,
          floorHeight: 2.0,
        }
      },
      { 
        id: 'hb3', shape: 'box', args: [9, 10, 7], positionOffset: [-3, 0, 7], color: '#FFE0B2',
        door: { side: 'front', width: 1.5, height: 2.5, color: '#E65100', depth: 0.2, positionY: 0.1 },
        windows: {
          sides: ['front', 'back', 'left', 'right'],
          countPerFloorPerSide: 2,
          numFloors: 2,
          width: 1, height: 1.2, color: '#FFF3E0',
          vSpacing: 0.8, hSpacing: 0.8, depth: 0.1,
          baseYOffset: 2.1,
        },
        floorLines: {
          sides: ['front', 'back', 'left', 'right'],
          height: 0.15, color: '#F57C00',
          baseYOffset: 2.8,
          floorHeight: 2.0,
        }
      },
      { id: 'hb4', shape: 'box', args: [3, 3, 3], positionOffset: [0, 15, 0], color: '#D7CCC8' }, 
      { id: 'hb5', shape: 'box', args: [2.5, 2.5, 2.5], positionOffset: [9, 12, 1], color: '#D7CCC8' },
    ],
  },
  {
    id: 'amphitheater-1',
    type: 'arena',
    basePosition: [-15, 0, -30], 
    baseRotation: [0, Math.PI, 0], 
    parts: [
      { id: 'stage', shape: 'box', args: [15, 1, 10], positionOffset: [0, 0, 0], color: '#A1887F' },
      { id: 's1_1', shape: 'box', args: [6, 1.5, 3], positionOffset: [0, 0.5, 7.5], color: '#BDBDBD', rotation: [0, 0, 0] },
      { id: 's1_2', shape: 'box', args: [6, 1.5, 3], positionOffset: [-4.5, 0.5, 6.5], color: '#BDBDBD', rotation: [0, Math.PI / 6, 0] },
      { id: 's1_3', shape: 'box', args: [6, 1.5, 3], positionOffset: [4.5, 0.5, 6.5], color: '#BDBDBD', rotation: [0, -Math.PI / 6, 0] },
      { id: 's2_1', shape: 'box', args: [5, 2, 3.5], positionOffset: [0, 1.5, 11], color: '#CBCBCB', rotation: [0, 0, 0] },
      { id: 's2_2', shape: 'box', args: [5, 2, 3.5], positionOffset: [-6, 1.5, 9.5], color: '#CBCBCB', rotation: [0, Math.PI / 5, 0] },
      { id: 's2_3', shape: 'box', args: [5, 2, 3.5], positionOffset: [6, 1.5, 9.5], color: '#CBCBCB', rotation: [0, -Math.PI / 5, 0] },
      { id: 's2_4', shape: 'box', args: [5, 2, 3.5], positionOffset: [-9, 1.5, 7], color: '#CBCBCB', rotation: [0, Math.PI / 2.8, 0] },
      { id: 's2_5', shape: 'box', args: [5, 2, 3.5], positionOffset: [9, 1.5, 7], color: '#CBCBCB', rotation: [0, -Math.PI / 2.8, 0] },
      { 
        id: 'aw1', shape: 'box', args: [25, 8, 1.5], positionOffset: [0, 0, 14], color: '#9E9E9E', // Outer wall
        // Adding tall, narrow "slits" or panels as windows
        windows: {
          sides: ['front'], // 'front' of this wall is its outer face
          countPerFloorPerSide: 5,
          numFloors: 2, // Two levels of these slits
          width: 0.5, height: 2.5, color: '#757575', // Darker slits
          vSpacing: 0.5, hSpacing: 2, depth: 0.1,
          baseYOffset: 1.75, // Center of first row of slits
        },
        floorLines: {
          sides: ['front'],
          height: 0.2, color: '#757575',
          baseYOffset: 3.25, // Approx center between the two rows of slits
          floorHeight: 3, 
        }
      },
    ],
  },
];

const LowPolyElements: React.FC = () => {
  return (
    <>
      {buildingClusters.map((cluster) => (
        <group
          key={cluster.id}
          position={cluster.basePosition}
          rotation={cluster.baseRotation}
        >
          {cluster.parts.map((part) => {
            const { shape, args, positionOffset, rotation: partRotation } = part;

            let partHeight = 0;
            if (shape === 'box' && args.length >= 2) partHeight = args[1];
            else if (shape === 'cylinder' && args.length >= 3) partHeight = args[2];
            
            // Ensure positionOffset is treated as the base of the part
            const finalPositionOffset: [number, number, number] = [
              positionOffset[0],
              positionOffset[1], // Y is the base
              positionOffset[2]
            ];
            
            return (
              <group
                key={part.id}
                position={finalPositionOffset} 
                rotation={partRotation}
              >
                {/* Main Part Mesh - Positioned so its base is at the group's y=0 */}
                <mesh position={[0, partHeight / 2, 0]} castShadow receiveShadow>
                  {shape === 'box' && <boxGeometry args={args as [number, number, number]} />}
                  {shape === 'cylinder' && <cylinderGeometry args={args as [number, number, number, number]} />}
                  <meshStandardMaterial color={part.color} flatShading />
                </mesh>

                {/* Render Details */}
                {part.door && <RenderDoorDetails config={part.door} parentArgs={args} parentShape={shape} />}
                {part.windows && <RenderWindowDetails config={part.windows} parentArgs={args} parentShape={shape} />}
                {part.floorLines && <RenderFloorLineDetails config={part.floorLines} parentArgs={args} parentShape={shape} />}
              </group>
            );
          })}
        </group>
      ))}
    </>
  );
};

export default LowPolyElements;
