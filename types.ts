
export interface VocabularyItem {
  word: string;
  translation: string;
  sentencePart1: string;
  sentencePart2: string; // The part after the blank
  fullSentence: string;
  emoji: string; // Visual cue for the word
  imageUrl?: string; // Optional URL for later expansion
}

export interface UnitConfig {
  id: string;
  title: string;
  promptTopic: string;
  description: string;
  color: string;
}

export enum AppState {
  MENU = 'MENU',
  LOADING = 'LOADING',
  STUDY = 'STUDY',
  WORKSHEET = 'WORKSHEET',
  GAME = 'GAME',
  SPELLING = 'SPELLING',
  RESULT = 'RESULT',
  ERROR = 'ERROR'
}

export interface GameSession {
  score: number;
  totalQuestions: number;
  currentQuestionIndex: number;
  correctAnswers: number;
}

export type AccentType = 'US' | 'UK';

export interface AppSettings {
  accent: AccentType;
  darkMode: boolean;
  brightness: number; // 0.5 to 1.0
}
