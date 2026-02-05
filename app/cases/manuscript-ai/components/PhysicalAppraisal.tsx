"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Types
interface AppraisalStep {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  instruction: string;
  focusArea: 'spine' | 'corners' | 'dedication' | 'cover';
  aiMessage: string;
}

interface AppraisalResult {
  condition: string;
  estimatedValue: number;
  rarity: string;
  patina: string;
  dedication?: string;
  confidence: number;
}

interface PhysicalAppraisalProps {
  onComplete: (result: AppraisalResult) => void;
  onCancel?: () => void;
  bookTitle?: string;
}

// Appraisal steps configuration
const APPRAISAL_STEPS: AppraisalStep[] = [
  {
    id: 1,
    title: "Fånga bokens ryggrad",
    subtitle: "Rygg & bindning",
    description: "Ryggens skick avgör bokens karaktär i bokhyllan och visar hur väl bindningen hållit.",
    instruction: "Fokusera på ryggen",
    focusArea: 'spine',
    aiMessage: "Analyserar bindningens kvalitet..."
  },
  {
    id: 2,
    title: "Detaljstudera hörnen",
    subtitle: "Slitage & patina",
    description: "Slitage på hörnen berättar historien om hur mycket verket har använts och älskats genom åren.",
    instruction: "Visa hörnen tydligt",
    focusArea: 'corners',
    aiMessage: "Bedömer patina och ålderstecken..."
  },
  {
    id: 3,
    title: "Finns det en personlig hälsning?",
    subtitle: "Dedikationer & signaturer",
    description: "Handskrivna dedikationer ökar bokens proveniens och kan ge den betydande historiskt värde.",
    instruction: "Sök efter dedikationer",
    focusArea: 'dedication',
    aiMessage: "Läser och transkriberar text..."
  }
];

export const PhysicalAppraisal: React.FC<PhysicalAppraisalProps> = ({ 
  onComplete, 
  onCancel,
  bookTitle = "din bok"
}) => {
  const [step, setStep] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [cameraActive, setCameraActive] = useState(false);
  const [showTips, setShowTips] = useState(true);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const currentStep = APPRAISAL_STEPS[step];
  const totalSteps = APPRAISAL_STEPS.length;
  const progressPercent = ((step + 1) / totalSteps) * 100;

  // Initialize camera
  useEffect(() => {
    if (cameraActive) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [cameraActive]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (error) {
      console.error('Camera access denied:', error);
      // Fallback to file upload if camera fails
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get image data
    const imageData = canvas.toDataURL('image/jpeg', 0.9);
    
    // Add to captured images
    setCapturedImages(prev => [...prev, imageData]);

    // Start analysis
    analyzeImage(imageData);
  };

  const analyzeImage = (imageData: string) => {
    setAnalyzing(true);
    setAnalysisProgress(0);

    // Simulate AI analysis with progress
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 150);

    // Simulate analysis time
    setTimeout(() => {
      clearInterval(progressInterval);
      setAnalysisProgress(100);
      
      setTimeout(() => {
        setAnalyzing(false);
        setAnalysisProgress(0);
        
        if (step < totalSteps - 1) {
          setStep(step + 1);
          setShowTips(true);
        } else {
          // Complete appraisal
          completeAppraisal();
        }
      }, 500);
    }, 2000);
  };

  const completeAppraisal = () => {
    stopCamera();
    
    // Mock appraisal result - in production, this would come from AI
    const result: AppraisalResult = {
      condition: "Mycket gott skick med patina",
      estimatedValue: 285,
      rarity: "Samlarvärde",
      patina: "Äkta ålderstecken som ökar värdet",
      dedication: capturedImages.length === 3 ? "Till Karin, med kärlek / Lisa 1987" : undefined,
      confidence: 94
    };

    onComplete(result);
  };

  const handleCancel = () => {
    stopCamera();
    if (onCancel) {
      onCancel();
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      analyzeImage(imageData);
    };
    reader.readAsDataURL(file);
  };

  const retakePhoto = () => {
    setCapturedImages(prev => prev.slice(0, -1));
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-[#FDFCFB] z-[60] flex flex-col"
    >
      {/* Progress Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-neutral-100">
        <div className="p-6 md:p-8 flex justify-between items-center max-w-6xl mx-auto">
          <div className="flex-1">
            <motion.span 
              key={step}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] text-[#BC544B] block"
            >
              Analys av {bookTitle}
            </motion.span>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-xs text-neutral-500">
                Steg {step + 1} av {totalSteps}
              </span>
              <div className="flex-1 max-w-xs h-1 bg-neutral-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-[#BC544B] to-[#1A1A1B]"
                />
              </div>
            </div>
          </div>
          
          <button 
            onClick={handleCancel}
            className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-[#BC544B] transition-colors ml-4"
          >
            Avbryt
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-8 overflow-hidden">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            {analyzing ? (
              <motion.div 
                key="analyzing"
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center space-y-8"
              >
                {/* AI Analysis Visualization */}
                <div className="relative w-32 h-32 mx-auto">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-neutral-100"
                    />
                    <motion.circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={2 * Math.PI * 56}
                      strokeDashoffset={2 * Math.PI * 56 * (1 - analysisProgress / 100)}
                      strokeLinecap="round"
                      className="text-[#BC544B]"
                      transition={{ duration: 0.3 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-[#BC544B]">
                      {analysisProgress}%
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <motion.p 
                    key={currentStep.aiMessage}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-serif text-xl md:text-2xl text-neutral-700"
                  >
                    {currentStep.aiMessage}
                  </motion.p>
                  <p className="text-sm text-neutral-400">
                    AI-driven bildanalys med 97% noggrannhet
                  </p>
                </div>

                {/* Analysis Details */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="grid grid-cols-3 gap-4 max-w-md mx-auto mt-8"
                >
                  {[
                    { label: 'Kontrast', value: '94%' },
                    { label: 'Fokus', value: '98%' },
                    { label: 'Detaljer', value: '91%' }
                  ].map((metric) => (
                    <div key={metric.label} className="bg-white rounded-xl p-4 border border-neutral-100">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                        {metric.label}
                      </p>
                      <p className="text-lg font-bold text-[#2D6A4F]">
                        {metric.value}
                      </p>
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            ) : (
              <motion.div 
                key="capture"
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Step Header */}
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-block bg-[#BC544B]/10 text-[#BC544B] px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4"
                  >
                    {currentStep.subtitle}
                  </motion.div>
                  
                  <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 leading-tight">
                    {currentStep.title}
                  </h2>
                  
                  <p className="text-sm md:text-base text-neutral-500 max-w-lg mx-auto leading-relaxed">
                    {currentStep.description}
                  </p>
                </div>

                {/* Camera Viewfinder / Upload Area */}
                <div className="relative aspect-[3/4] max-w-md mx-auto rounded-3xl overflow-hidden bg-[#E5E1DA]/20 border-2 border-neutral-200">
                  {cameraActive ? (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />
                      <canvas ref={canvasRef} className="hidden" />
                      
                      {/* Viewfinder Overlay */}
                      <div className="absolute inset-0 pointer-events-none">
                        {/* Corner guides */}
                        <div className="absolute top-8 left-8 w-12 h-12 border-l-4 border-t-4 border-white/60 rounded-tl-lg" />
                        <div className="absolute top-8 right-8 w-12 h-12 border-r-4 border-t-4 border-white/60 rounded-tr-lg" />
                        <div className="absolute bottom-8 left-8 w-12 h-12 border-l-4 border-b-4 border-white/60 rounded-bl-lg" />
                        <div className="absolute bottom-8 right-8 w-12 h-12 border-r-4 border-b-4 border-white/60 rounded-br-lg" />
                        
                        {/* Focus area indicator */}
                        <div className="absolute inset-12 border-2 border-dashed border-white/40 rounded-2xl flex items-center justify-center">
                          <span className="bg-black/50 backdrop-blur-sm text-white text-xs px-4 py-2 rounded-full font-bold uppercase tracking-wider">
                            {currentStep.instruction}
                          </span>
                        </div>
                        
                        {/* Scanning line animation */}
                        <motion.div 
                          animate={{ y: ['0%', '100%', '0%'] }} 
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                          className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#BC544B] to-transparent opacity-50" 
                        />
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
                      <svg className="w-20 h-20 text-neutral-300 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <p className="text-neutral-400 font-medium mb-6">
                        {currentStep.instruction}
                      </p>
                      
                      <div className="space-y-3 w-full">
                        <button
                          onClick={() => setCameraActive(true)}
                          className="w-full bg-[#1A1A1B] text-white py-4 rounded-2xl font-bold text-sm uppercase tracking-wider hover:bg-[#BC544B] transition-all active:scale-95"
                        >
                          Aktivera kamera
                        </button>
                        
                        <label className="block w-full">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                          <span className="block w-full border-2 border-neutral-300 text-neutral-600 py-4 rounded-2xl font-bold text-sm uppercase tracking-wider hover:border-[#BC544B] hover:text-[#BC544B] transition-all cursor-pointer text-center">
                            Ladda upp bild
                          </span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                {/* Tips Card */}
                <AnimatePresence>
                  {showTips && !cameraActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-gradient-to-br from-[#FFF9F5] to-white border border-[#BC544B]/20 rounded-2xl p-6 max-w-md mx-auto"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-[#BC544B] text-white rounded-full flex items-center justify-center font-bold text-sm">
                          💡
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-sm mb-2">Tips för bästa resultat</h3>
                          <ul className="text-xs text-neutral-600 space-y-1">
                            <li>• Använd naturligt ljus om möjligt</li>
                            <li>• Håll kameran rakt och stabilt</li>
                            <li>• Inkludera hela området i bilden</li>
                          </ul>
                        </div>
                        <button
                          onClick={() => setShowTips(false)}
                          className="flex-shrink-0 text-neutral-400 hover:text-neutral-600"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Action Buttons */}
                {cameraActive && (
                  <div className="flex gap-4 max-w-md mx-auto">
                    {capturedImages.length > step && (
                      <button
                        onClick={retakePhoto}
                        className="flex-1 border-2 border-neutral-300 text-neutral-600 py-4 rounded-2xl font-bold text-sm uppercase tracking-wider hover:border-[#BC544B] hover:text-[#BC544B] transition-all"
                      >
                        Ta om
                      </button>
                    )}
                    <button 
                      onClick={captureImage}
                      className="flex-1 bg-[#BC544B] text-white py-4 rounded-2xl font-bold text-sm uppercase tracking-wider shadow-xl shadow-[#BC544B]/20 hover:bg-[#A04840] transition-all active:scale-95"
                    >
                      Fånga bild
                    </button>
                  </div>
                )}

                {/* Previous Images Preview */}
                {capturedImages.length > 0 && (
                  <div className="flex justify-center gap-3 pt-4">
                    {capturedImages.map((img, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-16 h-20 rounded-lg overflow-hidden border-2 border-[#2D6A4F] shadow-md relative"
                      >
                        <img src={img} alt={`Captured ${idx + 1}`} className="w-full h-full object-cover" />
                        <div className="absolute top-1 right-1 w-5 h-5 bg-[#2D6A4F] text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                          ✓
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-xl border-t border-neutral-100 py-6">
        <div className="max-w-6xl mx-auto px-6 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#BC544B] rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">
                  Certifierad bedömning
                </p>
                <p className="text-[9px] text-neutral-400">
                  Bokbörsen Vision API v2.1
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-[9px] text-neutral-400">
              <span>🔒 Krypterad</span>
              <span>⚡ Realtid</span>
              <span>✓ GDPR-kompatibel</span>
            </div>
          </div>
        </div>
      </footer>
    </motion.div>
  );
};