import { ref, fn } from 'objection';
import { Location } from '@/models';

export const filter = (params) => {
  let queryBuilder = Location.query().where('status', 'OPEN');
  if (params?.locationId) {
    queryBuilder.where((builder) => {
      builder.where({ id: Number(params.locationId) });
    });
  }
  if (params?.search) {
    queryBuilder.where((builder) => {
      builder
        .where(fn.lower(ref('name')), 'like', `%${params.search.toLowerCase()}%`)
        .orWhere(
          fn.lower(ref('address:city').castText()),
          'like',
          `%${params.search.toLowerCase()}%`
        )
        .orWhere(
          fn.lower(ref('address:state').castText()),
          'like',
          `%${params.search.toLowerCase()}%`
        )
        .orWhere(
          fn.lower(ref('address:country').castText()),
          'like',
          `%${params.search.toLowerCase()}%`
        )
        .orWhere(fn.lower(ref('description')), 'like', `%${params.search.toLowerCase()}%`);
    });
  }
  return queryBuilder.orderBy('id', 'asc');
};
