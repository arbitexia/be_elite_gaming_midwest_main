export default {
  type: 'object',
  required: [],
  properties: {
    id: { type: 'integer' },
    name: { type: 'string', minLength: 1, maxLength: 255 },
    password: { type: 'string' },
    locationId: { type: 'integer' },
    status: {
      type: 'string',
      enum: ['ACTIVATED', 'DISABLED', 'ARCHIVED', 'VERIFY_PHONE', 'VERIFY_EMAIL']
    }
  }
};
