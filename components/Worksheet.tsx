
import React, { useState } from 'react';
import { VocabularyItem, AccentType } from '../types';
import { Eye, EyeOff, Volume2 } from 'lucide-react';

interface WorksheetProps {
  items: VocabularyItem[];
  accent: AccentType;
  speechRate: number;
  voiceLang?: string;
}

const Worksheet: React.FC<WorksheetProps> = ({ items, accent, speechRate, voiceLang }) => {
  const [revealedIds, setRevealedIds] = useState<Set<number>>(new Set());

  const toggleReveal = (index: number) => {
    const newRevealed = new Set(revealedIds);
    if (newRevealed.has(index)) {
      newRevealed.delete(index);
    } else {
      newRevealed.add(index);
    }
    setRevealedIds(newRevealed);
  };

  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const targetLang = voiceLang || (accent === 'US' ? 'en-US' : 'en-GB');
    utterance.lang = targetLang;
    utterance.rate = speechRate;
    
    // Attempt to find a "Natural" or "Google" voice
    const voices = window.speechSynthesis.getVoices();
    let bestVoice = null;

    if (voiceLang === 'zh-TW') {
        bestVoice = voices.find(v => (v.name.includes('Google') && v.lang.includes('zh-TW')) || (v.name.includes('Hanhan') || v.name.includes('Yating'))) 
                 || voices.find(v => v.lang.includes('zh-TW'));
    } else {
        const searchLang = accent === 'US' ? 'en-US' : 'en-GB';
        bestVoice = voices.find(v => v.lang === searchLang && (v.name.includes('Google') || v.name.includes('Microsoft')))
                 || voices.find(v => v.lang === searchLang);
    }

    if (bestVoice) {
        utterance.voice = bestVoice;
    }
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="w-full flex flex-col gap-4 pb-20">
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 mb-2 transition-colors">
        <h3 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
          📝 Practice Worksheet
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">Read the sentences and guess the missing words!</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {items.map((item, index) => {
          const isRevealed = revealedIds.has(index);
          return (
            <div key={index} className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border-b-4 border-slate-100 dark:border-slate-900 flex flex-col gap-3 transition-colors">
              <div className="flex justify-between items-start">
                 <div className="bg-blue-50 dark:bg-slate-700 text-2xl p-2 rounded-lg shadow-inner">
                    {item.emoji}
                 </div>
                 <button 
                   onClick={() => toggleReveal(index)}
                   className="text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
                 >
                   {isRevealed ? <EyeOff size={20}/> : <Eye size={20}/>}
                 </button>
              </div>

              <div className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100 leading-relaxed">
                {item.sentencePart1}
                <span 
                  className={`inline-block px-2 min-w-[80px] text-center border-b-2 transition-all duration-300 ${
                    isRevealed 
                      ? 'text-indigo-600 dark:text-indigo-400 border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 rounded' 
                      : 'text-transparent border-slate-300 dark:border-slate-600 select-none'
                  }`}
                >
                  {item.word}
                </span>
                {item.sentencePart2}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-50 dark:border-slate-700 mt-1">
                <span className="text-sm text-slate-400 dark:text-slate-500 font-medium">{item.translation}</span>
                <button 
                  onClick={() => speak(item.fullSentence)}
                  className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 p-2 rounded-full transition-colors"
                >
                  <Volume2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Worksheet;
