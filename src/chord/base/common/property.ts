'use strict';


export function strip(str: string, chars: string): string {
    chars = chars.replace('[', '\\[').replace(']', '\\]');
    let regex = new RegExp(`(^[${chars}]+|[${chars}]+$)`, 'g');
    return str.replace(regex, '');
}

export function getDescendentProp(obj: any, path: string): any {
    let nodes = strip(path, '.').split('.').filter(n => n != '');
    for (let node of nodes) {
        obj = obj[node];
    }
    return obj;
}

export function setDescendentProp(obj: any, path: string, value: any): any {
    let originObj = obj;
    let nodes = strip(path, '.').split('.').filter(n => n != '');
    if (nodes.length == 0) {
        return value;
    }
    for (let node of nodes.slice(0, -1)) {
        obj = obj[node];
    }
    obj[nodes[nodes.length - 1]] = value;
    return originObj;
}
