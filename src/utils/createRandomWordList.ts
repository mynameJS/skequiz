import { SUGGESTED_WORD } from '../constant/suggestedWord';

export const createRandomWordList = (category?: keyof typeof SUGGESTED_WORD): string[] => {
  let words: string[] = [];

  if (category && SUGGESTED_WORD[category]) {
    words = SUGGESTED_WORD[category];
  } else {
    words = Object.values(SUGGESTED_WORD).flat();
  }

  const randomWordList: string[] = [];
  while (randomWordList.length < 3) {
    const randomIndex = Math.floor(Math.random() * words.length);
    const randomWord = words[randomIndex];
    if (!randomWordList.includes(randomWord)) {
      randomWordList.push(randomWord);
    }
  }

  return randomWordList;
};
