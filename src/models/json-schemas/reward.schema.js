export default {
  type: 'object',
  required: [],
  properties: {
    id: { type: 'integer' },
    locationId: { type: 'integer' },
    productId: { type: 'string' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' }
  }
};
