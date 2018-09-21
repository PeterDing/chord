'use strict';


export const USER_COLLECTION_SCHEME_SQL = `
create table if not exists user_collection (
    id integer primary key asc,

    collectionId text unique on conflict ignore,

    origin text,
    collectionOriginalId text,
    url text,

    collectionName text,

    collectionCoverUrl text,
    collectionCoverPath text,

    userId text,
    userName text,

    releaseDate text,

    description text,

    tags text,

    duration text,

    -- json array, ["songId"]
    songs text,
    songCount text,

    addAt integer
)
`;
