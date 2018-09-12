'use strict';


/**
 * Throws an error, if value is not a javascript value
 */
export function ok(value?: any, message?: string) {
    if (!value || value === null) {
        throw new Error(message ? `Assertion failed (${message})` : 'Assertion failed');
    }
}


/**
 * Throws an error, ifi two values are not equal
 */
export function equal(a: any, b: any, message?: string) {
    if (a != b) {
        throw new Error(message ? `Not Equal: (${message})` : `Not Equal: ${a} != ${b}`);
    }
}
