export default {
  type: 'object',
  required: [],
  properties: {
    id: { type: 'integer' },
    firstName: { type: 'string', minLength: 1, maxLength: 255 },
    lastName: { type: 'string', minLength: 1, maxLength: 255 },
    userName: { type: 'string', minLength: 1, maxLength: 255 },
    email: { type: 'string' },
    phone: { type: 'string' },
    password: { type: 'string' },
    birthday: { type: 'string' },
    location: {
      type: 'object',
      properties: {
        country: { type: 'string' },
        city: { type: 'string' },
        state: { type: 'string' },
        zipcode: { type: 'string' },
        address1: { type: 'string' },
        address2: { type: 'string' }
      }
    },
    assetId: { type: 'integer' },
    status: {
      type: 'string',
      enum: ['ACTIVATED', 'DISABLED', 'ARCHIVED', 'VERIFY_PHONE', 'VERIFY_EMAIL']
    },
    roleId: { type: 'integer' }
  }
};
