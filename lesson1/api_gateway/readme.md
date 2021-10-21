# API Gateway
>**OBJECTIVE**
>Create `hello-world` api endpoint using API Gateway. 

## Procedure
1. Nav to AWS Console., API Gateway Service

2. From left nav pane, 
    - [ ] Select `Resources`. 
    - [ ] On `Resources` view select `Actions`
    - [ ] Select `Create Resource`

3. Configure the `Resource` 
    - [ ] On the _Resource Name_ field enter `message`
    - [ ] On the _Resource Path_ field enter `/message`
    - [ ] Click `Create Resource` button

4. Create an HTTP Method to associate with your `Resource`
    - [ ] Click `Actions`, click `GET` method, click the _Checkmark Button_
    - [ ] Configure the _Integration Method_ in this case we will choose the _Mock_ method, click `Save`

5. You will now be redirected to the _Method Execution Screen_. The general flow of thi execution engine is as follows
    1. The _client application_ will submit an inbound HTTP request
    2. The request will be passed to the `Method Request` block, which simply acknowledges the HTTP method of the request
    3. The `Method Request` block will pass the request to the `Integration Request` block, which will execute any transform logic we have implemented for _requests_
    4. The request will now be passed to the `Backend Server`. In this case it is a mock response so there is no _Backend_, but this is where we will wire `Lambda Functions` later.
    5. The _Backend_ will process the request, and pass the _response_ to another `Integration` block which will transform any _Response_ payload
    6. The `Integration` block once finished with its transform, will pass the _response_ to the `Method Response` block, which will maintain the Response Payload. 
    7. The _Response_ payload is then rendered back to the _client_ application and the request/response cycle is complete. 

6. Now that you understand the flow, lets format a _Mock Response_ as a JSON String to return to the calling client application. To do this we configure the `Integration Response` block in our flow.  
    - [ ] Click on the `Integration Response` block
    - [ ] Expand the _response_ for HTTP 200 Status. 
    - [ ] Under `Mapping Templates`, click on the `application/json` content type. This is where we will be presented with a _text editor_ where we can define our mock response. 
    - [ ] For our mock response lets return a string as follows, and click `Save`
```json
{
    "message": "Hello from API Gateway"
}
```

7. Now that this configuration is complete, all we have left is to deploy our API. 
    - [ ] From the `Actions` menu select `Deploy API`
    - [ ] In the `Deploy API` modal, enter _[New Stage]_ in the `Deployment Stage` field.
    - [ ] In the `Stage Name` enter _Test_, and click `Deploy` button

8. If you are not redirected already, on the left-nav pane, click `Stages`. Here you will see the endpoint that was produced mapping to our `test` API we just configured. If you click on this URL you will be redirected in the browser, and will see an _ERROR Message_ indicating that we are _Missing Authentication Token_. This is because when we clicked on the API URL we were taken to the _root_ of our API, and we **DO NOT** have a _GET_ method on our root. We need to append to the URL string the `/message` path parameter to initiate the request to the server and return our Mock Endpoint. 

```javascript
// This is the root path, which we did not configure a GET method for, and therefore won't work
http://<<amazon issued URL>>/test

// Change to /message where we configured a GET method to see our Mock response
http://<<amazon issued URL>>/test/message
```

9. We can also execute this test using the `Test` function in the API Gateway. 