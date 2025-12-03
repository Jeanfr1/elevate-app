import React, { useCallback, useState } from 'react';
import { Upload, FileVideo, X } from 'lucide-react';

interface UploadZoneProps {
  onFileSelected: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onFileSelected, selectedFile, onClear }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('video/')) {
        onFileSelected(file);
      }
    }
  }, [onFileSelected]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelected(e.target.files[0]);
    }
  };

  if (selectedFile) {
    return (
      <div className="w-full h-64 relative group">
        <div className="absolute inset-0 bg-zinc-900/50 rounded-2xl border border-white/10 backdrop-blur-md flex flex-col items-center justify-center transition-all duration-300">
          <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-white/5">
            <FileVideo className="text-zinc-400 w-6 h-6" />
          </div>
          <p className="text-zinc-300 font-light tracking-wide text-sm">{selectedFile.name}</p>
          <p className="text-zinc-500 text-xs mt-2 font-mono">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
          
          <button 
            onClick={onClear}
            className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <label 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        w-full h-64 rounded-2xl border border-dashed transition-all duration-500 cursor-pointer
        flex flex-col items-center justify-center relative overflow-hidden group
        ${isDragging 
          ? 'border-white/40 bg-white/5 scale-[1.01] shadow-[0_0_50px_rgba(255,255,255,0.05)]' 
          : 'border-white/10 hover:border-white/20 hover:bg-white/[0.02]'}
      `}
    >
      <input 
        type="file" 
        accept="video/*" 
        onChange={handleFileInput} 
        className="hidden" 
      />
      
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/[0.03] via-transparent to-transparent pointer-events-none" />

      <div className={`transition-transform duration-500 ${isDragging ? 'scale-110' : 'group-hover:scale-105'}`}>
        <div className="w-16 h-16 rounded-full bg-gradient-to-b from-zinc-800 to-black flex items-center justify-center mb-6 shadow-xl border border-white/5 relative">
          <Upload className="text-zinc-400 w-6 h-6" />
          {/* Pulse ring */}
          <div className="absolute inset-0 rounded-full border border-white/20 scale-110 opacity-0 group-hover:scale-125 group-hover:opacity-100 transition-all duration-1000" />
        </div>
      </div>

      <p className="text-zinc-400 font-light tracking-widest uppercase text-xs mb-2">Initiate Upload Sequence</p>
      <p className="text-zinc-600 text-xs tracking-wide">Drag & Drop or Click to Browse</p>
    </label>
  );
};
