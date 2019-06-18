'use strict';

import { Database } from 'better-sqlite3';

import { makeTableSql, addMissColumns } from 'chord/library/data/tables/schemes/util';


const TABLE_NAME = 'library_radio';
const TABLE_COLUMNS = [
    ['id', 'integer primary key asc'],
    ['radioId', 'text unique on conflict ignore'],
    ['type', 'text'],
    ['origin', 'text'],
    ['radioOriginalId', 'text'],
    ['radioMid', 'text'],
    ['url', 'text'],
    ['radioName', 'text'],
    ['radioCoverUrl', 'text'],
    ['radioCoverPath', 'text'],

    ['followerCount', 'integer'],
    ['followingCount', 'integer'],
    // json array: ["radioId"] or []
    ['followers', 'text'],
    // json array: ["radioId"] or []
    ['followings', 'text'],

    ['listenCount', 'integer'],
    ['episodeCount', 'integer'],
    ['radioCount', 'integer'],
    ['podcastCount', 'integer'],
    ['favoritePodcastCount', 'integer'],

    // json array: ["episodeId"] or []
    ['episodes', 'text'],
    // json array: ["radioId"] or []
    ['radios', 'text'],
    // json array: ["podcastId"] or []
    ['podcasts', 'text'],
    // json array: ["podcastId"] or []
    ['favoritePodcasts', 'text'],

    ['description', 'text'],
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
