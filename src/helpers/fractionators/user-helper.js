import { ref, fn } from 'objection';
import { User } from '@/models';
import { USER_STATUS_MAPPER, USER_FILTER_TYPE_MAPPER, USER_ROLE_MAPPER } from '@/constants';

export const filter = (params) => {
  let queryBuilder;
  queryBuilder = User.query();
  if (params.status) {
    queryBuilder.where((builder) => {
      if (params.status === USER_STATUS_MAPPER.VERIFY_PHONE) {
        return builder.where({ status: USER_STATUS_MAPPER.VERIFY_PHONE });
      }
      if (params.status === USER_STATUS_MAPPER.VERIFY_EMAIL) {
        return builder.where({ status: USER_STATUS_MAPPER.VERIFY_EMAIL });
      }
      if (params.status === USER_FILTER_TYPE_MAPPER.ACTIVE_USER) {
        return builder
          .where({
            status: USER_STATUS_MAPPER.ACTIVATED
          })
          .where('roleId', '<', USER_ROLE_MAPPER.ADMIN);
      }
      if (params.status === USER_FILTER_TYPE_MAPPER.DISABLED_USER) {
        return builder
          .whereIn('status', [USER_STATUS_MAPPER.DISABLED, USER_STATUS_MAPPER.ARCHIVED])
          .where('roleId', '<', USER_ROLE_MAPPER.ADMIN);
      }
      return builder;
    });
  }
  if (params.type) {
    queryBuilder.joinRelated('role').where('role.shortCode', params.type);
  }
  if (params.location && params.location !== 'ALL') {
    queryBuilder.joinRelated('userLocations').where('userLocations.locationId', params.location);
  }
  if (params.search) {
    queryBuilder.where((builder) => {
      builder
        .where(fn.lower(ref('firstName')), 'like', `%${params.search.toLowerCase()}%`)
        .orWhere(fn.lower(ref('lastName')), 'like', `%${params.search.toLowerCase()}%`)
        .orWhere(fn.lower(ref('userName')), 'like', `%${params.search.toLowerCase()}%`)
        .orWhere(fn.lower(ref('email')), 'like', `%${params.search.toLowerCase()}%`)
        .orWhere(fn.lower(ref('phone')), 'like', `%${params.search.toLowerCase()}%`);
    });
  }

  return queryBuilder;
};
