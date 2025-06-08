import baseInstance from './baseInstance';

// ==========================================
// TYPE DEFINITIONS
// ==========================================
export interface SocialMediaAuthor {
  _id: string;
  personaId: string;
  name: string;
  role: 'citizen' | 'candidate';
  intro?: string;
  communicationStyle?: string;
  ideologyPosition?: string;
  personaType: string;
}

export interface SocialMediaComment {
  _id: string;
  simId: string;
  commentId: string;
  postId: string;
  authorId: string;
  authorRole: 'citizen' | 'candidate';
  content: string;
  subTick: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  author: SocialMediaAuthor;
}

export interface SocialMediaReaction {
  _id: string;
  type: string;
  authorId: string;
  authorRole: 'citizen' | 'candidate';
  createdAt: string;
}

export interface SocialMediaEngagement {
  likes: number;
  dislikes: number;
  comments: number;
  totalReactions: number;
  totalEngagement: number;
}

export interface SocialMediaPost {
  _id: string;
  simId: string;
  postId: string;
  authorId: string;
  authorRole: 'citizen' | 'candidate';
  content: string;
  subTick: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  author: SocialMediaAuthor;
  comments: SocialMediaComment[];
  reactions: SocialMediaReaction[];
  commentCount: number;
  reactCount: number;
  likeCount: number;
  dislikeCount: number;
  engagement: SocialMediaEngagement;
  engagementScore: number;
}

export interface SocialMediaResponse {
  success: boolean;
  data: SocialMediaPost[];
}

// ==========================================
// API FUNCTIONS
// ==========================================
export const getSocialMediaPosts = async (simId: string, tick: number): Promise<SocialMediaResponse> => {
  try {
    const response = await baseInstance.get(`/api/socialmedia/${simId}/posts/${tick}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching social media posts:', error);
    throw error;
  }
};
