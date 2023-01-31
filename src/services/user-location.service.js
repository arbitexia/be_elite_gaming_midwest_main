import { UserLocation, Point } from '@/models';
import { APP_MESSAGE } from '@/constants';

export const checkIn = async (tabletId, userId) => {
  const userLocation = await UserLocation.query()
    .findOne({
      userId: tabletId
    })
    .throwIfNotFound({
      message: APP_MESSAGE.USER.NOT_FOUND
    });
  const location = await UserLocation.query().findOne({
    userId,
    locationId: userLocation.locationId
  });
  if (!location) {
    const newLocation = await UserLocation.query().insertAndFetch({
      userId,
      locationId: userLocation.locationId
    });
    return newLocation;
  }
  return location;
};

export const getOneByTablet = async (tabletId) => {
  const userLocation = await UserLocation.query()
    .findOne({
      userId: tabletId
    })
    .throwIfNotFound({
      message: APP_MESSAGE.USER.NOT_FOUND
    });

  return userLocation;
};
