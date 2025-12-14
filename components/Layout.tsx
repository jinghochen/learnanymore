import React, { useState, useEffect } from 'react';
import { Settings, Moon, Sun, Volume2, X, Gauge } from 'lucide-react';
import { AccentType } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  onHome?: () => void;
  showHome?: boolean;
  
  // Settings Props
  darkMode: boolean;
  toggleDarkMode: () => void;
  brightness: number;
  setBrightness: (val: number) => void;
  accent: AccentType;
  setAccent: (val: AccentType) => void;
  speechRate: number;
  setSpeechRate: (val: number) => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title, 
  onHome, 
  showHome = true,
  darkMode,
  toggleDarkMode,
  brightness,
  setBrightness,
  accent,
  setAccent,
  speechRate,
  setSpeechRate
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Apply dark mode to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div 
      className="min-h-screen relative overflow-hidden flex flex-col items-center transition-colors duration-300 bg-[#f0f9ff] dark:bg-slate-900"
      style={{ 
        filter: `brightness(${brightness})`,
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
      }}
    >
      {/* Background Decorations */}
      <div className="blob bg-pink-300 dark:bg-pink-900 w-96 h-96 rounded-full top-0 left-0 -translate-x-1/2 -translate-y-1/2 mix-blend-multiply dark:mix-blend-soft-light transition-colors duration-500"></div>
      <div className="blob bg-yellow-200 dark:bg-yellow-900 w-96 h-96 rounded-full top-0 right-0 translate-x-1/2 -translate-y-1/2 mix-blend-multiply dark:mix-blend-soft-light transition-colors duration-500"></div>
      <div className="blob bg-blue-300 dark:bg-blue-900 w-96 h-96 rounded-full bottom-0 left-20 translate-y-1/2 mix-blend-multiply dark:mix-blend-soft-light transition-colors duration-500"></div>

      {/* Header */}
      <header className="w-full max-w-4xl p-4 flex justify-between items-center z-20">
        <div className="flex items-center gap-2">
           <div className="bg-white dark:bg-slate-800 p-2 rounded-full shadow-md transition-colors">
             <span className="text-2xl">🌟</span>
           </div>
           <h1 className="text-2xl font-bold text-slate-700 dark:text-slate-100 tracking-tight">Little Star</h1>
        </div>
        
        <div className="flex gap-3">
            {showHome && onHome && (
            <button 
                onClick={onHome}
                className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-200 px-4 py-2 rounded-full shadow-sm font-bold transition-all hover:scale-105 active:scale-95 border-2 border-slate-100 dark:border-slate-700"
            >
                🏠 <span className="hidden sm:inline ml-1">Home</span>
            </button>
            )}
            <button
                onClick={() => setIsSettingsOpen(true)}
                className="bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-200 p-2 rounded-full shadow-sm border-2 border-slate-100 dark:border-slate-700 hover:scale-105 transition-all"
            >
                <Settings size={24} />
            </button>
        </div>
      </header>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
            <div className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-3xl shadow-2xl p-6 border-4 border-indigo-100 dark:border-slate-700 animate-in fade-in zoom-in duration-200 max-h-[85vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-black text-slate-700 dark:text-white">Settings</h3>
                    <button onClick={() => setIsSettingsOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                        <X size={28} />
                    </button>
                </div>

                {/* Dark Mode Toggle */}
                <div className="mb-6">
                    <label className="block text-sm font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase">Theme</label>
                    <button 
                        onClick={toggleDarkMode}
                        className="w-full bg-slate-100 dark:bg-slate-700 p-1 rounded-full flex relative transition-colors"
                    >
                        <div className={`w-1/2 py-2 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 z-10 ${!darkMode ? 'text-slate-800' : 'text-slate-400'}`}>
                            <Sun size={16} /> Light
                        </div>
                        <div className={`w-1/2 py-2 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 z-10 ${darkMode ? 'text-white' : 'text-slate-500'}`}>
                            <Moon size={16} /> Dark
                        </div>
                        {/* Slider BG */}
                        <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white dark:bg-slate-600 rounded-full shadow-sm transition-all duration-300 ${darkMode ? 'translate-x-full left-1' : 'left-1'}`}></div>
                    </button>
                </div>

                {/* Brightness Slider */}
                <div className="mb-6">
                    <label className="block text-sm font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase">Brightness</label>
                    <div className="flex items-center gap-3">
                        <Sun size={16} className="text-slate-400" />
                        <input 
                            type="range" 
                            min="0.5" 
                            max="1.1" 
                            step="0.1"
                            value={brightness}
                            onChange={(e) => setBrightness(parseFloat(e.target.value))}
                            className="w-full accent-indigo-500 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                        />
                        <Sun size={24} className="text-slate-800 dark:text-white" />
                    </div>
                </div>

                {/* Speech Rate Slider */}
                <div className="mb-6">
                    <label className="block text-sm font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase">Voice Speed: {speechRate}x</label>
                    <div className="flex items-center gap-3">
                        <span className="text-xl">🐢</span>
                        <input 
                            type="range" 
                            min="0.5" 
                            max="1.5" 
                            step="0.1"
                            value={speechRate}
                            onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                            className="w-full accent-indigo-500 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-xl">🐇</span>
                    </div>
                </div>

                {/* Accent Selection */}
                <div className="mb-2">
                    <label className="block text-sm font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase">Voice Accent</label>
                    <div className="grid grid-cols-2 gap-2">
                        <button 
                            onClick={() => setAccent('US')}
                            className={`p-3 rounded-xl border-2 font-bold flex flex-col items-center gap-1 transition-all ${accent === 'US' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300' : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'}`}
                        >
                            <span className="text-2xl">🇺🇸</span>
                            <span className="text-xs">American</span>
                        </button>
                        <button 
                            onClick={() => setAccent('UK')}
                            className={`p-3 rounded-xl border-2 font-bold flex flex-col items-center gap-1 transition-all ${accent === 'UK' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300' : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'}`}
                        >
                            <span className="text-2xl">🇬🇧</span>
                            <span className="text-xs">British</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* Content */}
      <main className="flex-1 w-full max-w-2xl p-4 flex flex-col z-10">
        {title && (
          <div className="mb-6 text-center">
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white drop-shadow-sm transition-colors">{title}</h2>
          </div>
        )}
        <div className="flex-1 flex flex-col">
          {children}
        </div>
      </main>
      
      <footer className="w-full p-4 text-center text-slate-400 dark:text-slate-500 text-sm z-10 pb-8">
        <p>Powered by Gemini 2.5 • Learning made fun</p>
      </footer>
    </div>
  );
};

export default Layout;