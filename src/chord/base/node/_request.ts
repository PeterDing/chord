'use strict';

import * as _requestPromise from 'request-promise';
import * as _request from 'request';


interface IMaxRetries {
    maxRetries?: number;
}

export type IRequestOptions = IMaxRetries & _requestPromise.Options;
export type IResponse = _request.Response;

export async function request(options: IRequestOptions): Promise<IResponse> {
    return await _requestPromise(options);
}


const DEFAULT_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36',
};

const DEFAULT_OPTIONS: (url: string, headers?: any) => IRequestOptions =
    (url: string, headers?: any) => {
        return {
            method: 'GET',
            url: url,
            headers: { ...DEFAULT_HEADERS, ...(headers || {}) },
            gzip: true,
            resolveWithFullResponse: false,
        };
    };

export async function htmlGet(url: string, headers?: any): Promise<IResponse> {
    return request(DEFAULT_OPTIONS(url, headers));
}
