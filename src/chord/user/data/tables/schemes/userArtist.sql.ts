'use strict';


export const USER_ARTIST_SCHEME_SQL = `
create table if not exists user_artist (
    id integer primary key asc,

    artistId text unique on conflict ignore,

    type text,
    origin text,
    artistOriginalId text,
    artistMid text,
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

    addAt integer,

    like integer
)
`;
