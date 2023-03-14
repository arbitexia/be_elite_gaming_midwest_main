import { Location } from '@/models';
import { fractionateHelper } from '@/helpers';
import { APP_MESSAGE } from '@/constants';

export const filter = async (filterBy) => {
  let queryBuilder;
  const { filter } = await fractionateHelper('location');
  queryBuilder = filter(filterBy);
  const locations = await queryBuilder.select('*').withGraphFetched('[gallery.asset]');
  return locations;
};

export const getOne = async (id) => {
  const location = await Location.query().findOne({ id }).withGraphFetched('[gallery.asset]');
  return location;
};

export const create = async (input) => {
  const newLocation = await Location.query()
    .insertAndFetch({
      name: input.name,
      coords: input.coords,
      address: input.address,
      status: input.status,
      type: input.type,
      description: input.description
    })
    .withGraphFetched('[gallery.asset]');
  return newLocation;
};

export const update = async (id, input) => {
  const location = await Location.query().findOne({ id }).throwIfNotFound({
    message: APP_MESSAGE.LOCATION.NOT_FOUND,
    type: 'NOT_FOUND'
  });

  const updatedLocation = await location
    .$query()
    .updateAndFetch({
      name: input.name,
      coords: input.coords,
      address: input.address,
      status: input.status,
      type: input.type,
      description: input.description
    })
    .withGraphFetched('[gallery.asset]');

  return updatedLocation;
};

export const destroy = async (id) => {
  const location = await Location.query().findOne({ id }).throwIfNotFound({
    message: APP_MESSAGE.LOCATION.NOT_FOUND,
    type: 'NOT_FOUND'
  });
  await location.$query().delete();
  return {
    message: APP_MESSAGE.LOCATION.SUCESS_DELETE
  };
};
