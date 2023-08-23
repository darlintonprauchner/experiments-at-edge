import {
    Callback,
    CloudFrontRequest,
    CloudFrontRequestEvent,
    CloudFrontRequestHandler,
    CloudFrontRequestResult,
    CloudFrontResponse,
    Context,
} from 'aws-lambda';

import { COOKIE_KEY } from './constants';
import { getCookie, setCookie } from './utils';

/*
The viewer-response will return the generated unique ID cookie in the Set-Cookie header.
*/

export const handler: CloudFrontRequestHandler = (
    event: CloudFrontRequestEvent,
    context: Context,
    callback: Callback<CloudFrontRequestResult>
): void => {
    const request: CloudFrontRequest = event.Records[0].cf.request;
    const headers = request.headers;
    const response: CloudFrontResponse = event.Records[0].cf.response;
    const cookieVal = getCookie(headers, COOKIE_KEY);

    if (cookieVal) {
        setCookie(response, `${COOKIE_KEY}=${cookieVal}`);
        callback(null, response);
        return;
    }
    
    callback(null, response);
};
