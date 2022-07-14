'use strict';

import { Logger, LogLevel } from 'chord/platform/log/common/log';
import { filenameToNodeName } from 'chord/platform/utils/common/paths';
const loggerWarning = new Logger(filenameToNodeName(__filename), LogLevel.Warning);

import { sleep } from 'chord/base/common/time';
import { ok } from 'chord/base/common/assert';
import { querystringify } from 'chord/base/node/url';
import { md5 } from 'chord/base/node/crypto';

import { IAudio } from 'chord/music/api/audio';
import { ISong } from 'chord/music/api/song';
import { ILyric } from 'chord/music/api/lyric';
import { IAlbum } from 'chord/music/api/album';
import { IArtist } from 'chord/music/api/artist';
import { ICollection } from 'chord/music/api/collection';
import { TMusicItems } from 'chord/music/api/items';

import { IAccount } from 'chord/music/api/user';

import { ESize, resizeImageUrl } from 'chord/music/common/size';

import { makeCookieJar, CookieJar } from 'chord/base/node/cookies';
import { request, IRequestOptions, IResponse } from 'chord/base/node/_request';

import { encrypt } from 'chord/music/migu/crypto';

import {
    _getAlbumId,
    makeAudios,
    makeSong,
    makeSongs,
    makeLyric,
    makeAlbum,
    makeAlbums,
    makeCollection,
    makeCollections,
    makeArtist,
    makeArtists,
    extractArtistSongs,
    makeArtistAlbums,
    extractCollectionSongIds,
} from 'chord/music/migu/parser';


export class MiguMusicApi {

    static readonly HEADERS_AUDIO = {
        'Connection': 'keep-alive',
        'Accept': '*/*',
        'X-Requested-With': 'XMLHttpRequest',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36',
        'Referer': 'https://music.migu.cn/v3/music/player/audio',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh-TW;q=0.7,zh;q=0.6,ja;q=0.5',
    };

    static readonly HEADERS_h5 = {
        'Connection': 'keep-alive',
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'X-Requested-With': 'XMLHttpRequest',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Mobile Safari/537.36',
        'Referer': 'https://m.music.migu.cn/v3',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh-TW;q=0.7,zh;q=0.6,ja;q=0.5',
        'Content-Type': 'application/json; charset=utf-8',
    };

    static readonly HEADERS_WEB = {
        'Connection': 'keep-alive',
        'Accept': '*/*',
        'X-Requested-With': 'XMLHttpRequest',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36',
        'Referer': 'https://music.migu.cn/v3/',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh-TW;q=0.7,zh;q=0.6,ja;q=0.5',
    };

    static readonly BASICURL = 'https://music.migu.cn/';
    static readonly BASICURL_H5 = 'https://m.music.migu.cn/';
    static readonly BASICURL_APP = 'https://pd.musicapp.migu.cn/';
    static readonly AUDIO_URL = 'https://218.205.239.34/MIGUM2.0/v1.0/content/sub/listenSong.do';

    static readonly NODE_MAP = {
        audio: 'v3/api/music/audioPlayer/getPlayInfo',

        // song: 'v3/api/music/audioPlayer/songs',
        song: 'v3/music/song',
        song_h5: 'migu/remoting/cms_detail_tag',

        album: 'migumusic/h5/album/info',
        albumSongs: 'v3/api/music/audioPlayer/songs',
        collection: 'migu/remoting/query_playlist_by_id_tag',
        collectionSongs: 'migu/remoting/playlistcontents_query_tag',  // From web

        artist: 'migu/remoting/cms_artist_detail_tag',
        artistSongs: 'v3/music/artist',  // From web
        artistAlbums: 'v3/music/artist',  // From web

        // search: 'migu/remoting/scr_search_tag',
        search: 'MIGUM3.0/v1.0/content/search_all.do',
    }

    private account: IAccount;
    private cookieJar: CookieJar;


    constructor() {
        if (!this.cookieJar) {
            let cookieJar = makeCookieJar();
            // initiateCookies().forEach(cookie => {
            //     let domain = cookie.domain;
            //     cookieJar.setCookie(cookie, domain.startsWith('http') ? domain : 'http://' + domain);
            // });
            this.cookieJar = cookieJar;
        }
    }


    public async request(node: string, params: any, to_enc: boolean = false, domain?: string, to_json: boolean = true): Promise<any> {
        let url = (domain || MiguMusicApi.BASICURL) + node;

        let headers;
        switch (domain) {
            case MiguMusicApi.BASICURL_H5:
                headers = MiguMusicApi.HEADERS_h5;
                break;
            case MiguMusicApi.BASICURL:
                headers = MiguMusicApi.HEADERS_WEB;
                break;
            default:
                headers = MiguMusicApi.HEADERS_WEB;
        }

        if (node == MiguMusicApi.NODE_MAP.album) {
            headers['By'] = md5(headers['User-Agent']);
            headers['Referer'] = 'https://m.music.migu.cn/v4';
        }

        if (to_enc) {
            let { secKey, encBuf } = encrypt(JSON.stringify(params));
            params = {
                dataType: 2,
                data: encBuf,
                secKey,
            }
        }
        if (params) {
            url = url + '?' + querystringify(params);
        }

        let options: IRequestOptions = {
            method: 'GET',
            jar: this.cookieJar || null,
            headers: headers,
            withCredentials: false,
        };

        let resp: IResponse = await request(url, options);

        ok(resp, `[ERROR] [MiguMusicApi.request]: url: ${url}, resp is ${resp}`);

        let json = resp.data;

        let is_ok = true;
        if (to_json) {
            is_ok = ((resp['returnCode'] || resp['code']) == '000000') || !!resp['data'] || !!resp['result'] || !!resp['success'];
        }
        if (!is_ok) {
            loggerWarning.warning(`[ERROR] [MiguMusicApi.request]: url: ${url}, result is ${JSON.stringify(json)}`);

            let message = json['msg'];
            throw new Error(message);
        }
        return json;
    }


    // flac: type = 3
    // 320kbps: type = 2
    // 40kbps: type = 1
    // public async audios(songId: string, songMediaMid?: string, supKbps?: number): Promise<Array<IAudio>> {
    //     let audios = [];
    //     while (true) {
    //         let tp = 2;
    //         if (supKbps > 320) {
    //             tp = 3;
    //         }
    //         let data = {
    //             copyrightId: songId,
    //             auditionsFlag: 0,
    //             type: tp,
    //         };
    //         let { secKey, encBuf } = encrypt(JSON.stringify(data));
    //         let params = {
    //             dataType: 2,
    //             data: encBuf,
    //             secKey,
    //         }
    //         let headers = MiguMusicApi.HEADERS_AUDIO;
    //         let node = MiguMusicApi.NODE_MAP.audio;
    //         let url = MiguMusicApi.BASICURL + node + '?' + querystringify(params);
    //         let options: IRequestOptions = {
    //             method: 'GET',
    //             jar: this.cookieJar || null,
    //             headers: headers,
    //             withCredentials: false,
    //         };
    //         let resp: IResponse = await request(url, options);
    //         let json = resp.data;
    //         audios = makeAudios(json['data']);
    //
    //         // if the audio is not flac, changing to 320kbps
    //         if (audios.length > 0 && tp == 3) {
    //             if (audios[0].kbps < 320) {
    //                 supKbps = 320;
    //                 continue;
    //             }
    //         }
    //         break;
    //     }
    //     return audios;
    // }


    public async audios(songOriginalId: string, songMediaMid?: string, supKbps?: number): Promise<Array<IAudio>> {
        if (!songMediaMid) {
            let song = await this.song(songOriginalId);
            songMediaMid = song.songMediaMid;
        }

        let toneFlag = 'SQ';
        let formatType = 'SQ';
        let resourceType = 'E';
        let format = 'flac';
        let kbps = 1000;
        while (true) {
            if (supKbps > 320) {
                toneFlag = 'SQ';
                formatType = 'SQ';
                resourceType = 'E';
                format = 'flac';
                kbps = 1000;
            } else if (supKbps > 128) {
                toneFlag = 'HQ';
                formatType = 'HQ';
                resourceType = '2';
                format = 'mp3';
                kbps = 320;
            } else if (supKbps > 64) {
                toneFlag = 'PQ';
                formatType = 'PQ';
                resourceType = '2';
                format = 'mp3';
                kbps = 128;
            } else {
                toneFlag = 'LQ';
                formatType = 'LQ';
                resourceType = '3';
                format = 'mp3';
                kbps = 64;
            }

            let params = {
                toneFlag,
                formatType,
                resourceType,
                netType: '00',
                copyrightId: '0',
                contentId: songMediaMid,
                channel: '0',
            };
            let resp = await request(
                MiguMusicApi.AUDIO_URL + '?' + querystringify(params),
                {
                    method: 'GET',
                    maxRedirects: 0,
                    validateStatus: function (status: number) { return status >= 200 && status <= 302; }
                }
            );

            let url = resp.headers['location'];
            if (!url) {
                if (supKbps > 320) {
                    supKbps = 320;
                } else if (supKbps > 128) {
                    supKbps = 128;
                } else if (supKbps > 64) {
                    supKbps = 64;
                } else {
                    // No audio
                    return [];
                }
                continue;
            } else {
                if (url.includes('MP3_320_')) {
                    kbps = 320;
                } else if (url.includes('MP3_128_')) {
                    kbps = 128;
                } else if (url.includes('MP3_64_')) {
                    kbps = 64;
                }
            }

            return [{
                format,
                size: null,
                kbps,
                url,
                path: null,
            }];
        }
    }


    // WARN: songId is a copyrightId of migu music
    public async song(songId: string): Promise<ISong> {
        let node = MiguMusicApi.NODE_MAP.song_h5;
        let params: any = {
            cpid: songId,
            // or cpid: songMid
            // cid、cpid和pid至少填写一个
        };
        let json = await this.request(node, params, false, MiguMusicApi.BASICURL_H5);
        let song = makeSong(json.data);

        // Get album info
        node = MiguMusicApi.NODE_MAP.song + '/' + songId;
        let body = await this.request(node, params, false, MiguMusicApi.BASICURL, false);
        let groups = /album\/(\d+)">(.+?)</.exec(body);
        if (groups != null) {
            let albumOriginalId = groups[1];
            let albumName = groups[2];
            song.albumId = _getAlbumId(albumOriginalId);
            song.albumOriginalId = albumOriginalId;
            song.albumName = albumName;
        }

        return song;
    }


    public async songs(songIds: Array<string>): Promise<Array<ISong>> {
        return await Promise.all(songIds.map(songId => this.song(songId)));
    }


    public async lyric(songId: string): Promise<ILyric> {
        let node = MiguMusicApi.NODE_MAP.song_h5;
        let params = {
            cpid: songId,
            // or cpid: songMid
            // cid、cpid和pid至少填写一个
        };
        let json = await this.request(node, params, false, MiguMusicApi.BASICURL_H5);

        let lyricInfo = json.data.lyricLrc;
        let transInfo = null;
        return makeLyric(songId, lyricInfo, transInfo);
    }


    public async album(albumId: string): Promise<IAlbum> {
        let node = MiguMusicApi.NODE_MAP.album;
        let params: any = { albumId };
        let json = await this.request(node, params, false, MiguMusicApi.BASICURL_H5);
        let album = makeAlbum(json.data);

        // node = MiguMusicApi.NODE_MAP.albumSongs;
        // params = {
        //     albumId,
        //     type: 2,
        // };
        // json = await this.request(node, params, false);
        // let songs = makeSongs(json.items).map(song => {
        //     song.albumCoverUrl = album.albumCoverUrl;
        //     return song;
        // });
        // if (songs.length > 0) {
        //     let song = songs[0];
        //     album.artistOriginalId = song.artistOriginalId;
        //     album.artistId = song.artistId;
        //     album.artistName = song.artistName;
        // }
        // album.songs = songs;

        return album;
    }


    public async albumSongs(albumId: string): Promise<Array<ISong>> {
        let node = MiguMusicApi.NODE_MAP.albumSongs;
        let params = {
            albumId,
            type: 2,
        };
        let json = await this.request(node, params, false);
        return makeSongs(json.items);
    }


    public async artist(artistId: string): Promise<IArtist> {
        let node = MiguMusicApi.NODE_MAP.artist;
        let params = {
            artistId,
        };
        let json = await this.request(node, params, false, MiguMusicApi.BASICURL_H5);
        return makeArtist(json.data);
    }


    /**
     * There gets an artist's top 50 songs
     * It can't be more
     */
    public async artistSongs(artistId: string, page: number = 1, size: number = 20): Promise<Array<ISong>> {
        let node = MiguMusicApi.NODE_MAP.artistSongs + '/' + artistId + '/song';
        let params = {
            from: 'migu', page, origin: 4,
        };
        let html = await this.request(node, params, false, MiguMusicApi.BASICURL, false);
        return extractArtistSongs(html);
    }


    public async artistAlbums(artistId: string, page: number = 1, size: number = 30): Promise<Array<IAlbum>> {
        let node = MiguMusicApi.NODE_MAP.artistAlbums + '/' + artistId + '/album';
        let params = {
            page,
        };
        let html = await this.request(node, params, false, MiguMusicApi.BASICURL, false);
        return makeArtistAlbums(html);
    }


    public async collection(collectionId: string, size: number = 10000): Promise<ICollection> {
        let node = MiguMusicApi.NODE_MAP.collection;
        let params: any = { playListId: collectionId };

        let json = await this.request(node, params, false, MiguMusicApi.BASICURL_H5);
        let collection = makeCollection(json['rsp']['playList'][0]);

        node = MiguMusicApi.NODE_MAP.collectionSongs;
        params = {
            playListType: 2,
            playListId: collectionId,
            contentCount: size,
        };
        json = await this.request(node, params, false, MiguMusicApi.BASICURL_H5);
        collection.songs = makeSongs(json['contentList'] || []);
        return collection;
    }


    /**
     * Search
     *
     * data params:
     * @type:
     * 2: song
     * 1: artist
     * 4: album
     * 5: mv
     * 6: collection
     */
    public async search(type: number, keyword: string, page: number = 1, size: number = 20): Promise<any> {
        let node = MiguMusicApi.NODE_MAP.search;
        let searchSwitch = {
            song: type == 2,
            album: type == 4,
            singer: type == 1,
            songlist: type == 6,
            tagSong: 0,
            mvSong: 0,
            bestShow: 0,
        }
        let params: any = {
            ua: 'Android_migu',
            text: keyword,
            pageNo: page,
            pageSize: 20, // This can not be changed.
            searchSwitch: JSON.stringify(searchSwitch),
        }
        let json = await this.request(node, params, false, MiguMusicApi.BASICURL_APP);
        return json;
    }


    /**
     * Search songs
     *
     * type = 2
     */
    public async searchSongs(keyword: string, page: number = 1, size: number = 10): Promise<Array<ISong>> {
        let json = await this.search(2, keyword, page, size);
        if (!json['songResultData']) { return []; }
        let s = makeSongs(json['songResultData']['result'] || []);
        return s;
    }


    /**
     * Search albums
     * type = 4
     */
    public async searchAlbums(keyword: string, page: number = 1, size: number = 10): Promise<Array<IAlbum>> {
        let json = await this.search(4, keyword, page, size);
        if (!json['albumResultData']) { return []; }
        return makeAlbums(json['albumResultData']['result'] || []);
    }


    /**
     * Search artists
     *
     * type = 1
     */
    public async searchArtists(keyword: string, page: number = 1, size: number = 10): Promise<Array<IArtist>> {
        let json = await this.search(1, keyword, page, size);
        if (!json['singerResultData']) { return []; }
        return makeArtists(json['singerResultData']['result'] || []);
    }


    /**
     * Search collections
     * type = 6
     */
    public async searchCollections(keyword: string, page: number = 1, size: number = 10): Promise<Array<ICollection>> {
        let json = await this.search(6, keyword, page, size);
        if (!json['songListResultData']) { return []; }
        return makeCollections(json['songListResultData']['result'] || []);
    }


    public async playLog(songId: string, seek: number): Promise<boolean> {
        return false;
    }


    public resizeImageUrl(url: string, size: ESize | number): string {
        return resizeImageUrl(url, size, (url: string, size) => `${url}?${size}x${size}`);
    }


    public async fromURL(input: string): Promise<Array<TMusicItems>> {
        let chunks = input.split(' ');
        let items = [];
        for (let chunk of chunks) {
            let m;
            let originId;
            let type;

            let matchList = [
                // song
                [/song\/([\da-zA-Z]+)/, 'song'],

                // artist
                [/artist\/(\d+)/, 'artist'],

                // album
                [/album\/(\d+)/, 'album'],

                // playlist
                [/playlist\/(\d+)/, 'collection'],
            ];
            for (let [re, tp] of matchList) {
                m = (re as RegExp).exec(chunk);
                if (m) {
                    originId = m[1];
                    type = tp;
                    break;
                }
            }

            if (originId) {
                let item;
                switch (type) {
                    case 'song':
                        item = await this.song(originId);
                        items.push(item);
                        break;
                    case 'artist':
                        item = await this.artist(originId);
                        items.push(item);
                        break;
                    case 'album':
                        item = await this.album(originId);
                        items.push(item);
                        break;
                    case 'collection':
                        item = await this.collection(originId);
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

