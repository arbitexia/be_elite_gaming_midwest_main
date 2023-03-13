import { Reward } from '@/models';
import { APP_MESSAGE } from '@/constants';
import { getProductsByIds } from './product.service';

export const getRewardById = async (id) => {
  const reward = await Reward.query().findById(id);
  return reward;
};

export const getRewardByLocationId = async (id) => {
  const reward = await Reward.query().findOne({ locationId: id });
  return reward;
};

export const createReward = async ({ locationId, productIds }) => {
  console.log(productIds);
  const reward = await Reward.query().findOne({ locationId });
  if (reward) {
    return await updateReward({ locationId, productIds });
  } else {
    const newReward = await Reward.query().insertAndFetch({ locationId, productIds });
    if (newReward.productIds) {
      const newProductIds = newReward.productIds.split(',').map((id) => parseInt(id));
      const products = await getProductsByIds(newProductIds);
      return { message: APP_MESSAGE.REWARD.SUCCESS_CREATE, locationId, products };
    } else {
      return { message: APP_MESSAGE.REWARD.SUCCESS_CREATE, locationId, products: [] };
    }
  }
};

export const updateReward = async ({ locationId, productIds }) => {
  const reward = await Reward.query()
    .findOne({ locationId })
    .throwIfNotFound({ message: APP_MESSAGE.REWARD.NOT_FOUND, type: 'NOT_FOUND' });
  const updateReward = await reward.$query().updateAndFetch({ locationId, productIds });
  if (updateReward.productIds) {
    const updateProductIds = updateReward.productIds.split(',').map((id) => parseInt(id));
    const products = await getProductsByIds(updateProductIds);
    return { message: APP_MESSAGE.REWARD.SUCCESS_UPDATE, locationId, products };
  } else {
    return { message: APP_MESSAGE.REWARD.SUCCESS_UPDATE, locationId, products: [] };
  }
};
