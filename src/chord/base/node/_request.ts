'use strict';

import axios from 'axios';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { wrapper } from 'axios-cookiejar-support';

import { CookieJar } from 'chord/base/node/cookies';

// For node use HTTP adapter
// https://github.com/axios/axios/issues/552#issuecomment-262884004
if (global.axiosAdaptersHttp) {
    axios.defaults.adapter = global.axiosAdaptersHttp;
}

// Let axios to support cookiejar
// https://github.com/3846masa/axios-cookiejar-support/blob/fa23f1ac07/examples/wrap_static_axios.mjs
wrapper(axios);


interface IMaxRetries {
    maxRetries?: number;
}


const DEFAULT_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36',
};

// Extended Request Config
// https://github.com/3846masa/axios-cookiejar-support#extended-request-config
declare module 'axios' {
    interface AxiosRequestConfig {
        jar?: CookieJar;
    }
}

export type IRequestOptions = AxiosRequestConfig;
export type IResponse = AxiosResponse;

export async function request(url: string, options?: IRequestOptions): Promise<IResponse> {
    let resp = await axios(url, options);
    return resp;
}

export async function htmlGet(url: string, headers?: any): Promise<IResponse> {
    return await request(url, { method: 'GET', headers: { ...DEFAULT_HEADERS, ...(headers || {}) } });
}
