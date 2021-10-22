# Fundamental Lambda 

>**OBJECTIVE**
> Review some core components / processes / etc. that are fundamental to having in depth understanding of Lambda Service.
> Specifically we will review the following 3 items: 
> - [ ] Lambda Handler Syntax with NodeJs
> - [ ] Addtional explanation of `event` Object
> - [ ] Sample Event Objects

## 1. Lambda Handler Syntax with NodeJS - `event`, `context`, & `callback`
> If using the NodeJS runtime for development of lambda functions there are some fundamental differences between runtime versions and function syntax that need to be understood to utilize NodeJS. 

 For example, assume we are going to write a funciton called `greetMe`. The syntax for such a function as a boilerplate _NodeJs_ function on Lambda would look something like this. 

1. We would create a directory called `greetMe`. 

2. Within the `greetMe` directory we would create a file called `index.js`. 

3. The contents of `index.js` in typical boiler plate _NodeJs_ syntax would look like this: 

```javascript 
exports.handler = (event, context, callback) => {
    ...

    callback(null, result)
}
```

>**READS LIKE:** Here we are _exporting_ a function called _handler_ using typical NodeJs syntax. Within our _handler_ function we are using _arrow function_ syntax and passing three(3) parameters:
>- [ ] the `event` Object which is the triggering event coming from one of the AWS services (S3 bucket upload, API Gateway Call, etc.), 
>- [ ] the `context` Object will return data about the context, or the runtime execution, of the function call (e.g. function name, execution time, etc.) & 
>- [ ] a `callback` function which will be invoked after the `...` code is ran (whatever that code maybe)
> 
> We are then returning a result by calling _callback_ and passing in a _result_ parameter, which is what will come back from our `...` code. 

4. We can write the same function, as an `async` function by some simple modifications: 

```javascript
exports.handler = async (event, context) => {
    ...

    return result
}
```

5. With an `async` function such as this, we can call other functions that may return a `promise`. For example assume we had a function such as `resizeImage` that returns a promise. We can couple our lambda function, _exports.handler_ with our _resizeImage_ function like this. 

```javascript
exports.handler = async (event, context) => {
    const data = event.data; 
    //resizeImage(data).then() or 
    let newImage = await resizeImage(data)
    return newImage
}

const resizeImage = (data) => new Promise(resolve, reject) => {
    ...
    ...
    if (error) {
        reject(error)
    } else {
        resolve(result);
    }
}
```

6. Using the `callback` style or the `async / await` style are both valid in a lambda function. 

---------

## 2. Additional explaintion -> `event` parameter

There are 3 things you need to remember regarding `events` with AWS Lambda: 
- [ ] `event` Objects are different depending on which AWS service invoked the event
- [ ] `Invokation` events can be `synchronous` or `asynchronous` depending on which AWS service fired the event
- [ ] an `event source` will either have a `push` or a `pull/poll` based event source

1. Lambda functions are _invoked_ via an event listener. The _event Object_ that triggers the invokation can come from several AWS Services, and the AWS Service will determine the contents of the _event payload_. We will explore a few of these _event payloads_ in `3. Sample Event Objects` section below.

+ In the AWS Console, on the AWS Lambda service page, at the top left-nav, you can see several of the services that can provide an _event invokation_ to the Lambda function. These services include: 

    + API Gateway
    + AWS IoT
    + Alexa Skills
    + CloudWatch Events 
    + etc...

2. Lambda _Invokation Types_ can be either `synchronous` or `asynchronous`, depending on the AWS Lambda _event source_. For example, 
    - an `S3` event is always `asynchronous`
    - while an event from _API Gateway_ or _Cognito_ event is `synchronous`
    
>**NOTE:** Invokation types coming from the AWS Services **CANNOT** be controlled. The Invokation type on any AWS Service is set by AWS and cannot be modified. In our own applications, Developers can use the `AWS SDK` to control whether an event type coming from your own application is `sync` or `async` in nature. 

3. The method that AWS Lambda recognizes or receives an event is either through 
    - a `push` based notification, where the AWS service will _inform_ AWS Lambda that an event has been published (e.g. S3 and API Gateway), or 
    - a `pull/poll` based notification, where AWS Lambda will periodically ping the AWS service asking if there are any events that require processing (e.g Dynamo DB, Kinesis event, or SQS Message event)

------------

## 3. The `event` Object(s)

A Developer can take a look at several of the `event Objects` that are fired from various AWS Services in the AWS Lambda console. 

1. Navigate to the AWS Lambda console
    - [ ] Right under the `Function Overview` component, is a vertical navbar, with several options to include `Test`. Click on `Test`
    - [ ] Select `New Event` radial button
    - [ ] In the `Template` field when selected will be a dynamically generated component with multple selection options of AWS Services that produce events that can invoke lambda functions. Select an option and view the event payload (e.g. `SQS Receive Message` vs. `CloudWatch Scheduled Event`)

```json
// sqs-receive-message
{
  "Records": [
    {
      "messageId": "19dd0b57-b21e-4ac1-bd88-01bbb068cb78",
      "receiptHandle": "MessageReceiptHandle",
      "body": "Hello from SQS!",
      "attributes": {
        "ApproximateReceiveCount": "1",
        "SentTimestamp": "1523232000000",
        "SenderId": "123456789012",
        "ApproximateFirstReceiveTimestamp": "1523232000001"
      },
      "messageAttributes": {},
      "md5OfBody": "{{{md5_of_body}}}",
      "eventSource": "aws:sqs",
      "eventSourceARN": "arn:aws:sqs:us-east-1:123456789012:MyQueue",
      "awsRegion": "us-east-1"
    }
  ]
}
```

```json
// cloudwatch-scheduled-event
{
  "id": "cdc73f9d-aea9-11e3-9d5a-835b769c0d9c",
  "detail-type": "Scheduled Event",
  "source": "aws.events",
  "account": "123456789012",
  "time": "1970-01-01T00:00:00Z",
  "region": "us-east-1",
  "resources": [
    "arn:aws:events:us-east-1:123456789012:rule/ExampleRule"
  ],
  "detail": {}
}
```

2. These event payloads can be used in our Lambda functions to establish business logic in our lambda invokations. 

---------

4. The `context` Object(s)

The context object provides information about the execution of the lambda function. Consider this object metadata that is used for reporting or logging purposes by AWS. The `context` Object not only provides metadata, but there are a suite of methods that can be called to provide input on the context as well. 

For example, assume that you executing some debugging, and needed to know how long before the lambda invokation will timeout? You can use the `context` object and the `getRemainingTime` method to find this out. 

```javascript 
exports.handler = async (event, context) => {
    // Will return remaining time in miliseconds before the lambda function timesout
    context.getRemainingTimeInMillis();

    // Will return the name, which is an attribute of the context Object, of the invoked function
    context.functionName;

    // Will return the name of the function version
    context.functionVersion;

    // Returns the Amazon Resource Name (arn) of the function
    context.functionArn;

    // Returns the request id of the current invokation
    context.awsRequestId;

    // Returns the memory limit of the invoked function
    context.memoryLimitMB;

    // Returns information from AWS Cognito about the identity provider
    context.identity;

    // Returns information about our logging information 
    context.logGroupName;
    context.logStreamName;

    // Returns information about the client application
    context.clientContext;
    context.clientContext.client.app_title
    context.clientContext.Custom
    context.clientContext.env.platform
    context.clientContext.env.make // model
}
```

>**RESOURCE:** Other uses of the `context` Object can be found in the AWS Documentation [here](https://docs.aws.amazon.com/lambda/latest/dg/nodejs-context.html)

----------

