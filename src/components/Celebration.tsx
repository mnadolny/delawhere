import React, { useEffect, useState } from 'react';

interface EmojiParticle {
  id: number;
  emoji: string;
  style: React.CSSProperties;
}

const EMOJIS = ['🎉', '🎊', '🎈', '🎆', '🎇', '✨', '🌟', '⭐', '🏆', '🥳'];
const PARTICLE_COUNT = 50;

const Celebration: React.FC = () => {
  const [particles, setParticles] = useState<EmojiParticle[]>([]);

  useEffect(() => {
    const newParticles: EmojiParticle[] = [];
    
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Random position calculations
      const startX = window.innerWidth / 2;
      const startY = window.innerHeight / 2;
      
      // Random end positions
      const tx = (Math.random() - 0.5) * window.innerWidth * 1.5;
      const ty = (Math.random() - 0.5) * window.innerHeight * 1.5;
      const rotation = Math.random() * 720 - 360; // Random rotation between -360 and 360 degrees
      
      // Random delay for more natural effect
      const delay = Math.random() * 0.5;
      
      newParticles.push({
        id: i,
        emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
        style: {
          left: `${startX}px`,
          top: `${startY}px`,
          '--tx': `${tx}px`,
          '--ty': `${ty}px`,
          '--r': `${rotation}deg`,
          animationDelay: `${delay}s`,
        } as React.CSSProperties,
      });
    }
    
    setParticles(newParticles);
    
    // Clean up particles after animation
    const timer = setTimeout(() => {
      setParticles([]);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="celebration-container">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="celebration-emoji"
          style={particle.style}
        >
          {particle.emoji}
        </div>
      ))}
    </div>
  );
};

export default Celebration; 