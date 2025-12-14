
import React, { useState, useEffect } from 'react';
import { VocabularyItem, AccentType } from '../types';
import { Star, Zap, Check, X } from 'lucide-react';
import JSConfetti from 'js-confetti';

interface QuizGameProps {
  items: VocabularyItem[];
  onComplete: (score: number, total: number) => void;
  accent: AccentType;
  speechRate: number;
  voiceLang?: string;
}

const QuizGame: React.FC<QuizGameProps> = ({ items, onComplete, accent, speechRate, voiceLang }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState<VocabularyItem[]>([]);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  const currentItem = items[currentIndex];

  useEffect(() => {
    if (currentItem && items.length > 0) {
        // Create distractors (3 wrong answers + 1 correct)
        const distractors = items
            .filter(i => i.word !== currentItem.word)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);
        
        const allOptions = [...distractors, currentItem].sort(() => 0.5 - Math.random());
        // If we don't have enough distractors (e.g. small vocab list), handle gracefully
        if (allOptions.length < 4) {
             // Just use what we have
        }
        
        setOptions(allOptions);
        setSelectedWord(null);
        setIsCorrect(null);
    }
  }, [currentIndex, items]);

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

  const handleOptionClick = (item: VocabularyItem) => {
    if (selectedWord) return; // Prevent double clicking

    const correct = item.word === currentItem.word;
    setSelectedWord(item.word);
    setIsCorrect(correct);

    if (correct) {
      const newScore = score + 1 + (streak > 2 ? 1 : 0); // Bonus for streak
      setScore(newScore);
      setStreak(s => s + 1);
      
      const jsConfetti = new JSConfetti();
      jsConfetti.addConfetti({
        emojis: [item.emoji, '⭐', '✨'],
        confettiNumber: 30,
      });
      // For Zhuyin, speak full sentence or word depending on context
      speak(voiceLang ? item.fullSentence : `Correct! ${item.word}`);
    } else {
        setStreak(0);
        speak(voiceLang ? item.fullSentence : `Oops. The answer is ${currentItem.word}`);
    }

    // Auto advance
    setTimeout(() => {
      if (currentIndex < items.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        onComplete(correct ? score + 1 : score, items.length);
      }
    }, 1500);
  };

  if (!currentItem) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center w-full h-full">
      {/* Game HUD */}
      <div className="w-full grid grid-cols-3 gap-2 mb-4">
         <div className="bg-white dark:bg-slate-800 p-2 rounded-xl border-b-4 border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center transition-colors">
            <span className="text-xs font-bold text-slate-400 uppercase">Score</span>
            <span className="text-xl font-black text-indigo-500 dark:text-indigo-400">{score}</span>
         </div>
         <div className="bg-white dark:bg-slate-800 p-2 rounded-xl border-b-4 border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center transition-colors">
            <span className="text-xs font-bold text-slate-400 uppercase">Question</span>
            <span className="text-xl font-black text-slate-700 dark:text-slate-200">{currentIndex + 1}<span className="text-sm text-slate-400">/{items.length}</span></span>
         </div>
         <div className={`p-2 rounded-xl border-b-4 flex flex-col items-center justify-center transition-colors ${streak > 1 ? 'bg-orange-100 border-orange-300 dark:bg-orange-900/50 dark:border-orange-700' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}>
            <span className="text-xs font-bold text-slate-400 uppercase">Streak</span>
            <div className="flex items-center gap-1">
                <Zap size={16} className={streak > 1 ? "fill-orange-500 text-orange-500" : "text-slate-300 dark:text-slate-600"} />
                <span className={`text-xl font-black ${streak > 1 ? 'text-orange-500' : 'text-slate-300 dark:text-slate-600'}`}>{streak}</span>
            </div>
         </div>
      </div>

      {/* The "Box" / Question Area */}
      <div className="w-full flex-1 bg-white dark:bg-slate-800 rounded-3xl shadow-lg border-b-8 border-indigo-100 dark:border-slate-700 p-6 mb-4 flex flex-col items-center justify-center text-center relative overflow-hidden transition-colors">
        {/* Decorative background circle */}
        <div className="absolute top-0 left-0 w-full h-2 bg-indigo-400 dark:bg-indigo-600"></div>
        
        <div className="mb-2 bg-indigo-50 dark:bg-indigo-900/50 text-indigo-500 dark:text-indigo-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            {voiceLang ? 'Listen & Choose' : 'Fill in the blank'}
        </div>

        <div className="text-2xl md:text-3xl font-bold text-slate-700 dark:text-slate-100 leading-snug my-4">
          {currentItem.sentencePart1}
          <div className={`inline-flex items-center justify-center min-w-[80px] h-10 mx-1 border-b-4 rounded-lg align-middle transition-all
            ${selectedWord === currentItem.word 
                ? 'bg-green-100 dark:bg-green-900/30 border-green-500 text-green-700 dark:text-green-400' 
                : isCorrect === false 
                    ? 'bg-red-100 dark:bg-red-900/30 border-red-400 text-red-600 dark:text-red-400' 
                    : 'bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-transparent'
            }`}>
             {selectedWord === currentItem.word ? currentItem.word : '?'}
          </div>
          {currentItem.sentencePart2}
        </div>
        
        {/* Hint */}
        <div className="mt-2 text-slate-400 dark:text-slate-500 font-medium text-sm bg-slate-50 dark:bg-slate-700 px-3 py-1 rounded-lg">
          {currentItem.translation}
        </div>
      </div>

      {/* Options Grid - 2x2 Layout like Wordwall */}
      <div className="w-full grid grid-cols-2 gap-3 mb-4">
        {options.map((option, idx) => {
           let btnStyle = "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"; // Default
           let icon = null;

           if (selectedWord) {
               if (option.word === currentItem.word) {
                   btnStyle = "bg-green-500 border-green-700 text-white scale-105 z-10 shadow-lg";
                   icon = <Check size={24} className="absolute top-2 right-2 text-white/50" />;
               } else if (option.word === selectedWord) {
                   btnStyle = "bg-red-500 border-red-700 text-white opacity-50";
                   icon = <X size={24} className="absolute top-2 right-2 text-white/50" />;
               } else {
                   btnStyle = "bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-400 dark:text-slate-500 opacity-50";
               }
           }

           return (
            <button
                key={idx}
                onClick={() => handleOptionClick(option)}
                disabled={!!selectedWord}
                className={`
                    relative group h-28 rounded-2xl border-b-8 shadow-sm transition-all duration-200 
                    flex flex-col items-center justify-center gap-1
                    active:border-b-0 active:translate-y-2
                    ${btnStyle}
                `}
            >
                {icon}
                <span className="text-3xl filter drop-shadow-sm group-hover:scale-110 transition-transform">{option.emoji}</span>
                <span className="text-lg font-black tracking-tight">{option.word}</span>
            </button>
           );
        })}
      </div>
    </div>
  );
};

export default QuizGame;
