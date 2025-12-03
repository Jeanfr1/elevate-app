import React from 'react';
import { Download, Play } from 'lucide-react';
import { LiquidButton } from '../ui/LiquidButton';
import { GlassCard } from '../ui/GlassCard';

interface VideoResultProps {
  videoUrl: string;
}

export const VideoResult: React.FC<VideoResultProps> = ({ videoUrl }) => {
  return (
    <div className="w-full animate-[fadeIn_1s_ease-out]">
      <GlassCard className="p-1" intensity="high">
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-black group">
          <video 
            src={videoUrl} 
            controls 
            className="w-full h-full object-cover"
          />
        </div>
      </GlassCard>

      <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-left">
          <h3 className="text-white text-lg font-light tracking-wide">Synthesis Complete</h3>
          <p className="text-zinc-500 text-sm mt-1">Your dubbed video is ready for deployment.</p>
        </div>
        
        <div className="flex gap-4">
          <a href={videoUrl} download target="_blank" rel="noreferrer">
             <LiquidButton>
                <Download size={16} />
                <span>DOWNLOAD MASTER</span>
             </LiquidButton>
          </a>
        </div>
      </div>
    </div>
  );
};
