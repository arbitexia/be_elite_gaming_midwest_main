import { Location } from '@/models';
import { fractionateHelper } from '@/helpers';
import { APP_MESSAGE } from '@/constants';

export const loadLocations = async (filterBy) => {
  let queryBuilder;
  const { filter } = await fractionateHelper('location');
  queryBuilder = filter(filterBy);
  const locations = await queryBuilder.select('*');
  return locations;
};

export const getOne = async (id) => {
  const location = await Location.query().findOne({ id }).withGraphFetched('[gallery]');
  return location;
};

export const createLocation = async (input) => {
  const newLocation = await Location.query().insertAndFetch({
    name: input.name,
    coords: input.coords,
    address: input.address,
    status: input.status,
    type: input.type,
    description: input.description
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
      name: input.name,
      coords: input.coords,
      address: input.address,
      status: input.status,
      type: input.type,
      description: input.description
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
