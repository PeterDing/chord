// 'use strict';
// 
// import { Logger, LogLevel } from 'chord/platform/log/common/log';
// import { filenameToNodeName } from 'chord/platform/utils/common/paths';
// const loggerWarning = new Logger(filenameToNodeName(__filename), LogLevel.Warning);
// 
// import { querystringify } from 'chord/base/node/url';
// import { request, IRequestOptions, htmlGet } from 'chord/base/node/_request';
// 
// import { IAudio } from 'chord/music/api/audio';
// import { ISong } from 'chord/music/api/song';
// import { ILyric } from 'chord/music/api/lyric';
// import { IAlbum } from 'chord/music/api/album';
// import { IArtist } from 'chord/music/api/artist';
// import { ICollection } from 'chord/music/api/collection';
// import { TMusicItems } from 'chord/music/api/items';
// 
// import { IUserProfile } from 'chord/music/api/user';
// 
// import { ESize, resizeImageUrl } from 'chord/music/common/size';
// 
// import { encryptParams, encryptPass } from 'chord/music/qianqian/crypto';
// 
// import {
//     makeLyric,
//     makeSong,
//     makeSongs,
//     makeAlbum,
//     makeAlbums,
//     makeArtist,
//     makeArtists,
//     makeCollection,
//     makeCollections,
//     makeUserProfile,
//     makeUserProfiles,
// } from 'chord/music/ximalaya/parser';
// 
// import {getUrl} from 'chord/music/ximalaya/crypto';
// 
// 
// export class Ximalaya {
// 
//     constructor() {
//     }
// 
// 
//     public async request(params: object, data?: string, url: string = QianQianApi.SERVER): Promise<any> {
//         let paramstr = querystringify(params);
//         url = url + '?' + paramstr;
// 
//         let options: IRequestOptions = {
//             method: 'GET',
//             url,
//             headers: QianQianApi.HEADERS,
//             body: data,
//             gzip: true,
//             resolveWithFullResponse: false,
//         };
//         let result: any = await request(options);
//         let json = JSON.parse(result.trim());
// 
//         if (json.error_code && json.error_code != 22000) {
//             loggerWarning.warning('[QianQianApi.request] [Error]: (params, response):', options, json);
//         }
// 
//         return json;
//     }
// 
// }
