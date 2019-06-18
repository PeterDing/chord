'use strict';

import { Database } from 'better-sqlite3';

import { makeTableSql, addMissColumns } from 'chord/library/data/tables/schemes/util';


const TABLE_NAME = 'library_podcast';
const TABLE_COLUMNS = [
    ['id', 'integer primary key asc'],

    ['podcastId', 'text unique on conflict ignore'],
    ['type', 'text'],
    ['origin', 'text'],
    ['podcastOriginalId', 'text'],
    ['podcastMid', 'text'],
    ['url', 'text'],
    ['podcastName', 'text'],
    ['podcastCoverUrl', 'text'],
    ['podcastCoverPath', 'text'],

    ['radioId', 'text'],
    ['radioOriginalId', 'text'],
    ['radioMid', 'text'],
    ['radioName', 'text'],
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
    // json array: ["episodeId"] only for local episodes
    ['episodes', 'text'],
    ['episodeCount', 'integer'],

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
