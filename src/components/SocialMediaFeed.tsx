import React, { useState, useEffect } from "react";
import Tweet, { type TweetProps } from "./Tweet";
import { getSocialMediaPosts, type SocialMediaPost } from "../api/socialMediaService";

// ==========================================
// ICON COMPONENTS
// ==========================================
const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
  </svg>
);

// ==========================================
// INTERFACE DEFINITIONS
// ==========================================
interface SocialMediaFeedProps {
  onClose?: () => void;
}

// ==========================================
// MAIN SOCIAL MEDIA FEED COMPONENT
// ==========================================
const SocialMediaFeed: React.FC<SocialMediaFeedProps> = ({ onClose }) => {
  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  const [isLoading, setIsLoading] = useState(true);
  const [feed, setFeed] = useState<TweetProps[]>([]);
  const [error, setError] = useState<string | null>(null);

  // ==========================================
  // HELPER FUNCTIONS
  // ==========================================
  const generateAvatarUrl = (authorId: string): string => {
    // Generate a consistent hash from authorId for consistent avatar selection
    let hash = 0;
    for (let i = 0; i < authorId.length; i++) {
      const char = authorId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    const avatarNumber = Math.abs(hash) % 50 + 1; // Use numbers 1-50
    return `https://i.pravatar.cc/150?img=${avatarNumber}`;
  };

  const formatTime = (createdAt: string): string => {
    const date = new Date(createdAt);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays}d`;
    } else if (diffHours > 0) {
      return `${diffHours}h`;
    } else {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return `${diffMins}m`;
    }
  };

  const generateUsername = (name: string, role: string): string => {
    if (role === 'candidate') {
      return `${name.replace(/\s+/g, '')}_Official`;
    }
    
    // For citizens, create a username from their name
    const nameParts = name.split(' ');
    if (nameParts.length > 1) {
      return `${nameParts[0]}${nameParts[1].charAt(0)}${Math.floor(Math.random() * 99)}`;
    }
    return `${nameParts[0]}${Math.floor(Math.random() * 999)}`;
  };

  const convertApiPostToTweet = (post: SocialMediaPost): TweetProps => {
    // Convert API comments to Tweet comments
    const convertedComments = post.comments?.map(comment => ({
      id: comment._id,
      avatar: generateAvatarUrl(comment.authorId),
      name: comment.author.name,
      username: generateUsername(comment.author.name, comment.author.role),
      time: formatTime(comment.createdAt),
      content: comment.content,
      likes: 0, // Comments don't have individual like counts in the API
      verified: comment.author.role === 'candidate'
    })) || [];

    return {
      avatar: generateAvatarUrl(post.authorId),
      name: post.author.name,
      username: generateUsername(post.author.name, post.author.role),
      time: formatTime(post.createdAt),
      content: post.content,
      likes: post.likeCount || 0,
      verified: post.author.role === 'candidate', // Candidates are verified
      commentCount: post.commentCount || 0,
      comments: convertedComments
    };
  };

  // ==========================================
  // API DATA FETCHING
  // ==========================================
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    const fetchSocialMediaData = async () => {
      console.log('🚀 SocialMediaFeed - Fetching social media data');

      try {
        setIsLoading(true);
        setError(null);
        
        console.log('🔍 SocialMediaFeed - Fetching data with hardcoded values');
        const response = await getSocialMediaPosts('baba9c30-f7d7-4f3e-933c-eeb9bd7cc547', 5);
        
        if (response.success && response.data) {
          const tweetData = response.data.map(convertApiPostToTweet);
          console.log('✅ SocialMediaFeed - Converted tweet data:', tweetData);
          setFeed(tweetData);
        } else {
          setError("No social media data available");
        }
      } catch (err) {
        console.error('Error fetching social media posts:', err);
        setError("Failed to load social media posts");
      } finally {
        setIsLoading(false);
      }
    };

    // Initial fetch
    fetchSocialMediaData();

    // Set up periodic refresh
    intervalId = setInterval(fetchSocialMediaData, 10000);

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []); // Empty dependency array - only run once on mount

  // ==========================================
  // COMPONENT RENDER
  // ==========================================
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto bg-white text-black h-screen flex flex-col">
        {/* Header with Logo */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center space-x-3">
            <img src="/icons/ic_shit.svg" alt="Shitter Logo" className="w-10 h-10" />
            <h1 className="text-2xl font-bold font-['ManifoldExtendedCF']">Shitter</h1>
          </div>
          <XIcon className="w-6 h-6 cursor-pointer text-gray-500 hover:text-gray-700" onClick={onClose} />
        </div>

        {/* Loading State */}
        <div className="flex-1 flex items-start justify-center pt-20">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="text-gray-500 text-lg">Loading your feed...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto bg-white text-black h-screen flex flex-col">
      {/* Header with Logo */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          <img src="/icons/ic_shit.svg" alt="Shitter Logo" className="w-10 h-10" />
          <h1 className="text-2xl font-bold font-['ManifoldExtendedCF']">Shitter</h1>
        </div>
        <XIcon className="w-6 h-6 cursor-pointer text-gray-500 hover:text-gray-700" onClick={onClose} />
      </div>

      {/* Main Content Area - Feed */}
      <div className="flex-1 overflow-hidden flex justify-center mt-4">
        <div className="h-full overflow-y-auto w-[60%]">
          {error ? (
            /* Error State */
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <div className="text-red-500 text-center">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <h3 className="text-xl font-semibold mb-2">Oops! Something went wrong</h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : feed.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <div className="text-gray-500 text-center">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
                <p className="text-gray-600">
                  The political discourse hasn't started yet. Check back in a moment!
                </p>
              </div>
            </div>
          ) : (
            /* Feed Content */
            feed.map((tweet, index) => (
              <div key={`feed-${index}`} className="mb-4 border border-gray-200 rounded-lg">
                <Tweet {...tweet} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SocialMediaFeed;
