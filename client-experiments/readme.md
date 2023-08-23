# Experiments@Edge
## Pre-Requisites

 - AWS Account
 - LaunchDarkly account

## Client A/B testing

### 1. Setup your AWS Credentials file
You should create your `~/.aws/credentials` with your `aws_access_key_id` and `aws_secret_access_key`:

```
[default]
aws_access_key_id=YOUR_STUFF_GOES_HERE
aws_secret_access_key=YOUR_SECRET_GOES_HERE
```

### 2. Install dependencies
```
   cd website-distribution
   npm i
```

### 3. Create the website and the CloudFront distribution

```
   sls deploy
```

### 4. Look for your distribution ID and URL

Browse to the [AWS CloudFront Distributions page](https://us-east-1.console.aws.amazon.com/cloudfront/v3/home?region=us-east-1#/distributions) and take note of the `ID` and `Domain name`, you'll need that later.

### 5. Quick test

Open the `Domain name` from the step above with your favourite browser.

**If you see a "green" page, written "Default Version", things are working so far.**

### 6. Prepare the lambdas that control the experiment

```
cd ...
cd lambda-at-edge
npm i
```

### 6.1 Add your LaunchDarkly API KEY

```
open src/viewerRequest.ts
```

Search for `YOUR_LAUNCH_DARKLY_API_KEY_GOES_HERE`, and replace by `LaunchDarkly SDK Key`, [found on LaunchDarkly Account Settings page](https://app.launchdarkly.com/settings/projects/default/environments).

### 7 Create your feature flag

Create a feature flag named `id-experiments-at-edge`, configure it to serve `a percentage rollout` by `user` `key`.

### 8. Define which distribution the Lambda@Edge are associated with

```
   open serverless.yml
```

Search for `YOUR_CLOUDFRONT_DISTRIBUTION_ID_GOES_HERE`, and replace by the `ID` from step 4.

### 9. Deploy your lambda@edge

```
   sls deploy
```

### 10. Final test

Reload the same page opened on step `5`, you should now see a `Blue` or `Red` variations of the page, dependent on your LaunchDarkly rollout configuration.

Also notice on cookies, you should see your unique customer identifier set on `cookie-exp-edge`.
