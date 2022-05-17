'use strict';


export function jsonDumpValue(obj: any): any {
    Object.keys(obj)
        .filter(key => obj[key] instanceof Object)
        .forEach(key => obj[key] = JSON.stringify(obj[key]));
    return obj;
}

export function jsonLoadValue(obj: any): any {
    Object.keys(obj)
        .filter(key => typeof obj[key] == 'string')
        .filter(key => obj[key].startsWith('[') || obj[key].startsWith('{'))
        .forEach(key => obj[key] = json_parse(obj[key]));
    return obj;
}


function json_parse(obj: string): any {
    try {
        return JSON.parse(obj);
    } catch (e) {
        return obj;
    }
}
