import { Reward, Location } from '@/models';
import { fractionateHelper, cursorHelper } from '@/helpers';
import { APP_MESSAGE } from '@/constants';
import config from '@/config';

const TEST = config.NODE_ENV === 'test';

/**
 * filter records
 * @param {Object} condition
 * @returns
 */
export const filter = async (filterBy, cursor) => {
  try {
    let queryBuilder;
    const pageCursor = cursorHelper('reward', cursor);
    const { filter } = await fractionateHelper('reward');
    queryBuilder = filter(filterBy);
    const { results, total } = await queryBuilder
      .page(pageCursor.page, pageCursor.size)
      .withGraphFetched('[gallery.asset, reward.product]');

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

/**
 * get one record by id
 * @param {Number} id
 * @returns
 */
export const getOne = async (id) => {
  const reward = await Reward.query().findById(id).withGraphFetched('[location, product]');
  return reward;
};

/**
 * store records
 * @param {Object[]} inputs
 * @returns
 */
export const create = async (inputs) => {
  let insertPromises = [];
  inputs.forEach((input) => {
    insertPromises.push(Reward.query().insert(input).withGraphFetched('[location, product]'));
  });
  const rewards = await Promise.all(insertPromises).then((res) => res);
  return rewards;
};

/**
 * update record
 * @param {Number} id
 * @param {Object} input
 * @returns
 */
export const update = async (id, input) => {
  const reward = await Reward.query()
    .findById(id)
    .throwIfNotFound({ message: APP_MESSAGE.REWARD.NOT_FOUND, type: 'NOT_FOUND' });
  const updatedReward = await reward
    .$query()
    .updateAndFetch(input)
    .withGraphFetched('[location, product]');
  return updatedReward;
};

/**
 * delete record
 * @param {Number} id
 * @returns
 */
export const destroy = async (id) => {
  const reward = await Reward.query()
    .findById(id)
    .throwIfNotFound({ message: APP_MESSAGE.REWARD.NOT_FOUND, type: 'NOT_FOUND' });
  await reward.$query().delete();
  return { message: APP_MESSAGE.REWARD.SUCCESS_DELETE };
};
