import { UserLocation } from '@/models';

export const checkIn = async (locationId, userId) => {
  const location = await UserLocation.query().findOne({
    userId,
    locationId
  });
  if (!location) {
    const newLocation = await UserLocation.query().insertAndFetch({
      userId,
      locationId
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
    .withGraphFetched('[location.[gallery(filterByModel).asset]]')
    .modifiers({
      filterByModel(builder) {
        builder.where('model', 'LOCATION');
      }
    });
  return userLocation;
};
