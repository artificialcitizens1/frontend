import React, { useState } from "react";

interface MovementControllerUIProps {
  onTargetsSet: (targets: {
    person1?: { x: number; y: number; z: number };
    person2?: { x: number; y: number; z: number };
  }) => void;
}

const inputStyle =
  "shadow appearance-none border rounded w-16 py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xs";
const labelStyle = "block text-gray-700 text-xs font-bold mr-1";

interface PersonInputGroupProps {
  personId: string;
  coords: { x: string; y: string; z: string };
  onChange: (personId: string, axis: "x" | "y" | "z", value: string) => void;
}

const PersonInputGroup = ({ personId, coords, onChange }: PersonInputGroupProps): JSX.Element => (
  <div className="mb-2 p-2 border border-gray-300 rounded">
    <h4 className="font-bold text-sm mb-1">
      {personId === "person1" ? "Person 1 Target" : "Person 2 Target"}
    </h4>
    <div className="flex items-center mb-1">
      <label htmlFor={`${personId}-x`} className={labelStyle}>
        X:
      </label>
      <input
        type="number"
        id={`${personId}-x`}
        value={coords.x}
        onChange={(e) => onChange(personId, "x", e.target.value)}
        className={inputStyle}
        placeholder="X"
      />
    </div>
    <div className="flex items-center mb-1">
      <label htmlFor={`${personId}-y`} className={labelStyle}>
        Y:
      </label>
      <input
        type="number"
        id={`${personId}-y`}
        value={coords.y}
        onChange={(e) => onChange(personId, "y", e.target.value)}
        className={inputStyle}
        placeholder="Y (Ground)"
      />
    </div>
    <div className="flex items-center">
      <label htmlFor={`${personId}-z`} className={labelStyle}>
        Z:
      </label>
      <input
        type="number"
        id={`${personId}-z`}
        value={coords.z}
        onChange={(e) => onChange(personId, "z", e.target.value)}
        className={inputStyle}
        placeholder="Z"
      />
    </div>
  </div>
);

const MovementControllerUI = ({ onTargetsSet }: MovementControllerUIProps): JSX.Element => {
  const [p1Coords, setP1Coords] = useState({ x: "", y: "", z: "" });
  const [p2Coords, setP2Coords] = useState({ x: "", y: "", z: "" });

  const handleInputChange = (personId: string, axis: "x" | "y" | "z", value: string) => {
    if (personId === "person1") {
      setP1Coords((prev) => ({ ...prev, [axis]: value }));
    } else {
      setP2Coords((prev) => ({ ...prev, [axis]: value }));
    }
  };

  const handleSubmit = () => {
    const targets: {
      person1?: { x: number; y: number; z: number };
      person2?: { x: number; y: number; z: number };
    } = {};

    const p1x = parseFloat(p1Coords.x);
    const p1y = parseFloat(p1Coords.y);
    const p1z = parseFloat(p1Coords.z);
    if (!isNaN(p1x) && !isNaN(p1y) && !isNaN(p1z)) {
      targets.person1 = { x: p1x, y: p1y, z: p1z };
    }

    const p2x = parseFloat(p2Coords.x);
    const p2y = parseFloat(p2Coords.y);
    const p2z = parseFloat(p2Coords.z);
    if (!isNaN(p2x) && !isNaN(p2y) && !isNaN(p2z)) {
      targets.person2 = { x: p2x, y: p2y, z: p2z };
    }

    if (Object.keys(targets).length > 0) {
      onTargetsSet(targets);
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "10px",
        right: "10px",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        padding: "12px",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        zIndex: 100,
        fontFamily: "sans-serif",
        fontSize: "12px",
      }}
    >
      <h3 className="text-md font-semibold mb-2 text-gray-800">Movement Controller</h3>
      <PersonInputGroup personId="person1" coords={p1Coords} onChange={handleInputChange} />
      <PersonInputGroup personId="person2" coords={p2Coords} onChange={handleInputChange} />
      <button
        onClick={handleSubmit}
        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline text-xs"
      >
        Set Targets & Move
      </button>
    </div>
  );
};

export default MovementControllerUI;
