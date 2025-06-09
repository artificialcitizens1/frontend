import React, { useEffect, useState } from 'react';
import Lottie from 'lottie-react';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ 
  children, 
  className = '' 
}) => {
  const [gridAnimationData, setGridAnimationData] = useState<any>(null);
  
  // Load animation data from public folder
  useEffect(() => {
    const loadAnimationData = async () => {
      try {
        // Fetch grid animation
        const response = await fetch('/animations/grid_animation.json');
        const data = await response.json();
        setGridAnimationData(data);
      } catch (error) {
        console.error('Error loading animation data:', error);
      }
    };
    
    loadAnimationData();
  }, []);
  
  return (
    <div className={`min-h-screen w-full relative overflow-hidden ${className}`}>
      {/* Fixed Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#131B39] to-[#0F1322]">
        {/* Top Grid Animation - Translated up with gradient fade */}
        <div className="absolute top-0 w-full h-1/2 overflow-hidden">
          <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-transparent to-[#0F1322] opacity-100"></div>
          {gridAnimationData && (
            <Lottie
              animationData={gridAnimationData}
              loop={true}
              autoplay={true}
              className="w-full h-full"
              style={{ 
                opacity: 0.15, 
                transform: 'translateY(-25%)', 
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%'
              }}
            />
          )}
        </div>
        {/* Bottom Grid Animation - Rotated 180 degrees and translated down with gradient fade */}
        <div className="absolute bottom-0 w-full h-1/2 overflow-hidden">
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-transparent via-transparent to-[#0F1322] opacity-100"></div>
          {gridAnimationData && (
            <Lottie
              animationData={gridAnimationData}
              loop={true}
              autoplay={true}
              className="w-full h-full"
              style={{ 
                opacity: 0.15, 
                transform: 'translateY(25%) rotate(180deg)', 
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%'
              }}
            />
          )}
        </div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col min-h-screen overflow-x-hidden">
        {children}
      </div>
    </div>
  );
};

export default PageLayout; 