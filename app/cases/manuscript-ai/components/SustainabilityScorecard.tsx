"use client";

import React from 'react';
import { motion } from 'framer-motion';

const badges = [
  { id: 1, emoji: "📜", title: "Beskyddare", desc: "Räddat 10+ böcker", active: true },
  { id: 2, emoji: "🚲", title: "Lokal hjälte", desc: "Använt Green Vaults", active: true },
  { id: 3, emoji: "🏛️", title: "Kurator", desc: "Skapat en hylla", active: false },
  { id: 4, emoji: "🕯️", title: "Nattläsare", desc: "Lästs 5000+ sidor", active: false },
];

export const SustainabilityScorecard = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-[3rem] p-10 shadow-soft border border-neutral-100 overflow-hidden relative"
    >
      {/* Bakgrunds-glow för att lyfta fram status */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-success/5 rounded-full blur-3xl" />

      <div className="text-center mb-10 relative z-10">
        <motion.div 
          initial={{ rotate: -10, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="w-28 h-28 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-success/20"
        >
          <span className="text-5xl">🌳</span>
        </motion.div>
        <h2 className="text-3xl font-serif font-bold text-ink">Skogens Väktare</h2>
        <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-[0.2em] mt-2">Nivå 4 • 2.450 poäng</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="bg-neutral-50 p-6 rounded-[2rem] border border-neutral-100">
          <p className="text-[10px] text-neutral-400 font-bold uppercase mb-1 tracking-tighter">CO2 Sparat</p>
          <p className="text-3xl font-black text-success">14.2<span className="text-sm ml-1">kg</span></p>
        </div>
        <div className="bg-neutral-50 p-6 rounded-[2rem] border border-neutral-100">
          <p className="text-[10px] text-neutral-400 font-bold uppercase mb-1 tracking-tighter">Livscykler</p>
          <p className="text-3xl font-black text-terracotta">12<span className="text-sm ml-1">st</span></p>
        </div>
      </div>

      {/* Progress Section */}
      <div className="mb-10 px-2">
        <div className="flex justify-between items-end mb-3">
          <span className="text-[10px] font-bold text-neutral-400 uppercase">Nästa trädplantering</span>
          <span className="text-xs font-bold text-success">70%</span>
        </div>
        <div className="h-3 w-full bg-neutral-100 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "70%" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="h-full bg-success"
          />
        </div>
        <p className="text-[10px] text-neutral-400 mt-3 italic text-center">
          Du är 5.8kg CO2 ifrån att vi planterar ett träd i ditt namn i Amazonas.
        </p>
      </div>

      {/* Badges Section */}
      <div className="pt-8 border-t border-neutral-100">
        <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-6 text-center">Dina Utmärkelser</h3>
        <div className="grid grid-cols-4 gap-4">
          {badges.map((badge) => (
            <div key={badge.id} className="group relative flex flex-col items-center">
              <motion.div 
                whileHover={{ y: -5 }}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm transition-all ${
                  badge.active ? 'bg-paper border border-gold/30' : 'bg-neutral-100 grayscale opacity-30'
                }`}
              >
                {badge.emoji}
              </motion.div>
              {/* Simple Tooltip on Hover */}
              <div className="absolute -top-12 scale-0 group-hover:scale-100 transition-transform bg-ink text-white text-[8px] p-2 rounded-lg w-20 text-center pointer-events-none z-20 font-bold uppercase">
                {badge.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};