import { ref, fn } from 'objection';
import { Location } from '@/models';

export const filter = (params) => {
  let queryBuilder;
  queryBuilder = Location.query();
  if (params?.search) {
    queryBuilder
      .where((builder) => {
        builder
          .where(fn.lower(ref('name')), 'like', `%${params.search.toLowerCase()}%`)
          .orWhere(
            fn.lower(ref('address:city').castText()),
            'like',
            `%${params.search.toLowerCase()}%`
          )
          .orWhere(
            fn.lower(ref('address:zipcode').castText()),
            'like',
            `%${params.search.toLowerCase()}%`
          )
          .orWhere(
            fn.lower(ref('address:state').castText()),
            'like',
            `%${params.search.toLowerCase()}%`
          )
          .orWhere(
            fn.lower(ref('address:address1').castText()),
            'like',
            `%${params.search.toLowerCase()}%`
          )
          .orWhere(
            fn.lower(ref('address:country').castText()),
            'like',
            `%${params.search.toLowerCase()}%`
          )
          .orWhere(fn.lower(ref('description')), 'like', `%${params.search.toLowerCase()}%`);
      })
      .withGraphFetched('[gallery]');
  }

  return queryBuilder;
};
