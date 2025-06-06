export type CommunicationStyle = 'Aggressive' | 'Calm' | 'Trendy';
export type MediaInteractions = 'None' | 'Few' | 'Many';

export interface PoliticalStanding {
  x: number; // -1 to 1 for Left to Right
  y: number; // -1 to 1 for Libertarian to Authoritarian
}

export interface CandidateParameters {
  communicationStyle: CommunicationStyle;
  mediaInteractions: MediaInteractions;
  charisma: number; // 0 to 1
  temper: number; // 0 to 1
  integrity: number; // 0 to 1
  authenticity: number; // 0 to 1
}

export interface Candidate {
  id: string;
  name: string;
  description: string;
  avatarUrl: string;
  parameters: CandidateParameters;
  politicalStanding: PoliticalStanding;
} 