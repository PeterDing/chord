'use strict';

import * as path from 'path';
import * as os from 'os';
import { mkdirp } from 'chord/base/node/pfs';

import { ok } from 'chord/base/common/assert';

import * as fs from 'fs';

import { ISong } from "chord/music/api/song";
import { IAlbum } from "chord/music/api/album";
import { IArtist } from "chord/music/api/artist";
import { ICollection } from "chord/music/api/collection";
// import { IPlayList } from "chord/music/api/playList";

import { IUserSong } from 'chord/user/api/song';
import { IUserAlbum } from 'chord/user/api/album';
import { IUserArtist } from 'chord/user/api/artist';
import { IUserCollection } from 'chord/user/api/collection';
// import { IUserPlayList } from 'chord/user/api/playList';

import { encryptPassword } from 'chord/user/auth/encrypt';

import { UserDatabase } from 'chord/user/data/database';

import { createTables } from 'chord/user/core/createTables';


export class User {

    username: string;
    password: string;

    db: UserDatabase;
    databasePath: string;


    constructor(username: string, databasePath: string, password: string = '') {
        this.username = username;
        this.databasePath = databasePath;
        this.password = password;

        this.init();
    }

    init() {
        if (fs.existsSync(this.databasePath)) {
            this.db = new UserDatabase(this.databasePath);
            // TODO: check database table schemes

            // auth
            let encPasswd1 = this.db.getEncryptedPassword();
            let encPasswd2 = encryptPassword(this.password);
            console.log(encPasswd1, encPasswd2);
            ok(encPasswd1 == encPasswd2, `[user] password not match: ${encPasswd1} != ${encPasswd2}`);
        } else {
            this.db = new UserDatabase(this.databasePath);
            createTables(this.db);
            this.db.addUser(this.username, encryptPassword(this.password));
        }
    }

    userSongs(lastId: number = 0, size: number = 20, keyword?: string): Array<IUserSong> {
        return this.db.userSongs(lastId, size, keyword);
    }

    userAlbums(lastId: number = 0, size: number = 20, keyword?: string): Array<IUserAlbum> {
        return this.db.userAlbums(lastId, size, keyword);
    }

    userArtists(lastId: number = 0, size: number = 20, keyword?: string): Array<IUserArtist> {
        return this.db.userArtists(lastId, size, keyword);
    }

    userCollections(lastId: number = 0, size: number = 20, keyword?: string): Array<IUserCollection> {
        return this.db.userCollections(lastId, size, keyword);
    }

    // userPlayLists(lastId: number = 0, size: number = 20, keyword?: string): Array<IUserPlayList> {
    // let rows = this.db.userPlayLists(lastId, size, keyword);
    // let userPlayLists = rows.map(row => makeUserPlayList(row));
    // return userPlayLists;
    // }


    addUser(username: string, password: string): boolean {
        return this.db.addUser(username, password);
    }

    addSong(song: ISong): IUserSong {
        let addAt = Date.now();
        return this.db.addSong(song, addAt);
    }

    addAlbum(album: IAlbum): IUserAlbum {
        let addAt = Date.now();
        return this.db.addAlbum(album, addAt);
    }

    addArtist(artist: IArtist): IUserArtist {
        let addAt = Date.now();
        return this.db.addArtist(artist, addAt);
    }

    addCollection(collection: ICollection): IUserCollection {
        let addAt = Date.now();
        return this.db.addCollection(collection, addAt);
    }

    deleteSong(song: ISong): boolean {
        return this.db.deleteSong(song);
    }

    deleteAlbum(album: IAlbum): boolean {
        return this.db.deleteAlbum(album);
    }

    deleteArtist(artist: IArtist): boolean {
        return this.db.deleteArtist(artist);
    }

    deleteCollection(collection: ICollection): boolean {
        return this.db.deleteCollection(collection);
    }
}


// WARN: no using defaultUser for production
const chordDir = path.join(os.homedir(), '.chord');
mkdirp(chordDir);
const defaultDBPath = path.join(chordDir, 'default-user-library.db');
export const defaultUser = new User('default', defaultDBPath);
