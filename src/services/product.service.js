import { Product } from '@/models';
import { fractionateHelper, cursorHelper } from '@/helpers';
import { APP_MESSAGE } from '@/constants';
import config from '@/config';
import { getRewardByLocationId } from './reward.service';

const TEST = config.NODE_ENV === 'test';

export const loadProducts = async (filterBy, cursor) => {
  let queryBuilder;
  const pageCursor = cursorHelper('product', cursor);
  const { filter } = await fractionateHelper('product');

  queryBuilder = filter(filterBy);

  const { results, total } = await queryBuilder
    .page(pageCursor.page, pageCursor.size)
    .withGraphFetched('[gallery.asset]');

  return {
    data: results,
    pageInfo: {
      ...pageCursor,
      total
    }
  };
};

export const getProductsByLocationId = async (id) => {
  const reward = await getRewardByLocationId(id);
  const productIds = reward.productIds.split(',').map((id) => parseInt(id));
  const products = await getProductsByIds(productIds);
  return products;
};

export const getOne = async (id) => {
  const user = await Product.query().findOne({ id }).withGraphFetched('[gallery.asset]');
  return user;
};

export const createProduct = async ({
  name,
  locationId,
  amount,
  point,
  status,
  short,
  description
}) => {
  const product = await Product.query()
    .insertAndFetch({ name, locationId, amount, point, status, short, description })
    .withGraphFetched('[gallery.asset]');
  return product;
};

export const updateProduct = async (
  id,
  { name, locationId, amount, point, status, short, description }
) => {
  const product = await Product.query().findOne({ id }).throwIfNotFound({
    message: APP_MESSAGE.PRODUCT.NOT_FOUND,
    type: 'NOT_FOUND'
  });

  const updatedProduct = await product
    .$query()
    .updateAndFetch({
      name,
      locationId,
      amount,
      point,
      status,
      short,
      description
    })
    .withGraphFetched('[gallery.asset]');

  return updatedProduct;
};

export const deleteProduct = async (id) => {
  const product = await Product.query().findOne({ id }).throwIfNotFound({
    message: APP_MESSAGE.PRODUCT.NOT_FOUND,
    type: 'NOT_FOUND'
  });
  await product.$query().delete();
  return {
    message: APP_MESSAGE.PRODUCT.SUCESS_DELETE
  };
};

export const getProductsByIds = async (ids) => {
  const products = await Product.query().findByIds(ids).withGraphFetched('[gallery.asset]');
  return products;
};
