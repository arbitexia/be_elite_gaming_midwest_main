import { ref, fn, raw } from 'objection';
import { Award } from '@/models';

export const filter = (params) => {
  let queryBuilder;
  queryBuilder = Award.query();
  if (params.status) {
    queryBuilder.where('status', params.status);
  }
  if (params.userId) {
    queryBuilder.joinRelated('userLocation').where('userLocation.userId', params.userId);
  }
  if (params.locationId) {
    queryBuilder.joinRelated('userLocation').where('userLocation.locationId', params.locationId);
  }
  if (params?.search) {
    queryBuilder.joinRelated('[userLocation.[user, location], product]').where((builder) => {
      builder
        .where(
          raw('LOWER(??)', 'userLocation:user.firstName'),
          'like',
          `%${params.search.toLowerCase()}%`
        )
        .orWhere(
          raw('LOWER(??)', 'userLocation:user.lastName'),
          'like',
          `%${params.search.toLowerCase()}%`
        )
        .orWhere(
          raw('LOWER(??)', 'userLocation:location.name'),
          'like',
          `%${params.search.toLowerCase()}%`
        )
        .orWhere(fn.lower(ref('product.name')), 'like', `%${params.search.toLowerCase()}%`);
    });
  }

  return queryBuilder;
};
