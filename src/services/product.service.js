import { Product } from '@/models';
import { fractionateHelper, cursorHelper } from '@/helpers';
import { APP_MESSAGE } from '@/constants';
import config from '@/config';

const TEST = config.NODE_ENV === 'test';

export const loadProducts = async (filterBy, cursor) => {
  let queryBuilder;
  const pageCursor = cursorHelper('product', cursor);
  const { filter } = await fractionateHelper('product');
  queryBuilder = filter(filterBy);
  const { results, total } = await queryBuilder
    .page(pageCursor.page, pageCursor.size)
    .withGraphFetched('[gallery(filterByModel).asset]')
    .modifiers({
      filterByModel(builder) {
        builder.where('model', 'PRODUCT');
      }
    });

  return {
    data: results,
    pageInfo: {
      ...pageCursor,
      total
    }
  };
};

export const getOne = async (id) => {
  const user = await Product.query()
    .findOne({ id })
    .withGraphFetched('[gallery(filterByModel).asset]')
    .modifiers({
      filterByModel(builder) {
        builder.where('model', 'PRODUCT');
      }
    });
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
    .withGraphFetched('[gallery(filterByModel).asset]')
    .modifiers({
      filterByModel(builder) {
        builder.where('model', 'PRODUCT');
      }
    });
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
    .withGraphFetched('[gallery(filterByModel).asset]')
    .modifiers({
      filterByModel(builder) {
        builder.where('model', 'PRODUCT');
      }
    });

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
  const products = await Product.query()
    .findByIds(ids)
    .withGraphFetched('[gallery(filterByModel).asset]')
    .modifiers({
      filterByModel(builder) {
        builder.where('model', 'PRODUCT');
      }
    });
  return products;
};
