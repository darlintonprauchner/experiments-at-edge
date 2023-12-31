# Experiments@Edge
## Pre-Requisites

 - AWS Account
 - LaunchDarkly account (with Experiments enabled)

## Client A/B testing

### 1. Tell me your secrets

#### 1.1 AWS Credentials
You should create your `~/.aws/credentials` with your `aws_access_key_id` and `aws_secret_access_key`:

```
[default]
aws_access_key_id=YOUR_STUFF_GOES_HERE
aws_secret_access_key=YOUR_SECRET_GOES_HERE
```

#### 1.2 LaunchDarkly Credentials
Using the IDE of your choice, let's do some smart "search and replace". 

| Search For                  	| Replace By                       	|
|-----------------------------	|----------------------------------	|
| LD_SERVER_SDK_KEY_GOES_HERE 	| Your LaunchDarkly SDK Key        	|
| LD_CLIENT_SIDE_ID_GOES_HERE 	| Your LaunchDarkly Client-side ID 	|

### 2 Configure your Experiments

1. Crete a feature flag named `id-experiments-at-edge-client-side`
 * Flag Variations: String
 * Variation 1: Control
 * Variation 2: A
 * Variation 3: B
 * Default Variations ON: Control
 * Default Variations OFF: Control
2. Enable feature flag `id-experiments-at-edge-client-side`
 * Split the traffic 1/3 for each variation
3. Create an experiment metric named `click-button-key`
 * Event kind: custom
4. Create an experiment
 * Name: Click driver
 * Hypothesis: High contrast drives clicks
 * Metric: `click-button-key`
 * Flag Variations: `id-experiments-at-edge-client-side`
 * Audience: 40% A; 40%B; 20%Control

### 3. Install dependencies
```
   cd website-distribution
   npm i
```

### 4. Create the website and the CloudFront distribution

```
   sls deploy
```

### 5. Look for your distribution ID and URL

Browse to the [AWS CloudFront Distributions page](https://us-east-1.console.aws.amazon.com/cloudfront/v3/home?region=us-east-1#/distributions) and take note of the `ID` and `Domain name`, you'll need that later.

### 6. Quick test

Open the `Domain name` from the step above with your favourite browser.

**If you see a "green" page, written "Default Version", things are working so far.**

### 7. Prepare the lambdas that control the experiment

```
cd ...
cd lambda-at-edge
npm i
```

### 8. Define which distribution the Lambda@Edge are associated with

```
   open serverless.yml
```

Search for `YOUR_CLOUDFRONT_DISTRIBUTION_ID_GOES_HERE`, and replace by the `ID` from step `5`.

### 9. Deploy your lambda@edge

```
   sls deploy
```

### 10. Final test

Reload the same page opened on step `6`, you should now see a `Blue` or `Red` (or even `Green`) variations of the page, dependent on your LaunchDarkly rollout configuration.

Also notice on cookies, you should see your unique customer identifier set on `cookie-exp-edge`.
