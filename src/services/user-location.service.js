import { UserLocation } from '@/models';

export const checkIn = async (tabletId, userId) => {
  const userLocation = await UserLocation.query()
    .findOne({
      userId: tabletId
    })
    .throwIfNotFound({
      message: APP_MESSAGE.VERIFICATION.NOT_FOUND
    });
  const location = UserLocation.query().findOne({
    userId: userId,
    locationId: userLocation.id
  });
  if (!location) {
    const newLocation = await UserLocation.query().insertAndFetch({
      userId: user.id,
      locationId: userLocation.id
    });
    return newLocation;
  }
  return location;
};
