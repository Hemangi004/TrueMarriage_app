import React from 'react';
import { Sparkles, Heart, Sun, Moon, Save } from 'lucide-react';
import { useBiodata } from '../../context/BiodataContext';



export const Header: React.FC = () => {
  const { completionScore, lastSavedTime, isDarkMode, toggleDarkMode } = useBiodata();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/20 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-500 via-purple-600 to-amber-400 p-[2px] shadow-lg shadow-rose-500/20 animate-float">
            <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center">
              <Heart className="w-6 h-6 text-rose-500 fill-rose-500/20" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                TrueMarriage<span className="gradient-text font-black">.in</span>
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded-full border border-rose-200/60 dark:border-rose-800/40">
                <Sparkles className="w-3 h-3 text-rose-500 animate-spin" style={{ animationDuration: '8s' }} /> AI Matrimonial
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Modern, Apple & LinkedIn-Inspired Biodata Builder
            </p>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-3 sm:gap-5">

          {/* Auto Save Badge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40 text-xs font-medium">
            <Save className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            <span>{lastSavedTime}</span>
          </div>

          {/* AI Profile Completion Widget */}
          <div className="flex items-center gap-3 bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl px-3.5 py-1.5 shadow-sm">
            <div className="relative flex items-center justify-center w-9 h-9">
              <svg className="w-9 h-9 transform -rotate-90">
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  className="text-slate-200 dark:text-slate-700"
                  fill="transparent"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  stroke="url(#completionGradient)"
                  strokeWidth="3.5"
                  strokeDasharray={2 * Math.PI * 14}
                  strokeDashoffset={2 * Math.PI * 14 * (1 - completionScore / 100)}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                  fill="transparent"
                />
                <defs>
                  <linearGradient id="completionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#E91E63" />
                    <stop offset="100%" stopColor="#8E24AA" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="absolute text-[11px] font-bold text-slate-800 dark:text-slate-100">
                {completionScore}%
              </span>
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Profile Completion
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                {completionScore >= 80 ? '🔥 High Match Score' : '✨ Add details to boost'}
              </div>
            </div>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200 border border-slate-200 dark:border-slate-700 shadow-sm"
            title="Toggle Light / Dark Mode"
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-purple-600" />}
          </button>
        </div>
      </div>
    </header>
  );
};
