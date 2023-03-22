import { Award } from '@/models';
import { fractionateHelper, cursorHelper } from '@/helpers';
import { APP_MESSAGE } from '@/constants';
import config from '@/config';

const TEST = config.NODE_ENV === 'test';

export const loadAwards = async (filterBy, cursor) => {
  let queryBuilder;
  const pageCursor = cursorHelper('award', cursor);
  const { filter } = await fractionateHelper('award');
  queryBuilder = filter(filterBy);
  const { results, total } = await queryBuilder
    .page(pageCursor.page, pageCursor.size)
    .withGraphFetched('[userLocation.[user, location], product, assignee]');
  return {
    data: results,
    pageInfo: {
      ...pageCursor,
      total
    }
  };
};

export const getOne = async (id) => {
  const award = await Award.query()
    .findOne({ id })
    .withGraphFetched('[userLocation.[user, location], product, assignee]');
  return award;
};

export const createAward = async ({ userLocationId, productId, status, note }) => {
  const award = await Award.query()
    .insertAndFetch({ userLocationId, productId, status, note })
    .withGraphFetched('[userLocation.[user, location], product, assignee]');
  return award;
};

export const acceptAward = async (id, assigneeId) => {
  const award = await Award.query().findOne({ id }).throwIfNotFound({
    message: APP_MESSAGE.PRODUCT.NOT_FOUND,
    type: 'NOT_FOUND'
  });

  const updatedAward = await award
    .$query()
    .updateAndFetch({
      assigneeId,
      status: 'ACCEPTED'
    })
    .withGraphFetched('[userLocation.[user, location], product, assignee]');

  return updatedAward;
};

export const declineAward = async (id) => {
  const award = await Award.query().findOne({ id }).throwIfNotFound({
    message: APP_MESSAGE.PRODUCT.NOT_FOUND,
    type: 'NOT_FOUND'
  });

  const updatedAward = await award
    .$query()
    .updateAndFetch({
      assigneeId,
      status: 'DECLINED'
    })
    .withGraphFetched('[userLocation.[user, location], product, assignee]');

  return updatedAward;
};
