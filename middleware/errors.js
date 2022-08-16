const HTTP_ERRORS = {
    Default: 1,
    Success: 200,
    BadRequest: 400,
    Unauthorized: 401,
    Forbidden: 403,
    NotFoundError: 404,
    UnprocessableEntity: 422,
    InternalServerError: 500,
    BadGateway: 502,
    ServiceUnavailable: 503,
}

class BaseError extends Error {
    code = HTTP_ERRORS.Default;
    constructor(message, errCode = HTTP_ERRORS.Default) {
        super(message);
        this.code = errCode;
    }
}

module,exports.BaseError = BaseError

module,exports.ValidationError = class ValidationError extends BaseError {
    constructor(message) {
        super(message, HTTP_ERRORS.UnprocessableEntity);
    }
}

module,exports.NotFoundError = class NotFoundError extends BaseError {
    constructor(message) {
        super(message, HTTP_ERRORS.NotFoundError);
    }
}

module,exports.IncorrectCredentialsError = class IncorrectCredentialsError extends BaseError {
    constructor(message) {
        super(message, HTTP_ERRORS.Unauthorized);
    }
}

module,exports.ForbiddenError = class ForbiddenError extends BaseError {
    constructor(message) {
        super(message, HTTP_ERRORS.Forbidden);
    }
}

module,exports.UnauthorizedError = class UnauthorizedError extends BaseError {
    constructor(message) {
        super(message, HTTP_ERRORS.Unauthorized);
    }
}

