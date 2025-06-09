import * as PIXI from "pixi.js";
import Character from "../components/simulation/Character";
import GridOverlay from "../components/simulation/GridOverlay";
import { Stage, Graphics, Text, Container, useApp } from "@pixi/react";
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTickStore } from "../store/tickStore";
import { useSimulationStore } from "../store/simulationStore";
import SimulationControls from "../components/simulation/SimulationControls";
import Logs from "../components/Logs";

// --- Type Definitions (Refactored for Declarative State) ---
interface Point { x: number; y: number; }
interface DistrictData { id: number; name: string; alias: 'home' | 'office' | 'amphitheater' | 'others'; x: number; y: number; width: number; height: number; gateway: Point; }

interface CharacterData { 
    characterId: string;
    initialDistrict: 'home' | 'office' | 'amphitheater' | 'others'; 
    targetDistrict: 'home' | 'office' | 'amphitheater' | 'others'; 
    name: string;
    color: number; 
    type: 'citizen' | 'candidate' | 'reporter'; 
    log: string;
    district: 'home' | 'office' | 'amphitheater' | 'others';
}

// --- Constants ---
export const LOGICAL_WIDTH = 800;
export const LOGICAL_HEIGHT = 600;
export const DISTRICT_GAP = 50;
export const DISTRICT_WIDTH = (LOGICAL_WIDTH - DISTRICT_GAP * 3) / 2;
export const DISTRICT_HEIGHT = (LOGICAL_HEIGHT - DISTRICT_GAP * 3) / 2;
export const CITIZEN_RADIUS = 10;
export const CANDIDATE_RADIUS = 18;
export const CITIZEN_SPEED = 1.5;
export const TRAVEL_SPEED = 1.5;
export const CENTRAL_ROAD_X = DISTRICT_GAP + DISTRICT_WIDTH + DISTRICT_GAP / 2;

// --- Data Definitions ---
export const DISTRICT_DEFINITIONS: DistrictData[] = [
    { id: 1, name: "BAY STREET RESIDENTIAL", alias: 'home', x: DISTRICT_GAP, y: DISTRICT_GAP, width: DISTRICT_WIDTH, height: DISTRICT_HEIGHT, gateway: { x: DISTRICT_GAP + DISTRICT_WIDTH, y: DISTRICT_GAP + DISTRICT_HEIGHT / 2 } },
    { id: 2, name: "CORPORATE PARK", alias: 'office', x: DISTRICT_WIDTH + DISTRICT_GAP * 2, y: DISTRICT_GAP, width: DISTRICT_WIDTH, height: DISTRICT_HEIGHT, gateway: { x: DISTRICT_WIDTH + DISTRICT_GAP * 2, y: DISTRICT_GAP + DISTRICT_HEIGHT / 2 } },
    { id: 3, name: "THE RHETORICTORIUM", alias: 'amphitheater', x: DISTRICT_GAP, y: DISTRICT_HEIGHT + DISTRICT_GAP * 2, width: DISTRICT_WIDTH, height: DISTRICT_HEIGHT, gateway: { x: DISTRICT_GAP + DISTRICT_WIDTH, y: DISTRICT_HEIGHT + DISTRICT_GAP * 2 + DISTRICT_HEIGHT / 2 } },
    { id: 4, name: "IDLE ENCLAVE", alias: 'others', x: DISTRICT_WIDTH + DISTRICT_GAP * 2, y: DISTRICT_HEIGHT + DISTRICT_GAP * 2, width: DISTRICT_WIDTH, height: DISTRICT_HEIGHT, gateway: { x: DISTRICT_WIDTH + DISTRICT_GAP * 2, y: DISTRICT_HEIGHT + DISTRICT_GAP * 2 + DISTRICT_HEIGHT / 2 } },
];

// --- Main App Component ---
export default function GodMode() {
  const navigate = useNavigate();
  const { charactersData, updateCharactersData } = useTickStore();
  const { addLog } = useSimulationStore();
  console.log("charactersData in god mode: ", Array.from(charactersData?.values() || []));
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");

  // Convert store data to array for rendering
  const characters = Array.from(charactersData?.values() || []);

  const handleCharacterClick = (characterId: string) => {
    const char = characters.find((c) => c.characterId === characterId);
    if (char && char.initialDistrict !== char.targetDistrict) return;
    setSelectedCharacterId(characterId);
  };

  // MODIFICATION: Logic simplified to only update the target district
  const handleMoveCharacter = (targetDistrict: 'home' | 'office' | 'amphitheater' | 'others') => {
    if (selectedCharacterId === null || !charactersData) return;

    const updatedCharacters = Array.from(charactersData.values()).map((c) =>
      c.characterId === selectedCharacterId ? { ...c, targetDistrict: targetDistrict } : c
    );
    updateCharactersData(updatedCharacters);
    setSelectedCharacterId(null);
  };
  
  // MODIFICATION: Logic simplified to set the current district to the target
  const handleTravelComplete = (characterId: string, finalDistrict: 'home' | 'office' | 'amphitheater' | 'others') => {
      if (!charactersData) return;
      
      const updatedCharacters = Array.from(charactersData.values()).map(c => 
          c.characterId === characterId ? { ...c, initialDistrict: finalDistrict } : c
      );
      updateCharactersData(updatedCharacters);
  }

//   const handleNavigateToVoterDetails = (type: "citizen" | "candidate" | "reporter") => {
//     if (type === "candidate") {
//       navigate("candidate-details");
//     } else {
//       navigate("voter-details");
  const handleNavigateToVoterDetails = (type: 'citizen' | 'candidate' | 'reporter', characterId: string) => {
    if(type === 'candidate') {
      navigate(`candidate-details/${characterId}`);
    } else {
      navigate(`voter-details/${characterId}`);
    }
  };

  const handleLetsGo = () => {
    console.log("Prompt submitted:", prompt);
    // Add the prompt as a log for testing
    if (prompt.trim()) {
      const timestamp = new Date().toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      addLog(`${timestamp} >>>Divine Command: ${prompt}`);
      setPrompt(""); // Clear the prompt after submission
      
      // Simulate additional system response for testing
      setTimeout(() => {
        addLog(`${timestamp} >>>System: Processing divine intervention...`);
      }, 1000);
      
      setTimeout(() => {
        addLog(`${timestamp} >>>World Event: Divine command executed successfully`);
      }, 2000);
    }
    // Here you can add the logic to handle the prompt submission
  };

  // Test function to add multiple logs quickly (for demonstration)
  const addTestLogs = () => {
    const testMessages = [
      "Charlie Singh announced new economic policies",
      "Arman Patel held a press conference", 
      "Citizens are responding positively to recent changes",
      "Market fluctuations detected in the simulation",
      "Breaking: Major announcement expected tomorrow"
    ];
    
    testMessages.forEach((message, index) => {
      setTimeout(() => {
        const timestamp = new Date().toLocaleTimeString('en-US', { 
          hour12: false, 
          hour: '2-digit', 
          minute: '2-digit' 
        });
        addLog(`${timestamp} >>>${message}`);
      }, index * 800);
    });
  };

  const selectedCharacter = characters.find((c) => c.characterId === selectedCharacterId);

  return (
    <div className="h-screen w-full bg-black text-white overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-black py-4 px-8 border-b border-white/10 flex-shrink-0">
        <div className="max-w-full mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 
              className="text-white text-4xl tracking-wider"
              style={{ fontFamily: "Roboto Mono", fontWeight: 500 }}
            >
              God Mode
            </h1>
          </div>
          
          <div className="flex items-center gap-8">
            <LeaderProfile name="CHARLIE SINGH" approval={67} />
            <LeaderProfile name="ARMAN PATEL" approval={67} align="right" />
          </div>
        </div>
      </div>

      <main className="flex-1 grid grid-cols-12 gap-6 p-6 overflow-hidden min-h-0">
        {/* Acts of God Panel */}
        <div className="col-span-2 flex flex-col gap-4 overflow-hidden min-h-0">
          <ActsOfGodPanel />
          
          {/* Divine Intervention Section */}
          <div className="bg-black border border-white/20 rounded-lg p-4 flex-shrink-0">
            <h3 
              className="text-white text-lg mb-3 tracking-wider"
              style={{ fontFamily: "Roboto Mono", fontWeight: 500 }}
            >
              Divine Intervention
            </h3>
            <div className="flex flex-col gap-3">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your divine command..."
                className="w-full h-24 bg-black border border-white/30 rounded-lg p-3 text-white placeholder-white/50 resize-none focus:outline-none focus:border-white/60 text-sm"
                style={{ fontFamily: "Roboto Mono" }}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleLetsGo}
                  className="flex-1 px-4 py-2 bg-white text-black hover:bg-white/90 transition-colors rounded-lg text-sm"
                  style={{ fontFamily: "Roboto Mono", fontWeight: 500 }}
                >
                  Let's Go!
                </button>
                <button
                  onClick={addTestLogs}
                  className="px-3 py-2 bg-white/10 text-white hover:bg-white/20 border border-white/30 transition-colors rounded-lg text-xs"
                  style={{ fontFamily: "Roboto Mono" }}
                  title="Add test logs"
                >
                  Test
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="col-span-7 flex flex-col gap-4 overflow-hidden min-h-0">
          {/* Map Container */}
          <div className="flex-grow overflow-hidden min-h-0">
            <MapContainer
              characters={characters}
              selectedCharacterId={selectedCharacterId}
              onCharacterClick={handleCharacterClick}
              onTravelComplete={handleTravelComplete}
              onNavigateToVoterDetails={handleNavigateToVoterDetails}
            />
          </div>
          
          {/* Simulation Controls */}
          <div className="flex-shrink-0">
            <SimulationControls />
          </div>

          {selectedCharacter && (
            <CharacterControlModal
              character={selectedCharacter}
              onMove={handleMoveCharacter}
              onClose={() => setSelectedCharacterId(null)}
            />
          )}
        </div>

        {/* Logs Panel - Constrained height */}
        <div className="col-span-3 overflow-hidden min-h-0">
          <div className="h-full min-h-0">
            <Logs />
          </div>
        </div>
      </main>

      <NewsTicker />
    </div>
  );
}

// --- UI Components ---
function LeaderProfile({
  name,
  approval,
  align = "left",
}: {
  name: string;
  approval: number;
  align?: "left" | "right";
}) {
  return (
    <div
      className={`flex w-full max-w-xs items-center gap-3 ${align === "right" ? "flex-row-reverse" : ""}`}
    >
      <div
        className={`w-12 h-12 flex items-center justify-center bg-black rounded-full border-2 shrink-0 ${align === "right" ? "border-red-500" : "border-blue-500"}`}
      >
        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
            clipRule="evenodd"
          ></path>
        </svg>
      </div>
      <div className={`w-full flex flex-col ${align === "right" ? "items-end" : "items-start"}`}>
        <div className="w-full flex justify-between items-center">
          <p 
            className="text-xs tracking-widest text-white/60"
            style={{ fontFamily: "Roboto Mono" }}
          >
            APPROVAL RATING
          </p>
          <span 
            className="text-sm font-bold text-white"
            style={{ fontFamily: "Roboto Mono" }}
          >
            {approval}%
          </span>
        </div>
        <h2 
          className="font-bold tracking-wider mt-1 w-full text-white"
          style={{ fontFamily: "Roboto Mono" }}
        >
          {name}
        </h2>
        <div className="w-full bg-white/20 h-2 rounded-full border border-white/30 mt-1">
          <div className="bg-white h-full rounded-full" style={{ width: `${approval}%` }}></div>
        </div>
      </div>
    </div>
  );
}

function ActsOfGodPanel() {
  const actions = [
    { icon: "▲", text: "Earthquake" },
    { icon: "♦", text: "Scandal Expose" },
    { icon: "→", text: "Market Crash" },
    { icon: "♦", text: "Assassination Attempt" },
  ];
  return (
    <div className="bg-black border border-white/20 rounded-lg flex flex-col flex-shrink-0">
      <div className="p-4 border-b border-white/20">
        <h3 
          className="font-bold text-lg tracking-wider text-white"
          style={{ fontFamily: "Roboto Mono" }}
        >
          Acts Of God
        </h3>
      </div>
      <div className="p-4">
        <ul className="space-y-3">
          {actions.map((action, i) => (
            <li
              key={i}
              className="p-3 bg-black border border-white/30 rounded-lg cursor-pointer hover:bg-white/5 transition-colors duration-200"
            >
              <span className="mr-3 text-white">{action.icon}</span>
              <span 
                className="text-white text-sm"
                style={{ fontFamily: "Roboto Mono" }}
              >
                {action.text}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function NewsTicker() {
  return (
    <footer className="w-full bg-black border-t border-white/20 p-3 overflow-hidden">
      <div className="whitespace-nowrap animate-marquee">
        <span 
          className="mx-8 text-white/70"
          style={{ fontFamily: "Roboto Mono" }}
        >
          Local politician caught arguing with ChatGPT over vote count.
        </span>
        <span 
          className="mx-8 text-white/70"
          style={{ fontFamily: "Roboto Mono" }}
        >
          New startup offers subscription-based fresh air; premium tier includes "pine forest" scent.
        </span>
        <span 
          className="mx-8 text-white/70"
          style={{ fontFamily: "Roboto Mono" }}
        >
          Minister declares Earth is flat 'in some constituencies'.
        </span>
      </div>
      <style>{`@keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-150%); } } .animate-marquee { display: inline-block; animation: marquee 30s linear infinite; }`}</style>
    </footer>
  );
}

function CharacterControlModal({
  character,
  onMove,
  onClose,
}: {
  character: CharacterData;
  onMove: (district: "home" | "office" | "amphitheater" | "others") => void;
  onClose: () => void;
}) {
  return (
    <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10 p-4">
      <div className="bg-black border-2 border-white rounded-lg p-6 text-center shadow-lg relative max-w-sm w-full">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white/60 hover:text-white font-bold text-lg"
        >
          ×
        </button>
        <h3 
          className="font-bold text-lg capitalize text-white"
          style={{ fontFamily: "Roboto Mono" }}
        >
          {character.type} <span className="text-yellow-400">#{character.characterId}</span>
        </h3>
        <p 
          className="text-sm text-white/60 mb-4"
          style={{ fontFamily: "Roboto Mono" }}
        >
          Current District:{" "}
          {DISTRICT_DEFINITIONS.find((d) => d.alias === character.initialDistrict)?.name}
        </p>
        <p 
          className="text-sm mb-2 text-white"
          style={{ fontFamily: "Roboto Mono" }}
        >
          Move to:
        </p>
        <div className="grid grid-cols-2 gap-2">
          {DISTRICT_DEFINITIONS.map((d) => (
            <button
              key={d.id}
              onClick={() => {
                onMove(d.alias);
                onClose();
              }}
              className="bg-white hover:bg-white/90 text-black font-bold py-2 px-4 rounded text-xs disabled:bg-white/20 disabled:cursor-not-allowed disabled:text-white/40"
              disabled={d.alias === character.initialDistrict}
              style={{ fontFamily: "Roboto Mono" }}
            >
              {d.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

interface MapContainerProps {
    characters: CharacterData[];
    selectedCharacterId: string | null;
    onCharacterClick: (id: string) => void;
    onTravelComplete: (id: string, finalDistrict: 'home' | 'office' | 'amphitheater' | 'others') => void;
    onNavigateToVoterDetails: (type: 'citizen' | 'candidate' | 'reporter', characterId: string) => void;
}

function MapContainer({
  characters,
  selectedCharacterId,
  onCharacterClick,
  onTravelComplete,
  onNavigateToVoterDetails,
}: MapContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: rect.width - 8, // Account for border
          height: rect.height - 40, // Account for header
        });
        setIsReady(true);
      }
    };

    if (containerRef.current) {
      updateDimensions();
      const resizeObserver = new ResizeObserver(updateDimensions);
      resizeObserver.observe(containerRef.current);
      return () => resizeObserver.disconnect();
    }
  }, []);

  return (
    <div
      className="bg-black/30 rounded-lg shadow-2xl border-4 border-gray-700/80 flex-grow w-full h-full"
      ref={containerRef}
    >
      {isReady && characters !== null && characters.length > 0 ? (
        <Stage
          width={dimensions.width}
          height={dimensions.height}
          options={{
            backgroundColor: 0x080808,
            autoDensity: true,
          }}
        >
          <Scene containerWidth={dimensions.width} containerHeight={dimensions.height}>
            <GridOverlay width={LOGICAL_WIDTH} height={LOGICAL_HEIGHT} />
            {DISTRICT_DEFINITIONS.map((district) => (
              <District key={district.id} {...district} />
            ))}
            {characters
              .filter((character: CharacterData) =>
                DISTRICT_DEFINITIONS.find((d) => d.alias === character.initialDistrict)
              )
              .map((character: CharacterData) => {
                const district = DISTRICT_DEFINITIONS.find(
                  (d) => d.alias === character.initialDistrict
                )!;
                return (
                  <Character
                    key={character.characterId}
                    {...character}
                    bounds={district}
                    isSelected={character.characterId === selectedCharacterId}
                    onClick={onCharacterClick}
                    onTravelComplete={onTravelComplete}
                    onNavigateToVoterDetails={onNavigateToVoterDetails}
                  />
                );
              })}
          </Scene>
        </Stage>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
        </div>
      )}
    </div>
  );
} 

const Scene = ({ children, containerWidth, containerHeight }: { children: React.ReactNode; containerWidth: number; containerHeight: number; }) => {
  const app = useApp();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (app && app.screen && app.screen.width > 0) {
        setIsReady(true);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [app]);

  if (!isReady || !app || !app.screen) {
    return null;
  }

  // Scale to fit the entire content within the container
  const scaleX = containerWidth / LOGICAL_WIDTH;
  const scaleY = containerHeight / LOGICAL_HEIGHT;
  const scale = Math.min(scaleX, scaleY); // Use min to ensure everything fits

  // Center the content within the container
  const scaledWidth = LOGICAL_WIDTH * scale;
  const scaledHeight = LOGICAL_HEIGHT * scale;
  const x = (containerWidth - scaledWidth) / 2;
  const y = (containerHeight - scaledHeight) / 2;

  return (
    <Container x={x} y={y} scale={scale}>
      {children}
    </Container>
  );
};

function Gateway({ x, y }: Point) {
  const draw = useCallback((g: PIXI.Graphics) => {
    g.clear();
    g.beginFill(0xa8a8a8, 1);
    g.drawRect(-4, -15, 8, 30);
    g.endFill();
  }, []);

  return <Graphics x={x} y={y} draw={draw} alpha={0.5} />;
}

function District({ id: _id, alias: _alias, x, y, width, height, name, gateway }: DistrictData) {
  const draw = useCallback(
    (g: PIXI.Graphics) => {
      g.clear();
      g.lineStyle(2, 0x4e4e4e, 1);
      g.drawRoundedRect(0, 0, width, height, 16);
      g.endFill();
    },
    [width, height]
  );

  const textStyle = useMemo(
    () =>
      new PIXI.TextStyle({
        fontFamily: "Arial",
        fontSize: 14,
        fill: "#A8A8A8",
        align: "center",
      }),
    []
  );

  return (
    <Container x={x} y={y}>
      <Graphics draw={draw} />
      <Text text={name} x={width / 2} y={-10} anchor={0.5} style={textStyle} />
      <Gateway x={gateway.x - x} y={gateway.y - y} />
    </Container>
  );
}
