'use strict';

import { getOrigin, ORIGIN, isOriginAlive } from 'chord/music/common/origin';

import { deepCopy } from 'chord/base/common/objects';
import { md5 } from 'chord/base/node/crypto';

import { IAudio } from 'chord/music/api/audio';
import { ISong } from 'chord/music/api/song';
import { ILyric } from 'chord/music/api/lyric';
import { IAlbum } from 'chord/music/api/album';
import { IArtist } from 'chord/music/api/artist';
import { ICollection } from 'chord/music/api/collection';
import { IListOption } from 'chord/music/api/listOption';
import { TMusicItems } from 'chord/music/api/items';

import { IUserProfile, IAccount } from 'chord/music/api/user';

import { appConfiguration } from 'chord/preference/configuration/app';

import { ESize } from 'chord/music/common/size';

import { AliMusicApi } from 'chord/music/xiami/api';
import { NeteaseMusicApi } from 'chord/music/netease/api';
import { QQMusicApi } from 'chord/music/qq/api';
import { QianQianApi } from 'chord/music/qianqian/api';
import { MiguMusicApi } from 'chord/music/migu/api';
import { KuwoMusicApi } from 'chord/music/kuwo/api';
import { SpotifyMusicApi } from 'chord/music/spotify/api';

import { cache12, cache30 } from 'chord/base/common/lru';

import { userConfiguration } from 'chord/preference/configuration/user';

import { makeItem, makeItems } from 'chord/music/core/parser';

import { insertMerge } from 'chord/base/common/algorithms';


export class Music {

    xiamiApi: AliMusicApi;
    neteaseApi: NeteaseMusicApi;
    qqApi: QQMusicApi;
    qianqianApi: QianQianApi;
    miguApi: MiguMusicApi;
    kuwoApi: KuwoMusicApi;
    spotifyApi: SpotifyMusicApi;


    constructor() {
        // WARNING: Xiami has shutdown its server
        // initiate xiami api
        // let xiamiApi = new AliMusicApi();
        // xiamiApi.setUserId('1');
        // this.xiamiApi = xiamiApi;
        this.xiamiApi = null;

        // initiate netease api
        this.neteaseApi = new NeteaseMusicApi();

        // initiate qq api
        this.qqApi = new QQMusicApi();

        // initiate qianqian api
        this.qianqianApi = new QianQianApi();

        // initiate migu api
        this.miguApi = new MiguMusicApi();

        // initiate kuwo api
        this.kuwoApi = new KuwoMusicApi();

        // initiate spotify api
        this.spotifyApi = new SpotifyMusicApi();

        // set user configuration
        let userConfig = userConfiguration.getConfig();
        // this.setAccount(userConfig.xiami && userConfig.xiami.account);
        this.setAccount(userConfig.netease && userConfig.netease.account);
        this.setAccount(userConfig.qq && userConfig.qq.account);
    }


    public isOriginOn(origin: string): boolean {
        if (!isOriginAlive(origin as ORIGIN)) {
            return false;
        }
        let config = appConfiguration.getConfig();
        return config.origins[origin];
    }


    /**
     * Clean one music api
     */
    public clean(origin: string): void {
        switch (origin) {
            case ORIGIN.xiami:
                this.xiamiApi = new AliMusicApi();
                this.xiamiApi.setUserId('1');
                break;
            case ORIGIN.netease:
                this.neteaseApi = new NeteaseMusicApi();
                break;
            case ORIGIN.qq:
                this.qqApi = new QQMusicApi();
                break;
            case ORIGIN.qianqian:
                this.qianqianApi = new QianQianApi();
                break;
            case ORIGIN.migu:
                this.miguApi = new MiguMusicApi();
                break;
            case ORIGIN.kuwo:
                this.kuwoApi = new KuwoMusicApi();
                break;
            case ORIGIN.spotify:
                this.spotifyApi = new SpotifyMusicApi();
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.clean] Here will never be occured. [args]: ${origin}`);
        }
    }


    /**
     * audioId is Chord's audio id, not audio original id
     */
    public async audios(songId: string, songMediaMid?: string, supKbps?: number): Promise<Array<IAudio>> {
        let h = md5(`music.core.api.audios(${songId})`);
        let result = cache30.get(h);
        if (result) return deepCopy(result);

        let originType = getOrigin(songId);
        switch (originType.origin) {
            case ORIGIN.xiami:
                result = await this.xiamiApi.audios(originType.id, supKbps);
                break;
            case ORIGIN.netease:
                result = await this.neteaseApi.audios(originType.id, supKbps);
                break;
            case ORIGIN.qq:
                result = await this.qqApi.audios(originType.id, supKbps);
                break;
            case ORIGIN.qianqian:
                result = await this.qianqianApi.audios(originType.id, supKbps);
                break;
            case ORIGIN.migu:
                result = await this.miguApi.audios(originType.id, songMediaMid, supKbps);
                break;
            case ORIGIN.kuwo:
                result = await this.kuwoApi.audios(originType.id, supKbps);
                break;
            case ORIGIN.spotify:
                result = await this.spotifyApi.audios(originType.id, supKbps);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.audio] Here will never be occured. [args]: ${songId}`);
        }

        cache30.set(h, result);
        return deepCopy(result);
    }


    /**
     * songId is Chord's song id, not song original id
     */
    public async song(songId: string): Promise<ISong> {
        let h = md5(`music.core.api.song(${songId})`);
        let result = cache12.get(h);
        result = makeItem(result);
        if (result) return result;

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
            case ORIGIN.qianqian:
                song = await this.qianqianApi.song(originType.id);
                break;
            case ORIGIN.migu:
                song = await this.miguApi.song(originType.id);
                break;
            case ORIGIN.kuwo:
                song = await this.kuwoApi.song(originType.id);
                break;
            case ORIGIN.spotify:
                song = await this.spotifyApi.song(originType.id);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.song] Here will never be occured. [args]: ${songId}`);
        }
        result = makeItem(song);

        cache12.set(h, result);
        return result;
    }


    public async lyric(songId: string, song?: ISong): Promise<ILyric> {
        let h = md5(`music.core.api.lyric(${songId})`);
        let result = cache12.get(h);
        if (result) return result;

        let lyric;
        let originType = getOrigin(songId);
        switch (originType.origin) {
            case ORIGIN.xiami:
                lyric = await this.xiamiApi.lyric(originType.id, song);
                break;
            case ORIGIN.netease:
                lyric = await this.neteaseApi.lyric(originType.id);
                break;
            case ORIGIN.qq:
                lyric = await this.qqApi.lyric(originType.id, song.songMid);
                break;
            case ORIGIN.qianqian:
                lyric = await this.qianqianApi.lyric(originType.id, song);
                break;
            case ORIGIN.migu:
                lyric = await this.miguApi.lyric(originType.id);
                break;
            case ORIGIN.kuwo:
                lyric = await this.kuwoApi.lyric(originType.id);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.lyric] Here will never be occured. [args]: ${songId}`);
        }
        result = lyric;

        cache12.set(h, result);
        return result;
    }


    /**
     * artistId is Chord's artist id, not artist original id
     */
    public async artist(artistId: string): Promise<IArtist> {
        let h = md5(`music.core.api.artist(${artistId})`);
        let result = cache12.get(h);
        result = makeItem(result);
        if (result) return result;

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
            case ORIGIN.qianqian:
                artist = await this.qianqianApi.artist(originType.id);
                break;
            case ORIGIN.migu:
                artist = await this.miguApi.artist(originType.id);
                break;
            case ORIGIN.kuwo:
                artist = await this.kuwoApi.artist(originType.id);
                break;
            case ORIGIN.spotify:
                artist = await this.spotifyApi.artist(originType.id);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.artist] Here will never be occured. [args]: ${artistId}`);
        }
        result = makeItem(artist);

        cache12.set(h, result);
        return result;
    }


    /**
     * artistId is Chord's artist id, not artist original id
     */
    public async artistSongs(artistId: string, offset: number = 0, limit: number = 10, artistMid?: string): Promise<Array<ISong>> {
        let h = md5(`music.core.api.artistSongs(${artistId}, ${offset}, ${limit})`);
        let result = cache12.get(h);
        result = makeItems(result);
        if (result) return result;

        let songs = [];
        let originType = getOrigin(artistId);
        switch (originType.origin) {
            case ORIGIN.xiami:
                songs = await this.xiamiApi.artistSongs(originType.id, offset, limit);
                break;
            case ORIGIN.netease:
                songs = await this.neteaseApi.artistSongs(originType.id, offset, limit);
                break;
            case ORIGIN.qq:
                songs = await this.qqApi.artistSongs(artistMid, offset, limit);
                break;
            case ORIGIN.qianqian:
                songs = await this.qianqianApi.artistSongs(originType.id, offset, limit);
                break;
            case ORIGIN.migu:
                songs = await this.miguApi.artistSongs(originType.id, offset, limit);
                break;
            case ORIGIN.kuwo:
                songs = await this.kuwoApi.artistSongs(originType.id, offset, limit);
                break;
            case ORIGIN.spotify:
                songs = await this.spotifyApi.artistSongs(originType.id, offset, limit);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.artistSongs] Here will never be occured. [args]: ${artistId}`);
        }
        result = makeItems(songs);

        cache12.set(h, result);
        return result;
    }


    /**
     * artistId is Chord's artist id, not artist original id
     */
    public async artistAlbums(artistId: string, offset: number = 0, limit: number = 10, artistMid?: string): Promise<Array<IAlbum>> {
        let h = md5(`music.core.api.artistAlbums(${artistId}, ${offset}, ${limit}, ${artistMid})`);
        let result = cache12.get(h);
        result = makeItems(result);
        if (result) return result;

        let albums = [];
        let originType = getOrigin(artistId);
        switch (originType.origin) {
            case ORIGIN.xiami:
                albums = await this.xiamiApi.artistAlbums(originType.id, offset, limit);
                break;
            case ORIGIN.netease:
                albums = await this.neteaseApi.artistAlbums(originType.id, offset, limit);
                break;
            // there needs qq's mid
            case ORIGIN.qq:
                albums = await this.qqApi.artistAlbums(artistMid, offset, limit);
                break;
            case ORIGIN.qianqian:
                albums = await this.qianqianApi.artistAlbums(originType.id, offset, limit);
                break;
            case ORIGIN.migu:
                albums = await this.miguApi.artistAlbums(originType.id, offset, limit);
                break;
            case ORIGIN.kuwo:
                albums = await this.kuwoApi.artistAlbums(originType.id, offset, limit);
                break;
            case ORIGIN.spotify:
                albums = await this.spotifyApi.artistAlbums(originType.id, offset, limit);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.artistAlbums] Here will never be occured. [args]: ${artistId}`);
        }
        result = makeItems(albums);

        cache12.set(h, result);
        return result;
    }


    /**
     * albumId is Chord's album id, not album original id
     */
    public async album(albumId: string): Promise<IAlbum> {
        let h = md5(`music.core.api.album(${albumId})`);
        let result = cache12.get(h);
        result = makeItem(result);
        if (result) return result;

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
            case ORIGIN.qianqian:
                album = await this.qianqianApi.album(originType.id);
                break;
            case ORIGIN.migu:
                album = await this.miguApi.album(originType.id);
                break;
            case ORIGIN.kuwo:
                album = await this.kuwoApi.album(originType.id);
                break;
            case ORIGIN.spotify:
                album = await this.spotifyApi.album(originType.id);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.album] Here will never be occured. [args]: ${albumId}`);
        }
        result = makeItem(album);

        cache12.set(h, result);
        return result;
    }


    /**
     * collectionId is Chord's collection id, not collection original id
     */
    public async collection(collectionId: string, offset: number = 0, limit: number = 1000): Promise<ICollection> {
        let h = md5(`music.core.api.collection(${collectionId}, ${offset}, ${limit})`);
        let result = cache12.get(h);
        result = makeItem(result);
        if (result) return result;

        let collection;
        let originType = getOrigin(collectionId);
        switch (originType.origin) {
            case ORIGIN.xiami:
                collection = await this.xiamiApi.collection(originType.id, offset, limit);
                break;
            case ORIGIN.netease:
                collection = await this.neteaseApi.collection(originType.id);
                break;
            case ORIGIN.qq:
                collection = await this.qqApi.collection(originType.id, offset, limit);
                break;
            case ORIGIN.qianqian:
                collection = await this.qianqianApi.collection(originType.id, offset, limit);
                break;
            case ORIGIN.migu:
                collection = await this.miguApi.collection(originType.id, offset);
                break;
            case ORIGIN.kuwo:
                collection = await this.kuwoApi.collection(originType.id, offset, limit);
                break;
            case ORIGIN.spotify:
                collection = await this.spotifyApi.collection(originType.id, limit);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.collection] Here will never be occured. [args]: ${collectionId}`);
        }
        result = makeItem(collection);

        cache12.set(h, result);
        return result;
    }


    /**
     * xiami searching based on page
     */
    public async searchSongs(keyword: string, offset: number = 0, limit: number = 10): Promise<Array<ISong>> {
        let h = md5(`music.core.api.searchSongs(${keyword}, ${offset}, ${limit})`);
        let result = cache12.get(h);
        result = makeItems(result);
        if (result) return result;

        let list = await Promise.all([
            this.isOriginOn(ORIGIN.xiami) ? this.xiamiApi.searchSongs(keyword, offset + 1, limit) : [],
            this.isOriginOn(ORIGIN.netease) ? this.neteaseApi.searchSongs(keyword, offset * limit, limit) : [],
            this.isOriginOn(ORIGIN.qq) ? this.qqApi.searchSongs(keyword, offset * limit, limit) : [],
            this.isOriginOn(ORIGIN.qianqian) ? this.qianqianApi.searchSongs(keyword, offset * limit, limit) : [],
            this.isOriginOn(ORIGIN.migu) ? this.miguApi.searchSongs(keyword, offset + 1, limit) : [],
            this.isOriginOn(ORIGIN.kuwo) ? this.kuwoApi.searchSongs(keyword, offset + 1, limit) : [],
            this.isOriginOn(ORIGIN.spotify) ? this.spotifyApi.searchSongs(keyword, offset + 1, limit) : [],
        ]);

        let items = insertMerge(list);

        result = makeItems(items);

        cache12.set(h, result);
        return result;
    }


    public async searchArtists(keyword: string, offset: number = 0, limit: number = 10): Promise<Array<IArtist>> {
        let h = md5(`music.core.api.searchArtists(${keyword}, ${offset}, ${limit})`);
        let result = cache12.get(h);
        result = makeItems(result);
        if (result) return result;

        let list = await Promise.all([
            this.isOriginOn(ORIGIN.xiami) ? this.xiamiApi.searchArtists(keyword, offset + 1, limit) : [],
            this.isOriginOn(ORIGIN.netease) ? this.neteaseApi.searchArtists(keyword, offset * limit, limit) : [],
            this.isOriginOn(ORIGIN.qq) ? this.qqApi.searchArtists(keyword, offset * limit, limit) : [],
            this.isOriginOn(ORIGIN.qianqian) ? this.qianqianApi.searchArtists(keyword, offset * limit, limit) : [],
            this.isOriginOn(ORIGIN.migu) ? this.miguApi.searchArtists(keyword, offset + 1, limit) : [],
            this.isOriginOn(ORIGIN.kuwo) ? this.kuwoApi.searchArtists(keyword, offset + 1, limit) : [],
            this.isOriginOn(ORIGIN.spotify) ? this.spotifyApi.searchArtists(keyword, offset + 1, limit) : [],
        ]);

        let items = insertMerge(list);

        result = makeItems(items);

        cache12.set(h, result);
        return result;
    }


    public async searchAlbums(keyword: string, offset: number = 0, limit: number = 10): Promise<Array<IAlbum>> {
        let h = md5(`music.core.api.searchAlbums(${keyword}, ${offset}, ${limit})`);
        let result = cache12.get(h);
        result = makeItems(result);
        if (result) return result;

        let list = await Promise.all([
            this.isOriginOn(ORIGIN.xiami) ? this.xiamiApi.searchAlbums(keyword, offset + 1, limit) : [],
            this.isOriginOn(ORIGIN.netease) ? this.neteaseApi.searchAlbums(keyword, offset * limit, limit) : [],
            this.isOriginOn(ORIGIN.qq) ? this.qqApi.searchAlbums(keyword, offset * limit, limit) : [],
            this.isOriginOn(ORIGIN.qianqian) ? this.qianqianApi.searchAlbums(keyword, offset * limit, limit) : [],
            this.isOriginOn(ORIGIN.migu) ? this.miguApi.searchAlbums(keyword, offset + 1, limit) : [],
            this.isOriginOn(ORIGIN.kuwo) ? this.kuwoApi.searchAlbums(keyword, offset + 1, limit) : [],
            this.isOriginOn(ORIGIN.spotify) ? this.spotifyApi.searchAlbums(keyword, offset + 1, limit) : [],
        ]);

        let items = insertMerge(list);

        result = makeItems(items);

        cache12.set(h, result);
        return result;
    }


    public async searchCollections(keyword: string, offset: number = 0, limit: number = 10): Promise<Array<ICollection>> {
        let h = md5(`music.core.api.searchCollections(${keyword}, ${offset}, ${limit})`);
        let result = cache12.get(h);
        result = makeItems(result);
        if (result) return result;

        let list = await Promise.all([
            this.isOriginOn(ORIGIN.xiami) ? this.xiamiApi.searchCollections(keyword, offset + 1, limit) : [],
            this.isOriginOn(ORIGIN.netease) ? this.neteaseApi.searchCollections(keyword, offset * limit, limit) : [],
            this.isOriginOn(ORIGIN.qq) ? this.qqApi.searchCollections(keyword, offset * limit, limit) : [],
            this.isOriginOn(ORIGIN.qianqian) ? this.qianqianApi.searchCollections(keyword, offset * limit, limit) : [],
            this.isOriginOn(ORIGIN.migu) ? this.miguApi.searchCollections(keyword, offset + 1, limit) : [],
            this.isOriginOn(ORIGIN.kuwo) ? this.kuwoApi.searchCollections(keyword, offset + 1, limit) : [],
            this.isOriginOn(ORIGIN.spotify) ? this.spotifyApi.searchCollections(keyword, offset + 1, limit) : [],
        ]);

        let items = insertMerge(list);

        result = makeItems(items);

        cache12.set(h, result);
        return result;
    }


    public async albumListOptions(origin: string): Promise<Array<IListOption>> {
        let h = md5(`music.core.api.albumListOptions(${origin})`);
        let result = cache12.get(h);
        if (result) return result;

        let items = [];
        switch (origin) {
            case ORIGIN.xiami:
                // items = await this.xiamiApi.albumListOptions();
                break;
            case ORIGIN.netease:
                items = [];
                break;
            case ORIGIN.qq:
                items = await this.qqApi.albumListOptions();
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.albumListOptions] Here will never be occured. [args]: ${origin}`);
        }

        result = items;

        cache12.set(h, result);
        return result;
    }


    public async albumList(origin: string, order: string, area: string, genre: string, type: string, year: string, company: string, offset: number = 0, limit: number = 10): Promise<Array<IAlbum>> {
        let h = md5(`music.core.api.albumList(${origin}, ${order}, ${area}, ${genre}, ${type}, ${year}, ${company}, ${offset}, ${limit})`);
        let result = cache12.get(h);
        result = makeItems(result);
        if (result) return result;

        let items = [];
        switch (origin) {
            case ORIGIN.xiami:
                // items = await this.xiamiApi.albumList(
                //     Number.parseInt(order),
                //     Number.parseInt(area),
                //     Number.parseInt(genre),
                //     Number.parseInt(year),
                //     Number.parseInt(type),
                //     offset,
                //     limit);
                break;
            case ORIGIN.netease:
                items = [];
                break;
            case ORIGIN.qq:
                items = await this.qqApi.albumList(
                    Number.parseInt(order),
                    Number.parseInt(area),
                    Number.parseInt(genre),
                    Number.parseInt(type),
                    Number.parseInt(year),
                    Number.parseInt(company),
                    offset,
                    limit);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.albumList] Here will never be occured. [args]: ${origin}, ${order}, ${area}, ${genre}, ${type}, ${year}, ${company}, ${offset}, ${limit}`);
        }

        result = makeItems(items);

        cache12.set(h, result);
        return result;
    }


    public collectionListOrders(origin: string): Array<{ name: string, id: string }> {
        let items = [];
        switch (origin) {
            case ORIGIN.xiami:
                // items = this.xiamiApi.collectionListOrders();
                break;
            case ORIGIN.netease:
                items = this.neteaseApi.collectionListOrders();
                break;
            case ORIGIN.qq:
                items = this.qqApi.collectionListOrders();
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.collectionListOrders] Here will never be occured. [args]: ${origin}`);
        }

        return items;
    }


    public async collectionListOptions(origin: string): Promise<Array<IListOption>> {
        let h = md5(`music.core.api.collectionListOptions(${origin})`);
        let result = cache12.get(h);
        if (result) return result;

        let items = [];
        switch (origin) {
            case ORIGIN.xiami:
                // items = await this.xiamiApi.collectionListOptions();
                break;
            case ORIGIN.netease:
                items = await this.neteaseApi.collectionListOptions();
                break;
            case ORIGIN.qq:
                items = await this.qqApi.collectionListOptions();
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.collectionListOptions] Here will never be occured. [args]: ${origin}`);
        }

        result = items;

        cache12.set(h, result);
        return result;
    }


    public async collectionList(origin: string, keyword: string, order: string, offset: number = 0, limit: number = 10): Promise<Array<ICollection>> {
        let h = md5(`music.core.api.collectionList(${origin}, ${keyword}, ${order}, ${offset}, ${limit})`);
        let result = cache12.get(h);
        result = makeItems(result);
        if (result) return result;

        let items = [];
        switch (origin) {
            case ORIGIN.xiami:
                // items = await this.xiamiApi.collectionList(keyword, order, offset, limit);
                break;
            case ORIGIN.netease:
                items = await this.neteaseApi.collectionList(keyword, order, offset, limit);
                break;
            case ORIGIN.qq:
                items = await this.qqApi.collectionList(order, keyword, offset, limit);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.collectionList] Here will never be occured. [args]: ${origin}, ${keyword}, ${order}, ${offset}, ${limit}`);
        }

        result = makeItems(items);

        cache12.set(h, result);
        return result;
    }


    public async artistList(origin: string, area: string, genre: string, gender: string, index: string, offset: number = 0, limit: number = 40): Promise<any> {
        let h = md5(`music.core.api.artistList(${origin}, ${area}, ${genre}, ${gender}, ${index}, ${offset}, ${limit})`);
        let result = cache12.get(h);
        if (origin == ORIGIN.xiami) {
            result[0] = makeItems(result[0]);
        } else {
            result = makeItems(result);
        }
        if (result) return result;

        let items = [];
        switch (origin) {
            case ORIGIN.xiami:
                // items = await this.xiamiApi.artistList(area, genre, gender, offset, limit);
                // items[0] = makeItems(items[0]);
                break;
            case ORIGIN.netease:
                items = await this.neteaseApi.artistList(genre, index, offset, limit);
                items = makeItems(items);
                break;
            case ORIGIN.qq:
                items = await this.qqApi.artistList(area, genre, gender, index, offset, limit);
                items = makeItems(items);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.artistList] Here will never be occured. [args]: ${origin}, ${area}, ${genre}, ${gender}, ${index}, ${offset}, ${limit}`);
        }

        cache12.set(h, result);
        return result;
    }


    public async newSongs(origin: string, offset: number = 0, limit: number = 10): Promise<Array<ISong>> {
        let h = md5(`music.core.api.newSongs(${origin}, ${offset}, ${limit})`);
        let result = cache12.get(h);
        result = makeItems(result);
        if (result) return result;

        let items = [];
        switch (origin) {
            case ORIGIN.xiami:
                // items = await this.xiamiApi.newSongs(offset, limit);
                break;
            case ORIGIN.netease:
                items = await this.neteaseApi.newSongs(offset, limit);
                break;
            case ORIGIN.qq:
                items = await this.qqApi.newSongs(offset, limit);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.newSongs] Here will never be occured. [args]: ${origin}`);
        }

        result = makeItems(items);

        cache12.set(h, result);
        return result;
    }


    public async newAlbums(origin: string, offset: number = 0, limit: number = 10): Promise<Array<IAlbum>> {
        let h = md5(`music.core.api.newAlbums(${origin}, ${offset}, ${limit})`);
        let result = cache12.get(h);
        result = makeItems(result);
        if (result) return result;

        let items = [];
        switch (origin) {
            case ORIGIN.xiami:
                // items = await this.xiamiApi.newAlbums(offset, limit);
                break;
            case ORIGIN.netease:
                items = await this.neteaseApi.newAlbums(offset, limit);
                break;
            case ORIGIN.qq:
                items = await this.qqApi.newAlbums(offset, limit);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.newAlbums] Here will never be occured. [args]: ${origin}`);
        }

        result = makeItems(items);

        cache12.set(h, result);
        return result;
    }


    public async newCollections(origin: string, offset: number = 0, limit: number = 10): Promise<Array<ICollection>> {
        let h = md5(`music.core.api.newCollections(${origin}, ${offset}, ${limit})`);
        let result = cache12.get(h);
        if (result) return result;

        let items = [];
        switch (origin) {
            case ORIGIN.xiami:
                // items = await this.xiamiApi.newCollections(offset, limit);
                break;
            case ORIGIN.netease:
                items = await this.neteaseApi.newCollections(offset, limit);
                break;
            case ORIGIN.qq:
                items = await this.qqApi.newCollections(offset, limit);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.newCollections] Here will never be occured. [args]: ${origin}`);
        }

        result = makeItems(items);

        cache12.set(h, result);
        return result;
    }


    public async login(origin: string, accountName: string, password: string): Promise<IAccount> {
        let account: IAccount;
        switch (origin) {
            case ORIGIN.xiami:
                // account = await this.xiamiApi.login(accountName, password);
                // this.xiamiApi.setAccount(account);
                break;
            case ORIGIN.netease:
                account = await this.neteaseApi.login(accountName, password);
                // account = await this.neteaseApi.login();
                this.neteaseApi.setAccount(account);
                break;
            case ORIGIN.qq:
                account = await this.qqApi.login();
                this.qqApi.setAccount(account);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.login] Here will never be occured. [args]: ${origin}, ${accountName}`);
        }
        return account;
    }


    /**
     * Check whether logined
     */
    public logined(origin: string): boolean {
        switch (origin) {
            case ORIGIN.xiami:
                // return this.xiamiApi.logined();
                return false;
            case ORIGIN.netease:
                return this.neteaseApi.logined();
            case ORIGIN.qq:
                return this.qqApi.logined();
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.logined] Here will never be occured. [args]: ${origin}`);
        }
    }


    public setAccount(account: IAccount): void {
        if (!account) { return; }

        let origin = account.user.origin;
        switch (origin) {
            case ORIGIN.xiami:
                // this.xiamiApi.setAccount(account);
                break;
            case ORIGIN.netease:
                this.neteaseApi.setAccount(account);
                break;
            case ORIGIN.qq:
                this.qqApi.setAccount(account);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.login] Here will never be occured. [args]: ${origin}, ${account}`);
        }
    }


    /**
     * here, the userId is IUserProfile.userId
     */
    public async userProfile(userId: string, userMid?: string, userName?: string): Promise<IUserProfile> {
        let h = md5(`music.core.api.userProfile(${userId}, ${userMid}, ${userName})`);
        let result = cache12.get(h);
        result = makeItem(result);
        if (result) return result;

        let userProfile;
        let originType = getOrigin(userId);
        switch (originType.origin) {
            case ORIGIN.xiami:
                // userProfile = await this.xiamiApi.userProfile(originType.id);
                break;
            case ORIGIN.netease:
                userProfile = await this.neteaseApi.userProfile(originType.id);
                break;
            case ORIGIN.qq:
                userProfile = await this.qqApi.userProfile(userId && userMid);
                break;
            case ORIGIN.qianqian:
                userProfile = await this.qianqianApi.userProfile(userName);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.login] Here will never be occured. [args]: ${userId}`);
        }
        result = makeItem(userProfile);

        cache12.set(h, result);
        return result;
    }


    /**
     * here, the userId is IUserProfile.userId
     */
    public async userFavoriteSongs(userId: string, offset: number = 0, limit: number = 10, userMid?: string): Promise<Array<ISong>> {
        let h = md5(`music.core.api.userFavoriteSongs(${userId}, ${offset}, ${limit}, ${userMid})`);
        let result = cache12.get(h);
        result = makeItems(result);
        if (result) return result;

        let songs = [];
        let originType = getOrigin(userId);
        switch (originType.origin) {
            case ORIGIN.xiami:
                // songs = await this.xiamiApi.userFavoriteSongs(originType.id, offset, limit);
                break;
            // netease only give favorite collections
            case ORIGIN.netease:
                songs = await this.neteaseApi.userFavoriteSongs(originType.id, offset, limit);
                break;
            case ORIGIN.qq:
                songs = await this.qqApi.userFavoriteSongs(userMid, offset, limit);
                break;
            case ORIGIN.qianqian:
                songs = await this.qianqianApi.userFavoriteSongs(originType.id, offset, limit);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.userFavoriteSongs] Here will never be occured. [args]: ${userId}`);
        }
        result = makeItems(songs);

        cache12.set(h, result);
        return result;
    }


    public async userFavoriteAlbums(userId: string, offset: number = 0, limit: number = 10, userMid?: string): Promise<Array<IAlbum>> {
        let h = md5(`music.core.api.userFavoriteAlbums(${userId}, ${offset}, ${limit}, ${userMid})`);
        let result = cache12.get(h);
        result = makeItems(result);
        if (result) return result;

        let albums = [];
        let originType = getOrigin(userId);
        switch (originType.origin) {
            case ORIGIN.xiami:
                // albums = await this.xiamiApi.userFavoriteAlbums(originType.id, offset, limit);
                break;
            // netease only give favorite collections
            case ORIGIN.netease:
                albums = [];
                break;
            case ORIGIN.qq:
                albums = await this.qqApi.userFavoriteAlbums(userMid, offset, limit);
                break;
            case ORIGIN.qianqian:
                albums = await this.qianqianApi.userFavoriteAlbums(originType.id, offset, limit);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.userFavoriteAlbums] Here will never be occured. [args]: ${userId}`);
        }
        result = makeItems(albums);

        cache12.set(h, result);
        return result;
    }


    public async userFavoriteArtists(userId: string, offset: number = 0, limit: number = 10, userMid?: string): Promise<Array<IArtist>> {
        let h = md5(`music.core.api.userFavoriteArtists(${userId}, ${offset}, ${limit}, ${userMid})`);
        let result = cache12.get(h);
        result = makeItems(result);
        if (result) return result;

        let artists = [];
        let originType = getOrigin(userId);
        switch (originType.origin) {
            case ORIGIN.xiami:
                // artists = await this.xiamiApi.userFavoriteArtists(originType.id, offset, limit);
                break;
            case ORIGIN.netease:
                artists = await this.neteaseApi.userFavoriteArtists(originType.id, offset, limit);
                break;
            case ORIGIN.qq:
                artists = await this.qqApi.userFavoriteArtists(userMid, offset, limit);
                break;
            case ORIGIN.qianqian:
                artists = await this.qianqianApi.userFavoriteArtists(originType.id, offset, limit);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.userFavoriteArtists] Here will never be occured. [args]: ${userId}`);
        }
        result = makeItems(artists);

        cache12.set(h, result);
        return result;
    }


    public async userFavoriteCollections(userId: string, offset: number = 0, limit: number = 10, userMid?: string): Promise<Array<ICollection>> {
        let h = md5(`music.core.api.userFavoriteCollections(${userId}, ${offset}, ${limit}, ${userMid})`);
        let result = cache12.get(h);
        result = makeItems(result);
        if (result) return result;

        let collections = [];
        let originType = getOrigin(userId);
        switch (originType.origin) {
            case ORIGIN.xiami:
                // collections = await this.xiamiApi.userFavoriteCollections(originType.id, offset, limit);
                break;
            // netease only give favorite collections
            case ORIGIN.netease:
                collections = await this.neteaseApi.userFavoriteCollections(originType.id, offset, limit);
                break;
            case ORIGIN.qq:
                collections = await this.qqApi.userFavoriteCollections(userMid, offset, limit);
                break;
            case ORIGIN.qianqian:
                collections = await this.qianqianApi.userFavoriteCollections(originType.id, offset, limit);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.userFavoriteCollections] Here will never be occured. [args]: ${userId}`);
        }
        result = makeItems(collections);

        cache12.set(h, result);
        return result;
    }


    public async userCreatedCollections(userId: string, offset: number = 0, limit: number = 10, userMid?: string): Promise<Array<ICollection>> {
        let h = md5(`music.core.api.userCreatedCollections(${userId}, ${offset}, ${limit}, ${userMid})`);
        let result = cache12.get(h);
        result = makeItems(result);
        if (result) return result;

        let collections = [];
        let originType = getOrigin(userId);
        switch (originType.origin) {
            case ORIGIN.xiami:
                // collections = await this.xiamiApi.userCreatedCollections(originType.id, offset, limit);
                break;
            // netease only give favorite collections
            case ORIGIN.netease:
                collections = [];
                break;
            case ORIGIN.qq:
                collections = await this.qqApi.userCreatedCollections(userMid, offset, limit);
                break;
            case ORIGIN.qianqian:
                collections = await this.qianqianApi.userCreatedCollections(originType.id, offset, limit);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.userCreatedCollections] Here will never be occured. [args]: ${userId}`);
        }
        result = makeItems(collections);

        cache12.set(h, result);
        return result;
    }


    public async userFollowings(userId: string, offset: number = 0, limit: number = 10, userMid?: string): Promise<Array<IUserProfile>> {
        let h = md5(`music.core.api.userFollowings(${userId}, ${offset}, ${limit}, ${userMid})`);
        let result = cache12.get(h);
        result = makeItems(result);
        if (result) return result;

        let userProfiles = [];
        let originType = getOrigin(userId);
        switch (originType.origin) {
            case ORIGIN.xiami:
                // userProfiles = await this.xiamiApi.userFollowings(originType.id, offset, limit);
                break;
            // netease only give favorite collections
            case ORIGIN.netease:
                userProfiles = await this.neteaseApi.userFollowings(originType.id, offset, limit);
                break;
            case ORIGIN.qq:
                userProfiles = await this.qqApi.userFollowings(userMid, offset, limit);
                break;
            case ORIGIN.qianqian:
                userProfiles = await this.qianqianApi.userFollowings(originType.id, offset, limit);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.userFollowings] Here will never be occured. [args]: ${userId}`);
        }
        result = makeItems(userProfiles);

        cache12.set(h, result);
        return result;
    }


    public async userFollowers(userId: string, offset: number = 0, limit: number = 10, userMid?: string): Promise<Array<IUserProfile>> {
        let h = md5(`music.core.api.userFollowers(${userId}, ${offset}, ${limit}, ${userMid})`);
        let result = cache12.get(h);
        result = makeItems(result);
        if (result) return result;

        let userProfiles = [];
        let originType = getOrigin(userId);
        switch (originType.origin) {
            case ORIGIN.xiami:
                // userProfiles = await this.xiamiApi.userFollowers(originType.id, offset, limit);
                break;
            // netease only give favorite collections
            case ORIGIN.netease:
                userProfiles = await this.neteaseApi.userFollowers(originType.id, offset, limit);
                break;
            case ORIGIN.qq:
                userProfiles = await this.qqApi.userFollowers(userMid, offset, limit);
                break;
            case ORIGIN.qianqian:
                userProfiles = await this.qianqianApi.userFollowers(originType.id, offset, limit);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.userFollowers] Here will never be occured. [args]: ${userId}`);
        }
        result = makeItems(userProfiles);

        cache12.set(h, result);
        return result;
    }


    protected async userLikeOrDislike(funcName: string, itemId: string, itemMid?: string): Promise<boolean> {
        let result;
        let originType = getOrigin(itemId);
        switch (originType.origin) {
            case ORIGIN.xiami:
                // result = await this.xiamiApi[funcName](originType.id, itemMid);
                return false;
            // netease only give favorite collections
            case ORIGIN.netease:
                result = await this.neteaseApi[funcName](originType.id, itemMid);
                break;
            case ORIGIN.qq:
                result = await this.qqApi[funcName](originType.id, itemMid);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.userLikeOrDislike] Here will never be occured. [args]: ${funcName} ${itemId}`);
        }
        return result;
    }


    public async userLikeSong(itemId: string, itemMid?: string): Promise<boolean> {
        return this.userLikeOrDislike('userLikeSong', itemId, itemMid);
    }


    public async userLikeArtist(itemId: string, itemMid?: string): Promise<boolean> {
        return this.userLikeOrDislike('userLikeArtist', itemId, itemMid);
    }


    public async userLikeAlbum(itemId: string, itemMid?: string): Promise<boolean> {
        return this.userLikeOrDislike('userLikeAlbum', itemId, itemMid);
    }


    public async userLikeCollection(itemId: string, itemMid?: string): Promise<boolean> {
        return this.userLikeOrDislike('userLikeCollection', itemId, itemMid);
    }


    public async userLikeUserProfile(itemId: string, itemMid?: string): Promise<boolean> {
        return this.userLikeOrDislike('userLikeUserProfile', itemId, itemMid);
    }


    public async userDislikeSong(itemId: string, itemMid?: string): Promise<boolean> {
        return this.userLikeOrDislike('userDislikeSong', itemId, itemMid);
    }


    public async userDislikeArtist(itemId: string, itemMid?: string): Promise<boolean> {
        return this.userLikeOrDislike('userDislikeArtist', itemId, itemMid);
    }


    public async userDislikeAlbum(itemId: string, itemMid?: string): Promise<boolean> {
        return this.userLikeOrDislike('userDislikeAlbum', itemId, itemMid);
    }


    public async userDislikeCollection(itemId: string, itemMid?: string): Promise<boolean> {
        return this.userLikeOrDislike('userDislikeCollection', itemId, itemMid);
    }


    public async userDislikeUserProfile(itemId: string, itemMid?: string): Promise<boolean> {
        return this.userLikeOrDislike('userDislikeUserProfile', itemId, itemMid);
    }


    public async playLog(songId: string, seek: number, songMid?: string): Promise<boolean> {
        let result;
        let originType = getOrigin(songId);
        switch (originType.origin) {
            case ORIGIN.xiami:
                // result = await this.xiamiApi.playLog(originType.id, seek);
                break;
            case ORIGIN.netease:
                result = await this.neteaseApi.playLog(originType.id, seek);
                break;
            case ORIGIN.qq:
                result = await this.qqApi.playLog(originType.id, seek, songMid);
                break;
            case ORIGIN.qianqian:
            case ORIGIN.migu:
            case ORIGIN.kuwo:
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.playLog] Here will never be occured. [args]: ${songId} ${seek}`);
        }
        return result;
    }


    public async recommendSongs(origin: string, offset: number = 0, limit: number = 10): Promise<Array<ISong>> {
        let h = md5(`music.core.api.recommendSongs(${origin}, ${offset}, ${limit})`);
        let result = cache12.get(h);
        result = makeItems(result);
        if (result) {
            return result;
        } else {
            result = [];
        }

        switch (origin) {
            case ORIGIN.xiami:
                // result = await this.xiamiApi.recommendSongs(offset, limit);
                break;
            case ORIGIN.netease:
                result = await this.neteaseApi.recommendSongs(offset, limit);
                break;
            case ORIGIN.qq:
                result = await this.qqApi.recommendSongs(offset, limit);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.recommendSongs] Here will never be occured. [args]: ${origin}`);
        }

        result = makeItems(result);

        cache12.set(h, result);
        return result;
    }


    public async recommendCollections(origin: string, offset: number = 0, limit: number = 10): Promise<Array<ICollection>> {
        let h = md5(`music.core.api.recommendCollections(${origin}, ${offset}, ${limit})`);
        let result = cache12.get(h);
        result = makeItems(result);
        if (result) {
            return result;
        } else {
            result = [];
        }

        switch (origin) {
            case ORIGIN.xiami:
                // result = await this.xiamiApi.recommendCollections(offset, limit);
                break;
            case ORIGIN.netease:
                result = await this.neteaseApi.recommendCollections(offset, limit);
                break;
            case ORIGIN.qq:
                result = await this.qqApi.recommendCollections(offset, limit);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.recommendCollections] Here will never be occured. [args]: ${origin}`);
        }

        result = makeItems(result);

        cache12.set(h, result);
        return result;
    }


    public resizeImageUrl(origin: string, url: string | object, size: ESize | number): string {
        if (!url) { return null; }
        switch (origin) {
            case ORIGIN.xiami:
                return null;
            // return this.xiamiApi.resizeImageUrl(url, size);
            case ORIGIN.netease:
                return this.neteaseApi.resizeImageUrl(url as string, size);
            case ORIGIN.qq:
                return this.qqApi.resizeImageUrl(url as string, size);
            case ORIGIN.qianqian:
                return this.qianqianApi.resizeImageUrl(url as string, size);
            case ORIGIN.migu:
                return this.miguApi.resizeImageUrl(url as string, size);
            case ORIGIN.kuwo:
                return this.kuwoApi.resizeImageUrl(url as string, size);
            case ORIGIN.spotify:
                return this.spotifyApi.resizeImageUrl(url as Array<any>, size);
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.resizeImageUrl] Here will never be occured. [args]: ${url}`);
        }
    }


    /**
     * Get music items directly from urls
     */
    public async fromURL(input: string): Promise<Array<TMusicItems>> {
        let h = md5(`music.core.api.fromURL(${input})`);
        let result = cache12.get(h);
        result = makeItems(result);
        if (result) return result;

        let futs = [];
        let chunks = input.split(' ');
        for (let chunk of chunks) {
            if (chunk.includes('xiami')) {
                // futs.push(this.xiamiApi.fromURL(chunk));
            } else if (input.includes('163.com')) {
                futs.push(this.neteaseApi.fromURL(chunk));
            } else if (input.includes('qq.com')) {
                futs.push(this.qqApi.fromURL(chunk));
            } else if (input.includes('taihe.com')) {
                futs.push(this.qianqianApi.fromURL(chunk));
            } else if (input.includes('music.migu.cn')) {
                futs.push(this.miguApi.fromURL(chunk));
            } else if (input.includes('kuwo.cn')) {
                futs.push(this.kuwoApi.fromURL(chunk));
            }
        }
        if (futs.length == 0) return [];
        let list = await Promise.all(futs);
        result = makeItems([].concat(...list));

        cache12.set(h, result);
        return result;
    }
}


export const musicApi = new Music();
