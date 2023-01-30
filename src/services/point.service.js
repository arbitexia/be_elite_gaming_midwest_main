import { Point, UserLocation } from '@/models';
import { APP_MESSAGE, DEAULT_INC_POINT } from '@/constants';
import config from '@/config';

const TEST = config.NODE_ENV === 'test';

export const getPoints = async (userId) => {
  const points = await Point.query()
    .joinRelated('userLocation')
    .where('userLocation.userId', userId)
    .withGraphFetched('[userLocation.[user, location]]');
  return points;
};

export const getPoint = async (userId, locationId) => {
  const location = await UserLocation.query().findOne({ userId, locationId }).throwIfNotFound({
    message: APP_MESSAGE.LOCATION.NOT_FOUND,
    type: 'NOT_FOUND'
  });

  const point = await Point.query()
    .findOne({ userLocationId: location.id })
    .withGraphFetched('[userLocation.[user, location]]');
  return point;
};

export const checkIn = async (userLocationId) => {
  const point = await Point.query().findOne({ userLocationId });
  if (!point)
    await Point.query().insert({
      userLocationId,
      point: DEAULT_INC_POINT
    });
  else await Point.query().increment('point', DEAULT_INC_POINT).where({ userLocationId });
};
