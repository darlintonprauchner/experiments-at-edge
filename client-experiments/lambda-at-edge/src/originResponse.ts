import {
    Callback,
    CloudFrontRequestEvent,
    CloudFrontRequestHandler,
    CloudFrontRequestResult,
    CloudFrontResponse,
    Context,
} from 'aws-lambda';

/*
    This origin-request is doing nothing, in fact it could be fully deleted, but it was kept here for the demo, so we know it exists.
*/

export const handler: CloudFrontRequestHandler = (
    event: CloudFrontRequestEvent,
    context: Context,
    callback: Callback<CloudFrontRequestResult>
): void => {
    // no-op
    const response: CloudFrontResponse = event.Records[0].cf.response;
    callback(null, response);
};
