import { Reward, Location, UserLocation } from '@/models';
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
      .withGraphFetched(
        '[gallery(filterLocationByModel).asset, reward.[location, product.[gallery(filterByModel).asset]]]'
      )
      .modifiers({
        filterByModel(builder) {
          builder.where('model', 'PRODUCT');
        },
        filterLocationByModel(builder) {
          builder.where('model', 'LOCATION');
        }
      });

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

export const getByUserId = async (userId) => {
  const userLocation = await UserLocation.query().where('userId', userId);
  const locationList = userLocation?.map((obj) => obj.locationId);
  const qb = await Reward.query()
    .withGraphJoined('[location, product]')
    .whereIn('locationId', locationList)
    .orderBy('createdAt', 'DESC');
  return qb;
};

export const getRewards = async (filter) => {
  let qb = Reward.query();
  if (filter?.locationId && Number(filter.locationId) !== 0) {
    qb.where('locationId', Number(filter.locationId));
  }
  //TODO add the filter by point
  qb.withGraphJoined('[location,  product.[gallery(filterByModel).asset]]')
    .modifiers({
      filterByModel(builder) {
        builder.where('model', 'PRODUCT');
      }
    })
    .orderBy('createdAt', 'DESC');

  const result = await qb.withGraphJoined('[location, product]').orderBy('createdAt', 'DESC');
  return result;
};
