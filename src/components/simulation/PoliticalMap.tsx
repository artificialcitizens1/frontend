import { useEffect, useRef, useState } from 'react';

interface PoliticalMapProps {
  currentDay: 1 | 2 | 3 | 4;
  events: {
    earthquake: boolean;
    scandal: boolean;
    stockCrash: boolean;
    assassination: boolean;
  };
  isPaused: boolean;
  speed: 0.25 | 0.5 | 1 | 1.5 | 2;
}

interface Point {
  x: number;
  y: number;
  size: number;
  color: 'blue' | 'orange';
  velocity: { x: number; y: number };
}

const QUADRANTS = {
  STREET_SMART: { label: 'STREET SMART RESIDENTIAL', x: 0, y: 0 },
  CORPORATE: { label: 'CORPORATE PARK', x: 1, y: 0 },
  AUDITORIUM: { label: 'ST SIMP AUDITORIUM', x: 0, y: 1 },
  SPACES: { label: 'OLD SPACES', x: 1, y: 1 },
};

export const PoliticalMap = ({
  currentDay,
  events,
  isPaused,
  speed
}: PoliticalMapProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [points, setPoints] = useState<Point[]>(() => {
    // Generate initial random points
    return Array.from({ length: 40 }, () => ({
      x: Math.random(),
      y: Math.random(),
      size: Math.random() * 10 + 5,
      color: Math.random() > 0.5 ? 'blue' : 'orange',
      velocity: {
        x: (Math.random() - 0.5) * 0.002,
        y: (Math.random() - 0.5) * 0.002
      }
    }));
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      // Clear canvas
      ctx.fillStyle = '#1A1A1A';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid lines
      ctx.strokeStyle = 'rgba(48, 79, 254, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();

      // Draw quadrant labels
      ctx.font = '14px "Roboto Mono"';
      ctx.fillStyle = '#7790FF';
      Object.values(QUADRANTS).forEach(({ label, x, y }) => {
        const textX = x * canvas.width + (x === 0 ? 10 : -ctx.measureText(label).width - 10);
        const textY = y * canvas.height + (y === 0 ? 20 : canvas.height - 10);
        ctx.fillText(label, textX, textY);
      });

      // Draw points
      points.forEach(point => {
        ctx.beginPath();
        ctx.arc(
          point.x * canvas.width,
          point.y * canvas.height,
          point.size,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = point.color === 'blue' ? '#7790FF' : '#FF7777';
        ctx.fill();
      });

      // Draw day indicator
      const dayWidth = canvas.width / 4;
      ctx.fillStyle = '#304FFE';
      ctx.fillRect(0, canvas.height - 4, dayWidth * currentDay, 4);
    };

    let animationFrame: number;
    const animate = () => {
      if (!isPaused) {
        setPoints(prevPoints =>
          prevPoints.map(point => {
            let newX = point.x + point.velocity.x * speed;
            let newY = point.y + point.velocity.y * speed;

            // Bounce off walls
            if (newX < 0 || newX > 1) point.velocity.x *= -1;
            if (newY < 0 || newY > 1) point.velocity.y *= -1;

            // Apply events effects
            if (events.earthquake) {
              newX += (Math.random() - 0.5) * 0.01;
              newY += (Math.random() - 0.5) * 0.01;
            }
            if (events.stockCrash && point.color === 'orange') {
              newY += 0.001; // Move corporate points down
            }
            if (events.scandal) {
              point.velocity.x *= 1.1; // Increase movement speed
              point.velocity.y *= 1.1;
            }

            return {
              ...point,
              x: Math.max(0, Math.min(1, newX)),
              y: Math.max(0, Math.min(1, newY))
            };
          })
        );
      }

      draw();
      animationFrame = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, [points, isPaused, speed, currentDay, events]);

  return (
    <div className="w-full h-full relative">
      <h2 className="text-[#7790FF] text-2xl font-['Roboto Mono'] mb-4">
        SIMPOLIS POLITICAL MAP
      </h2>
      <canvas
        ref={canvasRef}
        width={1000}
        height={600}
        className="w-full h-full"
      />
    </div>
  );
}; 