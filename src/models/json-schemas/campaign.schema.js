export default {
  type: 'object',
  required: [],
  properties: {
    id: { type: 'integer' },
    name: { type: 'string' },
    model: { type: 'string', enum: ['AUTO_PILOT', 'ON_DEMAND', 'INFORMATIONAL'] },
    type: {
      type: 'string',
      enum: ['BIRTHDAY', 'APPRECIATION', 'REFERRAL', 'REWARDS', 'WELCOME', 'NEWSLETTER']
    },
    offer: {
      type: 'integer'
    },
    offerType: {
      type: 'string',
      enum: ['COUPON', 'POINT']
    },
    total: {
      type: 'integer'
    },
    redeemed: {
      type: 'integer'
    },
    startDate: {
      type: 'string'
    },
    endDate: {
      type: 'string'
    },
    nextDelivery: {
      type: 'string'
    },
    status: {
      type: 'integer'
    },
    channels: {
      type: 'integer'
    }
  }
};
