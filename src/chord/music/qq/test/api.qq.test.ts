'use strict';

import * as assert from 'assert';
import { suite, test } from 'mocha';

import { QQMusicApi } from 'chord/music/qq/api';

const qqApi = new QQMusicApi();


suite('music/qq/QQMusicApi', () => {

    test('audios', async function() {
        let audios = await qqApi.audios('228011930');
        assert.equal(audios.length > 0, true);
    });

    test('song', async function() {
        let id = '228011930'
        let song = await qqApi.song(id);

        let songOriginalId = song.songOriginalId;
        assert.equal(songOriginalId, id);
    });

    test('lyric', async function() {
        let lyric = await qqApi.lyric('228011930', '001Ar8Ya3b63M4');

        assert.equal(lyric.songId, 'qq|song|228011930');
    });

    test('album', async function() {
        let id = '5917989';
        let album = await qqApi.album(id);

        assert.equal(album.albumOriginalId, id);
    });

    test('artist', async function() {
        let id = '2923';
        let artist = await qqApi.artist(id);

        assert.equal(artist.artistOriginalId, id);
    });

    test('artistSongs', async function() {
        let id = '2923';
        let songs = await qqApi.artistSongs(id, 0, 1);

        let size = songs.length;
        assert.equal(size, 1);
    });

    test('artistAlbums', async function() {
        let id = '003wI8vE3k8cTY';
        let albums = await qqApi.artistAlbums(id, 0, 1);

        let size = albums.length;
        assert.equal(size, 1);
    });

    test('collection', async function() {
        let id = '6267000549';
        let collection = await qqApi.collection(id);

        let songsSize = collection.songs.length;
        assert.equal(songsSize > 0, true);

        let collectionOriginalId = collection.collectionOriginalId;
        assert.equal(collectionOriginalId, id);
    });

    test('searchSongs', async function() {
        let songs = await qqApi.searchSongs('linkin', 0, 1);

        let size = songs.length;
        assert.equal(size, 1);
    });

    test('searchAlbums', async function() {
        let albums = await qqApi.searchAlbums('linkin', 0, 1);

        let size = albums.length;
        assert.equal(size, 1);
    });

    test('searchCollections', async function() {
        let collections = await qqApi.searchCollections('linkin', 0, 1);

        let size = collections.length;
        assert.equal(size, 1);
    });

    test('songList', async function() {
        let songs = await qqApi.songList(1, 0, 1);

        let size = songs.length;
        assert.equal(size > 1, true);
    });

    test('albumListOptions', async function() {
        let options = await qqApi.albumListOptions();

        assert.equal(options.slice(-1)[0].type, 'sort');
    });

    test('albumList', async function() {
        let albums = await qqApi.albumList(5, 0, -1, -1, -1, -1, 0, 1);

        assert.equal(albums.length > 1, true);
    });

    test('collectionListOptions', async function() {
        let options = await qqApi.collectionListOptions();

        assert.equal(options.slice(-1)[0].type, 'sort');
    });

    test('collectionList', async function() {
        let collections = await qqApi.collectionList(3, 10000000, 0, 1);

        assert.equal(collections.length > 1, true);
    });

    test('newSongs', async function() {
        let songs = await qqApi.newSongs(0, 1);

        assert.equal(songs.length > 1, true);
    });

    test('newAlbums', async function() {
        let albums = await qqApi.newAlbums(0, 1);

        assert.equal(albums.length > 1, true);
    });

    test('newCollections', async function() {
        let collections = await qqApi.newCollections(0, 1);

        assert.equal(collections.length > 1, true);
    });

    test('logined', function() {
        let ok = qqApi.logined();

        assert.equal(ok, false);
    });

    test('recommendCollections', async function() {
        let collections = await qqApi.recommendCollections(0, 1);
        assert.equal(collections.length > 1, true);
    });
});

