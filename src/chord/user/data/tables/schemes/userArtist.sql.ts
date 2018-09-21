'use strict';


export const USER_ARTIST_SCHEME_SQL = `
create table if not exists user_artist (
    id integer primary key asc,

    artistId text unique on conflict ignore,

    origin text,
    artistOriginalId text,
    url text,

    artistName text,
    artistAlias text,

    artistAvatarUrl text,
    artistAvatarPath text,

    area text,

    -- json array
    genres text,
    -- json array
    styles text,
    -- json array
    tags text,

    description text,

    addAt integer
)
`;
