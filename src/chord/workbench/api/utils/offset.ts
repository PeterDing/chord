'use strict';

import { ORIGIN } from 'chord/music/common/origin';

import { IOffset, initiateOffset } from 'chord/workbench/api/common/state/offset';


export function makeOffsets(origin: string, offset: IOffset, size: number): Array<IOffset> {
    /**
     * `page * size` is equal to the amount of songs which have been token.
     * `total` is equal to `page * size + amount of wonted songs`
     */
    const findPages = (page: number, size: number, total: number, offsets: Array<IOffset>): void => {
        let nowOffset = page * size;
        if (nowOffset >= total) {
            return;
        }

        // max size is 100 for xiami music
        let chunk = 100;
        while (true) {
            if ((nowOffset % chunk == 0) && (nowOffset + chunk <= total)) {
                let _offset = initiateOffset();
                _offset.offset = nowOffset / chunk + 1;
                _offset.limit = chunk;
                offsets.push(_offset);
                findPages(1, nowOffset + chunk, total, offsets);
                return;
            } else {
                chunk -= 10;
            }
        }
    };

    let offsets = [];
    let total;
    switch (origin) {
        case ORIGIN.xiami:
        case ORIGIN.migu:
        case ORIGIN.kuwo:
            total = offset.offset * offset.limit + size;
            findPages(offset.offset, offset.limit, total, offsets);
            break;
        case ORIGIN.netease:
        case ORIGIN.spotify:
        case ORIGIN.qq:
        case ORIGIN.qianqian:
            // TODO: user's favorites do not need offset * limit in apis
            let _offset = initiateOffset();
            _offset.offset = offset.offset;
            _offset.limit = size;
            offsets.push(_offset);
            break;
    }
    return offsets;
}


export function setCurrectOffset(origin: string, offset: IOffset, size: number): IOffset {
    let total;
    let _offset;
    switch (origin) {
        case ORIGIN.xiami:
        case ORIGIN.migu:
        case ORIGIN.kuwo:
            // `offset.offset * offset.limit` is equal to the amount of songs which have been token.
            // `total` is equal to `page * size + amount of wonted songs`
            total = offset.offset * offset.limit + size;
            _offset = initiateOffset();
            _offset.offset = total % 10 == 0 ? total / 10 : Math.floor(total / 10) + 1;
            _offset.limit = 10;
            break;
        case ORIGIN.netease:
        case ORIGIN.spotify:
        case ORIGIN.qq:
        case ORIGIN.qianqian:
            _offset = initiateOffset();
            _offset.offset = offset.offset + size;
            _offset.limit = 0;
            break;
    }
    return _offset;
}
