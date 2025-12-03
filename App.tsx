import React, { useState, useEffect } from 'react';
import { GlassCard } from './components/ui/GlassCard';
import { LiquidButton } from './components/ui/LiquidButton';
import { UploadZone } from './components/upload/UploadZone';
import { ProcessingVisualizer } from './components/status/ProcessingVisualizer';
import { VideoResult } from './components/video/VideoResult';
import { uploadVideo, createDubbingRequest, supabase } from './services/supabase';
import { triggerN8nWorkflow } from './services/n8n';
import { DubbingStatus, DubbingRequest, SUPPORTED_LANGUAGES } from './types';
import { AlertCircle, CheckCircle2, ChevronDown } from 'lucide-react';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<DubbingStatus>('idle');
  const [targetLang, setTargetLang] = useState<string>('Spanish');
  const [requestId, setRequestId] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  // Real-time subscription
  useEffect(() => {
    if (!requestId) return;

    const channel = supabase
      .channel(`request-${requestId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'dubbing_requests',
          filter: `id=eq.${requestId}`,
        },
        (payload) => {
          const newStatus = payload.new.status as DubbingStatus;
          setStatus(newStatus);
          
          if (newStatus === 'completed' && payload.new.dubbed_video_url) {
            setResultUrl(payload.new.dubbed_video_url);
          } else if (newStatus === 'failed') {
            setErrorMsg('Processing failed in the neural cloud.');
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [requestId]);

  const handleStartDubbing = async () => {
    if (!file) return;

    setErrorMsg(null);
    setStatus('uploading');

    try {
      // Step A: Upload Video
      const videoUrl = await uploadVideo(file);
      if (!videoUrl) throw new Error('Failed to upload video asset.');

      // Step B: Create Database Record
      const request = await createDubbingRequest(videoUrl, targetLang);
      if (!request) throw new Error('Failed to initialize request sequence.');
      
      setRequestId(request.id);
      setStatus('pending');

      // Step C: Trigger N8N
      const n8nSuccess = await triggerN8nWorkflow({
        request_id: request.id,
        video_url: videoUrl,
        language: targetLang,
      });

      if (n8nSuccess) {
        setStatus('processing');
      } else {
        throw new Error('Could not establish connection to processing core.');
      }

    } catch (err: any) {
      setStatus('failed');
      setErrorMsg(err.message || 'An unknown anomaly occurred.');
    }
  };

  const resetFlow = () => {
    setFile(null);
    setStatus('idle');
    setRequestId(null);
    setResultUrl(null);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-[#030303] text-zinc-200 font-sans selection:bg-cyan-500/30 selection:text-cyan-100 overflow-x-hidden">
      {/* Ambient Background Lights */}
      <div className="fixed top-[-20%] left-[20%] w-[600px] h-[600px] bg-white/[0.03] rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-900/[0.05] rounded-full blur-[100px] pointer-events-none" />
      
      {/* Grid Overlay */}
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none z-50 mix-blend-overlay"></div>

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-20 flex flex-col items-center min-h-screen justify-center">
        
        {/* Header */}
        <div className="mb-16 text-center space-y-4 relative">
          <div className="inline-block px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-[10px] uppercase tracking-[0.2em] text-zinc-400 mb-4">
             Aether Neural Engine v2.0
          </div>
          <h1 className="text-5xl md:text-7xl font-extralight tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 pb-2">
            Silent<span className="font-normal text-white">Flow</span>
          </h1>
          <p className="text-zinc-500 font-light text-lg tracking-wide max-w-lg mx-auto">
            Autonomous video dubbing and translation.
            <br />
            Powered by next-generation synthesis.
          </p>
        </div>

        {/* Main Interface */}
        <div className="w-full max-w-2xl relative">
          {/* Decorative lines */}
          <div className="absolute -left-12 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/5 to-transparent hidden md:block" />
          <div className="absolute -right-12 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/5 to-transparent hidden md:block" />

          {status === 'idle' || status === 'uploading' || status === 'failed' ? (
            <GlassCard className="p-8 md:p-12" intensity="medium">
              <div className="space-y-8">
                
                {/* Language Selector */}
                <div className="relative z-20">
                    <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-3 ml-1">Target Frequency</label>
                    <div className="relative">
                        <button 
                            onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors group"
                        >
                            <span className="text-zinc-200 tracking-wide">{targetLang}</span>
                            <ChevronDown className={`text-zinc-500 w-4 h-4 transition-transform duration-300 ${isLangMenuOpen ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {isLangMenuOpen && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 animate-[fadeIn_0.2s_ease-out]">
                                {SUPPORTED_LANGUAGES.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => {
                                            setTargetLang(lang.code);
                                            setIsLangMenuOpen(false);
                                        }}
                                        className="w-full text-left px-6 py-3 text-zinc-400 hover:text-white hover:bg-white/5 transition-colors text-sm tracking-wide"
                                    >
                                        {lang.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Upload Area */}
                <div>
                    <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-3 ml-1">Source Material</label>
                    <UploadZone 
                        onFileSelected={setFile} 
                        selectedFile={file} 
                        onClear={() => setFile(null)} 
                    />
                </div>

                {/* Error Message */}
                {status === 'failed' && (
                    <div className="bg-red-900/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
                        <AlertCircle className="text-red-400 w-5 h-5 shrink-0" />
                        <p className="text-red-200/80 text-sm font-light">{errorMsg}</p>
                    </div>
                )}

                {/* Action */}
                <div className="pt-4 flex justify-end">
                    <LiquidButton 
                        onClick={handleStartDubbing} 
                        disabled={!file} 
                        isLoading={status === 'uploading'}
                    >
                        INITIALIZE DUBBING
                    </LiquidButton>
                </div>
              </div>
            </GlassCard>
          ) : null}

          {/* Processing State */}
          {(status === 'pending' || status === 'processing') && (
            <GlassCard className="p-12 min-h-[400px] flex flex-col items-center justify-center" intensity="medium">
                 <ProcessingVisualizer status={status} />
            </GlassCard>
          )}

          {/* Result State */}
          {status === 'completed' && resultUrl && (
             <div className="space-y-6">
                 <VideoResult videoUrl={resultUrl} />
                 <div className="flex justify-center mt-12">
                     <button 
                        onClick={resetFlow}
                        className="text-zinc-500 hover:text-white text-xs tracking-widest uppercase transition-colors"
                     >
                         Process Another Asset
                     </button>
                 </div>
             </div>
          )}

        </div>
      </main>
      
      {/* Footer */}
      <footer className="fixed bottom-6 w-full text-center pointer-events-none">
          <p className="text-[10px] text-zinc-700 font-mono tracking-widest uppercase">System Secure • 256-bit Encrypted</p>
      </footer>
    </div>
  );
}

export default App;
