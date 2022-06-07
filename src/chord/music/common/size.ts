'use strict';

import * as nodeUrl from 'url';
import { isString } from 'chord/base/common/checker';


export enum ESize {
    Huge,
    Large,
    Big,
    Middle,
    Small,
    Tiny,
}

export function resizeImageUrl(url: string | object, size: ESize | number, resizeFunc: (url: string | object, size: number) => string): string {
    switch (size) {
        case ESize.Huge:
            size = 700;
            break;
        case ESize.Large:
            size = 450;
            break;
        case ESize.Big:
            size = 250;
            break;
        case ESize.Middle:
            size = 150;
            break;
        case ESize.Small:
            size = 60;
            break;
        case ESize.Tiny:
            size = 30;
            break;
        default:
            break;
    }
    if (isString(url)) {
        let u = nodeUrl.parse(url as string);
        url = `${u.protocol}//${u.hostname}${u.pathname}`;
    }
    return resizeFunc(url, size);
}
