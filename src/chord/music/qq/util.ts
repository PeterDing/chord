'use strict';

import { IMap } from 'chord/base/common/map';


export function getACSRFToken(cookies: IMap<string>): string {
    function e(x) {
        if (!x) {
            return '';
        }
        let n, o, t;
        for (n = 5381, o = 0, t = x.length; t > o; ++o)
            n += (n << 5) + x.charCodeAt(o);
        return (2147483647 & n).toString();
    }
    return e(
        cookies['qqmusic_key'] ||
        cookies['p_skey'] ||
        cookies['skey'] ||
        cookies['p_lskey'] ||
        cookies['lskey'] ||
        cookies['skey'] ||
        cookies['p_skey'] ||
        cookies['p_lskey'] ||
        cookies['lskey'] ||
        cookies['qqmusic_key']
    );
}
