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

    toJSON() {
        return {
            errorCode: this.code,
            errorMessage: this.message,
        };
    }
}

class ValidationError extends BaseError {
    details = null
    constructor(message, details) {
        super(message, HTTP_STATUS_CODES.UnprocessableEntity);
        this.details = details
    }

    toJSON() {
        return {
            errorCode: this.code,
            errorMessage: this.message,
            errorDetails: this.details,
        }
    }
}

class NotFoundError extends BaseError {
    constructor(message) {
        super(message, HTTP_STATUS_CODES.NotFoundError);
    }
}

class IncorrectCredentialsError extends BaseError {
    constructor(message) {
        super(message, HTTP_STATUS_CODES.Unauthorized);
    }
}

class ForbiddenError extends BaseError {
    constructor(message) {
        super(message, HTTP_STATUS_CODES.Forbidden);
    }
}

class UnauthorizedError extends BaseError {
    constructor(message) {
        super(message, HTTP_STATUS_CODES.Unauthorized);
    }
}
class InvalidDuplicateError extends BaseError {
    constructor(message) {
        super(message, HTTP_STATUS_CODES.ConflictError);
    }
}

errorHandler = (err, req, res, next) => {
    if (!(err instanceof BaseError)) {
        next(err);
        return;
    }
    res.status(err.code).json(err);
}

module.exports = {
    HTTP_STATUS_CODES: HTTP_STATUS_CODES,
    BaseError: BaseError,
    ValidationError: ValidationError,
    NotFoundError: NotFoundError,
    IncorrectCredentialsError: IncorrectCredentialsError,
    ForbiddenError: ForbiddenError,
    UnauthorizedError: UnauthorizedError,
    InvalidDuplicateError: InvalidDuplicateError,
    errorHandler: errorHandler,
}