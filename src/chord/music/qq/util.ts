'use strict';


export function getACSRFToken(cookies: { [key: string]: string }): string {
    function e(e) {
        let n, o, t;
        for (n = 5381, o = 0, t = e.length; t > o; ++o)
            n += (n << 5) + e.charCodeAt(o);
        return (2147483647 & n).toString();
    }
    return e(cookies["p_skey"] || cookies["skey"] || cookies["p_lskey"] || cookies["lskey"]);
}
