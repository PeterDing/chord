'use strict';

import { parseToMillisecond } from 'chord/base/common/time';

import { ILyric } from 'chord/music/api/lyric';


function cleanLyricFormat(text: string): string {
    return text.trim().replace(/<\d+>/g, '');
}

export function makeLyric(info: any): ILyric {
    let lyricText: string = info.trim();
    if (!lyricText) return { songId: null, chunks: [] };

    let chunks = [];
    let m;

    info.split('\n').forEach(row => {
        if (!row.trim()) return;

        let textr = /(\[.+?\])+(.*)/;
        m = textr.exec(row);
        if (!m) return;
        let text = m[2];
        let isText = text.includes('<1>');

        /**
         * For this case (finded at netease):
         *  [00:30.323][02:01.432] ba ba ba ~~~
         */
        let tagr = /\[(.+?)\]/g;
        while (m = tagr.exec(row)) {
            let tag = m[1];
            if (tag == 'x-trans') {
                if (chunks.length == 0) continue;
                let chunk = chunks.slice(-1)[0];
                chunk.translation = cleanLyricFormat(text);
                continue;
            }
            if (/^\d\d:/.test(tag)) {
                if (!isText && chunks.length != 0 && chunks.slice(-1)[0].type != 'lyric') {
                    let point = chunks.slice(-1)[0].point;
                    chunks.push({ type: 'breakline', text: null, point });
                }
                let chunk = {
                    type: isText ? 'text' : 'lyric',
                    text: cleanLyricFormat(text),
                    point: parseToMillisecond(tag),
                };
                chunks.push(chunk);
            }
        }
    });

    chunks = chunks.sort((x, y) => x.point - y.point);

    chunks.push({
        type: 'breakline',
        text: null,
        point: chunks.length >= 1 ? chunks.slice(-1)[0].point + 10 : 0
    });

    return { songId: null, chunks };
}
