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
