
import React, { useState } from 'react';
import Layout from './components/Layout';
import Flashcard from './components/Flashcard';
import QuizGame from './components/QuizGame';
import Worksheet from './components/Worksheet';
import SpellingGame from './components/SpellingGame';
import { AppState, VocabularyItem, UnitConfig, AccentType } from './types';
import { UNITS, VOCAB_DATABASE, ZHUYIN_UNITS, ZHUYIN_DATABASE, MATH_UNITS, MATH_DATABASE } from './constants';
import { fetchVocabularyForUnit } from './services/geminiService';
import { Loader2, BookOpen, Gamepad2, Trophy, RefreshCcw, FileText, SpellCheck, Languages, Calculator } from 'lucide-react';
import JSConfetti from 'js-confetti';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.MENU);
  // New State for Subject Selection
  const [selectedSubject, setSelectedSubject] = useState<'ENGLISH' | 'ZHUYIN' | 'MATH' | null>(null);
  
  const [currentUnit, setCurrentUnit] = useState<UnitConfig | null>(null);
  const [vocabList, setVocabList] = useState<VocabularyItem[]>([]);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [cardIndex, setCardIndex] = useState(0);
  const [gameScore, setGameScore] = useState(0);
  const [customTopic, setCustomTopic] = useState('');
  
  // Settings State
  const [accent, setAccent] = useState<AccentType>('US');
  const [darkMode, setDarkMode] = useState(false);
  const [brightness, setBrightness] = useState(1);
  const [speechRate, setSpeechRate] = useState(0.8);

  // Determine current voice language
  // Use zh-TW for Zhuyin AND Math
  const currentVoiceLang = (selectedSubject === 'ZHUYIN' || selectedSubject === 'MATH') ? 'zh-TW' : undefined;

  const loadUnit = async (unit: UnitConfig) => {
    setLoadingMsg(`Opening ${unit.title}...`);
    setAppState(AppState.LOADING);
    setCurrentUnit(unit);
    
    try {
      // Check if we have local data for this unit (Supports English, Zhuyin, and Math)
      let db = VOCAB_DATABASE;
      if (selectedSubject === 'ZHUYIN') db = ZHUYIN_DATABASE;
      if (selectedSubject === 'MATH') db = MATH_DATABASE;
      
      if (db[unit.id]) {
          // Simulate a tiny delay for UX smoothness
          setTimeout(() => {
              setVocabList(db[unit.id]);
              setAppState(AppState.STUDY);
          }, 500);
          return;
      }

      // Otherwise, use AI (Only for English generally, unless we expand prompt)
      const topic = unit.id === 'custom' ? customTopic : unit.promptTopic;
      if (unit.id === 'custom' && !topic.trim()) {
        alert("Please enter a topic!");
        setAppState(AppState.MENU);
        return;
      }

      const items = await fetchVocabularyForUnit(topic);
      if (items.length === 0) throw new Error("No items returned");
      
      setVocabList(items);
      setAppState(AppState.STUDY); 
    } catch (error) {
      console.error(error);
      setLoadingMsg("Oops! The magic failed. Try again.");
      setTimeout(() => setAppState(AppState.MENU), 2000);
    }
  };

  const handleGameComplete = (score: number, total: number) => {
    setGameScore(score);
    setAppState(AppState.RESULT);
    if (score === total) {
        const jsConfetti = new JSConfetti();
        jsConfetti.addConfetti();
    }
  };

  // Helper to render the tab navigation for learning modes
  const renderTabs = () => (
      <div className="flex flex-wrap justify-center gap-2 mb-6 w-full max-w-lg mx-auto px-2">
          <button 
              onClick={() => setAppState(AppState.STUDY)}
              className={`flex-1 min-w-[80px] py-2 rounded-xl font-bold flex items-center justify-center gap-1 transition-all ${appState === AppState.STUDY ? 'bg-indigo-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
          >
              <BookOpen size={16} /> <span className="hidden sm:inline">Flashcards</span>
          </button>
          <button 
              onClick={() => setAppState(AppState.WORKSHEET)}
              className={`flex-1 min-w-[80px] py-2 rounded-xl font-bold flex items-center justify-center gap-1 transition-all ${appState === AppState.WORKSHEET ? 'bg-blue-500 text-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
          >
              <FileText size={16} /> <span className="hidden sm:inline">Worksheet</span>
          </button>
          <button 
              onClick={() => setAppState(AppState.SPELLING)}
              className={`flex-1 min-w-[80px] py-2 rounded-xl font-bold flex items-center justify-center gap-1 transition-all ${appState === AppState.SPELLING ? 'bg-orange-500 text-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
          >
              <SpellCheck size={16} /> <span className="hidden sm:inline">Spell</span>
          </button>
          <button 
              onClick={() => setAppState(AppState.GAME)}
              className={`flex-1 min-w-[80px] py-2 rounded-xl font-bold flex items-center justify-center gap-1 transition-all ${appState === AppState.GAME ? 'bg-green-500 text-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
          >
              <Gamepad2 size={16} /> <span className="hidden sm:inline">Quiz</span>
          </button>
      </div>
  );

  const renderContent = () => {
    switch (appState) {
      case AppState.MENU:
        if (selectedSubject === null) {
            // MAIN LANDING SCREEN
            return (
                <div className="flex flex-col items-center justify-center w-full gap-6 py-10">
                    <div className="text-center mb-4">
                        <h2 className="text-3xl font-black text-slate-700 dark:text-white mb-2">Hello! 👋</h2>
                        <p className="text-slate-500 dark:text-slate-400 font-bold">What do you want to learn today?</p>
                    </div>

                    <button 
                        onClick={() => setSelectedSubject('ENGLISH')}
                        className="w-full max-w-sm bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border-b-8 border-indigo-100 dark:border-slate-700 hover:scale-105 transition-transform group"
                    >
                        <div className="text-6xl mb-4 group-hover:rotate-12 transition-transform duration-300">🇺🇸</div>
                        <h3 className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mb-1">English Fun</h3>
                        <p className="text-slate-400 dark:text-slate-500 font-bold">快樂學英語</p>
                    </button>
                    
                    <button 
                        onClick={() => setSelectedSubject('MATH')}
                        className="w-full max-w-sm bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl border-b-8 border-blue-100 dark:border-slate-700 hover:scale-105 transition-transform group"
                    >
                        <div className="text-6xl mb-4 group-hover:rotate-12 transition-transform duration-300">🔢</div>
                        <h3 className="text-2xl font-black text-blue-500 dark:text-blue-400 mb-1">Math</h3>
                        <p className="text-slate-400 dark:text-slate-500 font-bold">數學 (小一、小二)</p>
                    </button>
                </div>
            )
        }
        
        // ENGLISH MENU
        if (selectedSubject === 'ENGLISH') {
            return (
            <div className="flex flex-col gap-8 w-full animate-in slide-in-from-right duration-300">
                {/* Book 1 Section */}
                <div>
                    <h3 className="text-xl font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 ml-2">Book 1 (Here We Go)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {UNITS.filter(u => u.id.startsWith('b1')).map((unit) => (
                        <div key={unit.id} className="relative group">
                            <button
                                onClick={() => loadUnit(unit)}
                                className={`w-full h-full p-6 rounded-3xl shadow-lg border-b-8 transition-all hover:-translate-y-1 active:scale-95 active:border-b-0 active:translate-y-1 flex flex-col items-center text-center gap-3 ${unit.color} border-black/10 dark:border-black/30`}
                            >
                                <div className="bg-white/30 p-3 rounded-full text-2xl shadow-sm backdrop-blur-sm">
                                    {unit.id.includes('starter') ? '🚀' : unit.id.includes('u1') ? '👋' : unit.id.includes('u2') ? '🎂' : unit.id.includes('u3') ? '✏️' : '🎨'}
                                </div>
                                <div>
                                    <h3 className="font-black text-white text-lg md:text-xl drop-shadow-md">{unit.title}</h3>
                                    <p className="text-white/90 text-sm font-medium leading-tight mt-1">{unit.description}</p>
                                </div>
                            </button>
                        </div>
                        ))}
                    </div>
                </div>

                {/* Book 2 Section */}
                <div>
                    <h3 className="text-xl font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 ml-2">Book 2</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {UNITS.filter(u => u.id.startsWith('b2')).map((unit) => (
                        <div key={unit.id} className="relative group">
                            <button
                                onClick={() => loadUnit(unit)}
                                className={`w-full h-full p-6 rounded-3xl shadow-lg border-b-8 transition-all hover:-translate-y-1 active:scale-95 active:border-b-0 active:translate-y-1 flex flex-col items-center text-center gap-3 ${unit.color} border-black/10 dark:border-black/30`}
                            >
                                <div className="bg-white/30 p-3 rounded-full text-2xl shadow-sm backdrop-blur-sm">
                                    {unit.id.includes('starter') ? '🔟' : unit.id.includes('u1') ? '🐶' : '🏊'}
                                </div>
                                <div>
                                    <h3 className="font-black text-white text-lg md:text-xl drop-shadow-md">{unit.title}</h3>
                                    <p className="text-white/90 text-sm font-medium leading-tight mt-1">{unit.description}</p>
                                </div>
                            </button>
                        </div>
                        ))}
                    </div>
                </div>

                {/* AI Section */}
                <div>
                    <h3 className="text-xl font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 ml-2">AI Magic</h3>
                    <div className="w-full">
                        <div className={`h-full p-6 rounded-3xl shadow-lg border-b-8 border-purple-500 bg-purple-100 dark:bg-purple-900 flex flex-col items-center justify-center transition-transform`}>
                            <div className="text-4xl mb-2">✨</div>
                            <h3 className="font-bold text-slate-700 dark:text-white text-lg mb-2">Create Custom Lesson</h3>
                            <input 
                            type="text" 
                            placeholder="e.g. Space, Dinosaurs"
                            className="w-full p-3 rounded-xl border-2 border-purple-300 dark:border-purple-700 mb-2 text-center font-bold text-slate-600 dark:text-slate-200 dark:bg-slate-800 focus:outline-none focus:border-purple-500"
                            value={customTopic}
                            onChange={(e) => setCustomTopic(e.target.value)}
                            />
                            <button 
                                onClick={() => loadUnit(UNITS.find(u => u.id === 'custom')!)}
                                className="w-full bg-purple-500 text-white font-bold py-3 rounded-xl hover:bg-purple-600 transition-colors shadow-md"
                            >
                                Start AI Lesson
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            );
        }

        // ZHUYIN MENU
        if (selectedSubject === 'ZHUYIN') {
             return (
                <div className="flex flex-col gap-8 w-full animate-in slide-in-from-right duration-300">
                    <div>
                        <h3 className="text-xl font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 ml-2">Mandarin / Zhuyin Practice</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {ZHUYIN_UNITS.map((unit) => (
                            <div key={unit.id} className="relative group">
                                <button
                                    onClick={() => loadUnit(unit)}
                                    className={`w-full h-full p-6 rounded-3xl shadow-lg border-b-8 transition-all hover:-translate-y-1 active:scale-95 active:border-b-0 active:translate-y-1 flex flex-col items-center text-center gap-3 ${unit.color} border-black/10 dark:border-black/30`}
                                >
                                    <div className="bg-white/30 p-3 rounded-full text-2xl shadow-sm backdrop-blur-sm">
                                        🇹🇼
                                    </div>
                                    <div>
                                        <h3 className="font-black text-white text-lg md:text-xl drop-shadow-md">{unit.title}</h3>
                                        <p className="text-white/90 text-sm font-medium leading-tight mt-1">{unit.description}</p>
                                    </div>
                                </button>
                            </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-2xl border-2 border-yellow-200 dark:border-yellow-700 text-center text-slate-600 dark:text-slate-300 font-bold">
                        Tip: Listen to the sound and practice the example words!
                    </div>
                </div>
             );
        }

        // MATH MENU
        if (selectedSubject === 'MATH') {
             return (
                <div className="flex flex-col gap-8 w-full animate-in slide-in-from-right duration-300">
                    <div>
                        <h3 className="text-xl font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 ml-2">小一 (Grade 1)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                            {MATH_UNITS.filter(u => u.id.includes('g1')).map((unit) => (
                            <div key={unit.id} className="relative group">
                                <button
                                    onClick={() => loadUnit(unit)}
                                    className={`w-full h-full p-6 rounded-3xl shadow-lg border-b-8 transition-all hover:-translate-y-1 active:scale-95 active:border-b-0 active:translate-y-1 flex flex-col items-center text-center gap-3 ${unit.color} border-black/10 dark:border-black/30`}
                                >
                                    <div className="bg-white/30 p-3 rounded-full text-2xl shadow-sm backdrop-blur-sm">
                                        🧮
                                    </div>
                                    <div>
                                        <h3 className="font-black text-white text-lg md:text-xl drop-shadow-md">{unit.title}</h3>
                                        <p className="text-white/90 text-sm font-medium leading-tight mt-1">{unit.description}</p>
                                    </div>
                                </button>
                            </div>
                            ))}
                        </div>

                        <h3 className="text-xl font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 ml-2">小二 (Grade 2)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {MATH_UNITS.filter(u => u.id.includes('g2')).map((unit) => (
                            <div key={unit.id} className="relative group">
                                <button
                                    onClick={() => loadUnit(unit)}
                                    className={`w-full h-full p-6 rounded-3xl shadow-lg border-b-8 transition-all hover:-translate-y-1 active:scale-95 active:border-b-0 active:translate-y-1 flex flex-col items-center text-center gap-3 ${unit.color} border-black/10 dark:border-black/30`}
                                >
                                    <div className="bg-white/30 p-3 rounded-full text-2xl shadow-sm backdrop-blur-sm">
                                        📐
                                    </div>
                                    <div>
                                        <h3 className="font-black text-white text-lg md:text-xl drop-shadow-md">{unit.title}</h3>
                                        <p className="text-white/90 text-sm font-medium leading-tight mt-1">{unit.description}</p>
                                    </div>
                                </button>
                            </div>
                            ))}
                        </div>
                    </div>
                </div>
             );
        }

        return null;

      case AppState.LOADING:
        return (
          <div className="flex flex-col items-center justify-center flex-1 min-h-[50vh]">
            <Loader2 className="w-16 h-16 text-indigo-500 animate-spin mb-4" />
            <p className="text-2xl font-bold text-slate-600 dark:text-slate-200 animate-pulse">{loadingMsg}</p>
          </div>
        );

      case AppState.STUDY:
         return (
            <div className="flex flex-col w-full h-full">
                {renderTabs()}
                <Flashcard 
                    item={vocabList[cardIndex]} 
                    index={cardIndex}
                    total={vocabList.length}
                    accent={accent}
                    speechRate={speechRate}
                    voiceLang={currentVoiceLang}
                    onNext={() => {
                        if (cardIndex < vocabList.length - 1) {
                            setCardIndex(c => c + 1);
                        } else {
                            // Suggest worksheet or game
                            setAppState(AppState.WORKSHEET);
                        }
                    }}
                    onPrev={() => {
                        if (cardIndex > 0) setCardIndex(c => c - 1);
                    }}
                />
            </div>
         );

      case AppState.WORKSHEET:
          return (
              <div className="flex flex-col w-full h-full">
                  {renderTabs()}
                  <Worksheet 
                    items={vocabList} 
                    accent={accent} 
                    speechRate={speechRate} 
                    voiceLang={currentVoiceLang}
                  />
                  <div className="fixed bottom-6 left-0 w-full flex justify-center px-4 pointer-events-none z-20">
                     <button 
                        onClick={() => setAppState(AppState.SPELLING)}
                        className="pointer-events-auto bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-bold shadow-lg border-b-4 border-orange-700 active:border-b-0 active:translate-y-1 flex items-center gap-2 animate-bounce"
                     >
                         Next: Spelling <SpellCheck />
                     </button>
                  </div>
              </div>
          );

      case AppState.SPELLING:
          return (
            <div className="flex flex-col w-full h-full">
                {renderTabs()}
                <SpellingGame 
                    items={vocabList} 
                    onComplete={handleGameComplete} 
                    accent={accent} 
                    speechRate={speechRate} 
                    voiceLang={currentVoiceLang}
                />
            </div>
          );

      case AppState.GAME:
          return (
            <div className="flex flex-col w-full h-full">
                {renderTabs()}
                <QuizGame 
                    items={vocabList} 
                    onComplete={handleGameComplete} 
                    accent={accent} 
                    speechRate={speechRate} 
                    voiceLang={currentVoiceLang}
                />
            </div>
          );

      case AppState.RESULT:
          return (
              <div className="flex flex-col items-center justify-center flex-1 text-center py-10">
                  <div className="relative mb-8">
                      <div className="absolute inset-0 bg-yellow-400 blur-2xl opacity-50 rounded-full"></div>
                      <Trophy size={120} className="text-yellow-500 relative z-10 drop-shadow-lg" />
                  </div>
                  <h2 className="text-4xl font-black text-slate-800 dark:text-white mb-2">Awesome!</h2>
                  <p className="text-xl text-slate-500 dark:text-slate-300 mb-8 font-bold">You scored {gameScore} out of {vocabList.length}</p>
                  
                  <div className="flex flex-col gap-4 w-full max-w-xs">
                    <button 
                        onClick={() => {
                            setGameScore(0);
                            setAppState(AppState.GAME);
                        }}
                        className="bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl shadow-lg font-bold flex items-center justify-center gap-2 border-b-4 border-green-700 active:border-b-0 active:translate-y-1"
                    >
                        <RefreshCcw /> Play Quiz Again
                    </button>
                    <button 
                        onClick={() => {
                            setAppState(AppState.MENU);
                            setCardIndex(0);
                            setVocabList([]);
                            setCustomTopic('');
                        }}
                        className="bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-600 dark:text-white py-4 rounded-2xl shadow-md font-bold border-b-4 border-slate-200 dark:border-slate-800 active:border-b-0 active:translate-y-1 transition-colors"
                    >
                        Pick New Unit
                    </button>
                  </div>
              </div>
          );
      default:
        return null;
    }
  };

  return (
    <Layout 
      title={currentUnit ? currentUnit.title : "Little Star Learning"}
      showHome={appState !== AppState.MENU || selectedSubject !== null}
      onHome={() => {
        setAppState(AppState.MENU);
        setSelectedSubject(null);
        setCardIndex(0);
        setVocabList([]);
        setCustomTopic('');
        setCurrentUnit(null);
      }}
      darkMode={darkMode}
      toggleDarkMode={() => setDarkMode(!darkMode)}
      brightness={brightness}
      setBrightness={setBrightness}
      accent={accent}
      setAccent={setAccent}
      speechRate={speechRate}
      setSpeechRate={setSpeechRate}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
