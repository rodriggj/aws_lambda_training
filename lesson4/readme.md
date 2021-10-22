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

>**READS LIKE:** Here we are _exporting_ a function called _handler_ using typical NodeJs syntax. Within our _handler_ function, which is an _arrow function_ we pass 3 parameters, 1. the _event_ Object which is the triggering event coming from one of the AWS services (S3 bucket upload, API Gateway Call, etc.), 2. the _context_ will return data about the context of the function call (e.g. function name, execution time, etc.) & 3. a _callback_ function which will be invoked after the `...` code is ran (whatever that code maybe). We are then returning a result by calling _callback_ and passing in a _result_ parameter, which is what will come back from our `...` code. 

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

1. Lambda functions are _invoked_ via an event listener. The _event Object_ that triggers the invokation can come from several AWS Services, and the AWS Service will determine the contents of the _event payload_. 

+ In the AWS Console, on the AWS Lambda service page, at the top left-nav, you can see several of the services that can provide an _event invokation_ to the Lambda function. These services include: 

    + - [ ] API Gateway
    + - [ ] AWS IoT
    + - [ ] Alexa Skills
    + - [ ] CloudWatch Events 
    + - [ ] etc...

2. Lambda _Invokation Types_ can be either `synchronous` or `asynchronous`, depending on the AWS Lambda _event source_. For example, 
    - an `S3` event is always `asynchronous`
    - while an event from _API Gateway_ or _Cognito_ event is `synchronous`
    
>**NOTE:** Invokation types coming from the AWS Services **CANNOT** be controlled. The Invokation type on any AWS Service is set by AWS and cannot be modified. In our own applications, Developers can use the `AWS SDK` to control whether an event type coming from your own application is `sync` or `async` in nature. 

3. The method that AWS Lambda recognizes or receives an event is either through 
    - a `push` based notification, where the AWS service will _inform_ AWS Lambda that an event has been published (e.g. S3 and API Gateway), or 
    - a `pull/poll` based notification, where AWS Lambda will periodically ping the AWS service asking if there are any events that require processing (e.g Dynamo DB, Kinesis event, or SQS Message event)

------------

## 3. Sample Event Objects



