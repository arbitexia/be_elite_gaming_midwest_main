import { ref, fn } from 'objection';
import { Campaign } from '@/models';

export const filter = (params) => {
  let queryBuilder;
  queryBuilder = Campaign.query();
  if (params?.search) {
    queryBuilder.where((builder) => {
      builder.where(fn.lower(ref('name')), 'like', `%${params.search.toLowerCase()}%`);
      // .orWhere(fn.lower(ref('description')), 'like', `%${params.search.toLowerCase()}%`);
    });
  }
  queryBuilder.orderBy('id', 'DESC');
  return queryBuilder;
};
