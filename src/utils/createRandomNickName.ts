import { fakerKO as faker } from '@faker-js/faker';

export const createRandomNickName = () => {
  const randomAdjective = faker.word.adjective({ length: { min: 2, max: 3 }, strategy: 'closest' });
  const randomNoun = faker.word.noun({ length: { min: 2, max: 3 }, strategy: 'closest' });
  return `${randomAdjective}${randomNoun}`;
};
