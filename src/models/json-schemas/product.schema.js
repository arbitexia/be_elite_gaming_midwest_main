export default {
  type: 'object',
  required: [],
  properties: {
    id: { type: 'integer' },
    name: { type: 'string', minLength: 1, maxLength: 255 },
    locationId: { type: 'integer' },
    amount: { type: 'integer' },
    point: { type: 'integer' },
    status: {
      type: 'string',
      enum: ['AVAILABLE', 'DISABLED', 'OUTOFSTOCK']
    },
    description: {
      type: 'string'
    }
  }
};
