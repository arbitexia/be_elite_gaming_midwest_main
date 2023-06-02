import { UserLocation } from '@/models';
import { fractionateHelper, cursorHelper } from '@/helpers';

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

export const filterByLocationId = async (filterBy, cursor) => {
  let queryBuilder;
  const pageCursor = cursorHelper('userLocation', cursor);
  const { filter } = await fractionateHelper('userLocation');
  queryBuilder = filter(filterBy);
  const { results, total } = await queryBuilder
    .page(pageCursor.page, pageCursor.size)
    .withGraphFetched('[user, location]');
  return {
    data: results,
    pageInfo: {
      ...pageCursor,
      total
    }
  };
};
