import baseInstance from './baseInstance';

// ==========================================
// TYPE DEFINITIONS
// ==========================================
export interface NewsReporter {
  personaId: string;
  name: string;
  role: string;
  personaType: string;
  ideologyPosition: string;
}

export interface NewsEvent {
  eventId: string;
  description: string;
  category: string;
  eventType: string;
}

export interface NewsEpisode {
  episodeId: string;
  name: string;
  simId: string;
  channelId: string;
  content: string;
  reporter: NewsReporter;
  event: NewsEvent;
  createdAt: string;
}

export interface NewsData {
  simId: string;
  channelId: string;
  tick: number;
  totalEpisodes: number;
  episodes: NewsEpisode[];
}

export interface NewsResponse {
  success: boolean;
  message: string;
  data: NewsData;
}

// ==========================================
// API FUNCTIONS
// ==========================================
export const getNewsArticles = async (simId: string, tick: number, channelId: string): Promise<NewsResponse> => {
  try {
    const response = await baseInstance.get(`/api/tv/episodes/${simId}/${channelId}?tick=${tick}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching news episodes:', error);
    throw error;
  }
}; 