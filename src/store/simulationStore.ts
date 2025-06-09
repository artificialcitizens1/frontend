import { create } from "zustand";
import type { Candidate } from "../types/candidate";
import type { SimulationSettings } from "../types/simulation";

interface SimulationState {
  simulationName: string;
  description: string;
  candidates: [Candidate, Candidate] | null;
  simulationSettings: SimulationSettings | null;
  simulationId: string | null;
  currentTick: number;

  simulationData: any | null;
  logs: string[];

  // Actions
  setSimulationName: (name: string) => void;
  setDescription: (desc: string) => void;
  setCandidates: (candidates: [Candidate, Candidate]) => void;
  setSimulationSettings: (settings: SimulationSettings) => void;
  setSimulationId: (id: string) => void;
  setCurrentTick: (tick: number) => void;
  setSimulationData: (data: any) => void;
  addLog: (log: string) => void;
  setLogs: (logs: string[]) => void;
  clearLogs: () => void;

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
  currentTick: 1,
  simulationData: null,
  logs: [],
  setSimulationName: (name) => set({ simulationName: name }),
  setDescription: (desc) => set({ description: desc }),
  setCandidates: (candidates) => set({ candidates }),
  setSimulationSettings: (settings) => set({ simulationSettings: settings }),
  setSimulationId: (id) => set({ simulationId: id }),
  setCurrentTick: (tick) => set({ currentTick: tick }),
  setSimulationData: (data) => set({ simulationData: data }),
  addLog: (log) => set((state) => ({ logs: [...state.logs, log] })),
  setLogs: (logs) => set({ logs }),
  clearLogs: () => set({ logs: [] }),
  reset: () =>
    set({
      simulationName: "",
      description: "",
      candidates: null,
      simulationSettings: null,
      currentTick: 1,
      simulationData: null,
      logs: [],
    }),

  getAllData: () => ({
    simulationName: get().simulationName,
    description: get().description,
    candidates: get().candidates,
    simulationSettings: get().simulationSettings,
  }),
  getSimulationData: () => get().simulationData,
}));
