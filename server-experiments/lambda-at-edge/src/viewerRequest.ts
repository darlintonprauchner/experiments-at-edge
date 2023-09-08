import {
    Callback,
    CloudFrontRequest,
    CloudFrontRequestEvent,
    CloudFrontRequestHandler,
    CloudFrontRequestResult,
    Context,
} from 'aws-lambda';

import { init as LDInit } from '@launchdarkly/node-server-sdk';

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

    client.waitForInitialization().then(() => {
        console.log('Initiated LaunchDarkly');

        client.allFlagsState({ key: `anonymousUser-${Math.floor(Math.random() * 101)}` }, {anonimous: true}, (_, flagsState) => {
            console.log(`Flag state: ${JSON.stringify(flagsState.allValues())}`);

            const enabledFlags = {};
            let count = 0;

            for (const flagName of Object.keys(flagsState.allValues())) {
                const flagValue = flagsState.getFlagValue(flagName);
                
                console.log(`Flag whitelisted: ${flagName}: ${flagValue}`);
                enabledFlags[flagName] = flagValue;
            }

            headers[`flags`] = [{
                key: `flags`,
                value: JSON.stringify(enabledFlags)
            }];
            console.log(`Headers: ${headers}`);
        
            callback(null, request);
        });
    });
};
