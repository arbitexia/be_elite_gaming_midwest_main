export default {
  type: 'object',
  required: [],
  properties: {
    id: { type: 'integer' },
    userLocationId: { type: 'integer' },
    productId: { type: 'integer' },
    assigneeId: { type: 'integer' },
    status: {
      type: 'string',
      enum: ['ACCEPTED', 'DECLINED', 'WAITING']
    },
    note: { type: 'string' }
  }
};
