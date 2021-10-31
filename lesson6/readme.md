# Hands-On Examples 

**Objective**
> 

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

> **NOTE:** The `Use Lambda Proxy Integration` button, what you're doing is passing the request and response as a `raw` payload to / from lambda. There is no transformation, when you select this button. That is why in our lambda function instead of simply using the `return` statement, we needed to provide an HTTP well-formed response Object with a body, and status code. 
>
>_When using Proxy Integration you **CANNOT USE** Request / Response Mapping Templates in the Integration Blocks of API Gateway._

