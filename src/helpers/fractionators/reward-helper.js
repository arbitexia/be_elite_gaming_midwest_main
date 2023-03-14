import { Reward } from '@/models';

export const filter = (params) => {
  const { locationId, search } = params;
  let queryBuilder = Reward.query();
  if (locationId) {
    queryBuilder.where((builder) => {
      builder.where({ location_id: locationId });
    });
  }
  queryBuilder = queryBuilder.withGraphFetched('[location, product]');
  return queryBuilder;
};
