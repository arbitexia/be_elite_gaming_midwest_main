import { Campaign } from '@/models';
import { APP_MESSAGE } from '@/constants';

export const campaignSchedule = async () => {
  const config = await Campaign.query().first().throwIfNotFound({
    message: APP_MESSAGE.LOCATION.NOT_FOUND,
    type: 'NOT_FOUND'
  });
  return config;
};
