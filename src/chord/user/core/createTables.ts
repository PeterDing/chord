'use strict';

import { AUDIO_SCHEME_SQL } from 'chord/user/data/tables/schemes/audio.sql';
import { USER_SCHEME_SQL } from 'chord/user/data/tables/schemes/user.sql';
import { SONG_SCHEME_SQL } from 'chord/user/data/tables/schemes/song.sql';
import { USER_SONG_SCHEME_SQL } from 'chord/user/data/tables/schemes/userSong.sql';
import { USER_ALBUM_SCHEME_SQL } from 'chord/user/data/tables/schemes/userAlbum.sql';
import { USER_ARTIST_SCHEME_SQL } from 'chord/user/data/tables/schemes/userArtist.sql';
import { USER_COLLECTION_SCHEME_SQL } from 'chord/user/data/tables/schemes/userCollection.sql';

import { UserDatabase } from 'chord/user/data/database';


export function createTables(db: UserDatabase): boolean {
    db.getDatabase().exec(AUDIO_SCHEME_SQL);
    db.getDatabase().exec(USER_SCHEME_SQL);
    db.getDatabase().exec(SONG_SCHEME_SQL);
    db.getDatabase().exec(USER_SONG_SCHEME_SQL);
    db.getDatabase().exec(USER_ALBUM_SCHEME_SQL);
    db.getDatabase().exec(USER_ARTIST_SCHEME_SQL);
    db.getDatabase().exec(USER_COLLECTION_SCHEME_SQL);
    return true;
}
