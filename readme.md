# AWS Serverless Training 

## Objective
> Objective is to complete the AWS Course Training provided from Udemy. Course name is `AWS Lambda & Serverless Architecture Bootcamp` provided by Riyaz Sayyad. 

## Process 

### Lesson 1: AWS API Gateway
> Create an endpoint `/messages` with a **GET** HTTP method deployed to a `test` stage.

### Lesson 2: AWS Lambda Function 
> Initial lesson on creating first lambda function, `getRandomMessages` which returns a String response when called. 

### Lesson 3: Integrating Lambda Function with API Gateway
> Configure the `/messages` endpoint created in **Lesson 1** to call the `getRandomMessages` Lambda Function when an HTTP GET request is iniated by the client.

### Lesson 4: AWS Lambda Deep Dive
> Evaluate the AWS Lambda Service console, and explore additional topics that make the AWS Lambda functions work as our application back-end. Examples include the NodeJs syntax and parameters used for a function call (e.g. `event`, `context`, & `callback`). The `event` Object and how it works. The `context` Object and how it works. Logging / Error Handling, etc. 

### Lesson 5: Hands-On Excercise: `greetMe` Lambda
> Here we build a `greetMe` Lambda function. This function is triggered by an `AWS API Gateway Proxy` event, which we manipulate the event Object to include `pathParams` and `queryParams`. We then install a dependent library `moment` to create a timestamp. We deploy our code to AWS lambda using the `zip file / file upload` process and then test the lambda function with the API Gateway Proxy event object.

### Lesson 6: Hands-On Excercise: `greetMe` API Gateway
> Here we configure API gateway to provide access to the `greetMe` lambda function. We'll cover the use of `API Gateway Proxy` configuration, testing of the path and query parameters. Configuring `CORS`. 