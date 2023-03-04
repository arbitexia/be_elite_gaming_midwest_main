import { ref, fn } from 'objection';
import { User } from '@/models';
import { USER_STATUS_MAPPER, USER_FILTER_TYPE_MAPPER, USER_ROLE_MAPPER } from '@/constants';

export const filter = (params) => {
  let queryBuilder;
  queryBuilder = User.query();
  if (params.status) {
    queryBuilder.where((builder) => {
      if (params.status === USER_FILTER_TYPE_MAPPER.ALL) {
        return builder.whereNot({ status: USER_STATUS_MAPPER.ARCHIVED });
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
          .where({ status: USER_STATUS_MAPPER.DISABLED })
          .where('roleId', '<', USER_ROLE_MAPPER.ADMIN);
      }
      if (params.status === USER_FILTER_TYPE_MAPPER.ARCHIVED_USER) {
        return builder.where({ status: USER_STATUS_MAPPER.ARCHIVED }).orWhere({ status: null });
      }
      return builder;
    });
  }

  if (params.type) {
    queryBuilder.joinRelated('role').where('role.shortCode', params.type);
  }

  if (params.search) {
    queryBuilder.where((builder) => {
      builder
        .where(fn.lower(ref('firstName')), 'like', `%${params.search.toLowerCase()}%`)
        .orWhere(fn.lower(ref('lastName')), 'like', `%${params.search.toLowerCase()}%`)
        .orWhere(fn.lower(ref('userName')), 'like', `%${params.search.toLowerCase()}%`)
        .orWhere(fn.lower(ref('email')), 'like', `%${params.search.toLowerCase()}%`)
        .orWhere(fn.lower(ref('phone')), 'like', `%${params.search.toLowerCase()}%`)
        .orWhere(
          fn.lower(ref('location:city').castText()),
          'like',
          `%${params.search.toLowerCase()}%`
        )
        .orWhere(
          fn.lower(ref('location:zipcode').castText()),
          'like',
          `%${params.search.toLowerCase()}%`
        )
        .orWhere(
          fn.lower(ref('location:state').castText()),
          'like',
          `%${params.search.toLowerCase()}%`
        )
        .orWhere(
          fn.lower(ref('location:address1').castText()),
          'like',
          `%${params.search.toLowerCase()}%`
        )
        .orWhere(
          fn.lower(ref('location:country').castText()),
          'like',
          `%${params.search.toLowerCase()}%`
        )
        .orWhere(
          fn.lower(ref('first_login:region').castText()),
          'like',
          `%${params.search.toLowerCase()}%`
        )
        .orWhere(
          fn.lower(ref('first_login:city').castText()),
          'like',
          `%${params.search.toLowerCase()}%`
        )
        .orWhere(
          fn.lower(ref('first_login:country_name').castText()),
          'like',
          `%${params.search.toLowerCase()}%`
        )
        .orWhere(
          fn.lower(ref('first_login:postal').castText()),
          'like',
          `%${params.search.toLowerCase()}%`
        );
    });
  }

  return queryBuilder;
};
