import { HashCode } from '@/models';
import { APP_MESSAGE } from '@/constants';

export const getHashCodes = async () => {
  const hashCodes = await HashCode.query().throwIfNotFound({
    message: APP_MESSAGE.HASH_CODE.NOT_FOUND,
    type: 'NOT_FOUND'
  });
  return hashCodes;
};
