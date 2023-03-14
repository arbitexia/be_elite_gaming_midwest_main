import { ref, fn } from 'objection';
import { Product } from '@/models';

export const filter = (params) => {
  let queryBuilder;
  queryBuilder = Product.query();

  if (params.pointFrom) {
    if (params.pointTo) queryBuilder.whereBetween('point', [params.pointFrom, params.pointTo]);
    else queryBuilder.where('point', '>', params.pointFrom);
  }

  if (params?.search) {
    queryBuilder.where((builder) => {
      builder.where(fn.lower(ref('name')), 'like', `%${params.search.toLowerCase()}%`);
    });
  }

  return queryBuilder.orderBy('id', 'asc');
};
