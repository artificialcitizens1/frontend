import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/fonts.css';

export interface ToolbarProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  actions?: React.ReactNode;
  className?: string;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  title,
  subtitle,
  onBack,
  actions,
  className = '',
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className={`sticky top-0 z-50 bg-transparent py-12 px-8 ${className}`}>
      <div className="max-w-[1728px] mx-auto flex justify-between items-center">
        <div className="flex items-center gap-12">
          <button
            className="flex items-center justify-center h-[44px]"
            onClick={handleBack}
            aria-label="Go back"
          >
            <img 
              src="/images/back_button.svg" 
              alt="Back" 
              width="24" 
              height="44"
            />
          </button>
          
          <div>
            <h1 
              className="text-white" 
              style={{ 
                fontFamily: "Roboto Mono",
                fontWeight: 500,
                fontSize: "56px",
                lineHeight: "100%",
                letterSpacing: "0%"
              }}
            >
              {title}
            </h1>
            
            {subtitle && (
              <p 
                className="text-white/80 mt-2" 
                style={{ 
                  fontFamily: "Inter",
                  fontWeight: 300,
                  fontSize: "16px",
                  lineHeight: "100%",
                  letterSpacing: "0%"
                }}
              >
                {subtitle}
              </p>
            )}
          </div>
        </div>
        
        {actions && (
          <div className="flex items-center">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default Toolbar; 