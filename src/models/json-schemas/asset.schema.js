export default {
  type: 'object',
  required: [],
  properties: {
    id: { type: 'integer' },
    name: { type: 'string' },
    desc: { type: 'string' },
    url: { type: 'string' },
    type: { type: 'string', enum: ['IMAGE', 'PDF', 'VIDEO'] }
  }
};
