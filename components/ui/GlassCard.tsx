import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', intensity = 'medium' }) => {
  const bgMap = {
    low: 'bg-zinc-900/40 border-white/5',
    medium: 'bg-zinc-900/60 border-white/10 shadow-2xl shadow-black/50',
    high: 'bg-zinc-800/80 border-white/15 shadow-2xl shadow-black/80',
  };

  return (
    <div className={`relative backdrop-blur-2xl rounded-3xl border overflow-hidden transition-all duration-500 ${bgMap[intensity]} ${className}`}>
      {/* Subtle noisy texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/stardust.png")` }}></div>
      
      {/* Top subtle highlight */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50"></div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
