import { ref, fn } from 'objection';
import { Tablet } from '@/models';
import { USER_STATUS_MAPPER, USER_FILTER_TYPE_MAPPER } from '@/constants';

export const filter = (params) => {
  let queryBuilder;
  queryBuilder = Tablet.query();
  if (params.status !== USER_FILTER_TYPE_MAPPER.ALL) {
    queryBuilder.where((builder) => {
      if (params.status === USER_FILTER_TYPE_MAPPER.ACTIVE_USER) {
        return builder.where({
          status: USER_STATUS_MAPPER.ACTIVATED
        });
      }
      if (params.status === USER_FILTER_TYPE_MAPPER.DISABLED_USER) {
        return builder.where({ status: USER_STATUS_MAPPER.DISABLED });
      }
      if (params.status === USER_FILTER_TYPE_MAPPER.ARCHIVED_USER) {
        return builder.where({ status: USER_STATUS_MAPPER.ARCHIVED }).orWhere({ status: null });
      }
      return builder;
    });
  }

  if (params?.search) {
    queryBuilder.where((builder) => {
      builder.where(fn.lower(ref('name')), 'like', `%${params.search.toLowerCase()}%`);
    });
  }

  if (params?.sort) {
    const _sortBy = params?.sort.split('|');
    const sortBy = _sortBy[1].toLocaleLowerCase() === 'desc' ? 'DESC' : 'ASC';
    switch (_sortBy[0]) {
      case 'location':
        queryBuilder.joinRelated('location').orderBy('location.name', sortBy);
        break;
      case 'createAt':
        queryBuilder.orderBy('createdAt', sortBy);
        break;
      case 'name':
        queryBuilder.orderBy('name', sortBy);
        break;
      case 'status':
        queryBuilder.orderBy('status', sortBy);
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
