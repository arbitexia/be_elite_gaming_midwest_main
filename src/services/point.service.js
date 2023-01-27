import { Point, UserLocation } from '@/models';
import { securityHelper, fractionateHelper, placeholderHelper, cursorHelper } from '@/helpers';
import { AWSProvider } from '@/provider';
import { APP_MESSAGE, EMAIL_TEMPLATE_MAPPER } from '@/constants';
import config from '@/config';

const TEST = config.NODE_ENV === 'test';

export const getPoints = async (userId) => {
  return 'GetPoints';
};

export const getPoint = async (userId, locationId) => {
  const location = await UserLocation.query().findOne({ userId, locationId }).throwIfNotFound({
    message: APP_MESSAGE.LOCATION.NOT_FOUND,
    type: 'NOT_FOUND'
  });

  const point = await Point.query()
    .findOne({ userLocationId: location.id })
    .withGraphFetched('[userLocation, userLocation.user, userLocation.location]');
  return point;
};

export const checkIn = async (userLocationId) => {
  await Point.query().increment('point', DEAULT_INC_POINT).where({ userLocationId });
};
