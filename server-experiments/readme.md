# Experiments@Edge
## Pre-Requisites

 - AWS Account
 - LaunchDarkly account (with Experiments enabled)

## Server A/B testing

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

### 2 Create a few feature flags

Just follow your dreams, anything goes.

### 3. Install dependencies
```
   cd lambda-url-distribution
   npm i
```

### 4. Create the lambda URL and the CloudFront distribution

```
   sls deploy
```

### 5. Look for your distribution ID and URL

Browse to the [AWS CloudFront Distributions page](https://us-east-1.console.aws.amazon.com/cloudfront/v3/home?region=us-east-1#/distributions) and take note of the `ID` and `Domain name`, you'll need that later.

### 6. Quick test

Open the `Domain name` from the step above with your favourite browser.

**If you see "hello world" and no feature flags, things are working so far**

### 7. Prepare the lambdas that enrich the feature flags

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

Reload the same page opened on step `6`, you should now see all the feature flags now listed. This demonstrates how we can compose feature flag gathering outside of your codebase, and simply use them as an always readilly availalbe tool.
