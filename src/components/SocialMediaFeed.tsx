import React, { useState, useEffect } from "react";

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
interface TweetProps {
  avatar: string;
  name: string;
  username: string;
  time: string;
  content: React.ReactNode;
  image?: string;
  likes: number;
  verified: boolean;
}

// ==========================================
// TWEET COMPONENT
// ==========================================
const Tweet = ({
  avatar,
  name,
  username,
  time,
  content,
  image,
  likes,
  verified,
}: TweetProps) => (
  <div className="border-b border-gray-200 p-4 hover:bg-gray-50 transition-colors">
    <div className="flex">
      <div className="flex-1 min-w-0">
        <div className="flex items-start align-center">
          <img src={avatar} alt="avatar" className="w-12 h-12 rounded-full mr-3 flex-shrink-0" />
          <div>
            <div className="flex" >
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
            <button className="hover:text-blue-600 transition-colors">
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
);

// ==========================================
// MAIN SOCIAL MEDIA FEED COMPONENT
// ==========================================
const SocialMediaFeed = () => {
  // ==========================================
  // LOADING STATE
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
      content: "Just witnessed the most inspiring town hall meeting! Both candidates presented their visions, but only one spoke to the heart of our community's needs. Democracy in action! 🗳️",
      likes: 156,
      verified: true,
    },
    {
      avatar: "https://i.pravatar.cc/150?img=6",
      name: "Tech Insider",
      username: "TechInsider",
      time: "7:30 PM · Jun 8, 2022",
      content: "BREAKING: New AI-powered voting systems being tested for the upcoming election. Enhanced security and faster results promised. What are your thoughts on digital democracy?",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop",
      likes: 89,
      verified: true,
    },
    {
      avatar: "https://i.pravatar.cc/150?img=7",
      name: "Local News Today",
      username: "LocalNewsToday",
      time: "6:45 PM · Jun 8, 2022",
      content: "Weather alert: Thunderstorms expected during tomorrow's campaign rally. Both candidates confirm events will proceed as planned with indoor backup venues ready.",
      likes: 23,
      verified: true,
    },
    {
      avatar: "https://i.pravatar.cc/150?img=8",
      name: "Sarah Chen",
      username: "SarahC_Voter",
      time: "5:20 PM · Jun 8, 2022",
      content: "As a first-time voter, I'm taking this election seriously. Spent the weekend researching both candidates' policies. Healthcare and education are my top priorities. Who else is doing their homework? 📚",
      likes: 67,
      verified: false,
    },
    {
      avatar: "https://i.pravatar.cc/150?img=9",
      name: "Political Analyst Hub",
      username: "PoliAnalystHub",
      time: "4:10 PM · Jun 8, 2022",
      content: "Latest polling data shows a tightening race! Singh leads by 3 points, within the margin of error. Patel's recent policy announcements seem to be resonating with undecided voters. Thread 🧵",
      likes: 234,
      verified: true,
    },
    {
      avatar: "https://i.pravatar.cc/150?img=10",
      name: "Community Voice",
      username: "CommunityVoice22",
      time: "3:55 PM · Jun 8, 2022",
      content: "Attended both candidate forums this week. Here's my honest take: Singh has bold ideas but needs more concrete plans. Patel has experience but seems resistant to change. We need leadership that listens to ALL voices.",
      likes: 45,
      verified: false,
    },
    {
      avatar: "https://i.pravatar.cc/150?img=11",
      name: "Youth for Change",
      username: "Youth4Change",
      time: "2:30 PM · Jun 8, 2022",
      content: "Climate action NOW! 🌍 Both candidates need to address the environmental crisis affecting our generation. We won't accept empty promises anymore. #ClimateVote #YouthVoice",
      image: "https://images.unsplash.com/photo-1569163139394-de44303f1e88?w=400&h=300&fit=crop",
      likes: 178,
      verified: false,
    },
  ];

  // ==========================================
  // TRENDING DATA (RIGHT COLUMN)
  // ==========================================
  const trending: TweetProps[] = [
    {
      avatar: "https://i.pravatar.cc/150?img=4",
      name: "CNN",
      username: "CNN",
      time: "9:41 PM · Jun 8, 2022",
      content: (
        <>
          <p className="font-bold">Candidate Rahul Singh's home burned down.</p>
          <p>We suspect Arman Patel</p>
        </>
      ),
      image: "https://images.unsplash.com/photo-1574806473091-d81cfbc5fc8b?w=400&h=300&fit=crop",
      likes: 32,
      verified: true,
    },
    {
      avatar: "https://i.pravatar.cc/150?img=4",
      name: "CNN",
      username: "CNN",
      time: "9:41 PM · Jun 8, 2022",
      content: "AI Video shows RCB Lifting the trophy LOL",
      likes: 0,
      verified: true,
    },
    {
      avatar: "https://i.pravatar.cc/150?img=12",
      name: "BBC News",
      username: "BBCNews",
      time: "8:30 PM · Jun 8, 2022",
      content: (
        <>
          <p className="font-bold">LIVE: Election Debate Tonight</p>
          <p>Both candidates to face off in primetime debate. Key topics: economy, healthcare, education.</p>
        </>
      ),
      image: "https://images.unsplash.com/photo-1607473256721-4a23e96a2e10?w=400&h=300&fit=crop",
      likes: 445,
      verified: true,
    },
    {
      avatar: "https://i.pravatar.cc/150?img=13",
      name: "Reuters",
      username: "Reuters",
      time: "7:15 PM · Jun 8, 2022",
      content: "EXCLUSIVE: New poll reveals voter priorities - 68% say economy is top concern, followed by healthcare at 54% and education at 47%. Immigration ranks 4th at 23%.",
      likes: 289,
      verified: true,
    },
    {
      avatar: "https://i.pravatar.cc/150?img=14",
      name: "Political Insider",
      username: "PoliInsider",
      time: "6:50 PM · Jun 8, 2022",
      content: (
        <>
          <p className="font-bold">Campaign Finance Report</p>
          <p>Singh raises $2.3M this quarter, Patel at $1.8M. Small donor contributions surge 40%.</p>
        </>
      ),
      likes: 156,
      verified: true,
    },
    {
      avatar: "https://i.pravatar.cc/150?img=15",
      name: "Election Watch",
      username: "ElectionWatch22",
      time: "5:45 PM · Jun 8, 2022",
      content: "🚨 TRENDING: #DebateTonight #Singh2022 #Patel2022 #VoteReady - Social media buzzing ahead of tonight's debate. Early voter turnout up 15% from last cycle.",
      likes: 92,
      verified: false,
    },
    {
      avatar: "https://i.pravatar.cc/150?img=16",
      name: "The Daily Herald",
      username: "DailyHerald",
      time: "4:20 PM · Jun 8, 2022",
      content: (
        <>
          <p className="font-bold">Local Business Leaders Weigh In</p>
          <p>Chamber of Commerce hosts candidate forum focused on economic policies and job creation initiatives.</p>
        </>
      ),
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop",
      likes: 67,
      verified: true,
    },
    {
      avatar: "https://i.pravatar.cc/150?img=17",
      name: "Fact Check Central",
      username: "FactCheckCentral",
      time: "3:10 PM · Jun 8, 2022",
      content: "✅ FACT CHECK: Recent claims about education funding verified. Singh's proposal would increase funding by 12%, Patel's by 8%. Both within proposed budget constraints.",
      likes: 203,
      verified: true,
    },
    {
      avatar: "https://i.pravatar.cc/150?img=18",
      name: "Social Media Analytics",
      username: "SocialAnalytics",
      time: "2:35 PM · Jun 8, 2022",
      content: "📊 Viral Moment Alert: Singh's town hall response about healthcare has 2.3M views. Patel's infrastructure speech hits 1.8M. Engagement rates highest among 25-34 age group.",
      likes: 134,
      verified: false,
    },
  ];

  // ==========================================
  // COMPONENT RENDER
  // ==========================================
  if (isLoading) {
    return (
      <div className="flex flex-col max-w-6xl mx-auto bg-white text-black h-screen">
        {/* ==========================================
            MAIN HEADER
            ========================================== */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-white z-20 flex-shrink-0">
          <div className="flex">
              <img src="/icons/ic_shit.svg" alt="Twitter Logo" className="w-8 h-8" />
              <h1 className="text-2xl font-bold">Shitter</h1>
          </div>          
          <XIcon className="w-6 h-6 cursor-pointer" />
        </div>

        {/* ==========================================
            LOADING STATE
            ========================================== */}
        <div className="flex flex-1">
          {/* Left Column Loading */}
          <div className="w-[60%] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-white z-10 flex-shrink-0">
              <h2 className="text-xl font-bold font-['ManifoldExtendedCF']">Your Feed</h2>
            </div>
            <div className="flex-1 flex items-start justify-center pt-20">
              <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                <p className="text-gray-500 text-lg">Loading your feed...</p>
              </div>
            </div>
          </div>

          {/* Right Column Loading */}
          <div className="w-[40%] border-l border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200 bg-white z-10 flex-shrink-0">
              <h2 className="text-xl font-bold font-['ManifoldExtendedCF']">Trending</h2>
            </div>
            <div className="flex-1 flex items-start justify-center pt-20">
              <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                <p className="text-gray-500 text-lg">Loading trending...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col max-w-6xl mx-auto bg-white text-black h-screen">
      {/* ==========================================
          MAIN HEADER
          ========================================== */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-white z-20 flex-shrink-0">
        <div className="flex">
              <img src="/icons/ic_shit.svg" alt="Twitter Logo" className="w-8 h-8" />
              <h1 className="text-2xl font-bold">Shitter</h1>
          </div>  
        <XIcon className="w-6 h-6 cursor-pointer" />
      </div>

      {/* ==========================================
          MAIN CONTENT COLUMNS
          ========================================== */}
      <div className="flex flex-1 overflow-hidden">
        {/* ==========================================
            LEFT COLUMN - YOUR FEED
            ========================================== */}
        <div className="w-[60%] flex flex-col">
          {/* Feed Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-white z-10 flex-shrink-0">
            <h2 className="text-xl font-bold font-['ManifoldExtendedCF']">Your Feed</h2>
          </div>
          {/* Feed Content */}
          <div className="flex-1 overflow-y-auto">
            {feed.map((tweet, index) => (
              <Tweet key={`feed-${index}`} {...tweet} />
            ))}
          </div>
        </div>

        {/* ==========================================
            RIGHT COLUMN - TRENDING
            ========================================== */}
        <div className="w-[40%] border-l border-gray-200 flex flex-col">
          {/* Trending Header */}
          <div className="p-4 border-b border-gray-200 bg-white z-10 flex-shrink-0">
            <h2 className="text-xl font-bold font-['ManifoldExtendedCF']">Trending</h2>
          </div>
          {/* Trending Content */}
          <div className="flex-1 overflow-y-auto">
            {trending.map((tweet, index) => (
              <Tweet key={`trending-${index}`} {...tweet} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaFeed; 