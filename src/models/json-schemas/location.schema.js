export default {
  type: 'object',
  required: [],
  properties: {
    id: { type: 'integer' },
    name: { type: 'string', minLength: 1, maxLength: 255 },
    coords: {
      type: 'object',
      properties: {
        lng: { type: 'string' },
        lat: { type: 'string' }
      }
    },
    address: {
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
    status: {
      type: 'string',
      enum: ['OPEN', 'CLOSED']
    },
    type: {
      type: 'string',
      enum: ['PALM', 'ROULETTE']
    }
  }
};
