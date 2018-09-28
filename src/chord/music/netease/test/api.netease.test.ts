'use strict';

import * as assert from 'assert';
import { suite, test } from 'mocha';

import { neteaseMusicApi as neteaseApi } from 'chord/music/netease/api';
import { encrypt } from 'chord/music/netease/crypto';


suite('music/netease/NeteaseMusicApi', () => {

    test('toAES', function() {
        encrypt({ a: 1 });
    });

    test('audios', async function() {
        let id = '108795';
        let r = await neteaseApi.audios(id);
    });

    test('songsAudios', async function() {
        let r = await neteaseApi.songsAudios(['185868', '1309814820']);
    });

    test('song', async function() {
        let id = '546769020';
        let song = await neteaseApi.song(id);
        assert.equal(song.songOriginalId, id);
    });

    test('album', async function() {
        let id = '18893';
        let album = await neteaseApi.album(id);
    });

    test('artist', async function() {
        let id = '10563';
        let artist = await neteaseApi.artist(id);
    });

    test('artistAlbums', async function() {
        let id = '10563';
        let artist = await neteaseApi.artistAlbums(id, 0, 1);
    });

    test('collection', async function() {
        let id = '2309425946';
        let collection = await neteaseApi.collection(id);
    });

    test('searchSongs', async function() {
        let keyword = 'linkin';
        let songs = await neteaseApi.searchSongs(keyword, 0, 1);
    });

    test('searchAlbums', async function() {
        let keyword = 'linkin';
        let albums = await neteaseApi.searchAlbums(keyword, 0, 1);
    });

    test('searchArtists', async function() {
        let keyword = 'linkin';
        let artists = await neteaseApi.searchArtists(keyword, 0, 1);
    });

    test('searchCollections', async function() {
        let keyword = 'linkin';
        let collections = await neteaseApi.searchCollections(keyword, 0, 1);
    });

    test('similarSongs', async function() {
        let id = '298317';
        let songs = await neteaseApi.similarSongs(id);
    });

    // test('similarArtists', async function() {
    // let id = '10563';
    // let artists = await neteaseApi.similarArtists(id);
    // });

    test('similarCollections', async function() {
        let id = '2394955929';
        let collections = await neteaseApi.similarCollections(id);
    });

});
