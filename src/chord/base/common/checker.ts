'use strict';


export function isObject(obj: any): boolean {
    return (typeof obj == 'object' && obj != null) ? true : false;
}


export function isString(obj: any): boolean {
    return typeof obj == 'string';
}
