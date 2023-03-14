import { Activity } from '@/models';
import { APP_MESSAGE } from '@/constants';

export const createActivity = async ({ userId, model, victimId, type, metadata }) => {
  const activity = await Activity.query().insert({
    userId,
    victimId,
    model,
    type,
    metadata
  });
  return { data: activity, message: APP_MESSAGE.USER.SUCCESS };
};
