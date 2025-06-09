import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { TextAnimator } from "../utils/textAnimator";
import gsap from "gsap";

const Welcome = () => {
  const navigate = useNavigate();
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize text animations for all buttons
    buttonRefs.current.forEach((button) => {
      if (button) {
        const textElement = button.querySelector("span");
        if (textElement) {
          const animator = new TextAnimator(textElement);

          button.addEventListener("mouseenter", () => {
            animator.animate();
            // Add glow effect and translate up on hover
            gsap.to(button, {
              boxShadow:
                "0 0 20px rgba(255, 255, 255, 0.2), inset 0 0 15px rgba(255, 255, 255, 0.1)",
              y: -2,
              duration: 0.15,
              ease: "power2.inOut",
            });
          });

          button.addEventListener("mouseleave", () => {
            animator.animateBack();
            // Remove glow effect and reset position
            gsap.to(button, {
              boxShadow: "none",
              y: 0,
              duration: 0.15,
              ease: "power2.inOut",
            });
          });
        }
      }
    });
    
    // Enhanced glitch effect for title
    const applyGlitchEffect = () => {
      if (!titleRef.current) return;
      
      // Timeline for complex glitch animation
      const tl = gsap.timeline();
      
      // Random properties for the glitch effect
      const skewX = (Math.random() > 0.5 ? 1 : -1) * Math.random() * 20;
      const skewY = (Math.random() > 0.5 ? 1 : -1) * Math.random() * 5;
      const xOffset = (Math.random() > 0.5 ? 1 : -1) * Math.random() * 8;
      const yOffset = (Math.random() > 0.5 ? 1 : -1) * Math.random() * 4;
      const scale = 1 + Math.random() * 0.1;
      
      // Apply the glitch effect
      tl.to(titleRef.current, {
        skewX,
        skewY,
        x: xOffset,
        y: yOffset,
        scale,
        filter: `blur(${Math.random() * 2}px)`,
        textShadow: `${Math.random() * 5}px 0 rgba(255,0,0,0.7), -${Math.random() * 5}px 0 rgba(0,255,255,0.7)`,
        duration: 0.1,
        ease: "power1.inOut",
      })
      .to(titleRef.current, {
        skewX: -skewX * 0.8,
        skewY: -skewY * 0.8,
        x: -xOffset * 0.8,
        y: -yOffset * 0.8,
        scale: 1 / scale,
        filter: "blur(0px)",
        textShadow: `${Math.random() * 3}px 0 rgba(0,255,0,0.7), -${Math.random() * 3}px 0 rgba(255,0,255,0.7)`,
        duration: 0.1,
        ease: "power1.inOut",
      })
      .to(titleRef.current, {
        skewX: 0,
        skewY: 0,
        x: 0,
        y: 0,
        scale: 1,
        filter: "none",
        textShadow: "0 0 10px rgba(255,255,255,0.5)",
        duration: 0.2,
        ease: "power2.out",
      });
    };
    
    // Random interval for glitch effect
    const randomGlitchInterval = setInterval(() => {
      if (Math.random() > 0.6) { // 40% chance to trigger
        applyGlitchEffect();
      }
    }, 2000 + Math.random() * 3000); // Between 2-5 seconds
    
    return () => {
      clearInterval(randomGlitchInterval);
    };
  }, []);

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Main container */}
      <div className="max-w-[1728px] mx-auto relative min-h-screen">
        {/* Background GIF */}
        <div className="fixed right-0 top-0 w-[60%] h-screen">
          <img
            src="/images/welcome_banner.gif"
            alt="background animation"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="relative z-20 pt-[104px] pl-[72px]">
          {/* Logo/Title with enhanced glitch effect */}
          <div 
            ref={titleRef}
            className=" relative inline-block"
            data-text="Pol IO"
          >
            <img src="/images/app_logo.gif" alt="Pol IO"/>
          </div>

          <div className="flex flex-col justify-end min-h-[50vh]">

          <div className="text-[52px] leading-[65px] text-white mb-[53px]">
            <span className="text-white" style={{ fontFamily: "Dot Matrix" , lineHeight: "1.1"}}>
              Create a<br />
              sub world
            </span>
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col space-y-6 w-[555px]">
            {/* Create Simulation Button */}
            <button
              ref={(el) => (buttonRefs.current[0] = el)}
              className="w-full h-[104px] bg-transparent border border-white/30 hover:bg-transparent transition-all backdrop-blur-sm"
              onClick={() => navigate("/create-simulation")}
            >
              <span
                className="flex items-center justify-center h-full text-[28px] leading-[37px] text-white"
                style={{ fontFamily: "Roboto Mono" }}
              >
                createSim
              </span>
            </button>  
          </div>

          {/* <div className="h-20"></div> */}
          {/* <div className="h-20"></div> */}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
