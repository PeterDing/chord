'use strict';

import * as assert from 'assert';

import { suite, test } from 'mocha';

import { encrypt } from 'chord/music/migu/crypto';
import { MiguMusicApi } from 'chord/music/migu/api';

let api = new MiguMusicApi();

suite('music/migu/api', () => {

    /**
     * Net requests have some probability to be fail,
     * so we test these requests at local, missing at CI
    */

    test('encrypt', function() {
        encrypt('{"copyrightId":"60054704083","auditionsFlag":0}');
    });

    test('audios', async function() {
        let item = await api.audios('63388708595');
        assert.equal(item.length > 0, true);
    });

    test('song', async function() {
        let id = '63388708595';
        let item = await api.song(id);
        assert.equal(item.songOriginalId, id);
    });

    test('album', async function() {
        let id = '8592';
        let item = await api.album(id);
        assert.equal(item.albumOriginalId, id);
    });

    test('artist', async function() {
        let id = '127878';
        let item = await api.artist(id);
        assert.equal(item.artistOriginalId, id);
    });

    test('artistSongs', async function() {
        let id = '127878';
        let item = await api.artistSongs(id);
        assert.equal(item.length > 0, true);
    });

    test('artistAlbums', async function() {
        let id = '127878';
        let item = await api.artistAlbums(id);
        assert.equal(item.length > 0, true);
    });

    test('collection', async function() {
        let id = '162084668';
        let item = await api.collection(id);
        assert.equal(item.collectionOriginalId, id);
    });

    test('searchSongs', async function() {
        let item = await api.searchSongs('linkin');
        assert.equal(item.length > 0, true);
    });

    test('searchAlbums', async function() {
        let item = await api.searchAlbums('linkin');
        assert.equal(item.length > 0, true);
    });

    test('searchArtists', async function() {
        let item = await api.searchArtists('linkin');
        assert.equal(item.length > 0, true);
    });

    test('searchCollections', async function() {
        let item = await api.searchCollections('linkin');
        assert.equal(item.length > 0, true);
    });
});
