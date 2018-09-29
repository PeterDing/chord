'use strict';

import * as assert from 'assert';
import { suite, test } from 'mocha';

import { qqMusicApi } from 'chord/music/qq/api';


suite('music/qq/QQMusicApi', () => {

    test('song', async function() {
        let r = await qqMusicApi.song('307012');
    });

    test('album', async function() {
        let r = await qqMusicApi.album('4681996');
        // console.log(JSON.stringify(r, null, 4));
    });

    test('artist', async function() {
        let r = await qqMusicApi.artist('2923');
        // console.log(JSON.stringify(r, null, 4));
    });

    test('artistSongs', async function() {
        let r = await qqMusicApi.artistSongs('2923');
        // console.log(JSON.stringify(r, null, 4));
    });

    test('artistAlbums', async function() {
        let r = await qqMusicApi.artistAlbums('002J4UUk29y8BY');
        // console.log(JSON.stringify(r, null, 4));
    });

    test('collection', async function() {
        let r = await qqMusicApi.collection('3846594859');
        // console.log(JSON.stringify(r, null, 4));
    });

    test('searchSongs', async function() {
        let r = await qqMusicApi.searchSongs('linkin');
        // console.log(r)
        assert.equal(r.length, 10);
    });

    test('searchAlbums', async function() {
        let r = await qqMusicApi.searchAlbums('linkin');
        // console.log(r)
        assert.equal(r.length, 10);
    });

    test('searchCollections', async function() {
        let r = await qqMusicApi.searchCollections('linkin');
        // console.log(r)
        assert.equal(r.length, 10);
    });

});

