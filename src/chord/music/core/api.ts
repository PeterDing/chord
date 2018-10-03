'use strict';

import { getOrigin, ORIGIN } from 'chord/music/common/origin';

import { IAudio } from 'chord/music/api/audio';
import { ISong } from 'chord/music/api/song';
import { IAlbum } from 'chord/music/api/album';
import { IArtist } from 'chord/music/api/artist';
import { ICollection } from 'chord/music/api/collection';

import { AliMusicApi } from 'chord/music/xiami/api';
import { NeteaseMusicApi } from 'chord/music/netease/api';
import { QQMusicApi } from 'chord/music/qq/api';

import { makeItem, makeItems } from 'chord/music/core/parser';


export class Music {

    xiamiApi: AliMusicApi;
    neteaseApi: NeteaseMusicApi;
    qqApi: QQMusicApi;


    constructor() {
        // initiate xiami api
        let xiamiApi = new AliMusicApi();
        xiamiApi.setUserId('1');
        this.xiamiApi = xiamiApi;

        // initiate netease api
        this.neteaseApi = new NeteaseMusicApi();

        // initiate qq api
        this.qqApi = new QQMusicApi();
    }


    /**
     * audioId is Chord's audio id, not audio original id
     */
    public async audios(songId: string): Promise<Array<IAudio>> {
        let originType = getOrigin(songId);
        switch (originType.origin) {
            case ORIGIN.xiami:
                return await this.xiamiApi.audios(originType.id);
            case ORIGIN.netease:
                return await this.neteaseApi.audios(originType.id);
            case ORIGIN.qq:
                return await this.qqApi.audios(originType.id);
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.audio] Here will never be occured. [args]: ${songId}`);
        }
    }


    /**
     * Get many songs' audios
     */
    public async songsAudios(songIds: Array<string>): Promise<Array<Array<IAudio>>> {
        let songsOriginType = songIds.map(songId => getOrigin(songId));
        let xiamiSongIds = songsOriginType.filter(originType => originType.origin == ORIGIN.xiami).reverse().map(originType => originType.id);
        let neteaseSongIds = songsOriginType.filter(originType => originType.origin == ORIGIN.netease).reverse().map(originType => originType.id);

        let [xiamiSongsAudios, neteaseSongsAudios] = await Promise.all([
            this.xiamiApi.songsAudios(xiamiSongIds),
            this.neteaseApi.songsAudios(neteaseSongIds)
        ]);

        let songsAudios = [];
        songsOriginType.forEach(originType => {
            let audios;
            switch (originType.origin) {
                case ORIGIN.xiami:
                    audios = xiamiSongsAudios.pop();
                    songsAudios.push(audios);
                    break;
                case ORIGIN.netease:
                    audios = neteaseSongsAudios.pop();
                    songsAudios.push(audios);
                    break;
                default:
                    // Here will never be occured.
                    throw new Error(`[ERROR] [Music.songsAudios] Here will never be occured. wrong originType: ${JSON.stringify(originType)}`);
            }
        });
        return songsAudios;
    }


    /**
     * songId is Chord's song id, not song original id
     */
    public async song(songId: string): Promise<ISong> {
        let song;
        let originType = getOrigin(songId);
        switch (originType.origin) {
            case ORIGIN.xiami:
                song = await this.xiamiApi.song(originType.id);
                break;
            case ORIGIN.netease:
                song = await this.neteaseApi.song(originType.id);
                break;
            case ORIGIN.qq:
                song = await this.qqApi.song(originType.id);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.song] Here will never be occured. [args]: ${songId}`);
        }
        song = makeItem(song);
        return song;
    }


    /**
     * artistId is Chord's artist id, not artist original id
     */
    public async artist(artistId: string): Promise<IArtist> {
        let artist;
        let originType = getOrigin(artistId);
        switch (originType.origin) {
            case ORIGIN.xiami:
                artist = await this.xiamiApi.artist(originType.id);
                break;
            case ORIGIN.netease:
                artist = await this.neteaseApi.artist(originType.id);
                break;
            case ORIGIN.qq:
                artist = await this.qqApi.artist(originType.id);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.artist] Here will never be occured. [args]: ${artistId}`);
        }
        artist = makeItem(artist);
        return artist;
    }


    /**
     * artistId is Chord's artist id, not artist original id
     */
    public async artistSongs(artistId: string, offset: number = 0, limit: number = 10): Promise<Array<ISong>> {
        let songs = [];
        let originType = getOrigin(artistId);
        switch (originType.origin) {
            case ORIGIN.xiami:
                songs = await this.xiamiApi.artistSongs(originType.id, offset + 1, limit);
                break;
            case ORIGIN.netease:
                songs = await this.neteaseApi.artistSongs(originType.id, offset * limit, limit);
                break;
            case ORIGIN.qq:
                songs = await this.qqApi.artistSongs(originType.id, offset * limit, limit);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.artistSongs] Here will never be occured. [args]: ${artistId}`);
        }
        songs = makeItems(songs);
        return songs;
    }


    /**
     * artistId is Chord's artist id, not artist original id
     */
    public async artistAlbums(artistId: string, offset: number = 0, limit: number = 10, artistMid?: string): Promise<Array<IAlbum>> {
        let albums = [];
        let originType = getOrigin(artistId);
        switch (originType.origin) {
            case ORIGIN.xiami:
                albums = await this.xiamiApi.artistAlbums(originType.id, offset + 1, limit);
                break;
            case ORIGIN.netease:
                albums = await this.neteaseApi.artistAlbums(originType.id, offset * limit, limit);
                break;
            // there needs qq's mid
            case ORIGIN.qq:
                albums = await this.qqApi.artistAlbums(artistMid, offset * limit, limit);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.artistAlbums] Here will never be occured. [args]: ${artistId}`);
        }
        albums = makeItems(albums);
        return albums;
    }


    /**
     * albumId is Chord's album id, not album original id
     */
    public async album(albumId: string): Promise<IAlbum> {
        let album;
        let originType = getOrigin(albumId);
        switch (originType.origin) {
            case ORIGIN.xiami:
                album = await this.xiamiApi.album(originType.id);
                break;
            case ORIGIN.netease:
                album = await this.neteaseApi.album(originType.id);
                break;
            case ORIGIN.qq:
                album = await this.qqApi.album(originType.id);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.album] Here will never be occured. [args]: ${albumId}`);
        }
        album = makeItem(album);
        return album;
    }


    /**
     * collectionId is Chord's collection id, not collection original id
     */
    public async collection(collectionId: string): Promise<ICollection> {
        let collection;
        let originType = getOrigin(collectionId);
        switch (originType.origin) {
            case ORIGIN.xiami:
                collection = await this.xiamiApi.collection(originType.id);
                break;
            case ORIGIN.netease:
                collection = await this.neteaseApi.collection(originType.id);
                break;
            case ORIGIN.qq:
                collection = await this.qqApi.collection(originType.id);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.collection] Here will never be occured. [args]: ${collectionId}`);
        }
        collection = makeItem(collection);
        return collection;
    }


    /**
     * xiami searching based on page
     */
    public async searchSongs(keyword: string, offset: number = 0, limit: number = 10): Promise<Array<ISong>> {
        let items = [];
        let [xiamiSongs, neteaseSongs, qqSongs] = await Promise.all([
            this.xiamiApi.searchSongs(keyword, offset + 1, limit),
            this.neteaseApi.searchSongs(keyword, offset * limit, limit),
            this.qqApi.searchSongs(keyword, offset * limit, limit),
        ]);

        let maxLength = Math.max(xiamiSongs.length, neteaseSongs.length);
        for (let index = 0; index < maxLength; index++) {
            let s1 = xiamiSongs[index];
            s1 ? items.push(s1) : null;
            let s2 = neteaseSongs[index];
            s2 ? items.push(s2) : null;
            let s3 = qqSongs[index];
            s3 ? items.push(s3) : null;
        }

        items = makeItems(items);
        return items;
    }


    public async searchArtists(keyword: string, offset: number = 0, limit: number = 10): Promise<Array<IArtist>> {
        let items = [];
        let [xiamiArtists, neteaseArtists] = await Promise.all([
            this.xiamiApi.searchArtists(keyword, offset + 1, limit),
            this.neteaseApi.searchArtists(keyword, offset * limit, limit),
        ]);
        // qq doesn't support to search artist

        let maxLength = Math.max(xiamiArtists.length, neteaseArtists.length);
        for (let index = 0; index < maxLength; index++) {
            let s1 = xiamiArtists[index];
            s1 ? items.push(s1) : null;
            let s2 = neteaseArtists[index];
            s2 ? items.push(s2) : null;
        }

        items = makeItems(items);
        return items;
    }


    public async searchAlbums(keyword: string, offset: number = 0, limit: number = 10): Promise<Array<IAlbum>> {
        let items = [];
        let [xiamiAlbums, neteaseAlbums, qqAlbums] = await Promise.all([
            this.xiamiApi.searchAlbums(keyword, offset + 1, limit),
            this.neteaseApi.searchAlbums(keyword, offset * limit, limit),
            this.qqApi.searchAlbums(keyword, offset * limit, limit),
        ]);

        let maxLength = Math.max(xiamiAlbums.length, neteaseAlbums.length);
        for (let index = 0; index < maxLength; index++) {
            let s1 = xiamiAlbums[index];
            s1 ? items.push(s1) : null;
            let s2 = neteaseAlbums[index];
            s2 ? items.push(s2) : null;
            let s3 = qqAlbums[index];
            s3 ? items.push(s3) : null;
        }

        items = makeItems(items);
        return items;
    }


    public async searchCollections(keyword: string, offset: number = 0, limit: number = 10): Promise<Array<ICollection>> {
        let items = [];
        let [xiamiCollections, neteaseCollections, qqCollections] = await Promise.all([
            this.xiamiApi.searchCollections(keyword, offset + 1, limit),
            this.neteaseApi.searchCollections(keyword, offset * limit, limit),
            this.qqApi.searchCollections(keyword, offset * limit, limit),
        ]);

        let maxLength = Math.max(xiamiCollections.length, neteaseCollections.length);
        for (let index = 0; index < maxLength; index++) {
            let s1 = xiamiCollections[index];
            s1 ? items.push(s1) : null;
            let s2 = neteaseCollections[index];
            s2 ? items.push(s2) : null;
            let s3 = qqCollections[index];
            s3 ? items.push(s3) : null;
        }

        items = makeItems(items);
        return items;
    }
}


export const musicApi = new Music();
