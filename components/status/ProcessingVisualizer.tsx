import React from 'react';
import { DubbingStatus } from '../../types';

interface ProcessingVisualizerProps {
  status: DubbingStatus;
}

export const ProcessingVisualizer: React.FC<ProcessingVisualizerProps> = ({ status }) => {
  if (status === 'idle' || status === 'completed') return null;

  const getStatusText = () => {
    switch (status) {
      case 'uploading': return 'UPLOADING ASSETS TO SECURE STORAGE';
      case 'pending': return 'INITIATING NEURAL LINK';
      case 'processing': return 'SYNTHESIZING AUDIO & LIP SYNC';
      case 'failed': return 'SEQUENCE INTERRUPTED';
      default: return 'PROCESSING';
    }
  };

  return (
    <div className="w-full py-12 flex flex-col items-center justify-center">
      {/* Abstract Loader */}
      <div className="relative w-64 h-2 mb-8 bg-zinc-900 rounded-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent w-1/2 animate-[shimmer_2s_infinite] blur-sm"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent w-1/2 animate-[shimmer_2s_infinite]"></div>
      </div>

      <h3 className="text-xs font-mono text-cyan-500/80 tracking-[0.3em] animate-pulse">
        {getStatusText()}
      </h3>
      
      {/* Decorative Technical Elements */}
      <div className="mt-8 flex gap-2">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i} 
            className="w-1 h-1 bg-white/20 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 100}ms` }}
          />
        ))}
      </div>
    </div>
  );
};
