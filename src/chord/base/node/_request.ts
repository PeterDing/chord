'use strict';

import * as _requestPromise from 'request-promise';
import * as _request from 'request';


interface IMaxRetries {
    maxRetries?: number;
}

export type IRequestOptions = IMaxRetries & _requestPromise.Options;
export type IResponse = _request.Response;

export async function request(options: IRequestOptions): Promise<IResponse> {
    let resp = await _requestPromise(options);
    return resp;
}


const DEFAULT_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36',
};

const DEFAULT_OPTIONS: (url: string) => IRequestOptions =
    (url: string) => {
        return {
            method: 'GET',
            url: url,
            headers: DEFAULT_HEADERS,
            gzip: true,
            resolveWithFullResponse: false,
        };
    };

export async function htmlGet(url: string): Promise<IResponse> {
    return request(DEFAULT_OPTIONS(url));
}
