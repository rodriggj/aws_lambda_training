# Hands-On Examples 

**Objective**
> Implement our lambda function `greetMe` which provides for path and query paramaters to API Gateway to learn how these services work together to provide path and query paramater funcitonality. 

### Adding `greetMe` lambda to API Gateway & configuring API Gateway Proxy

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

### Configuring CORS on API Gateway

