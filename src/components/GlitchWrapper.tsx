import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { GlitchEffect } from '../utils/glitchEffect';

interface GlitchWrapperProps {
  children: React.ReactNode;
}

const GlitchWrapper: React.FC<GlitchWrapperProps> = ({ children }) => {
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const glitchEffectRef = useRef<GlitchEffect | null>(null);
  
  useEffect(() => {
    // Only apply glitch effect on the Welcome page (root path)
    const isWelcomePage = location.pathname === '/';
    
    if (isWelcomePage && containerRef.current) {
      glitchEffectRef.current = new GlitchEffect(containerRef.current);
      glitchEffectRef.current.start();
      
      return () => {
        if (glitchEffectRef.current) {
          glitchEffectRef.current.destroy();
        }
      };
    }
  }, [location.pathname]);
  
  return (
    <div ref={containerRef} className={location.pathname === '/' ? 'glitch-container' : ''}>
      {children}
    </div>
  );
};

export default GlitchWrapper; 