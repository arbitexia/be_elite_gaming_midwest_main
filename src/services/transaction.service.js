import { Point, Transaction, User } from '@/models';
import { fractionateHelper, cursorHelper } from '@/helpers';
import { APP_MESSAGE, TRANSACTION_TYPE } from '@/constants';
import config from '@/config';
import { raw } from 'objection';

const TEST = config.NODE_ENV === 'test';

export const loadTransactions = async (filterBy, cursor) => {
  let queryBuilder;
  const pageCursor = cursorHelper('transaction', cursor);
  const { filter } = await fractionateHelper('transaction');
  queryBuilder = filter(filterBy);
  const { results, total } = await queryBuilder
    .page(pageCursor.page, pageCursor.size)
    .withGraphFetched('[user, reward.[product], location, assignee, point ]');
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
    .withGraphFetched('[user, reward.[product], location, assignee, point ]');
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
  if (type === TRANSACTION_TYPE.POINT) {
    await Point.query().updateAndFetchById(pointId, { point: balance });
  }
  if (type === TRANSACTION_TYPE.COUPON) {
    await User.query().updateAndFetchById(userId, { coupon: balance });
  }
  const transaction = await Transaction.query()
    .insertAndFetch({
      userId,
      rewardId,
      locationId,
      status,
      type,
      amount,
      pointId: pointId > 0 ? pointId : undefined
    })
    .withGraphFetched('[user, reward.[product], location, assignee , point]');
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
      status,
      acceptedAt: new Date().toISOString()
    })
    .withGraphFetched('[user, reward.[product], location, assignee, point ]');
  if (status === 'ACCEPTED' && !transaction.locationId && !transaction.rewardId) {
    const user = await User.query().findOne({ id: transaction.userId }).throwIfNotFound({
      message: APP_MESSAGE.USER.NOT_FOUND
    });
    await user.$query().updateAndFetch({ coupon: user.coupon + transaction.amount });
  }
  if (status === 'DECLINED' && transaction.locationId && transaction.rewardId) {
    if (transaction.type === TRANSACTION_TYPE.POINT) {
      await Point.query()
        .patch({ point: raw(`point + ${Number(transaction.amount)}`) })
        .where('id', transaction.pointId);
    }
    if (transaction.type === TRANSACTION_TYPE.COUPON) {
      await User.query()
        .patch({ coupon: raw(`coupon + ${Number(transaction.amount)}`) })
        .where('id', transaction.userId);
    }
  }
  return updatedTransaction;
};

export const deleteTransaction = async (id) => {
  const transaction = await Transaction.query().deleteById(id).throwIfNotFound({
    message: APP_MESSAGE.TRANSACTION.NOT_FOUND,
    type: 'NOT_FOUND'
  });

  return transaction;
};

export const requestCoupon = async ({ userId, status, type, amount }) => {
  const result = await Transaction.query()
    .insertAndFetch({ userId, status, type, amount })
    .withGraphFetched('[user, assignee , point]');
  return { result, message: APP_MESSAGE.TRANSACTION.COUPON_REQUEST };
};
