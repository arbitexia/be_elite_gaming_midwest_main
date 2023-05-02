export default {
  type: 'object',
  required: [],
  properties: {
    id: { type: 'integer' },
    userId: { type: 'integer' },
    rewardId: { type: 'integer' },
    locationId: { type: 'integer' },
    assigneeId: { type: 'integer' },
    pointId: { type: 'integer' },
    status: {
      type: 'string',
      enum: ['ACCEPTED', 'DECLINED', 'WAITING']
    },
    type: {
      type: 'string',
      enum: ['POINT', 'COUPON']
    },
    point: { type: 'number' },
    acceptedAt: { type: 'string' }
  }
};
