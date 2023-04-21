export default {
  type: 'object',
  required: [],
  properties: {
    id: { type: 'integer' },
    name: { type: 'string' },
    model: { type: 'string' },
    field: { type: 'string' },
    description: {
      type: 'string'
    },
    status: {
      type: 'string',
      enum: ['PENDING', 'PUBLISHED', 'ARCHIVED']
    }
  }
};
