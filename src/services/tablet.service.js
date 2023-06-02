import { APP_MESSAGE } from '@/constants';
import { fractionateHelper, cursorHelper, securityHelper } from '@/helpers';
import { Tablet } from '@/models';

export const loadTablets = async (filterBy, cursor) => {
  let queryBuilder;
  const pageCursor = cursorHelper('tablet', cursor);
  const { filter } = await fractionateHelper('tablet');

  queryBuilder = filter(filterBy);

  const { results, total } = await queryBuilder
    .page(pageCursor.page, pageCursor.size)
    .withGraphFetched('[location]');

  return {
    data: results,
    pageInfo: {
      ...pageCursor,
      total
    }
  };
};

export const createTablet = async (data) => {
  const { name, status, locationId, password } = data;
  const tablet = await Tablet.query().findOne({ name });
  if (tablet) throw new BadRequest(APP_MESSAGE.TABLET.DUPLICATED_NAME);
  const hashedPassword = await securityHelper.hashPassword(password);
  const newTablet = await Tablet.query()
    .insertAndFetch({ name, status, locationId, password: hashedPassword })
    .withGraphFetched('[location]');
  return newTablet;
};

export const updateTablet = async (data) => {
  const { id, name, status, locationId } = data;
  const tablet = await Tablet.query().findOne({ id }).throwIfNotFound({
    message: APP_MESSAGE.TABLET.NOT_FOUND,
    type: 'NOT_FOUND'
  });

  const updatedTablet = await tablet
    .$query()
    .updateAndFetch({
      name,
      status,
      locationId
    })
    .withGraphFetched('[location]');

  return updatedTablet;
};

export const deleteTablet = async (id) => {
  const tablet = await Tablet.query().findOne({ id }).throwIfNotFound({
    message: APP_MESSAGE.TABLET.NOT_FOUND,
    type: 'NOT_FOUND'
  });
  await tablet.$query().delete();
  return {
    message: APP_MESSAGE.TABLET.SUCCESS_USER_DELETE
  };
};

export const updatePassword = async (id, oldPassword, password) => {
  const hashedPassword = await securityHelper.hashPassword(password);
  const tablet = await Tablet.query().findOne({ id }).throwIfNotFound({
    message: APP_MESSAGE.TABLET.NOT_FOUND
  });
  const isValid = await securityHelper.validatePassword(oldPassword, tablet.password);
  if (!isValid) {
    throw new Error(APP_MESSAGE.USER.INVALID_PASSWORD);
  }
  await tablet.$query().updateAndFetch({
    password: hashedPassword
  });

  return {
    message: APP_MESSAGE.TABLET.SUCESS_PASSWORD_UPDATE
  };
};
