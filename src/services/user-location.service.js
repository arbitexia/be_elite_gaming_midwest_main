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
  const location = UserLocation.query().findOne({
    userId: userId,
    locationId: userLocation.locationId
  });
  if (!location) {
    const newLocation = await UserLocation.query().insertAndFetch({
      userId: user.id,
      locationId: userLocation.id
    });
    await Point.query().insert({
      userLocationId: newLocation.id,
      point: 0
    });
    return newLocation;
  }
  return location;
};
