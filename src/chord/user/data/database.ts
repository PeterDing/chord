'use strict';

import { removeEmtryAttributes } from 'chord/base/common/objects';

import { jsonDumpValue } from 'chord/base/common/json';

import Database = require('better-sqlite3');

import { ISong } from 'chord/music/api/song';
import { IAlbum } from 'chord/music/api/album';
import { IArtist } from 'chord/music/api/artist';
import { ICollection } from 'chord/music/api/collection';
import { IAudio } from 'chord/music/api/audio';

import { IUserSong } from 'chord/user/api/song';
import { IUserAlbum } from 'chord/user/api/album';
import { IUserArtist } from 'chord/user/api/artist';
import { IUserCollection } from 'chord/user/api/collection';

import {
    toNumber,
    makeAudio,
    makeSong,
    makeAlbum,
    makeArtist,
    makeCollection
} from 'chord/user/data/parser';

import { TABLES } from 'chord/user/data/common';


export class UserDatabase {

    databasePath: string;
    private db: Database;

    constructor(databasePath: string) {
        this.db = new Database(databasePath);
    }

    public getDatabase() {
        return this.db;
    }

    public getEncryptedPassword(): string {
        let sql = 'SELECT encrypted_password FROM user';
        let result = this.db.prepare(sql).get();
        return result['encrypted_password'];
    }

    public audio(songId: string): Array<any> {
        let sql = 'SELECT * FROM audio WHERE songId = ?';
        return this.db.prepare(sql).all(songId)
            .map(row => makeAudio(row));
    }

    public songs(songIds: Array<string>): Array<ISong> {
        let param = '?,'.repeat(songIds.length).slice(0, -1);
        let sql = `SELECT * FROM song WHERE songId IN (${param})`;
        return this.db.prepare(sql).all(songIds)
            .map(row => makeSong(row))
            .map(song => {
                song.audios = this.audio(song.songId);
                return <ISong>song;
            });
    }

    protected userItem(sql: string, lastId: number, size: number, keyword?: string): Array<any> {
        if (keyword) {
            let kw = `%${keyword}%`;
            return this.db.prepare(sql).all({ lastId, kw, size });
        } else {
            return this.db.prepare(sql).all({ lastId, size });
        }
    }

    public userSongs(lastId: number, size: number, keyword?: string): Array<IUserSong> {
        let searchCondition = '';
        if (keyword) {
            searchCondition = '((song.songName like @kw) OR (song.subTitle like @kw) OR (song.albumName like @kw) OR (song.artistName like @kw) OR (song.genres like @kw))';
        }
        let sql = `SELECT * FROM user_song INNER JOIN song ON user_song.songId = song.songId WHERE user_song.id < @lastId ${keyword ? 'AND ' + searchCondition : ''} ORDER BY user_song.id DESC LIMIT @size`;
        return this.userItem(sql, lastId, size, keyword)
            .map(row => {
                let addAt = row.addAt;
                let id = row.id;
                delete row.id;
                delete row.addAt;

                let song = makeSong(row);
                song.audios = this.audio(song.songId);
                return { id, addAt, song };
            })
    }

    public userAlbums(lastId: number, size: number, keyword?: string): Array<IUserAlbum> {
        let searchCondition = '';
        if (keyword) {
            searchCondition = '((subTitle like @kw) OR (albumName like @kw) OR (artistName like @kw) OR (genres like @kw))';
        }
        let sql = `SELECT * FROM user_album WHERE id < @lastId ${keyword ? 'AND ' + searchCondition : ''} ORDER BY id DESC LIMIT @size`;
        return this.userItem(sql, lastId, size, keyword)
            .map(row => {
                let addAt = row.addAt;
                let id = row.id;
                delete row.id;
                delete row.addAt;

                let album = makeAlbum(row);
                return { id, addAt, album };
            });
    }

    public userAlbumSongs(albumId: string): Array<ISong> {
        let sql = `SELECT * FROM user_album WHERE albumId = ?`;
        let row = this.db.prepare(sql).get(albumId);
        if (row) {
            return this.songs(JSON.parse(row.songs).map(row => { delete row.id; return row }));
        } else {
            return [];
        }
    }

    public userArtists(lastId: number, size: number, keyword?: string): Array<IUserArtist> {
        let searchCondition = '';
        if (keyword) {
            searchCondition = '((artistName like @kw) OR (genres like @kw))';
        }
        let sql = `SELECT * FROM user_artist WHERE id < @lastId ${keyword ? 'AND ' + searchCondition : ''} ORDER BY id DESC LIMIT @size`;
        return this.userItem(sql, lastId, size, keyword)
            .map(row => {
                let addAt = row.addAt;
                let id = row.id;
                delete row.id;
                delete row.addAt;

                let artist = makeArtist(row);
                return { id, addAt, artist };
            });
    }

    public userCollections(lastId: number, size: number, keyword?: string): Array<IUserCollection> {
        let searchCondition = '';
        if (keyword) {
            searchCondition = '((collectionName like @kw) OR (tags like @kw))';
        }
        let sql = `SELECT * FROM user_collection WHERE id < @lastId ${keyword ? 'AND ' + searchCondition : ''} ORDER BY id DESC LIMIT @size`;
        return this.userItem(sql, lastId, size, keyword)
            .map(row => {
                let addAt = row.addAt;
                let id = row.id;
                delete row.id;
                delete row.addAt;

                let collection = makeCollection(row);
                return { id, addAt, collection };
            });
    }

    public userCollectionSongs(collectionId: string): Array<ISong> {
        let sql = 'SELECT * FROM user_collection WHERE collectionId = ?';
        let row = this.db.prepare(sql).get(collectionId);
        if (row) {
            return this.songs(JSON.parse(row.songs).map(row => { delete row.id; return row }));
        } else {
            return [];
        }
    }

    public storeAudio(audio: IAudio, songId: string): boolean {
        let _audio = <any>{ ...audio };
        _audio.songId = songId;

        let columns = Object.keys(_audio);
        let columnsStr = columns.join(',')
        let param = columns.map(c => '@' + c).join(',');
        let sql = `INSERT OR IGNORE INTO audio (${columnsStr}) values (${param})`;
        this.db.prepare(sql).run(_audio);
        return true;
    }

    public addUser(username: string, encrypted_password: string): boolean {
        let sql = `insert or ignore into user (username, encrypted_password) values (?, ?)`
        this.db.prepare(sql).run(username, encrypted_password);
        return true;
    }

    public storeSong(song: ISong, addAt: number): boolean {
        // First, store audios
        song.audios.map(audio => this.storeAudio(audio, song.songId));

        let _song = <any>{ ...song };
        delete _song.audios;

        removeEmtryAttributes(_song);
        toNumber(_song);

        jsonDumpValue(_song);

        let columns = Object.keys(_song);
        let columnsStr = columns.join(',')
        let param = columns.map(c => '@' + c).join(',');
        let sql = `INSERT OR IGNORE INTO song (${columnsStr}) VALUES (${param})`;
        this.db.prepare(sql).run(_song);
        return true;
    }

    public addSong(song: ISong, addAt: number): IUserSong {
        this.storeSong(song, addAt);

        let param = { addAt, songId: song.songId };

        let sql = 'INSERT OR IGNORE INTO user_song (songId, addAt) VALUES (@songId, @addAt)';
        let result = this.db.prepare(sql).run(param);

        return { id: <number>result.lastInsertROWID, song, addAt };
    }

    public addAlbum(album: IAlbum, addAt: number): IUserAlbum {
        // First add song;
        album.songs.map(song => this.storeSong(song, addAt));

        let _album = <any>{ ...album };
        _album.songs = album.songs.map(song => song.songId);

        removeEmtryAttributes(_album);
        toNumber(_album);

        jsonDumpValue(_album);

        _album.addAt = addAt;

        let columns = Object.keys(_album);
        let columnsStr = columns.join(',')
        let param = columns.map(c => '@' + c).join(',');
        let sql = `INSERT OR IGNORE INTO user_album (${columnsStr}) VALUES (${param})`;
        let result = this.db.prepare(sql).run(_album);

        return { id: <number>result.lastInsertROWID, album, addAt };
    }

    public addArtist(artist: IArtist, addAt: number): IUserArtist {
        let _artist = <any>{ ...artist };
        delete _artist.songs;
        delete _artist.albums;

        removeEmtryAttributes(_artist);
        toNumber(_artist);

        jsonDumpValue(_artist);

        _artist.addAt = addAt;

        let columns = Object.keys(_artist);
        let columnsStr = columns.join(',')
        let param = columns.map(c => '@' + c).join(',');
        let sql = `INSERT OR IGNORE INTO user_artist (${columnsStr}) VALUES (${param})`;
        let result = this.db.prepare(sql).run(_artist);

        return { id: <number>result.lastInsertROWID, artist, addAt };
    }

    public addCollection(collection: ICollection, addAt: number): IUserCollection {
        // First add song;
        collection.songs.map(song => this.storeSong(song, addAt));

        let _collection = <any>{ ...collection };
        _collection.songs = collection.songs.map(song => song.songId);

        removeEmtryAttributes(_collection);
        toNumber(_collection);

        jsonDumpValue(_collection);

        _collection.addAt = addAt;

        let columns = Object.keys(_collection);
        let columnsStr = columns.join(',')
        let param = columns.map(c => '@' + c).join(',');
        let sql = `INSERT OR IGNORE INTO user_collection (${columnsStr}) VALUES (${param})`;
        let result = this.db.prepare(sql).run(_collection);

        return { id: <number>result.lastInsertROWID, collection, addAt };
    }

    public removeSong(song: ISong): boolean {
        let sql = `DELETE FROM song WHERE songId = @songId AND songId NOT IN (SELECT songId FROM user_song WHERE songId = @songId)`;
        this.db.prepare(sql).run({ songId: song.songId });
        return true;
    }

    public deleteSong(song: ISong): boolean {
        let sql = `DELETE FROM user_song WHERE songId = ?`;
        this.db.prepare(sql).run(song.songId);

        // WARN: no remove song from `song` table, that song may be need by album or collection
        // this.removeSong(song);
        return true;
    }

    public deleteAlbum(album: IAlbum): boolean {
        let sql = `DELETE FROM user_album WHERE albumId = ?`;
        this.db.prepare(sql).run(album.albumId);

        album.songs.forEach(song => this.removeSong(song));
        return true;
    }

    public deleteArtist(artist: IArtist): boolean {
        let sql = `DELETE FROM user_artist WHERE artistId = ?`;
        this.db.prepare(sql).run(artist.artistId);
        return true;
    }

    public deleteCollection(collection: ICollection): boolean {
        let sql = `DELETE FROM user_collection WHERE collectionId = ?`;
        this.db.prepare(sql).run(collection.collectionId);

        collection.songs.forEach(song => this.removeSong(song));
        return true;
    }

    public exists(item: ISong | IArtist | IAlbum | ICollection): boolean {
        let sql = `select 'id' from ${TABLES[item.type]} where ${item.type}Id = ?`;
        let result = this.db.prepare(sql).get(item[item.type + 'Id']);
        return !!result;
    }
}
