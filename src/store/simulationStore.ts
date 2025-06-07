import { create } from "zustand";
import type { Candidate } from "../types/candidate";

interface SimulationState {
  simulationName: string;
  description: string;
  candidates: [Candidate, Candidate] | null;
  
  // Actions
  setSimulationName: (name: string) => void;
  setDescription: (desc: string) => void;
  setCandidates: (candidates: [Candidate, Candidate]) => void;
  
  // Reset function
  reset: () => void;
  
  // Get all data at once
  getAllData: () => {
    simulationName: string;
    description: string;
    candidates: [Candidate, Candidate] | null;
  };
}

export const useSimulationStore = create<SimulationState>((set, get) => ({
  simulationName: "",
  description: "",
  candidates: null,
  
  setSimulationName: (name) => set({ simulationName: name }),
  setDescription: (desc) => set({ description: desc }),
  setCandidates: (candidates) => set({ candidates }),
  
  reset: () => set({ 
    simulationName: "",
    description: "",
    candidates: null
  }),
  
  getAllData: () => ({
    simulationName: get().simulationName,
    description: get().description,
    candidates: get().candidates
  })
})); 