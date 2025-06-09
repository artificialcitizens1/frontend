import gsap from 'gsap';

// Class to create and manage glitch effects on DOM elements
export class GlitchEffect {
  private element: HTMLElement;
  private isActive: boolean = false;
  private timeline: gsap.core.Timeline | null = null;
  private noiseOverlay: HTMLDivElement | null = null;
  private scanlineOverlay: HTMLDivElement | null = null;
  
  constructor(element: HTMLElement) {
    this.element = element;
    this.setup();
  }

  // Set up the glitch effect elements
  private setup(): void {
    // Create noise overlay
    this.noiseOverlay = document.createElement('div');
    this.noiseOverlay.className = 'glitch-noise-overlay';
    
    // Create scanline overlay
    this.scanlineOverlay = document.createElement('div');
    this.scanlineOverlay.className = 'glitch-scanline-overlay';
    
    // Add CSS classes to the main element
    this.element.classList.add('glitch-container');
    
    // Append overlays to the element
    this.element.appendChild(this.noiseOverlay);
    this.element.appendChild(this.scanlineOverlay);
  }

  // Start the glitch effect
  public start(): void {
    if (this.isActive) return;
    this.isActive = true;
    
    // Add active class to trigger CSS animations
    this.element.classList.add('glitch-active');
    
    // Create GSAP timeline for more complex animations
    this.timeline = gsap.timeline({
      repeat: -1,
      repeatDelay: 2,
      onComplete: () => {
        if (!this.isActive) {
          this.timeline?.kill();
          this.timeline = null;
        }
      }
    });
    
    // Add random glitch animations
    this.timeline
      .to(this.element, {
        duration: 0.1,
        skewX: 5,
        ease: "power1.inOut",
      })
      .to(this.element, {
        duration: 0.04,
        skewX: 0,
        ease: "power1.inOut",
      })
      .to(this.element, {
        duration: 0.02,
        opacity: 0.8,
        ease: "power1.inOut",
      })
      .to(this.element, {
        duration: 0.01,
        opacity: 1,
        ease: "power1.inOut",
      })
      .add("glitchJump", "+=0.3")
      .to(this.element, {
        duration: 0.02,
        x: -5,
        ease: "power1.inOut",
      }, "glitchJump")
      .to(this.element, {
        duration: 0.04,
        x: 0,
        ease: "power1.inOut",
      })
      .to(this.element, {
        duration: 0.01,
        opacity: 0.8,
        ease: "power1.inOut",
      })
      .to(this.element, {
        duration: 0.02,
        opacity: 1,
        ease: "power1.inOut",
      });
  }

  // Stop the glitch effect
  public stop(): void {
    if (!this.isActive) return;
    this.isActive = false;
    
    // Remove active class
    this.element.classList.remove('glitch-active');
    
    // Kill the GSAP timeline
    if (this.timeline) {
      this.timeline.kill();
      this.timeline = null;
    }
  }

  // Clean up and remove all added elements
  public destroy(): void {
    this.stop();
    
    // Remove overlays
    if (this.noiseOverlay && this.noiseOverlay.parentNode) {
      this.noiseOverlay.parentNode.removeChild(this.noiseOverlay);
    }
    
    if (this.scanlineOverlay && this.scanlineOverlay.parentNode) {
      this.scanlineOverlay.parentNode.removeChild(this.scanlineOverlay);
    }
    
    // Remove classes
    this.element.classList.remove('glitch-container', 'glitch-active');
    
    this.noiseOverlay = null;
    this.scanlineOverlay = null;
  }
} 