'use strict';


export function makeListKey(index: number, ...args: string[]): string {
    return args.join('_') + index.toString().padStart(3, '0');
}
