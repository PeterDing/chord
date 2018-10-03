'use strict';


export const USER_ALBUM_SCHEME_SQL = `
create table if not exists user_album (
    id integer primary key asc,

    albumId text unique on conflict ignore,

    type text,
    origin text,
    albumOriginalId text,
    albumMid text,
    url text,

    albumName text,
    albumCoverUrl text,
    albumCoverPath text,

    artistId text,
    artistOriginalId text,
    artistMid text,
    artistName text,

    subTitle text,
    description text,

    -- json array
    genres text,
    -- json array
    styles text,
    -- json array
    tags text,

    duration integer,

    releaseDate integer,

    company text,

    -- json array: ["songId"], only for local songs
    songs text,
    songCount integer,

    addAt integer,

    like integer
)
`;
