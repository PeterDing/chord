'use strict';


export function hasChinaDomain(url: string): boolean {
    // xiami
    if (url.includes('xiami.net')) return true;

    // netease
    if (url.includes('126.net')) return true;

    // qq
    if (url.includes('qq.com')) return true;

    // qianqian
    if (url.includes('qianqian.com')) return true;
    if (url.includes('baidu.com')) return true;

    // ximalaya
    if (url.includes('xmcdn.com')) return true;
    return false;
}
