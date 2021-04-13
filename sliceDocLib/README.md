
# Library Usage

| Functions                     | Description                                                                                                                                                                   | File           | Folder           |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- | ---------------- |
| `authenticateToS3()`          | To Authenticate to the s3 bucket using **accesskey, secretkey & ARN values**                                                                                                  | awsS3.js       | storage-services |
| `uploadToS3Middleware()`      | Middleware to upload files to the s3 bucket using **Multer** as middleware                                                                                                    | awsS3.js       | storage-services |
| `authenticateToDigiMocker()`  | To Authenticate to the digimocker using **email Id & password**                                                                                                               | digiMocker.js  | data-sources     |
| `getDocsFromMocker()`         | To get all the documents present in the digimocker using **email Id & auth-token**                                                                                            | digiMocker.js  | data-sources     |
| `getSpecificDocsFromMocker()` | To get a specfic document from the digimocker using **email Id auth-token & name** (as a param)                                                                               | digiMocker.js  | data-sources     |
| `authenticateToDrive()`       | To Authenticate to the google drive using the basic credentials (client id, client secret redirection url & token) and list the files present after successful authentication | googleDrive.js | data-sources     |
| `getDocsFromDrive()`          | To get a specific document from google drive as **response-type in array-buffer**                                                                                             | googleDrive.js | data-sources     |
| `getLinkData()`               | To get a image from the url or the link which is passed as param                                                                                                              | linkSource.js  | data-sources     |
