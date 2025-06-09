import React, { useState, useEffect } from "react";
import { getNewsArticles, type NewsEpisode } from "../api/newsService";

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
const NewsChannel: React.FC<NewsChannelProps> = ({
  onClose,
  simId,
  currentTick,
  totalTicks
}) => {
  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("54359c07-c741-495b-92ca-e9e62da6f900");
  const [newsData, setNewsData] = useState<NewsEpisode[]>([]);
  const [error, setError] = useState<string | null>(null);

  // ==========================================
  // HELPER FUNCTIONS
  // ==========================================
  const generateImageUrl = (category: string): string => {
    const imageMap: { [key: string]: string } = {
      'political': 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&h=300&fit=crop',
      'rally': 'https://images.unsplash.com/photo-1569087682635-89e440a91b9d?w=600&h=300&fit=crop',
      'campaign': 'https://images.unsplash.com/photo-1541872705-1f73c6400ec9?w=600&h=300&fit=crop',
      'technology': 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=200&fit=crop',
      'finance': 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=200&fit=crop'
    };
    return imageMap[category] || imageMap['political'];
  };

  const generateReadTime = (content: string): string => {
    // Estimate read time based on content length (average 200 words per minute)
    const wordCount = content.split(' ').length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));
    return `${readTime} min read`;
  };

  const isBreakingNews = (episode: NewsEpisode): boolean => {
    // Consider political events as breaking news
    return episode.event.category === 'political' || episode.event.eventType === 'rally';
  };

  const getChannelFromEpisode = (episode: NewsEpisode): string => {
    // Extract channel from channelId or use reporter's ideology as fallback
    const channelMap: { [key: string]: string } = {
      'center': 'CNN',
      'left': 'CNN',
      'right': 'Fox News',
      'liberal': 'BBC',
      'conservative': 'Fox News'
    };
    return channelMap[episode.reporter.ideologyPosition] || 'CNN';
  };

  const convertEpisodeToArticle = (episode: NewsEpisode): NewsArticleProps => {
    return {
      title: episode.name,
      summary: episode.content,
      image: generateImageUrl(episode.event.category),
      readTime: generateReadTime(episode.content),
      category: episode.event.category,
      source: episode.reporter.name,
      isBreaking: isBreakingNews(episode)
    };
  };

  // ==========================================
  // API DATA FETCHING
  // ==========================================
  useEffect(() => {
    const fetchNewsData = async () => {
      console.log('🚀 NewsChannel - Fetching news data');

      try {
        setIsLoading(true);
        setError(null);
        
        console.log('🔍 NewsChannel - Fetching data for simId:', simId, 'currentTick:', currentTick, 'channelId:', activeTab);
        const response = await getNewsArticles(simId, currentTick, activeTab);
        
        if (response.success && response.data && response.data.episodes) {
          console.log('✅ NewsChannel - News episodes:', response.data);
          setNewsData(response.data.episodes);
        } else {
          setError("No news data available");
        }
      } catch (err) {
        console.error('Error fetching news episodes:', err);
        setError("Failed to load news episodes");
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch data when simId, currentTick, or activeTab changes
    fetchNewsData();
  }, [simId, currentTick, activeTab]); // Dependencies: simId, currentTick, and activeTab

  // ==========================================
  // NEWS SOURCE TABS
  // ==========================================
  const newsSources: NewsSourceTab[] = [
    { 
      id: "66948d25-60d6-48d0-8dad-6ad949c1e07f", 
      name: "Biased Broadcasting Corp", 
      logo: "🎭" 
    },
    { 
      id: "79eb9170-7ec2-415a-b0a7-5b81b57a9f6e", 
      name: "Al Exaggera", 
      logo: "🌪️" 
    },
  ];

  // ==========================================
  // FILTER NEWS DATA BY CHANNEL
  // ==========================================
  const filteredNews = newsData.filter(episode => getChannelFromEpisode(episode) === activeTab);

  const breakingNews = filteredNews
    .filter(episode => isBreakingNews(episode))
    .map(convertEpisodeToArticle);

  const otherNews = filteredNews
    .filter(episode => !isBreakingNews(episode))
    .map(convertEpisodeToArticle);

  const electionNews = filteredNews
    .filter(episode => episode.event.eventType === 'rally' || episode.event.category === 'political')
    .map(convertEpisodeToArticle);

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
            className={`px-4 py-2 font-medium transition-all duration-200 rounded-full border-2 flex items-center gap-2 ${
              activeTab === source.id
                ? "bg-black text-white border-black shadow-md"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
            }`}
          >
            <span className="text-lg">{source.logo}</span>
            <span className="font-['ManifoldExtendedCF'] text-sm">{source.name}</span>
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
            {error ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <div className="text-red-500 text-center">
                  <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <h3 className="text-lg font-semibold mb-2">Error Loading News</h3>
                  <p className="text-gray-600 text-sm">{error}</p>
                </div>
              </div>
            ) : breakingNews.length === 0 && electionNews.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <div className="text-gray-500 text-center">
                  <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                  <h3 className="text-lg font-semibold mb-2">No Breaking News</h3>
                  <p className="text-gray-600 text-sm">No breaking news or election updates available for {activeTab}.</p>
                </div>
              </div>
            ) : (
              <>
                {breakingNews.map((article, index) => (
                  <NewsArticle key={`breaking-${index}`} {...article} />
                ))}
                {/* Election News Section */}
                {electionNews.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-l font-bold mb-4 text-black font-['ManifoldExtendedCF']">
                      Election News
                    </h3>
                    {electionNews.map((article, index) => (
                      <NewsArticle key={`election-${index}`} {...article} />
                    ))}
                  </div>
                )}
              </>
            )}
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
            {error ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <div className="text-gray-500 text-center">
                  <p className="text-sm">Unable to load other news</p>
                </div>
              </div>
            ) : otherNews.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <div className="text-gray-500 text-center">
                  <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="text-lg font-semibold mb-2">No Other News</h3>
                  <p className="text-gray-600 text-sm">No other news articles available for {activeTab}.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {otherNews.map((article, index) => (
                  <NewsArticle key={`other-${index}`} {...article} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsChannel;
