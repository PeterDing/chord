'use strict';


export function assign(destination: any, ...sources: any[]): any {
    sources.forEach(source => Object.keys(source).forEach(key => destination[key] = source[key]));
    return destination;
}

export function removeEmtryAttributes(obj: any) {
    Object.keys(obj).forEach(key => {
        let val = obj[key];
        if (val === null || val === undefined) {
            delete obj[key];
        }
    });
}
