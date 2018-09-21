'use strict';


export function jsonDumpValue(obj: any): any {
    Object.keys(obj)
        .filter(key => obj[key] instanceof Object)
        .forEach(key => obj[key] = JSON.stringify(obj[key]));
    return obj;
}

export function jsonLoadValue(obj: any): any {
    Object.keys(obj).filter(key => key.startsWith('[') || key.startsWith('{'))
        .forEach(key => obj[key] = JSON.parse(obj[key]));
    return obj;
}
