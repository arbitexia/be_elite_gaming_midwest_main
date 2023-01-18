import { Location } from '@/models';
import { fractionateHelper, cursorHelper } from '@/helpers';
import { APP_MESSAGE } from '@/constants';

export const loadLocations = async (filterBy, cursor) => {
  let queryBuilder;
  const pageCursor = cursorHelper('location', cursor);
  const { filter } = await fractionateHelper('location');
  queryBuilder = filter(filterBy);
  console.log(pageCursor);
  const { results, total } = await queryBuilder.page(pageCursor.page, pageCursor.size);
  console.log('locations');
  return {
    data: results,
    pageInfo: {
      ...pageCursor,
      total
    }
  };
};

export const getOne = async (id) => {
  const location = await Location.query().findOne({ id }).withGraphFetched('[gallery]');
  return location;
};

export const createLocation = async (input) => {
  const newLocation = await Location.query().insertAndFetch({
    ...input
  });
  return newLocation;
};

export const updateLocation = async (id, input) => {
  const location = await Location.query().findOne({ id }).throwIfNotFound({
    message: APP_MESSAGE.LOCATION.NOT_FOUND,
    type: 'NOT_FOUND'
  });

  const updatedUser = await location
    .$query()
    .updateAndFetch({
      ...input
    })
    .withGraphFetched('[gallery]');

  return updatedUser;
};

export const deleteLocation = async (id) => {
  const location = await Location.query().findOne({ id }).throwIfNotFound({
    message: APP_MESSAGE.LOCATION.NOT_FOUND,
    type: 'NOT_FOUND'
  });
  await location.$query().delete();
  return {
    message: APP_MESSAGE.LOCATION.SUCESS_DELETE
  };
};
