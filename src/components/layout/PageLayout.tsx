import React from 'react';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`min-h-screen w-full relative overflow-hidden ${className}`}>
      {/* Fixed Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#131B39] to-[#0F1322]">
        {/* Top Grid */}
        <img
          src="/images/top_grid.png"
          alt="Top grid"
          className="absolute top-0 w-full h-1/2 object-cover opacity-30 origin-top"
        />
        {/* Bottom Grid */}
        <img
          src="/images/bottom_grid.png"
          alt="Bottom grid"
          className="absolute bottom-0 w-full h-1/2 object-cover opacity-30 origin-bottom"
        />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col min-h-screen overflow-x-hidden">
        {children}
      </div>
    </div>
  );
};

export default PageLayout; 