const awsS3Apis = require('./storage-services/awsS3')
const driveApis = require('./data-sources/googleDrive')
const mockerApis = require('./data-sources/digiMocker')
const linkApis = require('./data-sources/linkSource')

module.exports = {...awsS3Apis, ...driveApis, ...mockerApis, ...linkApis}