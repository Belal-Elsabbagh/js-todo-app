const HTTP_STATUS_CODES = {
    Default: 1,
    Success: 200,
    Created: 201,
    BadRequest: 400,
    NotAuthenticated: 401,
    Forbidden: 403,
    NotFoundError: 404,
    ConflictError: 409,
    UnprocessableEntity: 422,
    InternalServerError: 500,
    BadGateway: 502,
    ServiceUnavailable: 503,
}
Object.freeze(HTTP_STATUS_CODES)

export class BaseError extends Error {
    code = HTTP_STATUS_CODES.Default;
    constructor(message: string | undefined, errCode = HTTP_STATUS_CODES.Default) {
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

export class ValidationError extends BaseError {
    details = null
    constructor(message: string, details = null) {
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

export class NotFoundError extends BaseError {
    constructor(message: any) {
        super(message, HTTP_STATUS_CODES.NotFoundError);
    }
}

export class IncorrectCredentialsError extends BaseError {
    constructor(message: any) {
        super(message, HTTP_STATUS_CODES.NotAuthenticated);
    }
}

export class ForbiddenError extends BaseError {
    constructor(message: string) {
        super(message, HTTP_STATUS_CODES.Forbidden);
    }
}

export class NotAuthenticatedError extends BaseError {
    constructor(message: string) {
        super(message, HTTP_STATUS_CODES.NotAuthenticated);
    }
}
export class InvalidDuplicateError extends BaseError {
    constructor(message: any) {
        super(message, HTTP_STATUS_CODES.ConflictError);
    }
}

export default (err: any, req: any, res: any, next: any) => {
    if (!(err instanceof BaseError)) {
        next(err);
        return;
    }
    res.status(err.code).json(err);
}