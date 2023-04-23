export default {
  type: 'object',
  required: [],
  properties: {
    id: { type: 'integer' },
    name: { type: 'string' },
    subject: { type: 'string' },
    htmlBody: { type: 'string' },
    status: {
      type: 'string',
      enum: ['PENDING', 'PUBLISHED', 'ARCHIVED']
    },
    type: {
      type: 'string',
      enum: ['DEFAULT', 'DYNAMIC']
    },
    category: { type: 'string' },
    attachedFiles: {
      type: 'string'
    }
  }
};
