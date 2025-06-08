import { create } from "zustand";
import type { Candidate } from "../types/candidate";
import type { SimulationSettings } from "../types/simulation";

interface SimulationState {
  simulationName: string;
  description: string;
  candidates: [Candidate, Candidate] | null;
  simulationSettings: SimulationSettings | null;
  simulationId: string | null;
  simulationData: any | null;
  // Actions
  setSimulationName: (name: string) => void;
  setDescription: (desc: string) => void;
  setCandidates: (candidates: [Candidate, Candidate]) => void;
  setSimulationSettings: (settings: SimulationSettings) => void;
  setSimulationId: (id: string) => void;
  setSimulationData: (data: any) => void;
  // Reset function
  reset: () => void;

  // Get all data at once
  getAllData: () => {
    simulationName: string;
    description: string;
    candidates: [Candidate, Candidate] | null;
    simulationSettings: SimulationSettings | null;
  };

  // Get simulation data
  getSimulationData: () => any | null;
}

export const useSimulationStore = create<SimulationState>((set, get) => ({
  simulationName: "",
  description: "",
  candidates: null,
  simulationSettings: null,
  simulationId: null,
  simulationData: null,
  setSimulationName: (name) => set({ simulationName: name }),
  setDescription: (desc) => set({ description: desc }),
  setCandidates: (candidates) => set({ candidates }),
  setSimulationSettings: (settings) => set({ simulationSettings: settings }),
  setSimulationId: (id) => set({ simulationId: id }),
  setSimulationData: (data) => set({ simulationData: data }),
  reset: () =>
    set({
      simulationName: "",
      description: "",
      candidates: null,
      simulationSettings: null,
      simulationData: null,
    }),

  getAllData: () => ({
    simulationName: get().simulationName,
    description: get().description,
    candidates: get().candidates,
    simulationSettings: get().simulationSettings,
  }),
  getSimulationData: () => get().simulationData,
}));
