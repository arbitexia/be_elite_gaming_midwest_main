import { Point, Transaction } from '@/models';
import { fractionateHelper, cursorHelper } from '@/helpers';
import { APP_MESSAGE } from '@/constants';
import config from '@/config';

const TEST = config.NODE_ENV === 'test';

export const loadTransactions = async (filterBy, cursor) => {
  let queryBuilder;
  const pageCursor = cursorHelper('transaction', cursor);
  const { filter } = await fractionateHelper('transaction');
  queryBuilder = filter(filterBy);
  const { results, total } = await queryBuilder
    .page(pageCursor.page, pageCursor.size)
    .withGraphFetched('[user, reward.[product], location, assignee ]');
  return {
    data: results,
    pageInfo: {
      ...pageCursor,
      total
    }
  };
};

export const getOne = async (id) => {
  const transaction = await Transaction.query()
    .findOne({ id })
    .withGraphFetched('[user, reward.[product], location, assignee ]');
  return transaction;
};

export const createTransaction = async ({
  userId,
  rewardId,
  locationId,
  pointId,
  balance,
  status,
  type,
  amount
}) => {
  await Point.query().updateAndFetchById(pointId, { point: balance });
  const transaction = await Transaction.query()
    .insertAndFetch({ userId, rewardId, locationId, status, type, amount })
    .withGraphFetched('[user, reward.[product], location, assignee ]');
  return transaction;
};

export const updateTransaction = async (id, assigneeId, status) => {
  const transaction = await Transaction.query().findOne({ id }).throwIfNotFound({
    message: APP_MESSAGE.PRODUCT.NOT_FOUND,
    type: 'NOT_FOUND'
  });

  const updatedTransaction = await transaction
    .$query()
    .updateAndFetch({
      assigneeId,
      status: status,
      acceptedA: new Date()
    })
    .withGraphFetched('[user, reward.[product], location, assignee ]');

  if (status === 'DECLINED') {
  }
  return updatedTransaction;
};

export const deleteTransaction = async (id) => {
  const transaction = await Transaction.query().deleteById(id).throwIfNotFound({
    message: APP_MESSAGE.PRODUCT.NOT_FOUND,
    type: 'NOT_FOUND'
  });

  return transaction;
};
