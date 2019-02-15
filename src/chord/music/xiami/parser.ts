'use strict';

import { decodeHtml } from 'chord/base/browser/htmlContent';

import { getAbsolutUrl } from "chord/base/node/url";

import { ISong } from "chord/music/api/song";
import { ILyric } from 'chord/music/api/lyric';
import { IAlbum } from "chord/music/api/album";
import { IArtist } from "chord/music/api/artist";
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

import { makeLyric } from 'chord/music/utils/lyric';


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
    let songInfo = info['songDetail'] || info;
    let songExtInfo = info['songExt'] || info;

    let lyricUrl = songInfo['lyricInfo'] ? songInfo['lyricInfo']['lyricFile'] : songInfo['lyric'];

    let audios = [];
    if (songInfo['listenFiles'] && songInfo['listenFiles'].length > 0) {
        audios = songInfo['listenFiles'].map(a => makeAudio(a)).sort((x, y) => y.kbps < x.kbps);
    } else {
        // block song audio may be at here
        let backupSong = songInfo['bakSong'];
        if (backupSong && backupSong['listenFiles'] && backupSong['listenFiles'].length > 0) {
            audios = backupSong['listenFiles'].map(a => makeAudio(a)).sort((x, y) => y.kbps - x.kbps);
        }
    }

    let styles = songExtInfo['songStyle'] ? (songExtInfo['songStyle']['styles'] || []).map(i => ({ id: i['id'].toString(), name: i['title'] })) : [];
    let tags = songExtInfo['songTag'] ? (songExtInfo['songTag']['tags'] || []).map(i => ({ id: i['id'].toString(), name: i['name'] })) : [];

    let songOriginalId = songInfo['songId'];

    let song: ISong = {
        songId: _getSongId(songOriginalId),

        type: 'song',
        origin: _origin,

        songOriginalId,

        url: _getSongUrl(songOriginalId),

        songName: songInfo['songName'],
        subTitle: songInfo['subName'],

        songWriters: songInfo['songwriters'],
        singers: songInfo['singers'],

        albumId: _getAlbumId(songInfo['albumId']),
        albumOriginalId: (songInfo['albumId'] || '').toString(),
        albumName: songInfo['albumName'],
        albumCoverUrl: songInfo['albumLogo'],

        artistId: _getArtistId(songInfo['artistId']),
        artistOriginalId: (songInfo['artistId'] || '').toString(),
        artistName: songInfo['artistName'],
        artistAvatarUrl: songInfo['artistLogo'],

        composer: info['composer'],

        styles,
        tags,

        lyricUrl,

        track: songInfo['track'],
        cdSerial: songInfo['cdSerial'],

        // millisecond
        duration: songInfo['length'],

        // millisecond
        releaseDate: songInfo['gmtPublish'] || songInfo['gmtCreate'] || (songExtInfo['album'] ? songExtInfo['album']['gmtPublish'] : null),

        playCountWeb: info['playCount'] || null,
        playCount: 0,

        audios,
    };
    return song;
}


export function makeSongs(info: any): Array<ISong> {
    return info.map(songInfo => makeSong(songInfo));
}


export function makeAliLyric(songId: string, info: any): ILyric {
    let lyric = makeLyric(info);
    lyric.songId = _getSongId(songId);
    return lyric;
}


export function makeAlbum(info: any): IAlbum {
    let albumOriginalId = info['albumId'].toString();
    let albumId = _getAlbumId(albumOriginalId);
    let albumCoverUrl = getAbsolutUrl(info['albumLogo'], _staticResourceBasicUrl);
    let albumName = info['albumName'];

    let artistOriginalId = info['artistId'].toString();
    let artistId = _getArtistId(artistOriginalId);
    let artistName = info['artistName'];

    let releaseDate = info['gmtPublish'] || info['gmtCreate'];

    let duration: number = 0;
    let songs = info['songs'].map(i => makeSong(i));
    songs.forEach(song => {
        duration += song.duration;
        if (!song.albumOriginalId) {
            song.albumOriginalId = albumOriginalId;
            song.albumId = albumId;
            song.albumCoverUrl = albumCoverUrl;
        }
        if (!song.artistOriginalId) {
            song.artistOriginalId = artistOriginalId;
            song.artistId = artistId;
        }
    });

    let album: IAlbum = {
        albumId: _getAlbumId(albumOriginalId),

        type: 'album',
        origin: _origin,

        albumOriginalId: albumOriginalId,
        url: _getAlbumUrl(albumOriginalId),

        albumName,
        albumCoverUrl,

        artistId,
        artistOriginalId,
        artistName,

        duration: duration,

        releaseDate,

        songs: songs,
        songCount: songs.length,
    };

    return album;
}


export function makeCollection(info: any): ICollection {
    let collectionOriginalId = info['listId'];
    let collectionId = _getCollectionId(collectionOriginalId);
    let collectionName = info['collectName'];
    let collectionCoverUrl = getAbsolutUrl(info['collectLogo'], _staticResourceBasicUrl);
    let tags: Array<ITag> = (info['tags'] || []).map(tag => ({ name: tag }));

    let songs: Array<ISong> = (info['songs'] || []).map(songInfo => makeAliSong(songInfo));
    let duration = songs.length != 0 ? songs.map(s => s.duration).reduce((x, y) => x + y) : null;

    let collection: ICollection = {
        collectionId,

        type: 'collection',
        origin: _origin,
        collectionOriginalId,
        url: _getCollectionUrl(collectionOriginalId),

        collectionName,

        collectionCoverUrl,

        userId: _getUserId((info['userId'] || '').toString()),
        userName: info['userName'],

        // TODO: updateDate
        // updateDate: info['gmtModify'],

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


export function makeArtist(info: any): IArtist {
    let artistOriginalId = info['artistId'];
    let artistId = _getArtistId(artistOriginalId);
    let artistAvatarUrl = getAbsolutUrl(info['artistLogo'], _staticResourceBasicUrl);
    let artistAlias = info['alias'].split('/').filter(a => a.trim() != '').map(a => a.trim());
    let artist: IArtist = {
        artistId,
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


function getKbps(str: string): number {
    let r = /m(\d{2,3})\./.exec(str.slice(0, 20));
    if (r) {
        return parseInt(r[1]);
    } else {
        return 128;
    }
}


function makeAudio(info: any): IAudio {
    let url = info['listenFile'] || info['url'];
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
        audios = info['listenFiles'].map(a => makeAudio(a)).sort((x, y) => y.kbps < x.kbps);
    } else {
        // block song audio may be at here
        let backupSong = info['bakSong'];
        if (backupSong && backupSong['listenFiles'] && backupSong['listenFiles'].length > 0) {
            audios = backupSong['listenFiles'].map(a => makeAudio(a)).sort((x, y) => y.kbps - x.kbps);
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
    let tags: Array<ITag> = (info['tags'] || []).map(tag => ({ name: tag }));
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

        userId: _getUserId((info['userId'] || '').toString()),
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
