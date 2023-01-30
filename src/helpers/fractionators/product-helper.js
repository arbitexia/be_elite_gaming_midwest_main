import { ref, fn } from 'objection';
import { Product } from '@/models';

export const filter = (params) => {
  let queryBuilder;
  queryBuilder = Product.query();

  if (params.location && params.location != 0) {
    queryBuilder.where('locationId', params.location);
  }

  if (params.pointFrom) {
    if (params.pointTo) queryBuilder.whereBetween('point', [params.pointFrom, params.pointTo]);
    else queryBuilder.where('point', '>', params.pointFrom);
  }

  if (params?.search) {
    queryBuilder.where((builder) => {
      builder.where(fn.lower(ref('name')), 'like', `%${params.search.toLowerCase()}%`);
    });
  }

  return queryBuilder;
};
