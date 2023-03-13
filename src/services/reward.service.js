import { Reward } from '@/models';
import { fractionateHelper, cursorHelper } from '@/helpers';
import { APP_MESSAGE } from '@/constants';
import config from '@/config';

const TEST = config.NODE_ENV === 'test';

/**
 * store records
 * @param {Reward[]} inputs
 * @returns
 */
export const create = async (inputs) => {
  const rewards = await Reward.relatedQuery('rewards').insert(inputs);
  return rewards;
};

/**
 * update record
 * @param {Number} id
 * @param {Reward} input
 * @returns
 */
export const update = async (id, input) => {
  const reward = await Reward.query()
    .findById(id)
    .throwIfNotFound({ message: APP_MESSAGE.REWARD.NOT_FOUND, type: 'NOT_FOUND' });
  const updatedReward = await reward.$query().updateAndFetch(input);
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
