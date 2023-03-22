import { Activity } from '@/models';
import { APP_MESSAGE } from '@/constants';
import { fractionateHelper, cursorHelper } from '@/helpers';

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

export const getActivities = async (filterBy, cursor) => {
  try {
    let queryBuilder;
    const pageCursor = cursorHelper('activity', cursor);
    const { filter } = await fractionateHelper('activity');
    queryBuilder = filter(filterBy);
    const { results, total } = await queryBuilder
      .page(pageCursor.page, pageCursor.size)
      .withGraphFetched('[user]');

    return {
      data: results,
      pageInfo: {
        ...pageCursor,
        total
      }
    };
  } catch (error) {
    console.log(error);
  }
};
