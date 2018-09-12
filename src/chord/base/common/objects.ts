'use strict';


export function assign(destination: any, ...sources: any[]): any {
    sources.forEach(source => Object.keys(source).forEach(key => destination[key] = source[key]));
    return destination;
}
