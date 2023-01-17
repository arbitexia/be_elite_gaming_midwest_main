import { ref, fn } from 'objection';
import { Location } from '@/models';

export const filter = (params) => {
  let queryBuilder;
  queryBuilder = Location.query();
  if (params.search) {
    queryBuilder
      .where((builder) => {
        builder
          .where(fn.lower(ref('name')), 'like', `%${params.search.toLowerCase()}%`)
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
          );
      })
      .withGraphFetched('[gallery]');
  }

  return queryBuilder;
};
