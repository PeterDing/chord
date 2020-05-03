'use strict';

import { IAudio } from 'chord/music/api/audio';
import { ISong } from 'chord/music/api/song';
import { ILyric } from 'chord/music/api/lyric';
import { IAlbum } from 'chord/music/api/album';
import { IArtist } from 'chord/music/api/artist';
import { ICollection } from 'chord/music/api/collection';
import { IUserProfile } from "chord/music/api/user";

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

import { makeLyric as _makeLyric } from 'chord/music/utils/lyric';


const _origin = 'qianqian';

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


function formatText(str: string): string {
    if (!str) return str;
    return str.replace(/<em>|<\/em>/g, '');
}


function formatHtml(str: string): string {
    if (!str) return str;
    return str.replace(/\n/g, '<br/>');
}


export function makeAudio(format: string): IAudio {
    let audio = {
        format: format != 'flac' ? 'mp3' : 'flac',
        size: null,
        kbps: format != 'flac' ? Number.parseInt(format) : 720,
        url: null,
    };
    return audio;
}


export function makeLyric(songId: string, lyricInfo: any): ILyric {
    if (!lyricInfo) return null;

    let lyric = _makeLyric(lyricInfo);
    lyric.songId = _getSongId(songId);
    return lyric;
}


export function makeSong(info: any): ISong {
    let songInfo = info['songinfo'] || info;

    let lyricUrl = songInfo['lrclink'];

    let audios = (songInfo['all_rate'] || '').split(',').map(a => makeAudio(a)).sort((x, y) => y.kbps - x.kbps);

    let songOriginalId = songInfo['song_id'].toString();

    let albumOriginalId = songInfo['album_id'].toString();
    let albumName = formatText(songInfo['album_title']);
    let albumCoverUrl = songInfo['pic_small'] ? songInfo['pic_small'].split('@')[0] : null;

    let artistOriginalId = songInfo['artist_id'].toString();
    let artistName = formatText((songInfo['artist'] || songInfo['author']).split(',')[0]);
    let artistMid = songInfo['artist_ting_uid'] || songInfo['ting_uid'];
    let artistAvatarUrl = songInfo['artist_500_500'] ? songInfo['artist_500_500'].split('@')[0] : null;

    let songName = formatText(songInfo['title']);

    let songWriters = songInfo['songwriting'] ? songInfo['songwriting'].split(',').map(i => formatText(i)) : null;
    let singers = songInfo['author'] ? songInfo['author'].split(',').map(i => formatText(i)) : null;

    let song: ISong = {
        songId: _getSongId(songOriginalId),

        type: 'song',
        origin: _origin,

        songOriginalId,

        url: _getSongUrl(songOriginalId),

        songName,

        songWriters,
        singers,

        albumId: _getAlbumId(albumOriginalId),
        albumOriginalId,
        albumName,
        albumCoverUrl,

        artistId: _getArtistId(artistOriginalId),
        artistOriginalId,
        artistMid,
        artistName,
        artistAvatarUrl,

        description: formatHtml(songInfo['info']),

        composer: songInfo['compose'],

        lyricUrl,

        track: songInfo['album_no'],
        cdSerial: 0,

        // millisecond
        duration: Number.parseInt(songInfo['file_duration']) * 1000,

        // millisecond
        releaseDate: Date.parse(songInfo['publishtime']),

        playCountWeb: songInfo['total_listen_nums'] || null,
        playCount: 0,
        likeCount: songInfo['collect_num'],

        audios,
    };
    return song;
}


export function makeSongs(info: any): Array<ISong> {
    return (info || []).map(songInfo => makeSong(songInfo));
}


export function makeAlbum(info: any): IAlbum {
    let albumInfo = info['albumInfo'] || info;

    let albumOriginalId = albumInfo['album_id'].toString();
    let albumName = formatText(albumInfo['title']);
    let albumCoverUrl = albumInfo['pic_small'].split('@')[0];

    let artistOriginalId = albumInfo['artist_id'].toString();
    let artistMid = albumInfo['artist_ting_uid'] || albumInfo['ting_uid'];
    let artistName = formatText(albumInfo['author']);

    let songList = info['songlist'];
    let songs = (songList || []).map(song => makeSong(song));

    let album: IAlbum = {
        albumId: _getAlbumId(albumOriginalId),

        type: 'album',
        origin: _origin,
        albumOriginalId: albumOriginalId,
        url: _getAlbumUrl(albumOriginalId),

        albumName,
        albumCoverUrl: albumCoverUrl,

        artistId: _getArtistId(artistOriginalId),
        artistOriginalId,
        artistMid,
        artistName,

        description: formatHtml(albumInfo['info'] || albumInfo['album_desc']),

        releaseDate: Date.parse(albumInfo['publishtime']) || 0,

        company: albumInfo['publishcompany'],

        songs: songs,
        songCount: albumInfo['songs_total'] ? Number.parseInt(albumInfo['songs_total']) : null,

        playCount: albumInfo['listen_num'] ? Number.parseInt(albumInfo['listen_num']) : null,
        likeCount: albumInfo['collect_num'],
    };
    return album;
}


export function makeAlbums(info: any): Array<IAlbum> {
    return (info || []).map(albumInfo => makeAlbum(albumInfo));
}


export function makeArtist(info: any): IArtist {
    let artistOriginalId = info['artist_id'].toString();
    let artistMid = (info['ting_uid'] || info['artist_ting_uid']).toString();
    let artistAvatarUrl = (info['avatar_small'] || info['avatar_middle'] || info['pic_small']).split('@')[0];
    let artistAlias = formatText(info['nickname']);
    let artistName = formatText(info['name'] || info['author']);

    let artist: IArtist = {
        artistId: _getArtistId(artistOriginalId),
        type: 'artist',
        origin: _origin,
        artistOriginalId: artistOriginalId,
        url: _getArtistUrl(artistMid),

        artistMid,
        artistName,
        artistAlias: artistAlias ? [artistAlias] : null,

        artistAvatarUrl,
        area: info['country'],

        description: formatHtml(info['intro'] || info['artist_desc']),

        songs: [],
        albums: [],

        playCount: info['listen_num'] ? Number.parseInt(info['listen_num']) : null,
        likeCount: info['collect_num'],
    };
    return artist;
}


export function makeArtists(info: any): Array<IArtist> {
    return (info || []).map(artistInfo => makeArtist(artistInfo));
}


export function makeCollection(info: any): ICollection {
    let collInfo = info['info'] || info;

    let collectionOriginalId = (collInfo['list_id'] || collInfo['diy_id']).toString();
    let collectionCoverUrl = collInfo['list_pic_small'] || collInfo['diy_pic'];
    if (collectionCoverUrl)
        collectionCoverUrl = collectionCoverUrl.split('@')[0];
    let tags = (collInfo['list_tag'] || collInfo['diy_tag'] || '').split(',').map(function(tag) { return ({ name: tag }); });

    let collectionName = formatText(collInfo['list_title'] || collInfo['diy_title']);

    let userInfo = collInfo['userinfo'] || collInfo;
    let userId = _getUserId((userInfo['userid'] || userInfo['user_id'] || '').toString());
    let userName = formatText(userInfo['username']);

    let collection: ICollection = {
        collectionId: _getCollectionId(collectionOriginalId),

        type: 'collection',
        origin: _origin,
        collectionOriginalId,
        url: _getCollectionUrl(collectionOriginalId),

        collectionName,
        collectionCoverUrl,

        userId,
        userName,

        releaseDate: collInfo['createtime'] * 1000,

        description: formatHtml(collInfo['list_desc']),

        tags,

        songs: [],
        songCount: info['song_num'],

        playCount: info['listen_num'],
        likeCount: info['collect_num'],
    };
    return collection;
}


export function makeCollections(info: any): Array<ICollection> {
    return (info || []).map(collectionInfo => makeCollection(collectionInfo));
}


export function makeUserProfile(info: any): IUserProfile {
    let userOriginalId = info['userid'].toString();
    let userAvatarUrl = info['userpic'].split('@')[0];
    let userName = formatText(info['username']);

    let countInfo = info['count_info'] || info;
    let followerCount = countInfo['follow_num'];
    let followingCount = countInfo['friend_num'];

    let userProfile = {
        userId: _getUserId(userOriginalId),

        type: 'userProfile',
        origin: _origin,

        userOriginalId: userOriginalId,
        url: _getUserUrl(userName),

        userName: userName,
        userAvatarUrl: userAvatarUrl,

        followerCount: followerCount,
        followingCount: followingCount,

        songCount: info['songFavoriteNum'],

        artistCount: info['artistFavoriteNum'],
        albumCount: info['albumFavoriteNum'],

        favoriteCollectionCount: info['diyFavoriteNum'],
        createdCollectionCount: null,

        description: formatHtml(info['desc']),
    };
    return userProfile;
}


export function makeUserProfiles(info: any): Array<IUserProfile> {
    return (info || []).map(userInfo => makeUserProfile(userInfo));
}
