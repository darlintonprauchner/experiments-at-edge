import {
    Callback,
    CloudFrontRequest,
    CloudFrontRequestEvent,
    CloudFrontRequestHandler,
    CloudFrontRequestResult,
    Context,
} from 'aws-lambda';

import { v4 as uuidv4 } from 'uuid';
import { init as LDInit } from '@launchdarkly/node-server-sdk';

import { getCookie } from './utils';
import { COOKIE_KEY, HEADER_KEY } from './constants';

/*
    We are generating a unique identifier for this session, which will be persisted and common across all the requests.
    Based on this unique identifier, we can consistently assign a version of the experiment (A or B) - altough it could be multivariate.

    We are using a cookie to keep this persistence.
*/

const client = LDInit('LD_SERVER_SDK_KEY_GOES_HERE');
// Environment Variables restricted for Lambda@Edge
// https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/edge-functions-restrictions.html

export const handler: CloudFrontRequestHandler = (
    event: CloudFrontRequestEvent,
    context: Context,
    callback: Callback<CloudFrontRequestResult>
): void => {
    // Do not wait for an empty event loop
    context.callbackWaitsForEmptyEventLoop = false;

    const request: CloudFrontRequest = event.Records[0].cf.request;
    const headers = request.headers;
    console.log(`Read request from CloudFront: ${JSON.stringify(request)}`);

    let uniqueCustomerIdentifier = getCookie(headers, COOKIE_KEY);
    console.log(`Existing Unique Customer Identifier: ${uniqueCustomerIdentifier}`);

    if (!uniqueCustomerIdentifier) {
        // First visit, generate ID
        uniqueCustomerIdentifier = uuidv4();
        console.log(`Generated new Unique Customer Identifier: ${uniqueCustomerIdentifier}`);

        // Add as cookie
        const cookie = `${COOKIE_KEY}=${uniqueCustomerIdentifier}`;
        headers.cookie = headers.cookie || [];
        headers.cookie.push({ key: 'Cookie', value: cookie });
    }

    // In a real world scenario, the block bellow sets a cookie with the variation assigned, with a TTL
    // This will make it so it runs only once, for optimal performance
    // I'm not doing it here, so that I can increase/decrease it on the fly for demo purposes
    client.waitForInitialization().then(() => {
        console.log('Initiated LaunchDarkly');

        client.variation('id-experiments-at-edge-client-side', { key: uniqueCustomerIdentifier }, false, (_, variation) => {
            console.log(`Variation assigned: ${variation}`);
            
            // Header will be consumed on originRequest.ts
            const headerValue = JSON.stringify({ variation });
            headers[HEADER_KEY] = [{
                key: HEADER_KEY,
                value: headerValue
            }];
            console.log(`Updated headers: ${JSON.stringify(headers)}`);
        
            callback(null, request);
        });
    });
};
