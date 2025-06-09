import React, { useEffect, useRef } from "react";
import { TextAnimator } from "../utils/textAnimator";
import gsap from "gsap";

interface AnimatedTextProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  interval?: number; // Animation interval in milliseconds
  glowEffect?: boolean; // Whether to add glow effect during animation
  glowColor?: string; // Custom glow color
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  children,
  className = "",
  style = {},
  interval = 5000,
  glowEffect = true,
  glowColor = "rgba(255, 255, 255, 0.8)",
}) => {
  const textRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (textRef.current) {
      const animator = new TextAnimator(textRef.current);

      // Auto-animate the text in a loop
      const animateLoop = () => {
        animator.animate();

        // Add glow effect during animation if enabled
        if (glowEffect) {
          gsap.to(textRef.current, {
            textShadow: `0 0 30px ${glowColor}, 0 0 60px ${glowColor.replace("0.8", "0.4")}`,
            duration: 0.3,
            ease: "power2.inOut",
            yoyo: true,
            repeat: 1,
          });
        }
      };

      // Start the animation immediately
      animateLoop();

      // Set up interval to repeat the animation
      const intervalId = setInterval(animateLoop, interval);

      // Cleanup interval on unmount
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [interval, glowEffect, glowColor]);

  // Determine the HTML element type based on className or default to span
  const ElementType = className.includes("text-[120px]")
    ? "h1"
    : className.includes("text-[52px]")
      ? "h1"
      : "span";

  const textContent = typeof children === 'string' ? children : '';

  return React.createElement(
    ElementType,
    {
      ref: textRef,
      className,
      style,
      "data-text": textContent,
    },
    children
  );
};

export default AnimatedText;
