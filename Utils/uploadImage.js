
let Path = require('path');
let async = require('async');
let Fs = require('fs');
let AWS = require("aws-sdk");
let mime = require('mime-types');
let fsExtra = require('fs-extra');
let Config = require('../Config');

AWS.config.update({
    accessKeyId: 'AKIAIH3ZM3V7ZKQMCBBA',
    secretAccessKey:'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'
});
let s3 = new AWS.S3();

let uploadFilesOnS3 = function (fileData,userId) {
    return new Promise((resolve, reject) => {
        let filename;
        let ext;
        let dataToUpload = [];
        filename = fileData.filename.toString();
        ext = filename.substr(filename.lastIndexOf('.'))
        fileData.original = getFileNameWithUserId(false, filename,userId);
        fileData.thumb = getFileNameWithUserId(true, filename || (filename.substr(0, filename.lastIndexOf('.'))) + '.jpg',userId);
        dataToUpload.push({
                path: Path.resolve('.') + '/uploads/' + fileData.thumb,
                finalUrl: 'https://cattle12.s3.ap-south-1.amazonaws.com/' + fileData.thumb,
            },
            {
                path: fileData.path,
                finalUrl: 'https://cattle12.s3.ap-south-1.amazonaws.com/' + fileData.original
            });
        //console.log("___d",dataToUpload)
        async.auto({
            creatingThumb:  function (cb) {
                createThumbnailImage(fileData.path, Path.resolve('.') + '/uploads/' + fileData.thumb, function (err) {
                    cb()
                })
            },
            uploadOnS3: ['creatingThumb', function (err, cb) {
                let functionsArray = [];
                dataToUpload.forEach(function (obj) {
                    functionsArray.push((function (data) {
                        return function (internalCb) {
                            uploadFile1(data, internalCb)
                        }
                    })(obj))
                });

                async.parallel(functionsArray, (err, result) => {
                    deleteFile(Path.resolve('.') + '/uploads/' + fileData.thumb);
                    cb(err)
                })

            }]
        }, function (err) {
            let responseObject = {
                original: 'https://cattle12.s3.ap-south-1.amazonaws.com/' + fileData.original,
                thumbnail: 'https://cattle12.s3.ap-south-1.amazonaws.com/' + fileData.thumb,
            };
            //console.log("____responseObject",responseObject)
            if (err) return reject(err);
            else return resolve(responseObject)
        })
    })
};


let getFileNameWithUserId = function (thumbFlag, fullFileName, userId) {
   // console.log("_______________",thumbFlag,fullFileName,userId)
    let prefix = 'original_';
    let ext = fullFileName && fullFileName.length > 0 && fullFileName.substr(fullFileName.lastIndexOf('.') || 0, fullFileName.length);
    if (thumbFlag) {
        prefix = 'thumb_';
    }
    return prefix + userId + ext;
};


function createThumbnailImage(originalPath, thumbnailPath, callback) {
    //  console.log("Asddas",originalPath, thumbnailPath,)
    let gm = require('gm').subClass({imageMagick: true});
    gm(originalPath)
        .resize(140, 140, "!")
        .autoOrient()
        .write(thumbnailPath, function (err, data) {
                   //console.log("____Ddd___",err,data);
            callback(err)
        })
}


function uploadFile1(fileObj, uploadCb) {
    let fileName = Path.basename(fileObj.finalUrl);
    let stats = Fs.statSync(fileObj.path);
    let fileSizeInBytes = stats["size"];
    if (fileSizeInBytes < 5242880) {
        //   console.log("_if_")
        async.retry((retryCb) => {
            //console.log("333333",fileObj.path);
            Fs.readFile(fileObj.path, (err, fileData) => {
                s3.putObject({
                    Bucket: 'cattle12',
                    Key: fileName,
                    Body: fileData,
                    ContentType: mime.lookup(fileName)
                },  function(err, data) {
                    retryCb()
                });
            });
        }, uploadCb);
    } else {
        // console.log("_else_")
        fileObj.filename = fileName;
        uploadMultipart(fileObj, uploadCb)
    }
}

function uploadMultipart(fileInfo, uploadCb) {
    let options = {
        Bucket: 'cattle12',
        Key: fileInfo.filename,
        ACL: 'public-read',
        ContentType: mime.lookup(fileInfo.filename),
        ServerSideEncryption: 'AES256'
    };

    s3.createMultipartUpload(options, (mpErr, multipart) => {
        if (!mpErr) {
            //  console.log("multipart created", multipart.UploadId);
            Fs.readFile(fileInfo.path, (err, fileData) => {

                var partSize = 5242880;
                var parts = Math.ceil(fileData.length / partSize);

                async.times(parts, (partNum, next) => {

                    var rangeStart = partNum * partSize;
                    var end = Math.min(rangeStart + partSize, fileData.length);

                    //        console.log("uploading ", fileInfo.filename, " % ", (partNum / parts).toFixed(2));

                    partNum++;
                    async.retry((retryCb) => {
                        s3.uploadPart({
                            Body: fileData.slice(rangeStart, end),
                            Bucket: 'cattle12',
                            Key: fileInfo.filename,
                            PartNumber: partNum,
                            UploadId: multipart.UploadId
                        }, (err, mData) => {
                            retryCb(err, mData);
                        });
                    }, (err, data) => {
                        //          console.log(data);
                        next(err, {ETag: data.ETag, PartNumber: partNum});
                    });

                }, (err, dataPacks) => {
                    s3.completeMultipartUpload({
                        Bucket: 'cattle12',
                        Key: fileInfo.filename,
                        MultipartUpload: {
                            Parts: dataPacks
                        },
                        UploadId: multipart.UploadId
                    }, uploadCb);
                });
            });
        } else {
            uploadCb(mpErr);
        }
    });
}

function deleteFile(path) {
    fsExtra.remove(path, function (err) {
        console.log('error deleting file>>', err)
    });
}

module.exports= {
    uploadFilesOnS3:uploadFilesOnS3
};