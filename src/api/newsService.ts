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

export interface NewsChannelData {
  _id?: string;
  channelId: string;
  name: string;
  simId: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

// ==========================================
// API FUNCTIONS
// ==========================================
export const getNewsArticles = async (simId: string, tick: number, channelId: string): Promise<NewsResponse> => {
  try {
    console.log('🔍 newsService - Fetching episodes for simId:', simId, 'tick:', tick, 'channelId:', channelId);
    const response = await baseInstance.get(`/api/tv/episodes/${simId}/${channelId}?tick=${tick}`);
    console.log('✅ newsService - Episodes response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ newsService - Error fetching news episodes:', error);
    throw error;
  }
}; 

export const getNewsChannels = async (simId: string): Promise<NewsChannelData[]> => {
  try {
    console.log('🔍 newsService - Fetching channels for simId:', simId);
    const response = await baseInstance.get(`/api/tv/reporters/${simId}`);
    console.log('✅ newsService - Channels response:', response.data);
    
    // Ensure response.data is an array
    if (!Array.isArray(response.data)) {
      console.error('❌ newsService - Expected array but got:', typeof response.data, response.data);
      throw new Error('Invalid response format: expected array of channels');
    }
    
    // Validate each channel has required properties
    const validChannels = response.data.filter((channel: any) => {
      const isValid = channel && typeof channel.channelId === 'string' && typeof channel.name === 'string';
      if (!isValid) {
        console.warn('⚠️ newsService - Invalid channel data:', channel);
      }
      return isValid;
    });
    
    console.log('✅ newsService - Valid channels:', validChannels.length);
    return validChannels;
  } catch (error) {
    console.error('❌ newsService - Error fetching news channels:', error);
    throw error;
  }
};