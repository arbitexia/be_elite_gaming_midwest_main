export default {
  type: 'object',
  required: [],
  properties: {
    id: { type: 'integer' },
    userId: { type: 'integer' },
    amount: { type: 'integer' },
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
    status: {
      type: 'integer'
    },
    transactionId: {
      type: 'integer'
    },
    metadata: { type: 'object' }
  }
};
