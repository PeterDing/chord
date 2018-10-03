'use strict';


export const SONG_SCHEME_SQL = `
create table if not exists song (
    id integer primary key asc,

    songId text unique on conflict ignore,

    type text,
    origin text,

    songOriginalId text,

    songMid text,

    url text,

    songName text,
    subTitle text,

    -- json array
    songWriters text,
    -- json array
    singers text,

    albumId text,
    albumOriginalId text,
    albumMid text,
    albumName text,
    albumCoverUrl text,
    albumCoverPath text,

    artistId text,
    artistOriginalId text,
    artistMid text,
    artistName text,
    artistAvatarUrl text,
    artistAvatarPath text,

    composer text,

    lyricUrl text,
    lyricPath text,

    track integer,
    cdSerial integer,

    -- json array
    genres text,
    -- json array
    styles text,
    -- json array
    tags text,

    description text,
    duration integer,

    releaseDate integer,

    playCountWeb integer,

    playCount integer,

    -- audios store at audio table
    --  audios text

    disable integer,

    like integer
)
`;
