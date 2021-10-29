const im = require('imagemagik')
const fs = require('fs')
const os = require('os')
const uuidv4 = require('uuid/v4')
const { promisify } = require('util')
const AWS = require('aws-sdk')

AWS.config.update( {region: 'us-west-2'} )
const s3 = AWS.s3()

// the Following functions utilize a callback within thier functions. To utilze an async function with a promise we need a means to override the callback 
// and pass a promise which is what the promisify library will do. 

// 5. utilize the promisify library to execute an async function on the resize image request
const resizeAsync = promisify(im.resize)
// 9. utiize the readFile function to read the newly created image resize object
const readFileAsync = promisify(fs.readFile)
//10. you need to unlink the file once we are done reading it so we need to execute a function to do this 
const unlinkAsync = promisify(fs.unlink)

exports.handler = async (event) => {

    // 1. get the Records Object from the S3 event and map over all records
    let filesProcessed = event.Records.map(async (record)=> {

        // 2. retrieve the bucket information 
        let bucket = record.s3.bucket.name
        let fileName = record.s3.object.key
        
        // 3. get the file from s3
        var params = {
            BucketName: bucket, 
            FileName: fileName
        }

        // 4. utilze the aws sdk to execute a get call to the s3 bucket. It does not return a promise so you can call .promise() on this get call
        let inputData = s3.getObject(params).promise()

        // resize the file 
        // 6. identify a temp directory used by AWS Lambda and concat a unique id to the temp dir on the os
        let tempFile = os.tmpdir() + '/' + uuidv4() + '.jpg'

        // 7. pass some resize args to the image input file
        let resizeArgs = {
            srcData: inputData.Body, 
            dstPath: tempFile, 
            width: 150
        }

        // 8. call the resizeAsync function to process this image resize activity as a async event
        await resizeAsync(resizeArgs)

        // read the resized file
        // 11. now that we have handed the fs callback components and made them promises we can read the file
        let resizedData = await readFileAsync(tempFile)

        // post the resized image to s3
        //12. now that we have the target file name we can repost to S3
        let targetFileName = fileName.substring(0, fileName.lastIndexOf('.')) + `-small.jpg`

        //13. Now you need to recreate the params object to pass to the s3 put method
        var params = {
            Bucket: bucket + `-dest`, 
            Key: targetFileName, 
            Body: new Buffer(resizedData),
            ContentType: 'image/jpeg',
        }

        //14. call the s3 put method
        await s3.putObject(params).promise()
        return await unlinkAsync(tempFile)
    })

    // process all promises returned from the Records.map() call
    await Promise.all(filesProcessed)

    // display to user console that processing is complete
    console.log(`Done...`)

    // return a string "Done"
    return "Done"
}