'use strict';

import { Database } from 'better-sqlite3';

import { makeTableSql, addMissColumns } from 'chord/library/data/tables/schemes/util';


const TABLE_NAME = 'episode';
const TABLE_COLUMNS = [
    ['id', 'integer primary key asc'],

    ['episodeId', 'text unique on conflict ignore'],
    ['type', 'text'],
    ['origin', 'text'],
    ['episodeOriginalId', 'text'],
    ['episodeMid', 'text'],
    ['episodeMediaMid', 'text'],

    ['url', 'text'],
    ['episodeName', 'text'],
    ['subTitle', 'text'],

    // json array
    ['people', 'text'],

    ['podcastId', 'text'],
    ['podcastOriginalId', 'text'],
    ['podcastMid', 'text'],
    ['podcastName', 'text'],
    ['podcastCoverUrl', 'text'],
    ['podcastCoverPath', 'text'],

    ['radioId', 'text'],
    ['radioOriginalId', 'text'],
    ['radioMid', 'text'],
    ['radioName', 'text'],
    ['radioCoverUrl', 'text'],
    ['radioCoverPath', 'text'],

    ['composer', 'text'],
    ['lyricUrl', 'text'],
    ['lyricPath', 'text'],
    ['track', 'integer'],
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
