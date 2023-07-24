import { Point, Transaction, UserCoupon } from '@/models';
import { fractionateHelper, cursorHelper, dateHelper } from '@/helpers';
import { APP_MESSAGE, TRANSACTION_TYPE } from '@/constants';
import config from '@/config';
import { raw } from 'objection';
import uniqid from 'uniqid';
import { emailService } from '.';

const TEST = config.NODE_ENV === 'test';

export const loadTransactions = async (filterBy, cursor) => {
  let queryBuilder;
  const pageCursor = cursorHelper('transaction', cursor);
  const { filter } = await fractionateHelper('transaction');
  queryBuilder = filter(filterBy);
  const { results, total } = await queryBuilder
    .page(pageCursor.page, pageCursor.size)
    .withGraphFetched('[user, reward.[product], location, assignee, point, backOffice]');
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
    .withGraphFetched('[user, reward.[product], location, assignee, point, backOffice]');
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
  amount,
  userCouponCodes
}) => {
  if (type === TRANSACTION_TYPE.POINT) {
    await Point.query().updateAndFetchById(pointId, { point: balance });
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
    .withGraphFetched('[user, reward.[product], location, assignee , point, backOffice]');

  if (type === TRANSACTION_TYPE.COUPON && userCouponCodes && userCouponCodes.length > 0) {
    await Promise.all(
      userCouponCodes.map(async (code) => {
        await UserCoupon.query().findOne({ code }).patch({
          status: 0,
          transactionId: transaction.id
        });
      })
    );
  }
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
    .withGraphFetched('[user, reward.[product], location, assignee, point, backOffice]');

  if (status === 'ACCEPTED' && updatedTransaction.backOfficeId) {
    await UserCoupon.query().insert({
      userId: updatedTransaction.userId,
      amount: updatedTransaction.amount,
      code: uniqid('eg-'),
      type: updatedTransaction.backOffice.type,
      expirationDate: dateHelper
        .addDateTime({ days: updatedTransaction.backOffice.days })
        .toISOString(),
      status: 1
    });
    //send the email
    await emailService.requestTransactionEmail({
      user: updatedTransaction.user,
      transaction: updatedTransaction
    });
  }
  if (status === 'DECLINED' && transaction.locationId && transaction.rewardId) {
    if (transaction.type === TRANSACTION_TYPE.POINT) {
      await Point.query()
        .patch({ point: raw(`point + ${Number(transaction.amount)}`) })
        .where('id', transaction.pointId);
    }
    if (transaction.type === TRANSACTION_TYPE.COUPON) {
      await UserCoupon.query().patch({ status: 1 }).where('transactionId', transaction.id);
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

//maybe removed
export const requestCoupon = async ({ userId, status, type, amount }) => {
  const result = await Transaction.query()
    .insertAndFetch({ userId, status, type, amount })
    .withGraphFetched('[user, assignee , point]');
  return { result, message: APP_MESSAGE.TRANSACTION.COUPON_REQUEST };
};
