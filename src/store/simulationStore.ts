import { create } from "zustand";
import type { Candidate } from "../types/candidate";
import type { SimulationSettings } from "../types/simulation";

interface SimulationState {
  simulationName: string;
  description: string;
  candidates: [Candidate, Candidate] | null;
  simulationSettings: SimulationSettings | null;
  
  // Actions
  setSimulationName: (name: string) => void;
  setDescription: (desc: string) => void;
  setCandidates: (candidates: [Candidate, Candidate]) => void;
  setSimulationSettings: (settings: SimulationSettings) => void;
  
  // Reset function
  reset: () => void;
  
  // Get all data at once
  getAllData: () => {
    simulationName: string;
    description: string;
    candidates: [Candidate, Candidate] | null;
    simulationSettings: SimulationSettings | null;
  };
}

export const useSimulationStore = create<SimulationState>((set, get) => ({
  simulationName: "",
  description: "",
  candidates: null,
  simulationSettings: null,
  
  setSimulationName: (name) => set({ simulationName: name }),
  setDescription: (desc) => set({ description: desc }),
  setCandidates: (candidates) => set({ candidates }),
  setSimulationSettings: (settings) => set({ simulationSettings: settings }),
  
  reset: () => set({ 
    simulationName: "",
    description: "",
    candidates: null,
    simulationSettings: null
  }),
  
  getAllData: () => ({
    simulationName: get().simulationName,
    description: get().description,
    candidates: get().candidates,
    simulationSettings: get().simulationSettings
  })
})); 