import { Reward, UserLocation, Product } from '@/models';
import { fractionateHelper, cursorHelper } from '@/helpers';
import { APP_MESSAGE, DEFAULT_REWARD_POINT, DEFAULT_REWARD_COUPON } from '@/constants';
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
    const dataToInsert = { ...input, point: DEFAULT_REWARD_POINT, coupon: DEFAULT_REWARD_COUPON };
    insertPromises.push(
      Reward.query().insert(dataToInsert).withGraphFetched('[location, product]')
    );
  });
  const rewards = await Promise.all(insertPromises).then((res) => res);

  let updateLocationPromises = [];
  inputs.forEach((input) => {
    updateLocationPromises.push(
      Product.query().decrement('amount', 1).where({ id: input.productId })
    );
  });
  await Promise.all(updateLocationPromises).then((res) => res);

  return rewards;
};

export const update = async (id, data) => {
  const reward = await Reward.query()
    .findById(id)
    .throwIfNotFound({ message: APP_MESSAGE.REWARD.NOT_FOUND, type: 'NOT_FOUND' });
  const updatedReward = await reward
    .$query()
    .updateAndFetch(data)
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
  if (Number(filter.fromPoint) >= 0 && Number(filter.toPoint) > 0) {
    if (Number(filter.toPoint) === 1) {
      qb.joinRelated('product').where('product.point', '>', filter.fromPoint);
    } else {
      qb.joinRelated('product').whereBetween('product.point', [filter.fromPoint, filter.toPoint]);
    }
  }
  if (filter?.locationId && Number(filter.locationId) !== 0) {
    qb.where('locationId', Number(filter.locationId));
  }
  qb.withGraphFetched('[location,  product.[gallery(filterByModel).asset]]')
    .modifiers({
      filterByModel(builder) {
        builder.where('model', 'PRODUCT');
      }
    })
    .orderBy('createdAt', 'DESC');

  const result = await qb;
  return result;
};
