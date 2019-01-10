'use strict';


export interface ILyric {
    songId: string;
    chunks?: Array<{
        /**
         * type:
         *     c: origin lyric sentence
         */
        type: string;
        text: string;
        point?: number;
        translation?: string;
    }>;
};
