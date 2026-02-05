"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock-funktion för att simulera kamerastream och AI-detektering
// I en verklig app skulle detta interagera med webbkameran/mobilkameran
// och en faktisk AI-modell för ISBN/skick.
const mockScan = (setDetectedBook: React.Dispatch<React.SetStateAction<any>>, setScanningStatus: React.Dispatch<React.SetStateAction<string>>) => {
  setScanningStatus("Identifierar bokens DNA...");

  const mockBooks = [
    { title: "Möss och Människor", author: "John Steinbeck", year: 1937, isbn: "9789174291244", condition: "Bra", price: 145, cover: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=400" },
    { title: "Processen", author: "Franz Kafka", year: 1925, isbn: "9789100456789", condition: "Nyskick", price: 185, cover: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=600" },
    { title: "Aniara", author: "Harry Martinson", year: 1956, isbn: "9789100451111", condition: "Dåligt skick", price: 80, cover: "https://images.unsplash.com/photo-1543005128-44c68df4197e?q=80&w=300" },
  ];

  const randomBook = mockBooks[Math.floor(Math.random() * mockBooks.length)];

  setTimeout(() => {
    setScanningStatus("Analyserar skicket...");
  }, 2000);

  setTimeout(() => {
    setDetectedBook(randomBook);
    setScanningStatus("Bok identifierad & analyserad!");
  }, 4000);
};

interface ScannerViewProps {
  onScanComplete: (book: any) => void;
  onCancel: () => void;
}

export const ScannerView: React.FC<ScannerViewProps> = ({ onScanComplete, onCancel }) => {
  const [detectedBook, setDetectedBook] = useState<any>(null);
  const [scanningStatus, setScanningStatus] = useState("Väntar på bok...");

  useEffect(() => {
    // Starta simuleringen när komponenten laddas
    mockScan(setDetectedBook, setScanningStatus);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: "100%" }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: "100%" }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="fixed inset-0 bg-ink flex flex-col items-center justify-between p-8 z-50 font-sans text-white"
    >
      {/* Top Controls */}
      <div className="w-full flex justify-between items-center z-10">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCancel} 
          className="p-3 bg-white/10 rounded-full"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </motion.button>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xs font-bold uppercase tracking-widest text-neutral-400"
        >
          {scanningStatus}
        </motion.div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-3 bg-white/10 rounded-full"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> {/* Flash icon */}
        </motion.button>
      </div>

      {/* Camera Viewfinder Area */}
      <div className="relative w-64 h-96 border-2 border-white/30 rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center">
        {/* Animated Scan Line */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-1 bg-terracotta shadow-[0_0_15px_rgba(var(--terracotta-rgb),0.7)]"
          initial={{ y: "0%" }}
          animate={{ y: "100%" }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        />

        {/* AI Feedback Overlays */}
        <AnimatePresence>
          {scanningStatus.includes("Identifierar") && (
            <motion.div
              key="isbn-tag"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="absolute top-10 left-4 bg-success/80 text-white text-[8px] px-2 py-1 rounded-full backdrop-blur-md"
            >
              ISBN: Detekterar...
            </motion.div>
          )}
          {scanningStatus.includes("Analyserar skicket") && (
            <motion.div
              key="condition-tag"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0, transition: { delay: 0.5 } }}
              exit={{ opacity: 0 }}
              className="absolute bottom-20 right-4 bg-white/20 text-white text-[8px] px-2 py-1 rounded-full backdrop-blur-md border border-white/30"
            >
              AI: Analyserar skick...
            </motion.div>
          )}
        </AnimatePresence>

        {detectedBook && (
          <motion.img
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            src={detectedBook.cover}
            alt={detectedBook.title}
            className="w-full h-full object-cover rounded-3xl"
          />
        )}
      </div>

      {/* Bottom Sheet - Scan Result */}
      <AnimatePresence>
        {detectedBook && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[3rem] p-8 shadow-2xl text-ink"
          >
            <div className="w-12 h-1 bg-neutral-200 rounded-full mx-auto mb-6" />
            
            <div className="flex items-center justify-between mb-6">
                <div>
                    <span className="text-xs font-bold text-neutral-400 uppercase">Hittad titel</span>
                    <h3 className="text-2xl font-serif font-bold">{detectedBook.title}</h3>
                    <p className="text-neutral-500 italic">{detectedBook.author} ({detectedBook.year})</p>
                </div>
                <div className="text-right">
                    <span className="text-xs font-bold text-neutral-400 uppercase">Rek. Pris</span>
                    <p className="text-3xl font-black text-terracotta">{detectedBook.price} kr</p>
                </div>
            </div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
              className="space-y-3 mb-8 bg-neutral-50 p-4 rounded-2xl border-l-4 border-terracotta"
            >
                <p className="text-sm text-neutral-700">
                    📊 Vår analys: <strong>{detectedBook.condition} skick</strong>. Priset är baserat på 3 liknande sålda exemplar sista månaden.
                </p>
            </motion.div>

            <div className="flex space-x-4">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onCancel}
                  className="flex-1 border-2 border-neutral-100 py-4 rounded-2xl font-bold text-neutral-400"
                >
                    Avbryt
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onScanComplete(detectedBook)}
                  className="flex-[2] bg-ink text-white py-4 rounded-2xl font-bold shadow-lg shadow-ink/20"
                >
                    Publicera Annons
                </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};