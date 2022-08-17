const HTTP_STATUS_CODES = {
    Default: 1,
    Success: 200,
    Created: 201,
    BadRequest: 400,
    Unauthorized: 401,
    Forbidden: 403,
    NotFoundError: 404,
    ConflictError: 409,
    UnprocessableEntity: 422,
    InternalServerError: 500,
    BadGateway: 502,
    ServiceUnavailable: 503,
}
Object.freeze(HTTP_STATUS_CODES)

class BaseError extends Error {
    code = HTTP_STATUS_CODES.Default;
    constructor(message, errCode = HTTP_STATUS_CODES.Default) {
        super(message);
        this.code = errCode;
    }
}

module,exports.BaseError = BaseError

module,exports.ValidationError = class ValidationError extends BaseError {
    constructor(message) {
        super(message, HTTP_STATUS_CODES.UnprocessableEntity);
    }
}

module,exports.NotFoundError = class NotFoundError extends BaseError {
    constructor(message) {
        super(message, HTTP_STATUS_CODES.NotFoundError);
    }
}

module,exports.IncorrectCredentialsError = class IncorrectCredentialsError extends BaseError {
    constructor(message) {
        super(message, HTTP_STATUS_CODES.Unauthorized);
    }
}

module,exports.ForbiddenError = class ForbiddenError extends BaseError {
    constructor(message) {
        super(message, HTTP_STATUS_CODES.Forbidden);
    }
}

module,exports.UnauthorizedError = class UnauthorizedError extends BaseError {
    constructor(message) {
        super(message, HTTP_STATUS_CODES.Unauthorized);
    }
}

module.exports.InvalidDuplicateError = class InvalidDuplicateError extends BaseError {
    constructor(message) {
        super(message, HTTP_STATUS_CODES.ConflictError);
    }
}

module.exports.errorHandler = (err, req, res, next) => {
    if (!(err instanceof BaseError)) {
        next(err);
        return;
    }
    if (err.statusCode === HTTP_STATUS_CODES.Forbidden) {
        res.status(err.statusCode).json({
            message: err.message
        });
    }
    res.status(err.code).json({
        message: err.message,
        code: err.code
    });
}