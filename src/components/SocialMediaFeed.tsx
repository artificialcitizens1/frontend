import React, { useState, useEffect } from "react";
import Tweet, { type TweetProps } from "./Tweet";

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

  useEffect(() => {
    // Simulate API call with 5 second delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // ==========================================
  // FEED DATA (LEFT COLUMN)
  // ==========================================
  const feed: TweetProps[] = [
    {
      avatar: "https://i.pravatar.cc/150?img=1",
      name: "Arman Patel",
      username: "ChShrm",
      time: "9:41 PM · Jun 8, 2022",
      content: "Covefefefefee!!!!",
      likes: 32,
      verified: true,
    },
    {
      avatar: "https://i.pravatar.cc/150?img=2",
      name: "Chirag Sharma",
      username: "ChShrm",
      time: "9:41 PM · Jun 8, 2022",
      content:
        "In the latest political showdown, Rahul Singh and Arman Patel are at odds over key policies. Singh advocates for progressive reforms, while Patel emphasizes traditional values. The debate heats up as both leaders rally their supporters for the upcoming election!",
      likes: 32,
      verified: false,
    },
    {
      avatar: "https://i.pravatar.cc/150?img=3",
      name: "Ashvini Rathi",
      username: "1212Ash2",
      time: "9:41 PM · Jun 8, 2022",
      content:
        "Rahul Singh is clearly the voice of reason, while Arman Patel is just a relic of the past. Patel's outdated beliefs are not only irrelevant but also a barrier to the community's growth. Singh's vision for progressive reforms is what the people truly need, while Patel's stubbornness shows he has...",
      likes: 0,
      verified: false,
    },
    {
      avatar: "https://i.pravatar.cc/150?img=5",
      name: "Maya Johnson",
      username: "MayaJ_Official",
      time: "8:15 PM · Jun 8, 2022",
      content:
        "Just witnessed the most inspiring town hall meeting! Both candidates presented their visions, but only one spoke to the heart of our community's needs. Democracy in action! 🗳️",
      likes: 156,
      verified: true,
    },
    {
      avatar: "https://i.pravatar.cc/150?img=6",
      name: "Tech Insider",
      username: "TechInsider",
      time: "7:30 PM · Jun 8, 2022",
      content:
        "BREAKING: New AI-powered voting systems being tested for the upcoming election. Enhanced security and faster results promised. What are your thoughts on digital democracy?",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop",
      likes: 89,
      verified: true,
    },
    {
      avatar: "https://i.pravatar.cc/150?img=7",
      name: "Local News Today",
      username: "LocalNewsToday",
      time: "6:45 PM · Jun 8, 2022",
      content:
        "Weather alert: Thunderstorms expected during tomorrow's campaign rally. Both candidates confirm events will proceed as planned with indoor backup venues ready.",
      likes: 23,
      verified: true,
    },
    {
      avatar: "https://i.pravatar.cc/150?img=8",
      name: "Sarah Chen",
      username: "SarahC_Voter",
      time: "5:20 PM · Jun 8, 2022",
      content:
        "As a first-time voter, I'm taking this election seriously. Spent the weekend researching both candidates' policies. Healthcare and education are my top priorities. Who else is doing their homework? 📚",
      likes: 67,
      verified: false,
    },
    {
      avatar: "https://i.pravatar.cc/150?img=9",
      name: "Political Analyst Hub",
      username: "PoliAnalystHub",
      time: "4:10 PM · Jun 8, 2022",
      content:
        "Latest polling data shows a tightening race! Singh leads by 3 points, within the margin of error. Patel's recent policy announcements seem to be resonating with undecided voters. Thread 🧵",
      likes: 234,
      verified: true,
    },
    {
      avatar: "https://i.pravatar.cc/150?img=10",
      name: "Community Voice",
      username: "CommunityVoice22",
      time: "3:55 PM · Jun 8, 2022",
      content:
        "Attended both candidate forums this week. Here's my honest take: Singh has bold ideas but needs more concrete plans. Patel has experience but seems resistant to change. We need leadership that listens to ALL voices.",
      likes: 45,
      verified: false,
    },
    {
      avatar: "https://i.pravatar.cc/150?img=11",
      name: "Youth for Change",
      username: "Youth4Change",
      time: "2:30 PM · Jun 8, 2022",
      content:
        "Climate action NOW! 🌍 Both candidates need to address the environmental crisis affecting our generation. We won't accept empty promises anymore. #ClimateVote #YouthVoice",
      image: "https://images.unsplash.com/photo-1569163139394-de44303f1e88?w=400&h=300&fit=crop",
      likes: 178,
      verified: false,
    },
  ];

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
        <div className="h-full overflow-y-auto w-[60%] ">
          {feed.map((tweet, index) => (
            <div key={`feed-${index}`} className="mb-4 border border-gray-200 rounded-lg">
              <Tweet {...tweet} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SocialMediaFeed;
