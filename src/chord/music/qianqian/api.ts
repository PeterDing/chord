'use strict';

import { Logger, LogLevel } from 'chord/platform/log/common/log';
import { filenameToNodeName } from 'chord/platform/utils/common/paths';
const loggerWarning = new Logger(filenameToNodeName(__filename), LogLevel.Warning);

import { querystringify } from 'chord/base/node/url';
import { request, IRequestOptions, htmlGet } from 'chord/base/node/_request';

import { IAudio } from 'chord/music/api/audio';
import { ISong } from 'chord/music/api/song';
import { ILyric } from 'chord/music/api/lyric';
import { IAlbum } from 'chord/music/api/album';
import { IArtist } from 'chord/music/api/artist';
import { ICollection } from 'chord/music/api/collection';
import { TMusicItems } from 'chord/music/api/items';

import { IUserProfile } from 'chord/music/api/user';

import { ESize, resizeImageUrl } from 'chord/music/common/size';

import { encryptParams, encryptPass } from 'chord/music/qianqian/crypto';

import {
    makeLyric,
    makeSong,
    makeSongs,
    makeAlbum,
    makeAlbums,
    makeArtist,
    makeArtists,
    makeCollection,
    makeCollections,
    makeUserProfile,
    makeUserProfiles,
} from 'chord/music/qianqian/parser';


const CURL_HEADERS = {
    'User-Agent': 'curl/7.65.1',
    'Accept': '*/*',
};


export class QianQianApi {

    static readonly HEADERS = {
        'Connection': 'keep-alive',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) baidu-music/1.2.6 Chrome/66.0.3359.181 Electron/3.0.5 Safari/537.36',
        'Content-Type': 'application/json;charset=UTF-8',
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'en-US',
    };

    static readonly BASICURL = 'http://music.taihe.com/';

    static readonly SERVER = 'http://musicapi.taihe.com/v1/restserver/ting';

    static readonly AUDIO = 'http://music.taihe.com/data/music/fmlink';

    static readonly NODE_MAP = {
        audio: 'baidu.ting.song.getInfos',
        song: 'baidu.ting.song.baseInfo',
        album: 'baidu.ting.album.getAlbumInfo',
        artist: 'baidu.ting.artist.getInfo',
        artistSongs: 'baidu.ting.artist.getSongList',
        artistAlbums: 'baidu.ting.artist.getAlbumList',
        collection: 'baidu.ting.ugcdiy.getBaseInfo',
        collectionSongs: 'baidu.ting.ugcdiy.listSong',
        search: 'baidu.ting.search.merge',
        userProfile: 'baidu.ting.ugccenter.getUserBaseInfo',
        userFavoriteAlbums: 'baidu.ting.ugcdiy.userList',
        userFavoriteArtists: 'baidu.ting.ugcdiy.userList',
        userFavoriteCollections: 'baidu.ting.ugcdiy.userList',
        userCreatedCollections: 'baidu.ting.ugcdiy.userList',
        userFollowers: 'baidu.ting.ugcfriend.getFriOrFunList',
        userFollowings: 'baidu.ting.ugcfriend.getFriOrFunList',
    };


    constructor() {
    }


    public async request(params: object, data?: string, url: string = QianQianApi.SERVER, headers?: any): Promise<any> {
        let paramstr = querystringify(params);
        url = url + '?' + paramstr;

        headers = headers || QianQianApi.HEADERS;

        let options: IRequestOptions = {
            method: 'GET',
            url,
            headers,
            body: data,
            gzip: true,
            resolveWithFullResponse: false,
        };
        let result: any = await request(options);
        let json = JSON.parse(result.trim());

        if (json.error_code && json.error_code != 22000) {
            loggerWarning.warning('[QianQianApi.request] [Error]: (params, response):', options, json);
        }

        return json;
    }


    public async getAudio(songId: string, kbps: number): Promise<IAudio> {
        let params = {
            songIds: songId,
            type: kbps <= 320 ? 'mp3' : 'flac',
        };
        if (kbps <= 320) params['rate'] = kbps;

        let json = await this.request(
            params,
            null,
            QianQianApi.AUDIO,
            CURL_HEADERS,
        );
        let info = json['data']['songList'][0];

        if (info['songLink']) {
            let audio = {
                url: info['songLink'],
                format: info['format'],
                size: info['size'],
                kbps: info['rate'],
            };
            return audio;
        }
        return null;
    }


    public async audios(songId: string, supKbps?: number): Promise<Array<IAudio>> {
        let audios = await this.audio(songId);

        // no audios
        if (audios.length < 1) return [];

        for (let audio of audios) {
            if (!audio.url) {
                let _audio = await this.getAudio(songId, audio.kbps);
                if (_audio) audio.url = _audio.url;
            }
        }
        return audios.filter(audio => !!audio.url);
    }


    public async audio(songId: string): Promise<Array<IAudio>> {
        let json = await this.request(
            {
                method: QianQianApi.NODE_MAP.audio,
                from: 'qianqianmini',
                version: '1.0.0',
                platform: 'darwin',
                songid: songId,
                res: '1',
                aac: '1',
                e: encryptParams({ songid: songId, ts: +new Date }),
            },
        );
        if (json.error_code != 22000) return [];

        let song = makeSong(json);
        return song.audios;
    }


    public async song(songId: string): Promise<ISong> {
        let json = await this.request(
            {
                method: QianQianApi.NODE_MAP.song,
                from: 'qianqianmini',
                version: '1.0.0',
                platform: 'darwin',
                songid: songId,
                res: '1',
                aac: '1',
                e: encryptParams({ songid: songId, ts: +new Date }),
            },
        );
        return makeSong(json.content);
    }


    public async lyric(songId: string, song?: ISong): Promise<ILyric> {
        let lyricUrl;
        if (!song || !song.lyricUrl) {
            song = await this.song(songId);
        }
        lyricUrl = song.lyricUrl;
        if (!lyricUrl) return null;

        let cn: any = await htmlGet(lyricUrl);
        return makeLyric(songId, cn);
    }


    public async album(albumId: string): Promise<IAlbum> {
        let json = await this.request(
            {
                method: QianQianApi.NODE_MAP.album,
                from: 'qianqianmini',
                version: '11.2.6',
                platform: 'darwin',
                album_id: albumId,
            },
        );
        return makeAlbum(json);
    }


    public async artist(artistId: string): Promise<IArtist> {
        let json = await this.request(
            {
                method: QianQianApi.NODE_MAP.artist,
                from: 'qianqianmini',
                version: '11.2.6',
                platform: 'darwin',
                artistid: artistId,
                tinguid: '0',
            },
        );
        return makeArtist(json);
    }


    public async artistSongs(artistId: string, offset: number = 0, limit: number = 10): Promise<Array<ISong>> {
        let json = await this.request(
            {
                method: QianQianApi.NODE_MAP.artistSongs,
                from: 'qianqianmini',
                version: '11.2.6',
                platform: 'darwin',
                artistid: artistId,
                tinguid: '0',
                offset: offset,
                limits: limit,
            },
        );
        return makeSongs(json['songlist']);
    }


    public async artistAlbums(artistId: string, offset: number = 0, limit: number = 10): Promise<Array<IAlbum>> {
        let json = await this.request(
            {
                method: QianQianApi.NODE_MAP.artistAlbums,
                from: 'qianqianmini',
                version: '11.2.6',
                platform: 'darwin',
                artistid: artistId,
                tinguid: '0',
                order: '1',
                offset: offset,
                limits: limit,
            },
        );
        return makeAlbums(json['albumlist']);
    }


    public async collection(collectionId: string, offset: number = 0, limit: number = 100): Promise<ICollection> {
        let json = await this.request(
            {
                method: QianQianApi.NODE_MAP.collection,
                ...(encryptPass(
                    {
                        from: "qianqianmini",
                        platform: "darwin",
                        version: "11.2.6",
                        withcount: "1",
                        list_id: collectionId,
                    }
                )),
            },
        );
        let collection = makeCollection(json['result']);
        let songs = await this.collectionSongs(collectionId, offset, limit);
        collection.songs = songs;
        return collection;
    }


    public async collectionSongs(collectionId: string, offset: number = 0, limit: number = 100): Promise<Array<ISong>> {
        let json = await this.request(
            {
                method: QianQianApi.NODE_MAP.collectionSongs,
                ...(encryptPass(
                    {
                        from: "qianqianmini",
                        version: "11.2.6",
                        platform: "darwin",
                        list_id: collectionId,
                        start: offset,
                        num: limit,
                    }
                )),
            },
        );
        return makeSongs(json['result']['songList']);
    }


    public async searchSongs(keyword: string, offset: number = 0, limit: number = 10): Promise<Array<ISong>> {
        let json = await this.request(
            {
                method: QianQianApi.NODE_MAP.search,
                from: 'qianqianmini',
                version: '11.2.6',
                platform: 'darwin',
                isNew: '1',
                query: keyword,
                page_no: offset,
                page_size: limit,
                type: '0',
            },
        );
        let songs = makeSongs(json['result']['song_info']['song_list'].filter(i => i.song_id));
        return songs;
    }


    public async searchAlbums(keyword: string, offset: number = 0, limit: number = 10): Promise<Array<IAlbum>> {
        let json = await this.request(
            {
                method: QianQianApi.NODE_MAP.search,
                from: 'qianqianmini',
                version: '11.2.6',
                platform: 'darwin',
                isNew: '1',
                query: keyword,
                page_no: offset,
                page_size: limit,
                type: '2', // '0,1,2,10'
            },
        );
        let albums = makeAlbums(json['result']['album_info']['album_list']);
        return albums;
    }


    public async searchArtists(keyword: string, offset: number = 0, limit: number = 10): Promise<Array<IArtist>> {
        let json = await this.request(
            {
                method: QianQianApi.NODE_MAP.search,
                from: 'qianqianmini',
                version: '11.2.6',
                platform: 'darwin',
                isNew: '1',
                query: keyword,
                page_no: offset,
                page_size: limit,
                type: '1', // '0,1,2,10'
            },
        );
        let artists = makeArtists(json['result']['artist_info']['artist_list']);
        return artists;
    }


    public async searchCollections(keyword: string, offset: number = 0, limit: number = 10): Promise<Array<ICollection>> {
        let json = await this.request(
            {
                method: QianQianApi.NODE_MAP.search,
                from: 'qianqianmini',
                version: '11.2.6',
                platform: 'darwin',
                isNew: '1',
                query: keyword,
                page_no: offset,
                page_size: limit,
                type: '10',
            },
        );
        let collections = makeCollections(json['result']['playlist_info']['play_list']);
        return collections;
    }


    public async userProfile(userName: string): Promise<IUserProfile> {
        let json = await this.request(
            {
                method: QianQianApi.NODE_MAP.userProfile,
                ...(encryptPass(
                    {
                        nickname: userName,
                        withcount: 1,
                    }
                )),
            },
        );
        return makeUserProfile(json['result']);
    }


    // no api
    public async userFavoriteSongs(userId: string, offset: number = 0, limit: number = 10): Promise<Array<ISong>> {
        return [];
    }


    public async userFavoriteAlbums(userId: string, offset: number = 0, limit: number = 10): Promise<Array<IAlbum>> {
        let json = await this.request(
            {
                method: QianQianApi.NODE_MAP.userFavoriteAlbums,
                ...(encryptPass(
                    {
                        from: 'qianqianmini',
                        platform: 'darwin',
                        version: '11.2.6',
                        offset,
                        size: limit,
                        source: '1',
                        type: '0',
                        user_id: userId,
                    }
                )),
            },
        );
        return makeAlbums(json['result']['listinfo']);
    }


    public async userFavoriteArtists(userId: string, offset: number = 0, limit: number = 10): Promise<Array<IArtist>> {
        let json = await this.request(
            {
                method: QianQianApi.NODE_MAP.userFavoriteArtists,
                ...(encryptPass(
                    {
                        from: 'qianqianmini',
                        platform: 'darwin',
                        version: '11.2.6',
                        offset,
                        size: limit,
                        source: '2',
                        type: '0',
                        user_id: userId,
                    }
                )),
            },
        );
        return makeArtists(json['result']['listinfo']);
    }


    public async userFavoriteCollections(userId: string, offset: number = 0, limit: number = 10): Promise<Array<ICollection>> {
        let json = await this.request(
            {
                method: QianQianApi.NODE_MAP.userFavoriteCollections,
                ...(encryptPass(
                    {
                        from: 'qianqianmini',
                        platform: 'darwin',
                        version: '11.2.6',
                        offset,
                        size: limit,
                        source: '0',
                        type: '0',
                        user_id: userId,
                    }
                )),
            },
        );
        return makeCollections(json['result']['listinfo']);
    }


    public async userCreatedCollections(userId: string, offset: number = 0, limit: number = 10): Promise<Array<ICollection>> {
        let json = await this.request(
            {
                method: QianQianApi.NODE_MAP.userCreatedCollections,
                ...(encryptPass(
                    {
                        from: 'qianqianmini',
                        platform: 'darwin',
                        version: '11.2.6',
                        offset,
                        size: limit,
                        source: '0',
                        type: '10',
                        user_id: userId,
                    }
                )),
            },
        );
        return makeCollections(json['result']['listinfo']);
    }


    public async userFollowers(userId: string, offset: number = 0, limit: number = 10, ing: boolean = true): Promise<Array<IUserProfile>> {
        let json = await this.request(
            {
                method: QianQianApi.NODE_MAP.userFollowers,
                ...(encryptPass(
                    {
                        from: 'qianqianmini',
                        platform: 'darwin',
                        version: '11.2.6',
                        author_id: '2698337947',
                        offset,
                        size: limit,
                        type: '2',
                    }
                )),
            },
        );
        return makeUserProfiles(json['list']);
    }


    public async userFollowings(userId: string, offset: number = 0, limit: number = 10, ing: boolean = true): Promise<Array<IUserProfile>> {
        let json = await this.request(
            {
                method: QianQianApi.NODE_MAP.userFollowings,
                ...(encryptPass(
                    {
                        from: 'qianqianmini',
                        platform: 'darwin',
                        version: '11.2.6',
                        author_id: '2698337947',
                        offset,
                        size: limit,
                        type: '1',
                    }
                )),
            },
        );
        return makeUserProfiles(json['list']);
    }


    public resizeImageUrl(url: string, size: ESize | number): string {
        return resizeImageUrl(url, size, (url, size) => `${url}@s_1,w_${size},h_${size}`);
    }


    public async fromURL(input: string): Promise<Array<TMusicItems>> {
        let chunks = input.split(' ');
        let items = [];
        for (let chunk of chunks) {
            let m;
            let type;

            let matchList = [
                // song
                [/song\/(\d+)/, 'song'],

                // artist
                [/artist\/(\d+)/, 'artist'],

                // album
                [/album\/(\d+)/, 'album'],

                // collection
                [/songlist\/(\d+)/, 'collect'],

                // user
                [/nickname=([^&]+)/, 'user'],
            ];
            for (let [re, tp] of matchList) {
                m = (re as RegExp).exec(decodeURI(chunk));
                if (m) {
                    type = tp;
                    break;
                }
            }

            if (m && type == 'artist') {
                let url = 'http://music.taihe.com/artist/' + m[1];
                let cn = await htmlGet(url);
                m = (new RegExp(`artistId\\s*=\\s*'(\\d+)'`)).exec(cn as any);
            }

            if (m) {
                let key = m[1];
                let item;
                switch (type) {
                    case 'song':
                        item = await this.song(key);
                        items.push(item);
                        break;
                    case 'artist':
                        item = await this.artist(key);
                        items.push(item);
                        break;
                    case 'album':
                        item = await this.album(key);
                        items.push(item);
                        break;
                    case 'collect':
                        item = await this.collection(key);
                        items.push(item);
                        break;
                    case 'user':
                        item = await this.userProfile(key);
                        items.push(item);
                        break;
                    default:
                        break;
                }
            }
        }

        return items;
    }
}
