class GeneralError extends Error {
  constructor(message) {
    super();
    this.message = message;
  }

  getCode() {
    if (this instanceof BadRequest) {
      return 400;
    }

    if (this instanceof NotFound) {
      return 404;
    }

    if (this instanceof Unauthorized) {
      return 403;
    }

    if (this instanceof AuthenticationError) {
      return 402;
    }

    return 500;
  }
}

class AuthenticationError extends GeneralError {}
class BadRequest extends GeneralError {}
class NotFound extends GeneralError {}
class Unauthorized extends GeneralError {}

module.exports = { GeneralError, BadRequest, NotFound, Unauthorized, AuthenticationError };
