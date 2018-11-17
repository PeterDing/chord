'use strict';


export class ServerError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = 'ServerError';
    }
}


export class NoLoginError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = 'NoLoginError';
    }
}


export class LoginTimeoutError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = 'LoginTimeoutError';
    }
}
