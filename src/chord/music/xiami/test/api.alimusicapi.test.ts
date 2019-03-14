'use strict';

import * as assert from 'assert';
import * as process from 'process';

import { suite, test } from 'mocha';

import { AliMusicApi } from 'chord/music/xiami/api';

const aliApi = new AliMusicApi();

const IN_CI = process.env.IN_CI;


suite('music/xiami/AliMusicApi', () => {

    /**
     * Net requests have some probability to be fail,
     * so we test these requests at local, missing at CI
    */
    if (IN_CI) return;

    test('audios', async function() {
        let audios = await aliApi.audios('1');
        assert.equal(audios.length > 0, true);
    });

    test('song', async function() {
        let song = await aliApi.song('1');

        let songOriginalId = song.songOriginalId;
        assert.equal(songOriginalId, '1');
    });

    test('songs', async function() {
        let songs = await aliApi.songs(['1', '2']);

        let size = songs.length;
        assert.equal(size, 2);

        let songOriginalId = songs[0].songOriginalId;
        assert.equal(songOriginalId, '1');
    });

    test('lyric', async function() {
        let id = '375918';
        let lyric = await aliApi.lyric(id);

        assert.equal(lyric.songId, `xiami|song|${id}`);
    });

    test('similarSongs', async function() {
        let songs = await aliApi.similarSongs('1');

        let size = songs.length;
        assert.equal(size > 0, true);
    });

    test('album', async function() {
        let album = await aliApi.album('1');

        let albumId = album.albumId;
        assert.equal(albumId, 'xiami|album|1');

        let songsSize = album.songs.length;
        assert.equal(songsSize, 11);

        let audios = album.songs[0].audios;
        assert.equal(audios.length > 0, true);
    });

    test('albums', async function() {
        let albums = await aliApi.albums(['1', '2']);

        let size = albums.length;
        assert.equal(size, 2);

        let albumId = albums[0].albumId;
        assert.equal(albumId, 'xiami|album|1');
    });

    test('artist', async function() {
        let artist = await aliApi.artist('1');

        let artistId = artist.artistId;
        assert.equal(artistId, 'xiami|artist|1');

        let name = artist.artistName;
        assert.equal(name, 'Alex');
    });

    test('artistSongs', async function() {
        let songs = await aliApi.artistSongs('1', 1, 1);

        let size = songs.length;
        assert.equal(size, 1);

        let name = songs[0].artistName;
        assert.equal(name, 'Alex');
    });

    test('artistSongCount', async function() {
        let size = await aliApi.artistSongCount('1');

        assert.equal(size > 0, true);
    });

    test('artistAlbums', async function() {
        let albums = await aliApi.artistAlbums('1', 1, 1);

        let size = albums.length;
        assert.equal(size, 1);

        let name = albums[0].artistName;
        assert.equal(name, 'Alex');
    });

    test('artistAlbumCount', async function() {
        let size = await aliApi.artistAlbumCount('1');

        assert.equal(size > 0, true);
    });

    test('similarArtists', async function() {
        let artists = await aliApi.similarArtists('1');

        let size = artists.length;
        assert.equal(size > 0, true);
    });

    test('similarArtistCount', async function() {
        let size = await aliApi.similarArtistCount('1');

        assert.equal(size > 0, true);
    });

    test('collection', async function() {
        let collection = await aliApi.collection('398783788');

        let songsSize = collection.songs.length;
        assert.equal(songsSize > 0, true);

        let collectionId = collection.collectionId;
        assert.equal(collectionId, 'xiami|collection|398783788');
    });

    test('searchSongs', async function() {
        let songs = await aliApi.searchSongs('linkin', 2, 1);

        let size = songs.length;
        assert.equal(size, 1);
    });

    test('searchAlbums', async function() {
        let albums = await aliApi.searchAlbums('linkin', 1, 1);

        let size = albums.length;
        assert.equal(size, 1);
    });

    test('searchArtists', async function() {
        let artists = await aliApi.searchArtists('linkin', 1, 1);

        let size = artists.length;
        assert.equal(size, 1);
    });

    test('searchCollections', async function() {
        let collections = await aliApi.searchCollections('linkin', 1, 1);

        let size = collections.length;
        assert.equal(size, 1);
    });

    test('songList', async function() {
        let songs = await aliApi.songList(5, 1, 1);

        let size = songs.length;
        assert.equal(size, 1);
    });

    test('albumListOptions', async function() {
        let options = await aliApi.albumListOptions();

        assert.equal(options.slice(-1)[0].type, 'order');
    });

    test('albumList', async function() {
        let albums = await aliApi.albumList(0, 0, 0, 0, 0, 1, 1);

        assert.equal(albums.length > 1, true);
    });

    test('collectionListOptions', async function() {
        let collections = await aliApi.collectionListOptions();
        console.log(collections);

        assert.equal(collections.length > 1, true);
    });

    test('collectionList', async function() {
        let collections = await aliApi.collectionList('古典', 'new', 1, 1);

        assert.equal(collections.length, 1);
    });

    test('newSongs', async function() {
        let songs = await aliApi.newSongs(1, 1);

        assert.equal(songs.length, 1);
    });

    test('newAlbums', async function() {
        let albums = await aliApi.newAlbums(1, 1);

        assert.equal(albums.length > 0, true);
    });

    test('newCollections', async function() {
        let collections = await aliApi.newCollections(1, 1);

        assert.equal(collections.length, 1);
    });

    test('logined', function() {
        let ok = aliApi.logined();

        assert.equal(ok, false);
    });

    test('userProfile', async function() {
        let id = '8539366';
        let userProfile = await aliApi.userProfile(id);

        assert.equal(userProfile.userOriginalId, id);
    });

    test('userFavoriteSongs', async function() {
        let id = '8539366';
        let songs = await aliApi.userFavoriteSongs(id, 1, 1);
        assert.equal(songs.length, 1);
    });

    test('userFavoriteArtists', async function() {
        let id = '8539366';
        let artists = await aliApi.userFavoriteArtists(id, 1, 1);
        assert.equal(artists.length, 1);
    });

    test('userFavoriteCollections', async function() {
        let id = '8539366';
        let collections = await aliApi.userFavoriteCollections(id, 1, 1);
        assert.equal(collections.length, 1);
    });

    test('userCreatedCollections', async function() {
        let id = '8539366';
        let collections = await aliApi.userCreatedCollections(id, 1, 1);
        assert.equal(collections.length, 1);
    });

    test('userRecentPlay', async function() {
        let id = '8539366';
        let songs = await aliApi.userCreatedCollections(id, 1, 1);
        assert.equal(songs.length, 1);
    });

    test('userFollowers', async function() {
        let id = '8539366';
        let followers = await aliApi.userFollowers(id, 1, 1);
        assert.equal(followers.length, 1);
    });

    // FAIL_SYS_UNAUTHORIZED_ENTRANCE::API访问入口未授权
    // test('userFollowings', async function () {
    //     let id = '8539366';
    //     let followings = await aliApi.userFollowings(id, 1, 1);
    //     assert.equal(followings.length, 1);
    // });

    test('recommendSongs', async function() {
        let songs = await aliApi.recommendSongs(1, 1);
        assert.equal(songs.length > 0, true);
    });

    test('recommendCollections', async function() {
        let collections = await aliApi.recommendCollections(1, 1);
        assert.equal(collections.length > 0, true);
    });
});
