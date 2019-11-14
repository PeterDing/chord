'use strict';


export interface IAppConfiguration {
    // How many items to be showed. (e.g. songs, artists ....)
    itemSize: number;

    // able origins
    origins: { [origin: string]: boolean };

    volumn: number;

    // This proxy is used for Chinese user
    proxy: string;

    // Max kbps
    maxKbps: number;
}


export function initiateAppConfiguration(): IAppConfiguration {
    return {
        itemSize: 10,
        origins: {
            xiami: true,
            netease: true,
            qq: true,
            qianqian: true,

            ximalaya: true,
            himalaya: true,
            migu: true,
        },
        volumn: 0.5,
        proxy: null,
        maxKbps: 6000,
    };
}
