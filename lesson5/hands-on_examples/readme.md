# Hands-On Examples

>**OBJECTIVE**
> Review some hands-on examples of typical use cases that will require configuration in AWS Lambda.

## 1. Passing Parameters via the Event Object
1. Create a dir structure & `index.js` file

```s
mkdir hands-on_examples/greeting
cd greeting
code index.js
```

2. Create an Object named `greeting` to contain various salutations. 

```javascript
const greeting = {
    "en": "Hello!", 
    "fr": "Bonjour!", 
    "hi": "Namaste!", 
    "es": "Hola", 
    "pt": "Ola", 
    "ur": "Assalamo aleikum", 
    "it": "Ciao", 
    "de": "Hallo"
}
```

3. Write the boilerplate lambda `handler` function as an _async_ function 

```javascript
exports.hander = async (event, context) => {

}
```

4. Review `query` vs `path` params in a url string 

```javascript
// Path params
https://<domain>/path_param/another_path_param
e.g. https://www.mydomain.com/test/greetme

// Query Params (aka "key")
https://<domain>/path_param?key=value&anotherKey=value
e.g. https://www.mydomain.com/test/greetme?en="us"
```

5. Implmenting `path params` in our lambda function. We will allow the user to enter thier _name_ as a path parameter. We will extract thier input from the url by calling the event object.

```javascript
exports.handler = async(event, context) => {
    let name = event.pathParameters.name
}
```

6. Implement `query params` by using some destructuring along with the spread opeartor, and the event source is the `queryStringParameters` attribute. 

```javascript 
exports.handler = async (event, context) => {
    let name = event.pathParameters.name
    let { lang, ...info } = event.queryStringParameters;
}
```

7. Finally let's construct our `message` that we will present back to the user. First check to see if the user provided a _greeting_ query param; if they did then we use it. If not we will default to "en" as the query param. 

```javascript 
exports.handler = async (event, context) => {
    let name = event.pathParameters.name
    let { lang, ...info } = event.queryStringParameters;
    
    let message = `${greeting[lang] ? greeting[lang] : greeting['en']} ${name}`
}
```

8. Finally we need to construct a response object to return back to the API Gateway so we consturct a response. In our response we provide the _message_ we created, we provide additional query params in the _info_ attribute, and we consturct a timestamp using the `moment` library. 

```javascript 
exports.handler = async (event, context) => {
    let name = event.pathParameters.name
    let { lang, ...info } = event.queryStringParameters;
    
    let message = `${greeting[lang] ? greeting[lang] : greeting['en']} ${name}`
    let response = {
        message: message, 
        info: info,
        timestamp: moment().unix()
    }
}
```

> **NOTE:** To utilize the `moment` library we have to create a package.json file which we can do within the active dir by running, `npm init`, and then once the `npm init` wizard completes, you can install `moment` with _npm i moment --save_ command. Finally, require moment libary at the top of your index.js file with _const moment=require('moment')_

9. In this step we need to _return_ the response to API Gateway. In the event we __WERE NOT__ using the API Gateway Proxy, we could simply return the response Object with `return response`. But since we __ARE__ using `API Gateway Proxy` the response Object needs to be formated in an HTTP Object with a status code attribute. 

```javascript 
// If NOT using API Gateway Proxy
exports.handler = async (event, context) => {
    let name = event.pathParameters.name
    let { lang, ...info } = event.queryStringParameters;
    
    let message = `${greeting[lang] ? greeting[lang] : greeting['en']} ${name}`
    let response = {
        message: message, 
        info: info,
        timestamp: moment().unix()
    }
    return repsonse
}

// When using API Gateway Proxy
exports.handler = async (event, context) => {
    let name = event.pathParameters.name
    let { lang, ...info } = event.queryStringParameters;
    
    let message = `${greeting[lang] ? greeting[lang] : greeting['en']} ${name}`
    let response = {
        message: message, 
        info: info,
        timestamp: moment().unix()
    }
    return {
        statusCode: 200, 
        body: JSON.stringify(response)
    }
}
```

10. Finally, we need to deploy this lambda function to AWS Lambda. We can upload to Lambda manually or using a Framework (SAM), or via CLI. Here we will simply upload manually. 
+ Nav to AWS Lambda Service
+ Create a new function from Scratch
+ Upload the zip file 
+ Nav to the Test events and select AWS Gateway Proxy
+ Modify the Sample Test Event `pathParmeters` to `"name": "Gabe"`
+ Modify the Test Event `queryStringParameters` to `"lang": "it"`
+ To test the "info" aspect of our function in our `queryStringParams` also add `"city":"Milan", "country": "Italy", "landmark":"Fountain of Lions"`
+ Name the Test Event if you haven't already and click `Create` 
+ Click `Deploy`
+ Click `Test`