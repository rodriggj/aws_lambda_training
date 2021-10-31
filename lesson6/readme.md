# Hands-On Examples 

**Objective**
> Implement our lambda function `greetMe` which provides for path and query paramaters to API Gateway to learn how these services work together to provide path and query paramater funcitonality. 

### 1. Adding `greetMe` lambda to API Gateway & configuring API Gateway Proxy

1. Here we are going to create an endpoint that can access our `greetMe` function that was built in _lesson5_. 
- [ ] Nav to API Gateway

2. We need to create a _New Resource_ on our API Gateway console. Under the existing `/message` endpoint. Create a _New Resource_ 
- [ ] Click _/message_
- [ ] Click `Actions`/`Create Resource`
- [ ] For `Resource Name` enter _greet_
- [ ] For `Resource Path` enter _{name}_. 
- [ ] Click `Create Resource`

>**NOTE:** Use of the {} will parameterize the variable as a `path parameter`. Recall that ? will paramaterize the following _key=value_ string as a Query Parameter.

3. Now that we've created our resource we need to know provide the resource with an HTTP method. 

- [ ] Click the `/{name}` endpoint 
- [ ] Click `Actions` / `Create Method`
- [ ] Click `GET` and Click the _checkmark_ radial button


4. Now we can setup our Integration Method. When the screen redircts we can point our `{greet}` endpoint to our lambda function. 

- [ ] Select `Lambda Function`
- [ ] Select `Use Lambda Proxy Integration`
- [ ] Select the `greetMe` lambda function 
- [ ] Click `Save`

> **NOTE:** The `Use Lambda Proxy Integration` button, what you're doing is passing the request and response as a `raw` payload to / from lambda. There is no transformation, when you select this button. That is why in our lambda function instead of simply using the `return` statement, we needed to provide an HTTP well-formed response Object with a body, and status code. 
>
>_When using Proxy Integration you **CANNOT USE** Request / Response Mapping Templates in the Integration Blocks of API Gateway._

5. Now you can test the GET request. 

- [ ] Click `Test`
- [ ] For path parameter _name_ enter `John`
- [ ] For query parameters enter _lang=it_. You can add additional query params which will map to our _info_ node in our response. Try _lang=it&city=milan&country=italy_
- [ ] Click `test` and you should see the intened response

6. To test this endpoint from a client outside of API Gateway we need to deploy the API using API Gateway. 

- [ ] Select the `/name` endpoint
- [ ] Click `Actions` / `Deploy API`
- [ ] Under `Deployment Stage` click _test_
- [ ] The Endpoint will be presented to you, click on the endpoint. Of course this won't work b/c this is the root, and we need to add our path
- [ ] On the endpoint add to the end `/message/Gabe?lang=it` for example. 
- [ ] Your response should return `Ciao Gabe`

>**NOTE:** There is an edge case we didn't account for. If you pass no path or query params the lambda provides an error response. We can fix this by returning an empty object if no params are provided. To do this modify your lambda code as follows. Here we are assigning an empty object vs. a null value when no params are provided. Test in the API Gateway &/or Lambda console. 

```javascript 
// Was
let { lang, ...info } = event.queryStringParameters

// Change to 
let { lang, ...info } = event.queryStringParameters || {};
```

---------

### 2. Configuring CORS on API Gateway

> When we test this application we get a successful 200 responses, but that may not always be the case. If we were to send this request from some other domain, we may be presented with a `Cross Origin Resource Sharing` (CORS) error in the browser. To hand this using API Gateway we need to enable CORS which will pass a few Headers (`Allow Access` and an `Options` header)  that will handle this error for us; but this needs to be configured on API Gateway **AND** in our Lambda function. 

1. Open a new tab in `test-cors.org`, copy/paste our endpoint URL in this interface. Try to send the request and you will see an error `Access-Control-Allow-Origin`.

2. Open the API Gateway. Remember **because we are using the `Gateway Proxy Integration` we cannot use the `Integration Response` block to enable CORS so we have to include a response Header in our Lambda function**. This will now become a 2 part process 
    - [ ] on the /{name} endpoint click `Actions` / `Enable CORS`. This will enabel the `Options` header which will allow the `preflight` request to pass from any domain.
    - [ ] Now nav to the Lambda `greetMe` and modify the lambda response Object to include the following: 

```javascript 
return {
    statusCode: 200, 
    headers: {
        "Access-Control-Allow-Origin": "*"
    }, 
    body: JSON.stringify(response)
}
```

3. Send the request again on `test-cors.org` and you will see the there is no more error and an HTTP 200 response is submitted. 

---------

### 3. Request Validators

> Recall that there is a `Method Request` block in our API Gateway. In this block we can make sure we process any validators prior to the Lambda function processing the request. In this case we want to make sue that our request to the `greetMe` lambda function **HAS** a query paramater for at least **lang**.

- [ ] In the `Method Request` block of our `/name` GET endpoint click `Request Validator`
- [ ] You will be presented with a drop down. We don't have a body in our GET request, so select `Validate query string parameters and headers`, and click `check` radial button
- [ ] Now we have 2 options to configure our validator: 
    + 1. We can add specific `headers` or 
    + 2. We can configure `URL Query String Parameters`, click the `+` button and enter `lang`, click the `checkmark` radial button, and finally check the  `required` radial button.

> Now the `Method Request` will have some logic to check prior to sending to the `Integration Request` block and the `greetMe` lambda function. In a case where the user doesn't provide the `lang` query parameter in the request, the validator will fail, and never be passed downstream. 

- [ ] Before testing in the browser, make sure you `Deploy the API`, then test. 

-----------

