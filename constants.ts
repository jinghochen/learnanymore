
import { UnitConfig, VocabularyItem } from './types';

// Based on Hanlin Here We Go 1 & 2
export const UNITS: UnitConfig[] = [
  // --- Book 1 ---
  {
    id: 'b1_starter',
    title: 'B1 Starter: Numbers & Animals',
    promptTopic: 'numbers 1-5 and basic animals',
    description: 'one, two, ant, boy, cat...',
    color: 'bg-pink-400'
  },
  {
    id: 'b1_u1',
    title: 'B1 Unit 1: What\'s Your Name?',
    promptTopic: 'self introduction',
    description: 'I, my, fish, girl, hand',
    color: 'bg-orange-400'
  },
  {
    id: 'b1_u2',
    title: 'B1 Unit 2: How Old Are You?',
    promptTopic: 'numbers 6-10',
    description: 'six, seven, eight, nine, ten...',
    color: 'bg-yellow-400'
  },
  {
    id: 'b1_u3',
    title: 'B1 Unit 3: What\'s This?',
    promptTopic: 'school supplies',
    description: 'book, pen, ruler, pig, snake...',
    color: 'bg-green-400'
  },
  {
    id: 'b1_u4',
    title: 'B1 Unit 4: What Color Is It?',
    promptTopic: 'colors and school items',
    description: 'blue, green, red, library...',
    color: 'bg-teal-400'
  },
  // --- Book 2 ---
  {
    id: 'b2_starter',
    title: 'B2 Starter: Numbers 11-15',
    promptTopic: 'numbers 11-15',
    description: 'eleven, twelve, fifteen...',
    color: 'bg-blue-400'
  },
  {
    id: 'b2_u1',
    title: 'B2 Unit 1: Is That a Dog?',
    promptTopic: 'size and animals',
    description: 'small, big, dog, cat...',
    color: 'bg-indigo-400'
  },
  {
    id: 'b2_u2',
    title: 'B2 Unit 2: Can You Swim?',
    promptTopic: 'actions and verbs',
    description: 'dance, draw, jump, swim...',
    color: 'bg-purple-400'
  },
  {
    id: 'custom',
    title: 'Magic Topic (AI)',
    promptTopic: '', // Dynamic
    description: 'Create your own lesson!',
    color: 'bg-slate-500'
  }
];

export const ZHUYIN_UNITS: UnitConfig[] = [
  {
    id: 'z_symbol_basic',
    title: '1. 注音符號 (Symbols)',
    promptTopic: 'bopomofo symbols',
    description: '基礎聲母與韻母 (ㄅ, ㄆ, ㄇ, ㄚ...)',
    color: 'bg-red-400'
  },
  {
    id: 'z_spelling_2',
    title: '2. 二拼音練習 (2-Part)',
    promptTopic: 'bopomofo 2 part spelling',
    description: '練習拼音與聲調 (ㄅㄚ, ㄇㄚˇ...)',
    color: 'bg-amber-400'
  },
  {
    id: 'z_spelling_3',
    title: '3. 三拼音練習 (3-Part)',
    promptTopic: 'bopomofo 3 part spelling',
    description: '結合韻練習 (ㄍㄨㄚ, ㄏㄨㄚ...)',
    color: 'bg-emerald-400'
  }
];

export const MATH_UNITS: UnitConfig[] = [
  // --- Grade 1 ---
  {
    id: 'm_g1_count',
    title: '小一: 10以內的數',
    promptTopic: 'counting to 10',
    description: '數一數，有多少？',
    color: 'bg-cyan-400'
  },
  {
    id: 'm_g1_add',
    title: '小一: 加法練習',
    promptTopic: 'basic addition',
    description: '合起來是多少？(10以內)',
    color: 'bg-blue-500'
  },
  {
    id: 'm_g1_sub',
    title: '小一: 減法練習',
    promptTopic: 'basic subtraction',
    description: '剩下多少？(10以內)',
    color: 'bg-indigo-500'
  },
  // --- Grade 2 ---
  {
    id: 'm_g2_mul_2',
    title: '小二: 九九乘法 (2的乘法)',
    promptTopic: 'multiplication 2',
    description: '2 的乘法表',
    color: 'bg-violet-500'
  },
  {
    id: 'm_g2_mul_5',
    title: '小二: 九九乘法 (5的乘法)',
    promptTopic: 'multiplication 5',
    description: '5 的乘法表',
    color: 'bg-fuchsia-500'
  },
  {
    id: 'm_g2_add_100',
    title: '小二: 兩位數加法',
    promptTopic: 'addition within 100',
    description: '直式加法練習',
    color: 'bg-rose-400'
  }
];

export const PLACEHOLDER_IMAGES = [
  'https://picsum.photos/400/300?random=1',
  'https://picsum.photos/400/300?random=2',
  'https://picsum.photos/400/300?random=3',
];

// Helper to create simple item
const createItem = (word: string, translation: string, sentencePart1: string, sentencePart2: string, emoji: string): VocabularyItem => ({
  word,
  translation,
  sentencePart1,
  sentencePart2,
  fullSentence: `${sentencePart1}${word}${sentencePart2}`,
  emoji
});

// Helper for Zhuyin items
const createZhuyin = (symbol: string, example: string, emoji: string): VocabularyItem => ({
    word: symbol,
    translation: example, // e.g. "爸爸"
    sentencePart1: ``,
    sentencePart2: ` (${example})`,
    fullSentence: `${example}`, // Read only the Chinese word
    emoji
});

// Helper for Math items
const createMath = (answer: string, question: string, concept: string, emoji: string): VocabularyItem => ({
    word: answer,
    translation: concept, // e.g. "加法"
    sentencePart1: question + " = ",
    sentencePart2: "",
    fullSentence: `${question} 等於 ${answer}`, // For TTS
    emoji
});


// Database extracted from User's PDF
export const VOCAB_DATABASE: Record<string, VocabularyItem[]> = {
  'b1_starter': [
    createItem('one', '一', 'I have ', ' nose.', '1️⃣'),
    createItem('two', '二', 'I have ', ' eyes.', '2️⃣'),
    createItem('three', '三', 'There are ', ' pigs.', '3️⃣'),
    createItem('four', '四', 'I see ', ' birds.', '4️⃣'),
    createItem('five', '五', 'Give me ', '.', '5️⃣'),
    createItem('ant', '螞蟻', 'It is a small ', '.', '🐜'),
    createItem('boy', '男孩', 'He is a ', '.', '👦'),
    createItem('cat', '貓', 'The ', ' says meow.', '🐱'),
    createItem('dog', '狗', 'The ', ' says woof.', '🐶'),
    createItem('duck', '鴨子', 'The ', ' can swim.', '🦆'),
    createItem('egg', '蛋', 'This is an ', '.', '🥚'),
    createItem('elephant', '大象', 'The ', ' is big.', '🐘'),
  ],
  'b1_u1': [
    createItem('I', '我', '', ' am a student.', '🙋‍♂️'),
    createItem('my', '我的', 'This is ', ' book.', '📖'),
    createItem('fish', '魚', 'The ', ' can swim.', '🐟'),
    createItem('girl', '女孩', 'She is a ', '.', '👧'),
    createItem('hand', '手', 'Clap your ', 's.', '✋'),
  ],
  'b1_u2': [
    createItem('six', '六', 'I see ', ' apples.', '6️⃣'),
    createItem('seven', '七', 'There are ', ' days.', '7️⃣'),
    createItem('eight', '八', 'I am ', ' years old.', '8️⃣'),
    createItem('nine', '九', 'It is ', ' o\'clock.', '9️⃣'),
    createItem('ten', '十', 'I have ', ' fingers.', '🔟'),
    createItem('stop', '停止', 'Please ', ' the bus.', '🛑'),
  ],
  'b1_u3': [
    // Core Words from Image
    createItem('book', '書', 'Open your ', '.', '📕'),
    createItem('pen', '原子筆', 'This is a ', '.', '🖊️'),
    createItem('pencil', '鉛筆', 'I have a ', '.', '✏️'),
    createItem('eraser', '橡皮擦', 'Use an ', '.', '🧼'),
    createItem('ruler', '尺', 'I have a ', '.', '📏'),
    createItem('marker', '彩色筆', 'Use a red ', '.', '🖍️'),
    createItem('this', '這個', '', ' is my pen.', 'point 👇'),
    createItem('that', '那個', '', ' is a cat.', 'point 👉'),
    createItem('it', '它; 牠', '', ' is a dog.', '🐶'),
    createItem('an', '一個 (用於母音前)', 'It is ', ' apple.', '🍎'),

    // Phonics Words from Image (P, Q, R, S, T)
    createItem('pig', '豬', 'The ', ' is pink.', '🐷'),
    createItem('pink', '粉紅色', 'I like ', '.', '🩷'),
    createItem('queen', '皇后', 'She is a ', '.', '👑'),
    createItem('quiz', '小測驗', 'Let\'s take a ', '.', '📝'),
    createItem('red', '紅色', 'The apple is ', '.', '🔴'),
    createItem('rabbit', '兔子', 'The ', ' can jump.', '🐇'),
    createItem('snake', '蛇', 'The ', ' is long.', '🐍'),
    createItem('sun', '太陽', 'The ', ' is hot.', '☀️'),
    createItem('turtle', '烏龜', 'The ', ' is slow.', '🐢'),
    createItem('tiger', '老虎', 'The ', ' is big.', '🐅'),

    // Daily Talk from Image
    createItem('Good job', '做得好', '', '!', '👍'),
    createItem('Thank you', '謝謝', '', '!', '🙏'),
    createItem('Cool', '酷', 'That is ', '!', '😎'),
  ],
  'b1_u4': [
    createItem('blue', '藍色', 'The sky is ', '.', '🔵'),
    createItem('green', '綠色', 'The grass is ', '.', '🟢'),
    createItem('red', '紅色', 'The apple is ', '.', '🔴'),
    createItem('yellow', '黃色', 'The banana is ', '.', '🟡'),
    createItem('color', '顏色', 'What ', ' is it?', '🎨'),
    createItem('black', '黑色', 'My hair is ', '.', '⚫'),
    createItem('white', '白色', 'The cloud is ', '.', '⚪'),
    createItem('library', '圖書館', 'Be quiet in the ', '.', '🏫'),
    createItem('school', '學校', 'I go to ', '.', '🎒'),
    createItem('bag', '包包', 'This is my ', '.', '👜'),
    createItem('rainbow', '彩虹', 'Look at the ', '.', '🌈'),
  ],
  'b2_starter': [
    createItem('eleven', '十一', 'It is ', ' o\'clock.', '1️⃣1️⃣'),
    createItem('twelve', '十二', 'I have ', ' pencils.', '1️⃣2️⃣'),
    createItem('thirteen', '十三', 'She is ', ' years old.', '1️⃣3️⃣'),
    createItem('fourteen', '十四', 'Number ', ' is here.', '1️⃣4️⃣'),
    createItem('fifteen', '十五', 'There are ', ' eggs.', '1️⃣5️⃣'),
  ],
  'b2_u1': [
    createItem('small', '小的', 'The ant is ', '.', '🤏'),
    createItem('big', '大的', 'The elephant is ', '.', '🐘'),
    createItem('dog', '狗', 'I see a ', '.', '🐶'),
    createItem('cat', '貓', 'I see a ', '.', '🐱'),
    createItem('bird', '鳥', 'The ', ' can fly.', '🐦'),
    createItem('fish', '魚', 'The ', ' is in the water.', '🐟'),
  ],
  'b2_u2': [
    createItem('dance', '跳舞', 'I can ', '.', '💃'),
    createItem('draw', '畫畫', 'I can ', '.', '🎨'),
    createItem('jump', '跳', 'I can ', '.', '🦘'),
    createItem('read', '閱讀', 'I can ', ' a book.', '📖'),
    createItem('sing', '唱歌', 'I can ', '.', '🎤'),
    createItem('swim', '游泳', 'I can ', '.', '🏊'),
    createItem('write', '寫字', 'I can ', ' my name.', '✍️'),
  ],
};

export const ZHUYIN_DATABASE: Record<string, VocabularyItem[]> = {
    'z_symbol_basic': [
        createZhuyin('ㄅ', '爸爸', '👨'),
        createZhuyin('ㄆ', '葡萄', '🍇'),
        createZhuyin('ㄇ', '帽子', '👒'),
        createZhuyin('ㄈ', '飛機', '✈️'),
        createZhuyin('ㄉ', '蛋糕', '🍰'),
        createZhuyin('ㄊ', '兔子', '🐇'),
        createZhuyin('ㄋ', '牛奶', '🥛'),
        createZhuyin('ㄌ', '快樂', '😀'),
        createZhuyin('ㄚ', '阿姨', '👩'),
        createZhuyin('ㄛ', '公雞', '🐓'),
    ],
    'z_spelling_2': [
        // Updated to include Tone Marks for correct spelling game buttons
        createZhuyin('ㄅㄚ', '八', '8️⃣'), // 1st tone (no mark or space)
        createZhuyin('ㄅㄚˋ', '爸爸', '👨'), // 4th tone
        createZhuyin('ㄇㄚˇ', '馬', '🐴'), // 3rd tone
        createZhuyin('ㄊㄚ', '他', '👉'), 
        createZhuyin('ㄇㄧˇ', '米', '🍚'),
        createZhuyin('ㄆㄧˊ', '皮鞋', '👞'), // 2nd tone
        createZhuyin('ㄉㄚ', '搭車', '🚌'),
        createZhuyin('ㄋㄧˊ', '泥土', '🟤'),
        createZhuyin('ㄌㄨˋ', '馬路', '🛣️'),
        createZhuyin('ㄧˊ', '阿姨', '👩'),
        createZhuyin('ㄨˇ', '跳舞', '💃'),
    ],
    'z_spelling_3': [
        createZhuyin('ㄍㄨㄚ', '西瓜', '🍉'),
        createZhuyin('ㄏㄨㄚ', '花朵', '🌸'),
        createZhuyin('ㄍㄨㄛ', '鍋子', '🍳'),
        createZhuyin('ㄏㄨㄛˇ', '火', '🔥'),
        createZhuyin('ㄎㄨㄚ', '誇獎', '👍'),
        createZhuyin('ㄉㄨㄛ', '很多', '🔢'),
        createZhuyin('ㄊㄨㄛ', '拖地', '🧹'),
        createZhuyin('ㄕㄨㄟˇ', '水', '💧'),
        createZhuyin('ㄊㄤˊ', '糖果', '🍬'),
    ]
};

export const MATH_DATABASE: Record<string, VocabularyItem[]> = {
    'm_g1_count': [
        createMath('3', '🍎 🍎 🍎', '數數看', '3️⃣'),
        createMath('5', '🐶 🐶 🐶 🐶 🐶', '數數看', '5️⃣'),
        createMath('2', '🚗 🚗', '數數看', '2️⃣'),
        createMath('6', '🍌 🍌 🍌 🍌 🍌 🍌', '數數看', '6️⃣'),
        createMath('1', '🌞', '數數看', '1️⃣'),
    ],
    'm_g1_add': [
        createMath('3', '1 + 2', '加法', '➕'),
        createMath('5', '2 + 3', '加法', '➕'),
        createMath('7', '3 + 4', '加法', '➕'),
        createMath('9', '4 + 5', '加法', '➕'),
        createMath('10', '5 + 5', '加法', '➕'),
        createMath('6', '3 + 3', '加法', '➕'),
    ],
    'm_g1_sub': [
        createMath('1', '3 - 2', '減法', '➖'),
        createMath('3', '5 - 2', '減法', '➖'),
        createMath('5', '10 - 5', '減法', '➖'),
        createMath('0', '1 - 1', '減法', '➖'),
        createMath('2', '4 - 2', '減法', '➖'),
    ],
    'm_g2_mul_2': [
        createMath('2', '2 x 1', '乘法', '✖️'),
        createMath('4', '2 x 2', '乘法', '✖️'),
        createMath('6', '2 x 3', '乘法', '✖️'),
        createMath('8', '2 x 4', '乘法', '✖️'),
        createMath('10', '2 x 5', '乘法', '✖️'),
        createMath('12', '2 x 6', '乘法', '✖️'),
        createMath('14', '2 x 7', '乘法', '✖️'),
        createMath('16', '2 x 8', '乘法', '✖️'),
        createMath('18', '2 x 9', '乘法', '✖️'),
    ],
    'm_g2_mul_5': [
        createMath('5', '5 x 1', '乘法', '✖️'),
        createMath('10', '5 x 2', '乘法', '✖️'),
        createMath('15', '5 x 3', '乘法', '✖️'),
        createMath('20', '5 x 4', '乘法', '✖️'),
        createMath('25', '5 x 5', '乘法', '✖️'),
        createMath('30', '5 x 6', '乘法', '✖️'),
        createMath('35', '5 x 7', '乘法', '✖️'),
    ],
    'm_g2_add_100': [
        createMath('20', '10 + 10', '加法', '➕'),
        createMath('30', '15 + 15', '加法', '➕'),
        createMath('50', '25 + 25', '加法', '➕'),
        createMath('100', '50 + 50', '加法', '➕'),
    ]
};

// Re-export this for backward compatibility if needed, though we use VOCAB_DATABASE now
export const HARDCODED_UNIT_3_DATA = VOCAB_DATABASE['b1_u3'];
