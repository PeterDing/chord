'use strict';

import * as assert from 'assert';
import { suite, test } from 'mocha';

import { xiamiApi } from 'chord/music/xiami/api';


suite('music/xiami/XiamiApi', () => {

    test('song', async function() {
        let song = await xiamiApi.song('1');

        let songId = song.songId;
        assert.equal(songId, 'xm|s|1');

        let songOriginalId = song.songOriginalId;
        assert.equal(songOriginalId, '1');

        let albumId = song.albumId;
        assert.equal(albumId, 'xm|a|1');
    });

    test('album', async function() {
        let album = await xiamiApi.album('1');

        let albumId = album.albumId;
        assert.equal(albumId, 'xm|a|1');

        let songsSize = album.songs.length;
        assert.equal(songsSize, 11);
    });

    test('collection', async function() {
        let collection = await xiamiApi.collection('398783788');

        let songsSize = collection.songs.length;
        assert.equal(songsSize > 0, true);

        let collectionId = collection.collectionId;
        assert.equal(collectionId, 'xm|c|398783788');
    });

    test('searchAlbums', async function() {
        let albums = await xiamiApi.searchAlbums('linkin');

        let albumsSize = albums.length;
        assert.equal(albumsSize, 20);
    });
});
