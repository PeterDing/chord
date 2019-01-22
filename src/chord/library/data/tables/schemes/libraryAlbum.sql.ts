'use strict';

import { Database } from 'better-sqlite3';

import { makeTableSql, addMissColumns } from 'chord/library/data/tables/schemes/util';


const TABLE_NAME = 'library_album';
const TABLE_COLUMNS = [
    ['id', 'integer primary key asc'],
    ['albumId', 'text unique on conflict ignore'],
    ['type', 'text'],
    ['origin', 'text'],
    ['albumOriginalId', 'text'],
    ['albumMid', 'text'],
    ['url', 'text'],
    ['albumName', 'text'],
    ['albumCoverUrl', 'text'],
    ['albumCoverPath', 'text'],
    ['artistId', 'text'],
    ['artistOriginalId', 'text'],
    ['artistMid', 'text'],
    ['artistName', 'text'],
    ['subTitle', 'text'],
    ['description', 'text'],
    // json array
    ['genres', 'text'],
    // json array
    ['styles', 'text'],
    // json array
    ['tags', 'text'],
    ['duration', 'integer'],
    ['releaseDate', 'integer'],
    ['company', 'text'],
    // json array: ["songId"] only for local songs
    ['songs', 'text'],
    ['songCount', 'integer'],

    ['playCount', 'integer'],
    ['likeCount', 'integer'],
    ['like', 'integer'],

    ['addAt', 'integer'],
];
const ADDONS = null;


export function makeTable(db: Database): void {
    let tableSql = makeTableSql(TABLE_NAME, TABLE_COLUMNS, ADDONS);
    db.exec(tableSql);
}

export function fixTable(db: Database): void {
    addMissColumns(TABLE_NAME, TABLE_COLUMNS, db);
}
