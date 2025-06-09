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
interface NewsChannelProps {
  onClose?: () => void;
  simId: string;
  currentTick: number;
  totalTicks: number;
}

interface NewsArticleProps {
  title: string;
  summary: string;
  image?: string;
  readTime: string;
  category: string;
  source: string;
  isBreaking?: boolean;
}

interface NewsSourceTab {
  id: string;
  name: string;
  logo: string;
  active: boolean;
}

// ==========================================
// NEWS ARTICLE COMPONENT
// ==========================================
const NewsArticle = ({ title, summary, image, readTime }: NewsArticleProps) => (
  <div className="mb-6">
    {image && (
      <div className="mb-3">
        <img src={image} alt={title} className="w-full h-64 object-cover rounded-lg" />
      </div>
    )}
    <div className="space-y-2">
      <h3 className="font-bold text-xl text-black leading-tight">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{summary}</p>
      <div className="text-xs text-gray-500 pt-2">
        <span>{readTime}</span>
      </div>
    </div>
  </div>
);

// ==========================================
// MAIN NEWS CHANNEL COMPONENT
// ==========================================
const NewsChannel: React.FC<NewsChannelProps> = ({ onClose, simId, currentTick, totalTicks }) => {
  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("CNN");

  useEffect(() => {
    // Simulate API call with 3 second delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // ==========================================
  // NEWS SOURCE TABS
  // ==========================================
  const newsSources: NewsSourceTab[] = [
    { id: "CNN", name: "CNN", logo: "", active: activeTab === "CNN" },
    { id: "BBC", name: "BBC", logo: "", active: activeTab === "BBC" },
    { id: "ALJAZEERA", name: "Al Jazeera", logo: "", active: activeTab === "ALJAZEERA" },
    { id: "FOXNEWS", name: "Fox News", logo: "", active: activeTab === "FOXNEWS" },
  ];

  // ==========================================
  // BREAKING NEWS DATA
  // ==========================================
  const breakingNews: NewsArticleProps[] = [
    {
      title: "Fire erupts at election candidate Rahul's home, party blames opposition leader",
      summary:
        "With members embedded in multiple agencies, the team's approach to transforming government operations has sparked intense debate among political circles.",
      image: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&h=300&fit=crop",
      readTime: "7 Min",
      category: "Politics",
      source: "CNN Breaking",
      isBreaking: true,
    },
  ];

  // ==========================================
  // OTHER NEWS DATA
  // ==========================================
  const otherNews: NewsArticleProps[] = [
    {
      title: "Elon Musk May Be Out. But DOGE Is Just Getting Started.",
      summary:
        "With members embedded in multiple agencies, the team's approach to transforming government...",
      image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=200&fit=crop",
      readTime: "7 Min",
      category: "Technology",
      source: "Tech Report",
    },
    {
      title: "Crypto Market Sees Major Shifts Amid Regulatory Changes.",
      summary:
        "Experts say that the increasing scrutiny could lead to a more stable investment environment...",
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=200&fit=crop",
      readTime: "5 Min",
      category: "Finance",
      source: "Financial Times",
    },
  ];

  // ==========================================
  // ELECTION NEWS DATA
  // ==========================================
  const electionNews: NewsArticleProps[] = [
    {
      title: "Election News",
      summary:
        "Latest updates on the upcoming election with comprehensive coverage of all candidates and their platforms.",
      image: "https://images.unsplash.com/photo-1569087682635-89e440a91b9d?w=600&h=300&fit=crop",
      readTime: "10 Min",
      category: "Politics",
      source: "Election Desk",
    },
  ];

  // ==========================================
  // COMPONENT RENDER
  // ==========================================
  if (isLoading) {
    return (
      <div className="flex flex-col max-w-6xl mx-auto bg-white text-black h-screen border border-gray-300 rounded-lg">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-300">
          <h1 className="text-3xl font-bold tracking-wide text-black">NEWS</h1>
          <XIcon
            className="w-6 h-6 cursor-pointer hover:text-gray-600 transition-colors text-black"
            onClick={onClose}
          />
        </div>

        {/* Loading State */}
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center space-y-6">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-gray-400"></div>
            <p className="text-xl text-gray-600">Loading news...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col max-w-6xl mx-auto bg-white text-black h-screen border border-gray-300 rounded-lg overflow-hidden">
      {/* ==========================================
          MAIN HEADER
          ========================================== */}
      <div className="flex justify-between items-center p-6 flex-shrink-0">
        <h1 className="text-xl font-bold tracking-wide text-black font-['ManifoldExtendedCF']">
          NEWS
        </h1>
        <XIcon
          className="w-6 h-6 cursor-pointer hover:text-gray-600 transition-colors text-black"
          onClick={onClose}
        />
      </div>

      {/* ==========================================
          NEWS SOURCE TABS
          ========================================== */}
      <div className="flex space-x-2 p-2 border-b border-gray-300 flex-shrink-0">
        {newsSources.map((source) => (
          <button
            key={source.id}
            onClick={() => setActiveTab(source.id)}
            className={`px-4 py-1 font-medium transition-all duration-200 rounded-full border-2 ${
              source.active
                ? "bg-black text-white border-black shadow-md"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
            }`}
          >
            {source.name}
          </button>
        ))}
      </div>

      {/* ==========================================
          MAIN CONTENT
          ========================================== */}
      <div className="flex flex-1 overflow-hidden">
        {/* ==========================================
            LEFT COLUMN - BREAKING NEWS
            ========================================== */}
        <div className="w-[60%] flex flex-col p-6 border-r border-gray-300">
          <h2 className="text-l font-bold mb-6 text-black font-['ManifoldExtendedCF']">
            Breaking News
          </h2>
          <div className="flex-1 overflow-y-auto">
            {breakingNews.map((article, index) => (
              <NewsArticle key={`breaking-${index}`} {...article} />
            ))}
            {/* Election News Section */}
            <div className="mt-8">
              <h3 className="text-l font-bold mb-4 text-black font-['ManifoldExtendedCF']">
                Election News
              </h3>
              {electionNews.map((article, index) => (
                <NewsArticle key={`election-${index}`} {...article} />
              ))}
            </div>
          </div>
        </div>

        {/* ==========================================
            RIGHT COLUMN - OTHER NEWS
            ========================================== */}
        <div className="w-[40%] flex flex-col p-6">
          <h2 className="text-l font-bold mb-6 text-black font-['ManifoldExtendedCF']">
            Other News
          </h2>
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-6">
              {otherNews.map((article, index) => (
                <NewsArticle key={`other-${index}`} {...article} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsChannel;
