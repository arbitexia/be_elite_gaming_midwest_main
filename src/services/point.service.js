import { Point, UserLocation, Config } from '@/models';
import { APP_MESSAGE, DEFAULT_INC_POINT } from '@/constants';
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
  const configItem = await Config.query().first();
  const dailyConfig = configItem?.daily ?? DEFAULT_INC_POINT;
  if (!point) {
    await Point.query().insert({
      userLocationId,
      point: dailyConfig,
      updatedAt: new Date()
    });
  } else {
    await Point.query().increment('point', dailyConfig).where({ userLocationId });
  }
};

export const addPoint = async (userLocationId, pointCount) => {
  const point = await Point.query().findOne({ userLocationId });
  if (!point) {
    const result = await Point.query().insertAndFetch({
      userLocationId,
      point: pointCount,
      updatedAt: new Date()
    });
    return { totalPoint: pointCount, id: result.id };
  } else {
    await Point.query().increment('point', pointCount).where({ userLocationId });
    return { totalPoint: point.point + pointCount, id: point.id };
  }
};
