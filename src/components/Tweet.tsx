import React, { useState } from "react";

// ==========================================
// INTERFACE DEFINITIONS
// ==========================================
export interface TweetProps {
  avatar: string;
  name: string;
  username: string;
  time: string;
  content: React.ReactNode;
  image?: string;
  likes: number;
  verified: boolean;
}

export interface CommentProps {
  id: string;
  avatar: string;
  name: string;
  username: string;
  time: string;
  content: string;
  likes: number;
  verified: boolean;
}

// ==========================================
// COMMENTS SECTION COMPONENT
// ==========================================
const CommentsSection = () => {
  // Dummy comments data
  const dummyComments: CommentProps[] = [
    {
      id: "1",
      avatar: "https://i.pravatar.cc/150?img=21",
      name: "Alex Johnson",
      username: "alexj_2024",
      time: "2h",
      content: "This is exactly what we need to see more of in politics. Transparency and accountability!",
      likes: 12,
      verified: false,
    },
    {
      id: "2",
      avatar: "https://i.pravatar.cc/150?img=22",
      name: "Maria Garcia",
      username: "maria_politics",
      time: "1h",
      content: "I disagree with this stance. We need to consider the economic implications more carefully.",
      likes: 8,
      verified: true,
    },
    {
      id: "3",
      avatar: "https://i.pravatar.cc/150?img=23",
      name: "David Chen",
      username: "dchen_voter",
      time: "45m",
      content: "Great point! This is why I'll be voting in the upcoming election. Every voice matters! 🗳️",
      likes: 15,
      verified: false,
    },
    {
      id: "4",
      avatar: "https://i.pravatar.cc/150?img=24",
      name: "Sarah Williams",
      username: "swilliams_news",
      time: "30m",
      content: "Can someone fact-check this? I want to make sure I'm getting accurate information before sharing.",
      likes: 6,
      verified: true,
    },
    {
      id: "5",
      avatar: "https://i.pravatar.cc/150?img=25",
      name: "Mike Thompson",
      username: "mike_t_voter",
      time: "15m",
      content: "This thread is so informative! Thanks for sharing. We need more discussions like this.",
      likes: 3,
      verified: false,
    },
  ];

  return (
    <div className="border-t border-gray-200 bg-gray-50">
      {/* Comments List */}
      <div className="p-4 space-y-4">
        {dummyComments.map((comment) => (
          <div key={comment.id} className="flex space-x-3">
            <img
              src={comment.avatar}
              alt="avatar"
              className="w-10 h-10 rounded-full flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm">{comment.name}</span>
                {comment.verified && (
                  <svg
                    className="w-4 h-4 text-blue-500 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.67-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.34 2.19c-1.39-.46-2.9-.2-3.91.81s-1.27 2.52-.81 3.91c-1.31.67-2.19 1.91-2.19 3.34s.88 2.67 2.19 3.34c-.46 1.39-.2 2.9.81 3.91s2.52 1.27 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.67-.88 3.34-2.19c1.39.46 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.5 4.88l-3.33-3.33a.75.75 0 011.06-1.06l2.27 2.27 4.97-4.97a.75.75 0 011.06 1.06l-5.5 5.5a.75.75 0 01-1.06 0z" />
                  </svg>
                )}
                <span className="text-gray-500 text-sm">@{comment.username}</span>
                <span className="text-gray-500 text-sm">·</span>
                <span className="text-gray-500 text-sm">{comment.time}</span>
              </div>
              <p className="text-sm mt-1">{comment.content}</p>
              <div className="flex items-center space-x-4 mt-2">
                <button className="flex items-center space-x-1 text-gray-500 hover:text-pink-600 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  <span className="text-xs">{comment.likes}</span>
                </button>
                <button className="text-gray-500 hover:text-blue-600 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// TWEET COMPONENT
// ==========================================
const Tweet = ({ avatar, name, username, time, content, image, likes, verified }: TweetProps) => {
  const [showComments, setShowComments] = useState(false);

  return (
    <>
      <div className="border-b border-gray-200 p-4 hover:bg-gray-50 transition-colors">
    <div className="flex">
      <div className="flex-1 min-w-0">
        <div className="flex items-start align-center">
          <img src={avatar} alt="avatar" className="w-12 h-12 rounded-full mr-3 flex-shrink-0" />
          <div>
            <div className="flex">
              <span className="font-bold text-black truncate">{name}</span>
              <div className="flex items-center">
                {verified && (
                  <svg
                    className="w-4 h-4 ml-1 text-blue-500 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.67-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.34 2.19c-1.39-.46-2.9-.2-3.91.81s-1.27 2.52-.81 3.91c-1.31.67-2.19 1.91-2.19 3.34s.88 2.67 2.19 3.34c-.46 1.39-.2 2.9.81 3.91s2.52 1.27 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.67-.88 3.34-2.19c1.39.46 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.5 4.88l-3.33-3.33a.75.75 0 011.06-1.06l2.27 2.27 4.97-4.97a.75.75 0 011.06 1.06l-5.5 5.5a.75.75 0 01-1.06 0z" />
                  </svg>
                )}
              </div>
            </div>
            <div>
              <span className="text-gray-500 truncate">@{username}</span>
            </div>
          </div>
        </div>
        <div className="mt-1">
          <div className="text-black">{content}</div>
          {image && (
            <div className="mt-3">
              <img
                src={image}
                alt="tweet"
                className="rounded-2xl max-w-full h-auto border border-gray-200"
              />
            </div>
          )}
        </div>
        <div className="mt-2 text-xs w-full">
          <span className="text-gray-500">{time}</span>
        </div>
        {/* Divider line below time parameter */}
        <div className="mt-3 border-t border-gray-200 w-full"></div>
        <div className="flex items-center justify-between text-gray-500 mt-3 text-sm max-w-md">
          <div className="flex items-center space-x-6">
            <button className="flex items-center space-x-1 hover:text-pink-600 transition-colors">
              <img src="/icons/ic_like.svg" alt="Like" className="w-5 h-5 text-pink-500" />
              <span>{likes}</span>
            </button>
            <button 
              className="hover:text-blue-600 transition-colors"
              onClick={() => setShowComments(!showComments)}
            >
              <img src="/icons/ic_comments.svg" alt="Comment" className="w-5 h-5" />
            </button>
            <button className="hover:text-green-600 transition-colors">
              <img src="/icons/ic_repost.svg" alt="Repost" className="w-5 h-5" />
            </button>
            <button className="hover:text-blue-600 transition-colors">
              <img src="/icons/ic_share.svg" alt="Share" className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
      
      {/* Comments Section - displayed inline when expanded */}
      {showComments && (
        <CommentsSection />
      )}
    </>
  );
};

export default Tweet;
