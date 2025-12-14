
import React, { useState, useEffect } from 'react';
import { VocabularyItem, AccentType } from '../types';
import { Volume2, RefreshCw, CheckCircle, ArrowRight } from 'lucide-react';
import JSConfetti from 'js-confetti';

interface SpellingGameProps {
  items: VocabularyItem[];
  onComplete: (score: number, total: number) => void;
  accent: AccentType;
  speechRate: number;
  voiceLang?: string;
}

const SpellingGame: React.FC<SpellingGameProps> = ({ items, onComplete, accent, speechRate, voiceLang }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrambledLetters, setScrambledLetters] = useState<string[]>([]);
  const [userAnswer, setUserAnswer] = useState<string[]>([]);
  const [status, setStatus] = useState<'playing' | 'correct' | 'wrong'>('playing');
  const [score, setScore] = useState(0);

  const currentItem = items[currentIndex];

  useEffect(() => {
    if (currentItem) {
      // For Zhuyin or English, we scramble the "word" part. 
      // Zhuyin words (e.g., ㄅㄚ) are characters, English are letters.
      const cleanWord = currentItem.word.replace(/\s+/g, '');
      const letters = cleanWord.split('').map(l => voiceLang ? l : l.toLowerCase());
      
      // Shuffle
      const shuffled = [...letters].sort(() => Math.random() - 0.5);
      setScrambledLetters(shuffled);
      setUserAnswer([]);
      setStatus('playing');
    }
  }, [currentIndex, currentItem, voiceLang]);

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

  const handleLetterClick = (letter: string, index: number) => {
    if (status !== 'playing') return;

    // Move from scrambled to user answer
    const newAnswer = [...userAnswer, letter];
    setUserAnswer(newAnswer);

    // Remove from scrambled (visually hide or remove)
    const newScrambled = [...scrambledLetters];
    newScrambled.splice(index, 1);
    setScrambledLetters(newScrambled);

    // Check if full word formed
    const cleanTarget = currentItem.word.replace(/\s+/g, '').toLowerCase();
    const currentAnswerStr = newAnswer.join('').toLowerCase();
    
    // For zh-TW we might not want to lowercase, but Zhuyin symbols don't have case anyway.
    
    if (currentAnswerStr.length === cleanTarget.length) {
      if (currentAnswerStr === cleanTarget) {
        handleCorrect();
      } else {
        handleWrong();
      }
    }
  };

  const handleUndo = () => {
    if (status !== 'playing' || userAnswer.length === 0) return;
    
    const lastLetter = userAnswer[userAnswer.length - 1];
    setUserAnswer(prev => prev.slice(0, -1));
    setScrambledLetters(prev => [...prev, lastLetter]);
  };

  const handleCorrect = () => {
    setStatus('correct');
    setScore(s => s + 1);
    // Speak full sentence/word for context
    speak(voiceLang ? `答對了！ ${currentItem.fullSentence}` : `Correct! ${currentItem.word}`);
    const jsConfetti = new JSConfetti();
    jsConfetti.addConfetti({ emojis: [currentItem.emoji, '🎉', '🅰️'] });

    setTimeout(() => {
        nextCard();
    }, 2000);
  };

  const handleWrong = () => {
    setStatus('wrong');
    speak(voiceLang ? '再試一次' : `Try again. ${currentItem.word}`);
    // Auto reset after delay
    setTimeout(() => {
        resetCurrentCard();
    }, 1500);
  };

  const resetCurrentCard = () => {
    const cleanWord = currentItem.word.replace(/\s+/g, '');
    const letters = cleanWord.split('').map(l => voiceLang ? l : l.toLowerCase());
    setScrambledLetters([...letters].sort(() => Math.random() - 0.5));
    setUserAnswer([]);
    setStatus('playing');
  };

  const nextCard = () => {
    if (currentIndex < items.length - 1) {
        setCurrentIndex(c => c + 1);
    } else {
        onComplete(score + 1, items.length); // +1 because we just finished the last one
    }
  };

  if (!currentItem) return <div>Loading...</div>;

  const targetLength = currentItem.word.replace(/\s+/g, '').length;

  return (
    <div className="flex flex-col items-center w-full h-full max-w-lg mx-auto">
      
      {/* HUD */}
      <div className="flex justify-between w-full mb-4 px-4">
        <span className="font-bold text-slate-400">Word {currentIndex + 1}/{items.length}</span>
        <span className="font-bold text-indigo-500">Score: {score}</span>
      </div>

      {/* Card Display */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-lg border-b-4 border-slate-200 dark:border-slate-700 w-full flex flex-col items-center mb-6 transition-colors">
        <div className="text-6xl mb-4">{currentItem.emoji}</div>
        <div className="text-slate-500 dark:text-slate-400 font-bold mb-4">{currentItem.translation}</div>
        
        <button 
             onClick={() => speak(currentItem.word)}
             className="mb-6 bg-indigo-100 dark:bg-indigo-900/50 hover:bg-indigo-200 text-indigo-600 dark:text-indigo-300 p-3 rounded-full transition-colors"
        >
             <Volume2 size={24} />
        </button>

        {/* Answer Slots */}
        <div className="flex flex-wrap gap-2 justify-center min-h-[60px]">
           {Array.from({ length: targetLength }).map((_, i) => {
               const letter = userAnswer[i];
               const isFilled = !!letter;
               let slotStyle = "border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-400";
               
               if (isFilled) {
                   slotStyle = "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-200 animate-in zoom-in duration-200";
                   if (status === 'correct') slotStyle = "border-green-500 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-100";
                   if (status === 'wrong') slotStyle = "border-red-500 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100";
               }

               return (
                   <div 
                    key={i} 
                    className={`w-10 h-12 md:w-12 md:h-14 border-b-4 rounded-lg flex items-center justify-center text-2xl font-black uppercase transition-all ${slotStyle}`}
                   >
                       {letter || '_'}
                   </div>
               )
           })}
        </div>
      </div>

      {/* Scrambled Letters (Keyboard) */}
      <div className="w-full bg-slate-200 dark:bg-slate-900/50 rounded-3xl p-4 md:p-6 grid grid-cols-5 gap-2 md:gap-3 transition-colors">
          {scrambledLetters.map((letter, idx) => (
              <button
                key={idx}
                onClick={() => handleLetterClick(letter, idx)}
                className="aspect-square bg-white dark:bg-slate-800 rounded-xl shadow-sm border-b-4 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:-translate-y-1 active:border-b-0 active:translate-y-1 transition-all text-xl md:text-2xl font-bold text-slate-700 dark:text-slate-200 uppercase flex items-center justify-center"
              >
                  {letter}
              </button>
          ))}
          {scrambledLetters.length === 0 && status === 'playing' && (
              <div className="col-span-5 text-center text-slate-400 py-2">
                 All letters placed! 
              </div>
          )}
      </div>

      {/* Controls */}
      <div className="w-full flex justify-between mt-6 px-2">
          <button 
            onClick={handleUndo}
            disabled={userAnswer.length === 0 || status !== 'playing'}
            className="text-slate-500 dark:text-slate-400 font-bold flex items-center gap-2 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30"
          >
              <RefreshCw size={20} /> Undo
          </button>

          {status === 'wrong' && (
              <button onClick={resetCurrentCard} className="text-red-500 font-bold">Try Again</button>
          )}
      </div>
    </div>
  );
};

export default SpellingGame;
