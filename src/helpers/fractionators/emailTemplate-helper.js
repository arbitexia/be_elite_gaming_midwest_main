import { EmailTemplate } from '@/models';
import { fn, ref } from 'objection';

export const filter = (params) => {
  let queryBuilder;
  queryBuilder = EmailTemplate.query();
  if (params?.search) {
    queryBuilder.where((builder) => {
      builder
        .where(fn.lower(ref('name')), 'like', `%${params.search.toLowerCase()}%`)
        .orWhere(fn.lower(ref('templateId').castText()), 'like', `%${params.search.toLowerCase()}%`)
        .orWhere(fn.lower(ref('category').castText()), 'like', `%${params.search.toLowerCase()}%`);
    });
  }
  if (params?.sort) {
    const _sortBy = params?.sort.split('|');
    const sortBy = _sortBy[1].toLocaleLowerCase() === 'desc' ? 'ASC' : 'DESC';
    switch (_sortBy[0]) {
      case 'name':
        queryBuilder.orderBy('name', sortBy);
        break;
      case 'templateId':
        queryBuilder.orderBy('templateId', sortBy);
        break;
      case 'status':
        queryBuilder.orderBy('status', sortBy);
        break;
      case 'status':
        queryBuilder.orderBy('category', sortBy);
        break;
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
