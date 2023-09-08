import {
    Callback,
    CloudFrontRequest,
    CloudFrontRequestEvent,
    CloudFrontRequestHandler,
    CloudFrontRequestResult,
    Context,
} from 'aws-lambda';
import { HEADER_KEY } from './constants';

/*
The origin-request reads the experiment header that was generated in the previous step and modifies the request. 
CloudFront will then route the request to the corresponding URI in case of a cache miss.
*/

export const handler: CloudFrontRequestHandler = (
    event: CloudFrontRequestEvent,
    context: Context,
    callback: Callback<CloudFrontRequestResult>
): void => {
    const request: CloudFrontRequest = event.Records[0].cf.request;
    const headers = request.headers;

    const headerValue = headers[HEADER_KEY] && headers[HEADER_KEY][0] && headers[HEADER_KEY][0].value;
    console.log(`Header variation: ${headerValue}`);

    if (headerValue) {
        // If there is an experiment assigned by viewerRequest.ts, then we use it to change the URI
        const experiment = JSON.parse(headerValue);
        if (experiment.variation !== 'Control') {
            const newURI = `/index${experiment.variation}.html`;

            console.log(`Requested URL: ${request.uri}`);
            request.uri = newURI;
            console.log(`Assigned URL: ${request.uri}`);
        }
    }
    
    callback(null, request);
};
