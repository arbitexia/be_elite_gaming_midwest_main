export default {
  type: 'object',
  required: [],
  properties: {
    id: { type: 'integer' },
    name: { type: 'string' },
    shortCode: {
      type: 'string',
      enum: ['GUEST', 'USER', 'TABLET', 'ADMIN', 'SUPER']
    }
  }
};
