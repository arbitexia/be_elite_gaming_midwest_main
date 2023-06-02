import { UserLocation } from '@/models';

export const filter = (params) => {
  let queryBuilder;
  queryBuilder = UserLocation.query();
  if (params?.locationId) {
    queryBuilder.where((builder) => {
      builder.where('locationId', params.locationId);
    });
  }
  queryBuilder.orderBy('id', 'DESC');
  return queryBuilder;
};
