import { Reward, Location } from '@/models';
import { fractionateHelper } from '@/helpers';
import { APP_MESSAGE } from '@/constants';
import config from '@/config';

const TEST = config.NODE_ENV === 'test';

/**
 * filter records
 * @param {Object} condition
 * @returns
 */
export const filter = async (condition) => {
  const locations = await Location.query()
    .orderBy('id', 'asc')
    .withGraphFetched('[gallery.asset, reward.[product]]');
  return locations;
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
