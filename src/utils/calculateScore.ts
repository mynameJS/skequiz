export const calculateScore = (limitTime: number, remainingTime: number) => {
  const maxScore = 100;
  const minScore = 10;
  const resultScore = minScore + (maxScore - minScore) * (remainingTime / limitTime);

  // 점수 반올림해서 산정하자
  return Math.round(resultScore);
};
