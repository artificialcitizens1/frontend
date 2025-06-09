import baseInstance from './baseInstance';

export interface PersonaResponse {
  success: boolean;
  message: string;
  data: {
    persona: {
      personaId: string;
      name: string;
      role: string;
      personaType: string;
      ideologyPosition: string;
      communicationStyle: string;
      intro: string;
      longTermGoal?: string;
      candidateAffinities: Array<{
        candidateId: string;
        affinityScore: number;
      }>;
      authenticityLevel: number;
      charismaLevel: number;
      integrityLevel: number;
    };
    opponent?: {
      personaId: string;
      name: string;
      role: string;
      personaType: string;
      ideologyPosition: string;
      communicationStyle: string;
      intro: string;
      longTermGoal?: string;
      candidateAffinities?: Array<{
        candidateId: string;
        affinityScore: number;
      }>;
      authenticityLevel?: number;
      charismaLevel?: number;
      integrityLevel?: number;
    };
  };
}

export const getPersonaDetails = async (personaId: string): Promise<PersonaResponse> => {
  try {
    const response = await baseInstance.get(`/api/persona/${personaId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching persona details:', error);
    return {
      success: false,
      message: 'Failed to fetch persona details',
      data: {
        persona: {
          personaId: '',
          name: '',
          role: '',
          personaType: '',
          ideologyPosition: '',
          communicationStyle: '',
          intro: '',
          longTermGoal: '',
          candidateAffinities: [],
          authenticityLevel: 0,
          charismaLevel: 0,
          integrityLevel: 0
        }
      }
    };
  }
};
