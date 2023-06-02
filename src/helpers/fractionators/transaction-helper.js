import { TRANSACTION_STATUS } from '@/constants';
import { Transaction } from '@/models';
import { ref, fn } from 'objection';

export const filter = (params) => {
  let queryBuilder = Transaction.query();

  if (params?.status === TRANSACTION_STATUS.WAITING) {
    queryBuilder.where(`transactions.status`, '=', TRANSACTION_STATUS.WAITING);
  } else if (params?.status === TRANSACTION_STATUS.ACCEPTED) {
    queryBuilder.whereNot(`transactions.status`, '=', TRANSACTION_STATUS.WAITING);
  }

  if (params?.type) {
    queryBuilder.where('type', '=', params.type);
  }

  if (params?.search) {
    const searchValue = params.search.toLowerCase();
    queryBuilder.joinRelated('user');
    queryBuilder.joinRelated('location');
    queryBuilder.joinRelated('assignee');
    queryBuilder.where((builder) => {
      builder
        .where(fn.lower(ref('transactions.amount').castText()), 'like', `%${searchValue}%`)
        .orWhere(fn.lower(ref('user.firstName')), 'like', `%${searchValue}%`)
        .orWhere(fn.lower(ref('user.lastName')), 'like', `%${searchValue}%`)
        .orWhere(fn.lower(ref('location.name')), 'like', `%${searchValue}%`)
        .orWhere(fn.lower(ref('assignee.firstName')), 'like', `%${searchValue}%`)
        .orWhere(fn.lower(ref('assignee.lastName')), 'like', `%${searchValue}%`);
    });
  }

  if (params?.sort) {
    const _sortBy = params.sort.split('|');
    const sortBy = _sortBy[1].toLowerCase() === 'desc' ? 'desc' : 'asc';
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
    queryBuilder.orderBy('id', 'desc');
  }

  return queryBuilder;
};

// export const filter = (params) => {
//   let queryBuilder;
//   queryBuilder = Transaction.query();
//   queryBuilder.joinRelated('user');
//   if (params?.status === TRANSACTION_STATUS.WAITING) {
//     queryBuilder.where('status', TRANSACTION_STATUS.WAITING);
//   } else if (params?.status === TRANSACTION_STATUS.ACCEPTED) {
//     queryBuilder.whereNot('status', TRANSACTION_STATUS.WAITING);
//   }
//   if (params?.type) {
//     queryBuilder.where('type', params.type);
//   }
//   if (params?.search) {
//     const searchValue = params.search.toLowerCase();
//     // queryBuilder.where((builder) => {
//     //   builder
//     //     .where(fn.lower(ref('amount').castText()), 'like', `%${searchValue}%`)
//     //     .orWhere(fn.lower(ref('user.firstName')), 'like', `%${searchValue}%`);
//     // });
//     queryBuilder.where((builder) => {
//       builder
//         .where(fn.lower(ref('user.firstName')), 'like', `%${searchValue}%`)
//         .orWhere(fn.lower(ref('user.lastName')), 'like', `%${searchValue}%`);
//     });
//   }
//   if (params?.sort) {
//     const _sortBy = params?.sort.split('|');
//     const sortBy = _sortBy[1].toLocaleLowerCase() === 'desc' ? 'DESC' : 'ASC';
//     switch (_sortBy[0]) {
//       case 'createAt':
//         queryBuilder.orderBy('createdAt', sortBy);
//         break;
//       case 'amount':
//         queryBuilder.orderBy('amount', sortBy);
//         break;
//       case 'type':
//         queryBuilder.orderBy('type', sortBy);
//         break;
//       default:
//         queryBuilder.orderBy('id', sortBy);
//         break;
//     }
//   } else {
//     queryBuilder.orderBy('id', 'DESC');
//   }
//   return queryBuilder;
// };
