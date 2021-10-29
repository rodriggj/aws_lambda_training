# Lambda Function
>**OBJECTIVE**
>Create our first _lambda function_

## Procedure
1. Nav to AWS Console, Lambda 

2. Click `Create Function`, when the page redirects, click `Author from Scratch`

3. Configure the _Lambda Function_
    - [ ] In the `Function Name` field enter _getRandomMessage_
    - [ ] In the `Runtime` field select _Node.js <<version>>_
    - [ ] Click on the `Create Function` button

>**NOTE** Previous versions of the Lambda interface required that you specify or create an `IAM Role`. The new Lambda interface assumes by default that it will create a role. You can leave the default setting unless you have a role created previously. By default the policy you are enabling is allowing the role access to `CloudWatch` logs, so the role can write logging information to `AWS CloudWatch` service.

4. When the Lambda function is created you will be redirected to a new screen. Here you will see an editor, with an `handler function` created within a file called `index.js`. 

```javascript
exports.handler = async (event) => {
    // TODO implement
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
    return response;
};
```

5. Here we can modify this function and pass in an array that will contain some random messages. Modify the `handler function` to the following: 

```javascript
const messages = [ 
    "Hello World", 
    "Hello Serverless", 
    "Its a great day", 
    "Yay, I'm learing something new", 
    "On cloud nine", 
    "Over the moon", 
    "Shooting for the stars", 
    "On top of the world", 
    "World at my feet", 
    "Doing the things I love"
]

exports.handler = (event, context, callback) => {
    let message = messages[Math.floor(Math.random()*10)]
    callback(null, message)
};  
```

6. Click `Deploy`. 

7. Click `Test`. You may be prompted to configure a test event by a modal screen popping up. If so provide a `Test Event Name`, like _myEvent_ and click `Save`. Leave the default payload as is. Click the `Test` button, and you should see a random message appear in the UI as you configured in the Lambda function. 