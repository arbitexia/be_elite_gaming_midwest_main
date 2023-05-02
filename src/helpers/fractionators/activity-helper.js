import { Activity } from '@/models';

export const filter = (params) => {
  let queryBuilder;
  queryBuilder = Activity.query();
  if (params?.userId) {
    queryBuilder.where('userId', params.userId);
  }
  if (params?.modelType && params.modelType !== 'ALL') {
    queryBuilder.where('model', params.modelType);
  }
  if (params?.search) {
    queryBuilder
      .joinRelated('user')
      .whereRaw(
        `concat(LOWER("user"."first_name"), ' ', LOWER("user"."last_name")) LIKE '%${params.search.toLowerCase()}%'`
      );
  }
  if (params?.sort) {
    const _sortBy = params?.sort.split('|');
    const sortBy = _sortBy[1].toLocaleLowerCase() === 'desc' ? 'DESC' : 'ASC';
    switch (_sortBy[0]) {
      case 'createAt':
        queryBuilder.orderBy('createdAt', sortBy);
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
