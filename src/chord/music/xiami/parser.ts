'use strict';

import { decodeHtml } from 'chord/base/browser/htmlContent';

import { getAbsolutUrl } from "chord/base/node/url";

import { ISong } from "chord/music/api/song";
import { IAlbum } from "chord/music/api/album";
import { IArtist } from "chord/music/api/artist";
import { IGenre } from "chord/music/api/genre";
import { ITag } from "chord/music/api/tag";
import { ICollection } from "chord/music/api/collection";
import { IAudio } from "chord/music/api/audio";

import { IUserProfile, IAccount } from "chord/music/api/user";

import {
    getSongUrl,
    getAlbumUrl,
    getArtistUrl,
    getCollectionUrl,
    getUserUrl,
    getSongId,
    getAlbumId,
    getArtistId,
    getCollectionId,
    getUserId,
} from "chord/music/common/origin";
import { decrypt } from "chord/music/xiami/crypto";
import { xpathSelect } from 'chord/workbench/api/browser/xpath';


const _staticResourceBasicUrl = 'http://img.xiami.net';
const _origin = 'xiami';

const _getSongUrl: (id: string) => string = getSongUrl.bind(null, _origin);
const _getSongId: (id: string) => string = getSongId.bind(null, _origin);
const _getAlbumUrl: (id: string) => string = getAlbumUrl.bind(null, _origin);
const _getAlbumId: (id: string) => string = getAlbumId.bind(null, _origin);
const _getArtistUrl: (id: string) => string = getArtistUrl.bind(null, _origin);
const _getArtistId: (id: string) => string = getArtistId.bind(null, _origin);
const _getCollectionUrl: (id: string) => string = getCollectionUrl.bind(null, _origin);
const _getCollectionId: (id: string) => string = getCollectionId.bind(null, _origin);
const _getUserUrl: (id: string) => string = getUserUrl.bind(null, _origin);
const _getUserId: (id: string) => string = getUserId.bind(null, _origin);


/**
 * All images from 'http://img.xiami.net' and 'http://pic.xiami.net/'
 * can be resize by adding follow params
 * ?x-oss-process=image/resize,m_fill,w_382,h_382/format,webp
 */


export function makeSong(info: any): ISong {
    let lyricUrl: string;
    if (!!info['lyric_url']) {
        lyricUrl = getAbsolutUrl(info['lyric_url'], _staticResourceBasicUrl);
    }

    let albumCoverUrl: string = getAbsolutUrl(info['album_pic'], _staticResourceBasicUrl);

    let artistAvatarUrl: string = getAbsolutUrl(info['singersSource'][0]['artistLogo'], _staticResourceBasicUrl);

    let audios: Array<IAudio> = [{ url: decrypt(info['location']), format: 'mp3' }];

    let song: ISong = {
        songId: _getSongId(info['song_id']),

        type: 'song',
        origin: _origin,

        songOriginalId: info['song_id'],

        url: _getSongUrl(info['song_id']),

        songName: info['name'],
        subTitle: info['song_sub_title'],

        songWriters: info['songwriters'],
        singers: info['singers'],

        albumId: _getAlbumId(info['album_id']),
        albumOriginalId: info['album_id'].toString(),
        albumName: info['album_name'],
        albumCoverUrl: albumCoverUrl,

        artistId: _getArtistId(info['artist_id']),
        artistOriginalId: info['artist_id'].toString(),
        artistName: info['artist_name'],
        artistAvatarUrl: artistAvatarUrl,

        composer: info['composer'],

        lyricUrl: lyricUrl,

        track: info['track'],
        cdSerial: info['cd_serial'],

        // millisecond
        duration: info['length'],

        // millisecond
        releaseDate: info['demoCreateTime'],

        playCountWeb: info['playCount'] || null,
        playCount: 0,

        audios: audios,
    };
    return song;
}


export function makeAlbum(info: any): IAlbum {
    let songInfo: any = info.data.trackList[0];
    let songs: Array<ISong> = info.data.trackList.map(info => makeSong(info));

    let albumOriginalId: string = songInfo['album_id'].toString();

    let albumCoverUrl: string = getAbsolutUrl(songInfo['album_pic'], _staticResourceBasicUrl);

    let duration: number = 0;
    songs.forEach(song => { duration += song.duration; });

    let album: IAlbum = {
        albumId: _getAlbumId(albumOriginalId),

        type: 'album',
        origin: _origin,
        albumOriginalId: albumOriginalId,
        url: _getAlbumUrl(albumOriginalId),

        albumName: songInfo['album_name'],
        albumCoverUrl: albumCoverUrl,

        artistId: _getArtistId(songInfo['artist_id']),
        artistOriginalId: songInfo['artist_id'].toString(),
        artistName: songInfo['artist_name'],

        duration: duration,

        releaseDate: songInfo['demoCreateTime'],

        songs: songs,
        songCount: songs.length,
    };

    return album;
}


export function makeArtist(html: string): IArtist {
    /**
     * At browser, using browser dom api
     */
    if (window) {
        let doc: HTMLElement = new (<any>window).DOMParser().parseFromString(html, 'text/html');

        // name and alias
        let _chunk = xpathSelect('//h1', doc)[0].innerText.trim().split('\n');
        let artistName: string = _chunk[0];
        let artistAlias: Array<string>;
        if (_chunk.length > 1) {
            artistAlias = _chunk[1].split('/').filter(n => n.trim() != '').map(n => { return n.trim(); });
        }

        // artist id
        let artistOriginalId: string = xpathSelect('//link[@rel="canonical"]', doc)[0].href.split('/').pop();
        let artistId: string = _getArtistId(artistOriginalId);
        let _url: string = _getArtistUrl(artistOriginalId);

        let description: string = xpathSelect('//div[@class="record"]', doc)[0].innerHTML.trim();

        // TODO, need to convert to unity country code
        let area: string = xpathSelect('//td[@valign="top"]', doc)[1].innerText.trim();

        let artistAvatarUrl: string = xpathSelect('//a[@id="cover_lightbox"]', doc)[0].href.replace('https', 'http');

        // genres
        let genres: Array<IGenre>;
        xpathSelect('//td[@valign="top"]//a[contains(@href,"/genre/")]', doc).forEach(el => {
            let genre: IGenre = {
                id: el.href.split('/').pop(),
                name: el.textContent().trim(),
            };
            genres.push(genre);
        });

        // songs
        let songs: Array<ISong> = xpathSelect('//td[@class="chkbox"]/input/@value', doc).map(r => {
            let songOriginalId: string = r.value;
            let song: ISong = {
                songId: _getSongId(songOriginalId),
                type: 'song',
                songOriginalId: songOriginalId,

                url: _getSongUrl(songOriginalId),
                origin: _origin,

                artistId: artistId,
                artistOriginalId: artistOriginalId,
                artistName: artistName,
                artistAvatarUrl: artistAvatarUrl,
            };
            return song;
        });

        // get song name
        xpathSelect('//td[@class="song_name"]//a[contains(@href,"/song/")][1]', doc).forEach((a, index) => {
            songs[index].songName = a.innerText.trim();
        });

        // get playCountWeb
        xpathSelect('//td[@class="song_hot"]', doc).forEach((t, index) => {
            songs[index].playCountWeb = parseInt(t.innerText);
        });

        // albums
        let albums: Array<IAlbum> = xpathSelect('//p[@class="cover"]', doc).filter(el => {
            return /试听/.test(el.textContent.trim());
        }).map(el => {
            let albumCoverUrl: string = 'http:' + /src="(\/\/pic.xiami.net\/.+?\.jpg)/.exec(el.innerHTML)[1];
            let albumOriginalId: string = /'(\d+)',\sthis/.exec(el.innerHTML)[1];
            let album: IAlbum = {
                albumId: _getAlbumId(albumOriginalId),
                type: 'album',
                albumOriginalId: albumOriginalId,
                origin: _origin,
                url: _getAlbumUrl(albumOriginalId),

                albumCoverUrl: albumCoverUrl,

                artistId: artistId,
                artistOriginalId: artistOriginalId,
                artistName: artistName,
            };
            return album;
        });

        let artist: IArtist = {
            artistId: artistId,
            type: 'artist',
            origin: _origin,
            artistOriginalId: artistOriginalId,
            url: _url,

            artistName: artistName,
            artistAlias: artistAlias,

            artistAvatarUrl: artistAvatarUrl,
            area: area,
            genres: genres,

            description: description,

            songs: songs,
            albums: albums,
        };
        return artist;

    } else {
        // TODO, parser html, using cheerio
        throw new Error('no html parser using nodejs api or cheerio');
    }
}


export function makeCollection(info: any, collectionOriginalId: string): ICollection {
    let songs: Array<ISong> = info.data.trackList.map(info => makeSong(info));

    let duration: number = 0;
    songs.forEach(song => { duration += song.duration; });

    let collection: ICollection = {
        collectionId: _getCollectionId(collectionOriginalId),

        type: 'collection',
        origin: _origin,
        collectionOriginalId: collectionOriginalId,
        url: _getCollectionUrl(collectionOriginalId),

        duration: duration,

        songs: songs,
        songCount: songs.length,
    };
    return collection;
}


function getKbps(str: string): number {
    let r = /m(\d{2,3})\./.exec(str.slice(0, 20));
    if (r) {
        return parseInt(r[1]);
    } else {
        return 128;
    }
}


function makeAudio(info: any): IAudio {
    let url = info['listenFile'];
    let audio: IAudio = {
        format: info['format'],
        size: info['fileSize'],
        kbps: getKbps(url),
        url,
    }
    return audio;
}


export function makeAliSong(info: any): ISong {
    let lyricUrl: string;
    if (!!info['lyricInfo']) {
        lyricUrl = getAbsolutUrl(info['lyricInfo']['lyricFile'], _staticResourceBasicUrl);
    }

    let albumCoverUrl: string = getAbsolutUrl(info['albumLogo'], _staticResourceBasicUrl);

    let artistAvatarUrl: string = getAbsolutUrl(info['artistLogo'], _staticResourceBasicUrl);

    let songOriginalId = info['songId'].toString();

    let audios = [];
    if (info['listenFiles'] && info['listenFiles'].length > 0) {
        audios = info['listenFiles'].map(a => makeAudio(a)).sort((x, y) => x.size < y.size);
    } else {
        // block song audio may be at here
        let backupSong = info['bakSong'];
        if (backupSong && backupSong['listenFiles'] && backupSong['listenFiles'].length > 0) {
            audios = backupSong['listenFiles'].map(a => makeAudio(a)).sort((x, y) => x.size < y.size);
        }
    }

    let song: ISong = {
        songId: _getSongId(songOriginalId),

        type: 'song',
        origin: _origin,

        songOriginalId,

        url: _getSongUrl(songOriginalId),

        songName: info['songName'],
        subTitle: info['subName'],

        songWriters: info['songwriters'],
        singers: info['singers'],

        albumId: _getAlbumId(info['albumId']),
        albumOriginalId: info['albumId'].toString(),
        albumName: info['albumName'],
        albumCoverUrl: albumCoverUrl,

        artistId: _getArtistId(info['artistId']),
        artistOriginalId: info['artistId'].toString(),
        artistName: info['artistName'],
        artistAvatarUrl: artistAvatarUrl,

        composer: info['composer'],

        lyricUrl: lyricUrl,

        track: info['track'],
        cdSerial: info['cdSerial'],

        duration: info['length'],

        releaseDate: info['gmtCreate'],

        playCountWeb: info['playCount'],
        playCount: info['playCount'],

        description: decodeHtml(info['description']),

        audios: audios,
    };
    return song;
}


export function makeAliSongs(info: any): Array<ISong> {
    let songs: Array<ISong> = (info || []).map(songInfo => makeAliSong(songInfo));
    return songs;
}


export function makeAliAlbum(info: any): IAlbum {
    let albumOriginalId: string = info['albumId'].toString();

    let albumCoverUrl: string = getAbsolutUrl(info['albumLogo'], _staticResourceBasicUrl);

    let tags: Array<ITag> = [{ id: info['categoryId'], name: info['albumCategory'] }];

    let songs: Array<ISong> = (info['songs'] || []).map(song => makeAliSong(song));

    let album: IAlbum = {
        albumId: _getAlbumId(albumOriginalId),

        type: 'album',
        origin: _origin,
        albumOriginalId: albumOriginalId,
        url: _getAlbumUrl(albumOriginalId),

        albumName: info['albumName'],
        albumCoverUrl: albumCoverUrl,
        subTitle: info['subName'],

        artistId: _getArtistId(info['artistId']),
        artistOriginalId: info['artistId'].toString(),
        artistName: info['artistName'],

        tags: tags,

        description: decodeHtml(info['description']),

        releaseDate: info['gmtPublish'],

        company: info['company'],

        songs: songs,
        songCount: info['songCount'],

        playCount: info['playCount'],
        likeCount: info['collects'],
    };
    return album;
}


export function makeAliAlbums(info: any): Array<IAlbum> {
    let albums: Array<IAlbum> = (info || []).map(albumInfo => makeAliAlbum(albumInfo));
    return albums;
}


export function makeAliArtist(info: any): IArtist {
    let artistOriginalId = info['artistId'].toString();
    let artistAvatarUrl = getAbsolutUrl(info['artistLogo'], _staticResourceBasicUrl);
    let artistAlias = info['alias'].split('/').filter(a => a.trim() != '').map(a => a.trim());
    let artist: IArtist = {
        artistId: _getArtistId(artistOriginalId),
        type: 'artist',
        origin: _origin,
        artistOriginalId: artistOriginalId,
        url: _getArtistUrl(artistOriginalId),

        artistName: info['artistName'],
        artistAlias: artistAlias,

        artistAvatarUrl: artistAvatarUrl,
        area: info['area'],

        description: decodeHtml(info['description']),

        songs: [],
        albums: [],

        playCount: info['playCount'],
        likeCount: info['countLikes'],
    };
    return artist;
}


export function makeAliArtists(info: any): Array<IArtist> {
    let artists: Array<IArtist> = (info || []).map(artistInfo => makeAliArtist(artistInfo));
    return artists;
}


export function makeAliCollection(info: any): ICollection {
    let collectionOriginalId = info['listId'].toString();
    let collectionCoverUrl = getAbsolutUrl(info['collectLogo'], _staticResourceBasicUrl);
    let tags: Array<ITag> = info['tags'].map(tag => ({ name: tag }));
    let songs: Array<ISong> = (info['songs'] || []).map(songInfo => makeAliSong(songInfo));
    let duration = songs.length != 0 ? songs.map(s => s.duration).reduce((x, y) => x + y) : null;

    let collection: ICollection = {
        collectionId: _getCollectionId(collectionOriginalId),

        type: 'collection',
        origin: _origin,
        collectionOriginalId,
        url: _getCollectionUrl(collectionOriginalId),

        collectionName: info['collectName'],

        collectionCoverUrl,

        userId: _getUserId(info['userId'].toString()),
        userName: info['userName'],

        releaseDate: info['gmtCreate'],

        description: decodeHtml(info['description']),

        tags,

        duration,

        songs,
        songCount: info['songCount'],

        playCount: info['playCount'],
        likeCount: info['collects'],
    };
    return collection;
}


export function makeAliCollections(info: any): Array<ICollection> {
    let collections = (info || []).map(collectionInfo => makeAliCollection(collectionInfo));
    return collections;
}


export function makeUserProfile(info: any): IUserProfile {
    let userOriginalId = info['userId'].toString();
    let userAvatarUrl = (info['avatar'] || '').split('@')[0];
    let user = {
        userId: _getUserId(userOriginalId),

        type: 'userProfile',

        origin: _origin,

        userOriginalId,

        url: _getUserUrl(userOriginalId),

        userName: info['nickName'],

        userAvatarUrl,

        followerCount: info['fans'] || null,
        followingCount: info['followers'] || null,

        listenCount: info['listens'] || null,

        description: decodeHtml(info['description']),
    };
    return user;
}


export function makeUserProfiles(info: any): Array<IUserProfile> {
    return info.map(userProfile => makeUserProfile(userProfile));
}


export function makeUserProfileMore(info: any): IUserProfile {
    let userFavoriteInfo = info['userFavoriteInfo'];

    let user = {
        userId: null,
        origin: _origin,

        type: 'userProfile',

        artistCount: userFavoriteInfo['artistCount'],
        albumCount: userFavoriteInfo['albumCount'],
        favoriteCollectionCount: info['userFavouriteCollectCount'],
    };
    return user;
}


export function makeAccount(info: any): IAccount {
    let userOriginalId = info['userId'].toString();
    let user: IUserProfile = {
        userId: _getUserId(userOriginalId),

        type: 'userProfile',

        origin: _origin,

        userOriginalId,

        userName: info['nickName'],
    };
    return {
        user,
        type: 'account',
        accessToken: info['accessToken'],
        refreshToken: info['refreshToken'],
    };
}
