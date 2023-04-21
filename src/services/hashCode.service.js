import { HashCode } from '@/models';
import { APP_MESSAGE } from '@/constants';

export const getHashCodes = async () => {
  const hashCodes = await HashCode.query().throwIfNotFound({
    message: APP_MESSAGE.LOCATION.NOT_FOUND,
    type: 'NOT_FOUND'
  });
  return hashCodes;
};
