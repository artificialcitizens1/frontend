import baseInstance from './baseInstance';
import type { Candidate } from '../types/candidate';
import { useSimulationStore } from '../store';

interface SimulationStartRequest {
  simulationData: {
    name: string;
    description: string;
  };
  candidatesData: Array<{
    name: string;
    intro: string;
    communicationStyle: string;
    mediaInteractions: string;
    charismaLevel: number;
    temperLevel: number;
    integrityLevel: number;
    authenticityLevel: number;
    ideologyPosition: string;
  }>;
}

interface SimulationResponse {
  simulation: {
    name: string;
    simId: string;
    currentTick: number;
    tickStatus: string;
    description: string;
    tickSize: number;
    totalSubTicks: number;
    status: string;
    _id: string;
    startedAt: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  candidates: Array<{
    personaId: string;
    simId: string;
    name: string;
    role: string;
    // Include other candidate properties, but we only really need these for reference
    [key: string]: any;
  }>;
}

interface LoreResponse {
  title: string;
  content: string[];
}

export const startSimulationFlow = async (
  candidates: Candidate[], 
  simulationName: string = "2025 General Election", 
  simulationDescription: string = "A simulation of the 2025 general election with two major candidates."
): Promise<SimulationResponse> => {
  // Transform the candidates data to match the API requirements
  const candidatesData = candidates.map(candidate => {
    // Map political standing to ideology position
    let ideologyPosition = '';
    const { x, y } = candidate.politicalStanding;
    
    if (x <= 0 && y <= 0) {
      ideologyPosition = 'Libertarian-Left';
    } else if (x > 0 && y <= 0) {
      ideologyPosition = 'Libertarian-Right';
    } else if (x <= 0 && y > 0) {
      ideologyPosition = 'Authoritarian-Left';
    } else {
      ideologyPosition = 'Authoritarian-Right';
    }
    
    // Convert 0-1 values to 1-10 scale for levels
    const charismaLevel = Math.round(candidate.parameters.charisma * 10);
    const temperLevel = Math.round(candidate.parameters.temper * 10);
    const integrityLevel = Math.round(candidate.parameters.integrity * 10);
    const authenticityLevel = Math.round(candidate.parameters.authenticity * 10);
    
    return {
      name: candidate.name,
      intro: candidate.description,
      communicationStyle: candidate.parameters.communicationStyle,
      mediaInteractions: candidate.parameters.mediaInteractions,
      charismaLevel,
      temperLevel,
      integrityLevel,
      authenticityLevel,
      ideologyPosition
    };
  });
  
  const payload: SimulationStartRequest = {
    simulationData: {
      name: simulationName,
      description: simulationDescription
    },
    candidatesData
  };
  
  const response = await baseInstance.post('/api/simulations/start-flow', payload);
  return response.data;
};

export const getSimulationLore = async (simId: string): Promise<LoreResponse> => {
  const response = await baseInstance.get(`/api/simulations/${simId}/lore`);
  
  // The API returns { lore: string } - a single text block
  const data = response.data;
  
  // Split the lore text into paragraphs for better display
  let paragraphs: string[] = [];
  if (data && data.lore) {
    // Split the text by newline characters to get paragraphs
    paragraphs = data.lore.split('\n\n').filter((p: string) => p.trim() !== '');
  }

  // Try to get candidate names from the store for a more specific title
  let title = "The Story of Our World";
  
  try {
    // This is a bit of a hack to access the store outside of a component
    // In a real app, you might want to pass this information more directly
    const store = useSimulationStore.getState();
    if (store.candidates && store.candidates.length >= 2) {
      const candidate1 = store.candidates[0].name;
      const candidate2 = store.candidates[1].name;
      title = `${candidate1} vs ${candidate2}: A Tale of Two Visions`;
    }
  } catch (e) {
    // If there's any error accessing the store, just use the default title
    console.log('Could not access candidate names for title');
  }
  
  // Return in the format our component expects
  return {
    title,
    content: paragraphs
  };
}; 

export const getSimulationStatus = async (tick=0, simId: string): Promise<SimulationResponse> => {
  try {
      const response = await baseInstance.post(`/api/simulations/data`, {tick: tick, simId: simId});
      return response.data;
  } catch (error) {
    console.error('Error fetching simulation status:', error);
    throw error;
  }
};