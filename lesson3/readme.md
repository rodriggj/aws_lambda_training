# Integrate Lambda & API Gateway

>**OBJECTIVE**
>Integrate our `getRandomMessage` lambda function with our `/message` endpoint, and access the function response via a **GET** request.

## Procedure
1. Nav back to API Gateway

2. On the left-nav pane, select `Resources` > select the `/messages` **GET** method

3. On the `Integration Type` screen, change the selection from `Mock Response` to `Lambda Function`

4. Configure the `Integration Type > Lambda Function` selection 
    - [ ] For `Lambda Region` select the region you were in when you created the Lambda function (e.g. _us-west-2_)
    - [ ] In the dropdown for `Lambda Function` select the `getRandomMessages` function 
    - [ ] Click on `Save` button and confirm the `...switch to lambda integration` modal by clicking `Ok`
    - [ ] A new modal will pop-up asking to _...give permissions to API Gateway..._ to interact with Lambda > Click `Ok`

5. Go back to the `Method Execution` screen so we can `Test` the new configuration of the `/messages` endpoint change from a _Mock_ response to the _getRandomMessages_ lambda function. 
    - [ ] Click `Test`
    - [ ] You will be redirected to a screen asking for additional parameters. We don't have any so simply click `Test`
    - [ ] Verify that the `Response Body` returns a random string from the `messages` array that we configured in Lesson 2 when we created the Lambda function.

>**NOTE** previously when we mocked our response, we **DID NOT** return a String, but instead returned a JSON payload. This may matter that the format of the response is different. To correct this we can once again use our `Integration Response` block to modify/transform our response from the lambda function to the anticipated response of a JSON object. 

6. In our `Method Execution` screen click the `Integration Response` block
    - [ ] Expand the HTTP 200 status response, and click the `Mapping Templates` section, then click the `application/json` hyperlink
    - [ ] Here we can once again provide the format that we want API gateway to convert the lambda response to our calling client. Input the following code to create a JSON Object

```javascript
{
    "message": $input.body
}
```

>**NOTE** That we can access the lambda function response body, by utilizing the syntax `$input.body` instead of hardcoding the lambda response body in _Mapping Template_.

7. If you want to test this new change in the browser you will have to redeploy your API. 
    - [ ] Click in **GET** method on your `Method Execution` view in API Gateway
    - [ ] Click `Actions` > `Deploy API`
    - [ ] Select the `test` phase that we created previously, and ping the `/messages` endpoint
    - [ ] Verify that the new JSON Object is presented with a _random_ string response from the _getRandomMessage_ function we created on Lambda