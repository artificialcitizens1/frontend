import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { TextAnimator } from "../utils/textAnimator";
import gsap from "gsap";
import AnimatedText from "../components/AnimatedText";

const Welcome = () => {
  const navigate = useNavigate();
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

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

        {/* Content */}
        <div className="relative z-20 pt-[104px] pl-[72px]">
          {/* Logo/Title */}
          <AnimatedText
            className="text-[52px] leading-[65px] text-white mb-[53px]"
            style={{
              fontFamily: "Arcade Interlaced",
              letterSpacing: "0.02em",
            }}
            interval={7000}
            glowEffect={true}
          >
            Pol IO
          </AnimatedText>

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

            {/* Election Result Demo Button */}
            <button
              ref={(el) => (buttonRefs.current[2] = el)}
              className="w-full h-[104px] bg-transparent border border-white/30 hover:bg-transparent transition-all backdrop-blur-sm"
              onClick={() => navigate("/simulation/demo/election-result")}
            >
              <span
                className="flex items-center justify-center h-full text-[28px] leading-[37px] text-white"
                style={{ fontFamily: "Roboto Mono" }}
              >
                electionResult
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
