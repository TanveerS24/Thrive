import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);

  const colors = [
    '#22C55E', // Growth Green
    '#38BDF8', // Sky Blue
    '#60A5FA', // Lighter Blue
    '#34D399', // Teal
    '#FBBF24', // Amber
    '#F87171', // Red
    '#A78BFA', // Purple
    '#FB7185', // Pink
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create shooting star at random position
    const createShootingStar = () => {
      const side = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
      let x, y, vx, vy;

      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const randomSpeed = Math.random() * 0.8 + 0.4; // Speed multiplier: 0.4 to 1.2
      const randomThickness = Math.random() * 3 + 0.5; // Thickness: 0.5 to 3.5

      if (side === 0) {
        // From top
        x = Math.random() * canvas.width;
        y = -10;
        vx = (Math.random() - 0.5) * 8 * randomSpeed;
        vy = (Math.random() * 6 + 4) * randomSpeed;
      } else if (side === 1) {
        // From right
        x = canvas.width + 10;
        y = Math.random() * canvas.height;
        vx = -(Math.random() * 6 + 4) * randomSpeed;
        vy = (Math.random() - 0.5) * 8 * randomSpeed;
      } else if (side === 2) {
        // From bottom
        x = Math.random() * canvas.width;
        y = canvas.height + 10;
        vx = (Math.random() - 0.5) * 8 * randomSpeed;
        vy = -(Math.random() * 6 + 4) * randomSpeed;
      } else {
        // From left
        x = -10;
        y = Math.random() * canvas.height;
        vx = (Math.random() * 6 + 4) * randomSpeed;
        vy = (Math.random() - 0.5) * 8 * randomSpeed;
      }

      particlesRef.current.push({
        x,
        y,
        vx,
        vy,
        life: 1,
        maxLife: 1.5,
        color: randomColor,
        size: randomThickness,
      });
    };

    let lastShootingStarTime = 0;
    const shootingStarInterval = 500; // Create a star every 500ms

    const animate = () => {
      // Clear canvas with black background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Create new shooting star occasionally
      const now = Date.now();
      if (now - lastShootingStarTime > shootingStarInterval) {
        createShootingStar();
        lastShootingStarTime = now;
      }

      // Update and draw particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const particle = particlesRef.current[i];

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Decrease life
        particle.life -= 0.01;

        // Draw particle trail
        const trailLength = 40;
        const opacity = (particle.life / particle.maxLife) * 0.8;

        // Create gradient for trail effect
        const gradient = ctx.createLinearGradient(
          particle.x,
          particle.y,
          particle.x - particle.vx * trailLength,
          particle.y - particle.vy * trailLength
        );
        gradient.addColorStop(0, `${particle.color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`);
        gradient.addColorStop(1, `${particle.color}00`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = particle.size;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(
          particle.x - particle.vx * trailLength,
          particle.y - particle.vy * trailLength
        );
        ctx.stroke();

        // Draw star
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = opacity;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        // Remove dead particles
        if (particle.life <= 0) {
          particlesRef.current.splice(i, 1);
        }
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full z-0"
      style={{ pointerEvents: 'none' }}
    />
  );
};

export default AnimatedBackground;
