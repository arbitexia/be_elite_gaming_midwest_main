export default {
  type: 'object',
  required: [],
  properties: {
    id: { type: 'integer' },
    daily: { type: 'integer' },
    weekly: { type: 'integer' },
    monthly: { type: 'integer' },
    checkinThreshold: { type: 'integer' },
    coupon: { type: 'integer' },
    initialCoupon: { type: 'integer' },
    requestCoupon: { type: 'integer' }
  }
};
