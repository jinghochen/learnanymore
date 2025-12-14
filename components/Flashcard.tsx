
import React, { useState } from 'react';
import { VocabularyItem, AccentType } from '../types';
import { Volume2, ArrowRight, ArrowLeft, RefreshCw } from 'lucide-react';

interface FlashcardProps {
  item: VocabularyItem;
  onNext: () => void;
  onPrev: () => void;
  index: number;
  total: number;
  accent: AccentType;
  speechRate: number;
  voiceLang?: string; // e.g., 'zh-TW'
}

const Flashcard: React.FC<FlashcardProps> = ({ item, onNext, onPrev, index, total, accent, speechRate, voiceLang }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const speak = (text: string) => {
    // Cancel previous speech to prevent queueing oddities
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const targetLang = voiceLang || (accent === 'US' ? 'en-US' : 'en-GB');
    utterance.lang = targetLang;
    utterance.rate = speechRate; 
    
    // Attempt to find a "Natural" or "Google" voice which sounds better
    const voices = window.speechSynthesis.getVoices();
    let bestVoice = null;

    if (voiceLang === 'zh-TW') {
        // Prioritize Google's Chinese voice or Microsoft's Hanhan/Yating
        bestVoice = voices.find(v => (v.name.includes('Google') && v.lang.includes('zh-TW')) || (v.name.includes('Hanhan') || v.name.includes('Yating'))) 
                 || voices.find(v => v.lang.includes('zh-TW'));
    } else {
        // Prioritize Google or Microsoft English voices
        const searchLang = accent === 'US' ? 'en-US' : 'en-GB';
        bestVoice = voices.find(v => v.lang === searchLang && (v.name.includes('Google') || v.name.includes('Microsoft')))
                 || voices.find(v => v.lang === searchLang);
    }

    if (bestVoice) {
        utterance.voice = bestVoice;
    }

    window.speechSynthesis.speak(utterance);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 w-full">
      
      {/* Progress */}
      <div className="mb-4 bg-white/50 dark:bg-slate-800/50 px-4 py-1 rounded-full text-slate-600 dark:text-slate-300 font-bold text-sm backdrop-blur-sm">
        Card {index + 1} of {total}
      </div>

      {/* Card Container */}
      <div 
        className="relative w-full max-w-sm aspect-[3/4] cursor-pointer group perspective-1000 mb-6"
        onClick={handleFlip}
      >
        <div className={`relative w-full h-full duration-500 preserve-3d transition-all ${isFlipped ? 'rotate-y-180' : ''}`}>
          
          {/* Front */}
          <div className="absolute w-full h-full backface-hidden bg-white dark:bg-slate-800 border-4 border-indigo-200 dark:border-slate-700 rounded-3xl shadow-xl flex flex-col items-center justify-center p-6 text-center hover:border-indigo-300 dark:hover:border-slate-600 transition-colors">
            <div className="mb-6 w-full h-40 bg-indigo-50 dark:bg-slate-700 rounded-2xl flex items-center justify-center text-8xl shadow-inner border border-indigo-100 dark:border-slate-600">
              {item.emoji}
            </div>
            <h3 className="text-4xl font-black text-slate-800 dark:text-white mb-2">{item.word}</h3>
            <p className="text-slate-400 dark:text-slate-500 font-bold mb-8 text-sm uppercase tracking-widest flex items-center gap-2">
                <RefreshCw size={14} /> Tap to flip
            </p>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                // If it's Zhuyin, we might want to speak the full sentence (which contains the reading) if word is just a symbol
                speak(item.fullSentence.length < 5 ? item.fullSentence : item.word);
              }}
              className="bg-indigo-500 hover:bg-indigo-600 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95 flex items-center gap-2"
            >
              <Volume2 size={24} />
              <span className="font-bold">Listen</span>
            </button>
          </div>

          {/* Back */}
          <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-800 rounded-3xl shadow-xl flex flex-col items-center justify-center p-6 text-center text-white">
            <div className="text-5xl mb-4">{item.emoji}</div>
            <h3 className="text-3xl font-bold mb-2">{item.translation}</h3>
            <div className="w-16 h-1 bg-white/30 rounded-full mb-6"></div>
            
            <p className="text-lg opacity-90 mb-2 font-medium">Example:</p>
            <p className="text-xl font-bold bg-black/20 p-4 rounded-xl leading-relaxed border border-white/10">
              "{item.fullSentence}"
            </p>
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                speak(item.fullSentence);
              }}
              className="mt-6 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-transform hover:scale-110 active:scale-95 border border-white/20"
            >
              <Volume2 size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4 w-full max-w-sm justify-between">
        <button 
          onClick={onPrev}
          disabled={index === 0}
          className="bg-white dark:bg-slate-800 disabled:opacity-50 text-slate-700 dark:text-slate-200 px-6 py-3 rounded-2xl shadow-md font-bold flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 border-b-4 border-slate-200 dark:border-slate-900 active:border-b-0 active:translate-y-1 transition-colors"
        >
          <ArrowLeft size={20} /> Prev
        </button>
        <button 
          onClick={onNext}
          className="bg-indigo-500 text-white px-8 py-3 rounded-2xl shadow-md font-bold flex items-center gap-2 hover:bg-indigo-600 border-b-4 border-indigo-700 active:border-b-0 active:translate-y-1"
        >
          {index === total - 1 ? 'Finish' : 'Next'} <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default Flashcard;
