import * as PIXI from "pixi.js";
import Character from "../components/simulation/Character";
import GridOverlay from "../components/simulation/GridOverlay";
import { Stage, Graphics, Text, Container, useApp } from "@pixi/react";
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTickStore } from "../store/tickStore";
import SimulationControls from "../components/simulation/SimulationControls";

// --- Type Definitions (Refactored for Declarative State) ---
interface Point {
  x: number;
  y: number;
}
interface DistrictData {
  id: number;
  name: string;
  alias: "home" | "office" | "amphitheatre" | "outside";
  x: number;
  y: number;
  width: number;
  height: number;
  gateway: Point;
}

interface CharacterData {
  characterId: string;
  initialDistrict: "home" | "office" | "amphitheatre" | "outside";
  targetDistrict: "home" | "office" | "amphitheatre" | "outside";
  name: string;
  color: number;
  type: "citizen" | "candidate" | "reporter";
  log: string;
  district: "home" | "office" | "amphitheatre" | "outside";
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
  {
    id: 1,
    name: "BAY STREET RESIDENTIAL",
    alias: "home",
    x: DISTRICT_GAP,
    y: DISTRICT_GAP,
    width: DISTRICT_WIDTH,
    height: DISTRICT_HEIGHT,
    gateway: { x: DISTRICT_GAP + DISTRICT_WIDTH, y: DISTRICT_GAP + DISTRICT_HEIGHT / 2 },
  },
  {
    id: 2,
    name: "CORPORATE PARK",
    alias: "office",
    x: DISTRICT_WIDTH + DISTRICT_GAP * 2,
    y: DISTRICT_GAP,
    width: DISTRICT_WIDTH,
    height: DISTRICT_HEIGHT,
    gateway: { x: DISTRICT_WIDTH + DISTRICT_GAP * 2, y: DISTRICT_GAP + DISTRICT_HEIGHT / 2 },
  },
  {
    id: 3,
    name: "THE RHETORICTORIUM",
    alias: "amphitheatre",
    x: DISTRICT_GAP,
    y: DISTRICT_HEIGHT + DISTRICT_GAP * 2,
    width: DISTRICT_WIDTH,
    height: DISTRICT_HEIGHT,
    gateway: {
      x: DISTRICT_GAP + DISTRICT_WIDTH,
      y: DISTRICT_HEIGHT + DISTRICT_GAP * 2 + DISTRICT_HEIGHT / 2,
    },
  },
  {
    id: 4,
    name: "IDLE ENCLAVE",
    alias: "outside",
    x: DISTRICT_WIDTH + DISTRICT_GAP * 2,
    y: DISTRICT_HEIGHT + DISTRICT_GAP * 2,
    width: DISTRICT_WIDTH,
    height: DISTRICT_HEIGHT,
    gateway: {
      x: DISTRICT_WIDTH + DISTRICT_GAP * 2,
      y: DISTRICT_HEIGHT + DISTRICT_GAP * 2 + DISTRICT_HEIGHT / 2,
    },
  },
];

// const generateInitialCharacters = (count: number): CharacterData[] => {
//     const characters: CharacterData[] = [];
//     // MODIFICATION: current and target district IDs are the same initially
//     characters.push({ characterId: 0, currentDistrictId: 1, targetDistrictId: 1, color: 0x4d82f7, type: 'candidate' });
//     characters.push({ characterId: 1, currentDistrictId: 2, targetDistrictId: 2, color: 0xf7934d, type: 'candidate' });

//     for (let i = 2; i < count; i++) {
//         const districtId = Math.floor(Math.random() * 4) + 1;
//         characters.push({
//             characterId: i,
//             currentDistrictId: districtId,
//             targetDistrictId: districtId,
//             color: Math.random() > 0.4 ? 0x4d82f7 : 0xf7934d,
//             type: 'citizen',
//         });
//     }
//     return characters;
// };

// --- Main App Component ---
export default function GodMode() {
  const navigate = useNavigate();
  const { charactersData, updateCharactersData } = useTickStore();
  console.log("charactersData in god mode: ", Array.from(charactersData?.values() || []));
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  // MODIFICATION: travelPlans state is removed

  // Convert store data to array for rendering
  const characters = Array.from(charactersData?.values() || []);

  const handleCharacterClick = (characterId: string) => {
    const char = characters.find((c) => c.characterId === characterId);
    if (char && char.initialDistrict !== char.targetDistrict) return;
    setSelectedCharacterId(characterId);
  };

  // MODIFICATION: Logic simplified to only update the target district
  const handleMoveCharacter = (targetDistrict: "home" | "office" | "amphitheatre" | "outside") => {
    if (selectedCharacterId === null || !charactersData) return;

    const updatedCharacters = Array.from(charactersData.values()).map((c) =>
      c.characterId === selectedCharacterId ? { ...c, targetDistrict: targetDistrict } : c
    );
    updateCharactersData(updatedCharacters);
    setSelectedCharacterId(null);
  };

  // MODIFICATION: Logic simplified to set the current district to the target
  const handleTravelComplete = (
    characterId: string,
    finalDistrict: "home" | "office" | "amphitheatre" | "outside"
  ) => {
    if (!charactersData) return;

    const updatedCharacters = Array.from(charactersData.values()).map((c) =>
      c.characterId === characterId ? { ...c, initialDistrict: finalDistrict } : c
    );
    updateCharactersData(updatedCharacters);
  };

  const handleNavigateToVoterDetails = (type: "citizen" | "candidate" | "reporter") => {
    if (type === "candidate") {
      navigate("candidate-details");
    } else {
      navigate("voter-details");
    }
  };

  const selectedCharacter = characters.find((c) => c.characterId === selectedCharacterId);

  return (
    <div className="bg-[#0f172a] min-h-screen flex flex-col font-mono text-gray-300">
      <TopBar />
      <main className="flex-grow grid grid-cols-1 lg:grid-cols-6 gap-4 p-4">
        <div className="lg:col-span-1 order-2 lg:order-1">
          <ActsOfGodPanel />
        </div>
        <div className="lg:col-span-4 order-1 lg:order-2 flex flex-col relative">
          <MapContainer
            characters={characters}
            selectedCharacterId={selectedCharacterId}
            onCharacterClick={handleCharacterClick}
            onTravelComplete={handleTravelComplete}
            onNavigateToVoterDetails={handleNavigateToVoterDetails}
          />
          <SimulationControls />
          {selectedCharacter && (
            <CharacterControlModal
              character={selectedCharacter}
              onMove={handleMoveCharacter}
              onClose={() => setSelectedCharacterId(null)}
            />
          )}
        </div>
        <div className="lg:col-span-1 order-3 lg:order-3">
          <LogsPanel />
        </div>
      </main>
      <NewsTicker />
    </div>
  );
}

// --- UI Components ---
function TopBar() {
  return (
    <header className="flex flex-col md:flex-row items-center justify-between p-4 border-b border-gray-700/50 gap-4">
      <LeaderProfile name="CHARLIE SINGH" approval={67} />
      <LeaderProfile name="ARMAN PATEL" approval={67} align="right" />
    </header>
  );
}
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
        className={`w-12 h-12 flex items-center justify-center bg-gray-800 rounded-full border-2 border-gray-600 shrink-0 ${align === "right" ? "bg-red-900/50 border-red-500" : "bg-blue-900/50 border-blue-500"}`}
      >
        <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
            clipRule="evenodd"
          ></path>
        </svg>
      </div>
      <div className={`w-full flex flex-col ${align === "right" ? "items-end" : "items-start"}`}>
        <div className="w-full flex justify-between items-center">
          <p className="text-xs tracking-widest text-gray-400">APPROVAL RATING</p>
          <span className="text-sm font-bold">{approval}%</span>
        </div>
        <h2 className="font-bold tracking-wider mt-1 w-full">{name}</h2>
        <div className="w-full bg-gray-700/50 h-2 rounded-full border border-gray-600/50 mt-1">
          <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${approval}%` }}></div>
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
    <div className="h-full p-4 bg-black/20 rounded-lg">
      <h3 className="font-bold text-lg mb-4 tracking-wider">Acts Of God</h3>
      <ul className="space-y-3">
        {actions.map((action, i) => (
          <li
            key={i}
            className="p-3 bg-gray-800/80 border border-gray-700 rounded-md cursor-pointer hover:bg-gray-700 transition-colors duration-200"
          >
            <span className="mr-3 text-cyan-400">{action.icon}</span>
            {action.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
function LogsPanel() {
  const logEntries = [
    "Day 10",
    "Charlie Singh held a rally to please his voters.",
    "Acts of vandalism on Rahul's posters.",
    "Earthquake caused 1m casualties.",
  ];
  return (
    <div className="h-full p-4 bg-black/20 rounded-lg">
      <h3 className="font-bold text-lg mb-4 tracking-wider">Logs</h3>
      <ul className="space-y-3 text-sm text-gray-400">
        {logEntries.map((entry, i) => (
          <li key={i} className="leading-relaxed">{`*** ${entry}`}</li>
        ))}
      </ul>
      <div className="mt-4 flex flex-col gap-2">
        <button className="w-full py-2 bg-gray-800/80 border border-gray-700 rounded-md text-sm">
          News
        </button>
        <button className="w-full py-2 bg-gray-800/80 border border-gray-700 rounded-md text-sm">
          Social Media
        </button>
      </div>
    </div>
  );
}
function NewsTicker() {
  return (
    <footer className="w-full bg-black/30 p-2 overflow-hidden border-t border-gray-700/50">
      <div className="whitespace-nowrap animate-marquee">
        <span className="mx-8 text-gray-400">
          Local politician caught arguing with ChatGPT over vote count.
        </span>
        <span className="mx-8 text-gray-400">
          New startup offers subscription-based fresh air; premium tier includes "pine forest"
          scent.
        </span>
        <span className="mx-8 text-gray-400">
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
  onMove: (district: "home" | "office" | "amphitheatre" | "outside") => void;
  onClose: () => void;
}) {
  return (
    <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10 p-4">
      <div className="bg-gray-900 border-2 border-cyan-500 rounded-lg p-6 text-center shadow-lg relative max-w-sm w-full">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white font-bold text-lg"
        >
          ×
        </button>
        <h3 className="font-bold text-lg capitalize">
          {character.type} <span className="text-yellow-400">#{character.characterId}</span>
        </h3>
        <p className="text-sm text-gray-400 mb-4">
          Current District:{" "}
          {DISTRICT_DEFINITIONS.find((d) => d.alias === character.initialDistrict)?.name}
        </p>
        <p className="text-sm mb-2">Move to:</p>
        <div className="grid grid-cols-2 gap-2">
          {DISTRICT_DEFINITIONS.map((d) => (
            <button
              key={d.id}
              onClick={() => {
                onMove(d.alias);
                onClose();
              }}
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded text-xs disabled:bg-gray-500 disabled:cursor-not-allowed"
              disabled={d.alias === character.initialDistrict}
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
  onTravelComplete: (
    id: string,
    finalDistrict: "home" | "office" | "amphitheatre" | "outside"
  ) => void;
  onNavigateToVoterDetails: (type: "citizen" | "candidate" | "reporter") => void;
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

  useEffect(() => {
    if (containerRef.current) {
      const timer = setTimeout(() => setIsReady(true), 100);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div
      className="bg-black/30 p-4 rounded-lg shadow-2xl border-4 border-gray-700/80 w-full flex-grow relative"
      ref={containerRef}
    >
      <h2 className="text-center text-cyan-400 mb-2 tracking-widest absolute top-2 left-1/2 -translate-x-1/2 z-10">
        SIMPLOLIS POLITICAL MAP
      </h2>
      {isReady && characters !== null && characters.length > 0 ? (
        <Stage
          className="w-full h-full"
          options={{
            backgroundColor: 0x080808,
            resizeTo: containerRef.current!,
            autoDensity: true,
          }}
        >
          <Scene>
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

const Scene = ({ children }: { children: React.ReactNode }) => {
  const app = useApp();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (app && app.screen && app.screen.width > 0) {
        setIsReady(true);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [app]);

  if (!isReady || !app || !app.screen) {
    return null;
  }

  const scale = Math.min(app.screen.width / LOGICAL_WIDTH, app.screen.height / LOGICAL_HEIGHT) || 1;
  const x = (app.screen.width - LOGICAL_WIDTH * scale) / 2;
  const y = (app.screen.height - LOGICAL_HEIGHT * scale) / 2;

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
