import { Reward } from '@/models';
import { APP_MESSAGE } from '@/constants';
import { getProductsByIds } from './product.service';

export const getRewardById = async (id) => {
  const reward = await Reward.query()
    .findById(id)
    .throwIfNotFound({ message: APP_MESSAGE.REWARD.NOT_FOUND, type: 'NOT_FOUND' });
  return reward;
};

export const getRewardByLocationId = async (id) => {
  const reward = await Reward.query()
    .findOne({ locationId: id })
    .throwIfNotFound({ message: APP_MESSAGE.REWARD.NOT_FOUND, type: 'NOT_FOUND' });
  return reward;
};

export const createReward = async ({ locationId, productIds }) => {
  const reward = await Reward.query().findOne({ locationId });
  if (reward) {
    return await updateReward({ locationId, productIds });
  } else {
    const newReward = await Reward.query().insertAndFetch({ locationId, productIds });
    const newProductIds = newReward.productIds.split(',').map((id) => parseInt(id));
    const products = await getProductsByIds(newProductIds);
    return { message: APP_MESSAGE.REWARD.SUCCESS_CREATE, locationId };
  }
};

export const updateReward = async ({ locationId, productIds }) => {
  const reward = await Reward.query()
    .findOne({ locationId })
    .throwIfNotFound({ message: APP_MESSAGE.REWARD.NOT_FOUND, type: 'NOT_FOUND' });
  const updateReward = await reward.$query().updateAndFetch({ locationId, productIds });
  const updateProductIds = updateReward.productIds.split(',').map((id) => parseInt(id));
  const products = await getProductsByIds(updateProductIds);
  return { message: APP_MESSAGE.REWARD.SUCCESS_UPDATE, locationId, products };
};
