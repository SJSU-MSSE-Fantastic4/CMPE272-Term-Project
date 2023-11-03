export enum HttpCode {
    OK = 200,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500,
}

export class HttpException extends Error {
    status: HttpCode;
    message: string;
    constructor(status: number, message: string) {
        super(message);
        this.status = status;
        this.message = message;
    }
}

export class BadParamsException extends HttpException {
    constructor() {
        super(400, `The Query Parameters Provided are Invalid`);
    }
}

export class BadDataException extends HttpException {
    constructor() {
        super(400, `The Body Provided is Invalid`);
    }
}

export class BadQueryException extends HttpException {
    constructor() {
        super(400, `The Query Provided is Invalid`);
    }
}

export class PostNotFoundException extends HttpException {
    constructor(id: string) {
        super(404, `Post with id ${id} not found`);
    }
}
