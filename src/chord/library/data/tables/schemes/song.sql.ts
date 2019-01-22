'use strict';

import { Database } from 'better-sqlite3';

import { makeTableSql, addMissColumns } from 'chord/library/data/tables/schemes/util';


const TABLE_NAME = 'song';
const TABLE_COLUMNS = [
    ['id', 'integer primary key asc'],
    ['songId', 'text unique on conflict ignore'],
    ['type', 'text'],
    ['origin', 'text'],
    ['songOriginalId', 'text'],
    ['songMid', 'text'],
    ['songMediaMid', 'text'],
    ['url', 'text'],
    ['songName', 'text'],
    ['subTitle', 'text'],
    // json array
    ['songWriters', 'text'],
    // json array
    ['singers', 'text'],
    ['albumId', 'text'],
    ['albumOriginalId', 'text'],
    ['albumMid', 'text'],
    ['albumName', 'text'],
    ['albumCoverUrl', 'text'],
    ['albumCoverPath', 'text'],
    ['artistId', 'text'],
    ['artistOriginalId', 'text'],
    ['artistMid', 'text'],
    ['artistName', 'text'],
    ['artistAvatarUrl', 'text'],
    ['artistAvatarPath', 'text'],
    ['composer', 'text'],
    ['lyricUrl', 'text'],
    ['lyricPath', 'text'],
    ['track', 'integer'],
    ['cdSerial', 'integer'],
    // json array
    ['genres', 'text'],
    // json array
    ['styles', 'text'],
    // json array
    ['tags', 'text'],
    ['description', 'text'],
    ['duration', 'integer'],
    ['releaseDate', 'integer'],
    // audios store at audio', 'table
    // ['audios', 'text'],
    ['disable', 'integer'],
    ['playCountWeb', 'integer'],
    ['playCount', 'integer'],
    ['likeCount', 'integer'],
    ['like', 'integer'],
];
const ADDONS = null;


export function makeTable(db: Database): void {
    let tableSql = makeTableSql(TABLE_NAME, TABLE_COLUMNS, ADDONS);
    db.exec(tableSql);
}

export function fixTable(db: Database): void {
    addMissColumns(TABLE_NAME, TABLE_COLUMNS, db);
}
