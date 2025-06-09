import { useNavigate } from "react-router-dom";
import "../styles/fonts.css"; // Import fonts
import { useEffect, useRef } from "react";
import { TextAnimator } from "../utils/textAnimator";
import gsap from "gsap";

const Welcome = () => {
  const navigate = useNavigate();
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Initialize text animations for all buttons
    buttonRefs.current.forEach((button) => {
      if (button) {
        const textElement = button.querySelector('span');
        if (textElement) {
          const animator = new TextAnimator(textElement);
          
          button.addEventListener('mouseenter', () => {
            animator.animate();
            // Add glow effect and translate up on hover
            gsap.to(button, {
              boxShadow: '0 0 20px rgba(255, 255, 255, 0.2), inset 0 0 15px rgba(255, 255, 255, 0.1)',
              y: -2,
              duration: 0.15,
              ease: 'power2.inOut'
            });
          });
          
          button.addEventListener('mouseleave', () => {
            animator.animateBack();
            // Remove glow effect and reset position
            gsap.to(button, {
              boxShadow: 'none',
              y: 0,
              duration: 0.15,
              ease: 'power2.inOut'
            });
          });
        }
      }
    });

    // Initialize animation for the title
    if (titleRef.current) {
      const animator = new TextAnimator(titleRef.current);
      
      titleRef.current.addEventListener('mouseenter', () => {
        animator.animate();
      });
      
      titleRef.current.addEventListener('mouseleave', () => {
        animator.animateBack();
      });
    }
  }, []);

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Main container */}
      <div className="max-w-[1728px] mx-auto relative min-h-screen">
        {/* Background GIF */}
        <div className="fixed right-0 top-0 w-[60%] h-screen">
          <img
            src="/images/bnanner-sample.gif"
            alt="background animation"
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Blue overlay */}
        <div className="absolute right-0 top-0 w-[50%] h-full bg-[rgba(38,51,170,0.33)]" />
        
        {/* Gradient overlay */}
        <div
          className="absolute right-0 top-0 w-[50%] h-full"
          style={{
            background: "linear-gradient(90deg, #121934 0%, rgba(18, 25, 52, 0) 30%, rgba(18, 25, 52, 0) 100%)",
          }}
        />
      </div>

        {/* Content */}
        <div className="relative z-20 pt-[104px] pl-[72px]">
          {/* Logo/Title */}
          <h1
            ref={titleRef}
            className="text-[52px] leading-[65px] text-white mb-[53px] cursor-pointer"
            style={{
              fontFamily: "Arcade Interlaced",
              letterSpacing: "0.02em",
            }}
          >
            Pol IO
          </h1>

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

            {/* All Simulations Button */}
            <button
              ref={(el) => (buttonRefs.current[1] = el)}
              className="w-full h-[104px] bg-transparent border border-white/30 hover:bg-transparent transition-all backdrop-blur-sm"
            >
              <span
                className="flex items-center justify-center h-full text-[28px] leading-[37px] text-white"
                style={{ fontFamily: "Roboto Mono" }}
              >
                allSims
              </span>
            </button>

            {/* Settings Button */}
            <button
              ref={(el) => (buttonRefs.current[2] = el)}
              className="w-full h-[104px] bg-transparent border border-white/30 hover:bg-transparent transition-all backdrop-blur-sm"
            >
              <span
                className="flex items-center justify-center h-full text-[28px] leading-[37px] text-white"
                style={{ fontFamily: "Roboto Mono" }}
              >
                setting
              </span>
            </button>

            {/* Voter Details Button */}
            <button
              ref={(el) => (buttonRefs.current[3] = el)}
              className="w-full h-[104px] bg-transparent border border-white/30 hover:bg-transparent transition-all backdrop-blur-sm"
              onClick={() => navigate("/voter-details")}
            >
<span
                className="flex items-center justify-center h-full text-[28px] leading-[37px] text-white"
                style={{ fontFamily: "Roboto Mono" }}
              >
              All Simulations
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
