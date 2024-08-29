import { nanoid } from 'nanoid';

const createShortUniqueId = () => {
  const shortId = nanoid(10);
  return shortId;
};

export default createShortUniqueId;
