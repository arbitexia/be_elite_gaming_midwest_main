import { ref, fn } from 'objection';
import { Product } from '@/models';

export const filter = (params) => {
  try {
    let queryBuilder;
    queryBuilder = Product.query();
    if (params?.pointFrom) {
      if (params.pointTo) queryBuilder.whereBetween('point', [params.pointFrom, params.pointTo]);
      else queryBuilder.where('point', '>', params.pointFrom);
    }

    if (params?.search) {
      queryBuilder.where((builder) => {
        builder
          .where(fn.lower(ref('name')), 'like', `%${params.search.toLowerCase()}%`)
          .orWhere(fn.lower(ref('short')), 'like', `%${params.search.toLowerCase()}%`)
          .orWhere(fn.lower(ref('point').castText()), 'like', `%${params.search.toLowerCase()}%`)
          .orWhere(fn.lower(ref('amount').castText()), 'like', `%${params.search.toLowerCase()}%`);
      });
    }

    if (params?.sort) {
      const _sortBy = params?.sort.split('|');
      const sortBy = _sortBy[1].toLocaleLowerCase() === 'desc' ? 'DESC' : 'ASC';
      switch (_sortBy[0]) {
        case 'name':
          queryBuilder.orderBy('name', sortBy);
          break;
        case 'createAt':
          queryBuilder.orderBy('createdAt', sortBy);
          break;
        case 'short':
          queryBuilder.orderBy('short', sortBy);
          break;
        case 'point':
          queryBuilder.orderBy('point', sortBy);
          break;
        case 'status':
          queryBuilder.orderBy('status', sortBy);
          break;
        case 'amount':
          queryBuilder.orderBy('amount', sortBy);
          break;
        default:
          queryBuilder.orderBy('id', sortBy);
          break;
      }
    } else {
      queryBuilder.orderBy('id', 'ASC');
    }

    return queryBuilder;
  } catch (error) {
    console.log(error);
  }
};
