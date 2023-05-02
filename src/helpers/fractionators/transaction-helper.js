import { TRANSACTION_STATUS } from '@/constants';
import { Transaction } from '@/models';

export const filter = (params) => {
  let queryBuilder;
  queryBuilder = Transaction.query();
  if (params?.status === TRANSACTION_STATUS.WAITING) {
    queryBuilder.where('status', TRANSACTION_STATUS.WAITING);
  } else if (params?.status === TRANSACTION_STATUS.ACCEPTED) {
    queryBuilder.whereNot('status', TRANSACTION_STATUS.WAITING);
  }
  if (params?.type) {
    queryBuilder.where('type', params.type);
  }
  if (params?.sort) {
    const _sortBy = params?.sort.split('|');
    const sortBy = _sortBy[1].toLocaleLowerCase() === 'desc' ? 'DESC' : 'ASC';
    switch (_sortBy[0]) {
      case 'createAt':
        queryBuilder.orderBy('createdAt', sortBy);
        break;
      case 'amount':
        queryBuilder.orderBy('amount', sortBy);
        break;
      case 'type':
        queryBuilder.orderBy('type', sortBy);
        break;
      default:
        queryBuilder.orderBy('id', sortBy);
        break;
    }
  } else {
    queryBuilder.orderBy('id', 'DESC');
  }
  return queryBuilder;
};
