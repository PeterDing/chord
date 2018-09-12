'use strict';

import * as crypto from 'crypto';


export function md5(data: string | Buffer): string {
    return crypto.createHash('md5').update(data).digest('hex');
}
