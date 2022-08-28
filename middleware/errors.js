const HTTP_STATUS_CODES = {
    Default: 1,
    Success: 200,
    Created: 201,
    BadRequest: 400,
    NotAuthenticated: 401,
    Forbidden: 403,
    NotFoundError: 404,
    InvalidDuplicateEntry: 409,
    ValidationError: 422,
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

module.exports = {
    HTTP_STATUS_CODES: HTTP_STATUS_CODES,
    BaseError: BaseError,
    ValidationError: class ValidationError extends BaseError {
        details = null
        constructor(message, details) {
            super(message, HTTP_STATUS_CODES.ValidationError);
            this.details = details
        }
    
        toJSON() {
            return {
                errorCode: this.code,
                errorMessage: this.message,
                errorDetails: this.details,
            }
        }
    },
    NotFoundError: class NotFoundError extends BaseError {
        constructor(message) {
            super(message, HTTP_STATUS_CODES.NotFoundError);
        }
    },
    NotAuthenticatedError: class NotAuthenticatedError extends BaseError {
        constructor(message) {
            super(message, HTTP_STATUS_CODES.NotAuthenticated);
        }
    },
    ForbiddenError: class ForbiddenError extends BaseError {
        constructor(message) {
            super(message, HTTP_STATUS_CODES.Forbidden);
        }
    },
    InvalidDuplicateEntryError: class InvalidDuplicateEntryError extends BaseError {
        constructor(message) {
            super(message, HTTP_STATUS_CODES.InvalidDuplicateEntry);
        }
    },
    errorHandler: (err, req, res, next) => {
        if (!(err instanceof BaseError)) {
            next(err);
            return;
        }
        res.status(err.code).json(err);
    }
}