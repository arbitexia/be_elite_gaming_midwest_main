export default {
  type: 'object',
  required: [],
  properties: {
    id: { type: 'integer' },
    coupon: { type: 'integer' },
    checkinThreshold: { type: 'integer' },
    days: { type: 'integer' },
    type: {
      type: 'string',
      enum: ['FREE', 'MATCH']
    },
    expirationDate: {
      type: 'string'
    },
    code: {
      type: 'string'
    },
    status: { type: 'integer' }
  }
};
