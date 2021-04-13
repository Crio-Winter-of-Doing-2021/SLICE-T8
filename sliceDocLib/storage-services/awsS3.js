const path = require("path");
const multer = require("multer");
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");
const jwt = require("jsonwebtoken");

exports.authenticateToS3 = (accessKeyId, secretAccessKey, Bucket, cb) => {
  var token = jwt.sign(
    {
      accessKeyId,
      secretAccessKey,
      Bucket,
    },
    process.env.SECRET
  );

  console.log('token , ', token)
  
  const s3 = new aws.S3({
    accessKeyId,
    secretAccessKey,
  });

  const x = Bucket.split(":").pop();
  var bucketParams = { Bucket: x };
  s3.getBucketLocation(bucketParams, function (err, data) {
    if (err) {
      cb(err.message, null);
      console.log("Error", err.message);
    } else if (data) {
      cb(null, token);
      console.log("Success");
    }
  });
};

/**
 * Check FileType
 * file should be jpeg, jpg, png
 */
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|pdf/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}

// Middleware
exports.uploadToS3Middleware = (req, res, next) => {
  // const { accessKeyId, secretAccessKey, Bucket } = req.query;

  const { accessKeyId, secretAccessKey, Bucket } = jwt.verify(
    req.headers["authorization"].split(" ")[1],
    process.env.SECRET
  );

  // S3 setup starts here.

  const s3 = new aws.S3({
    accessKeyId,
    secretAccessKey,
    Bucket,
  });

  const profileImgUpload = multer({
    storage: multerS3({
      s3: s3,
      bucket: Bucket.split(":").pop(),
      acl: "public-read",
      key: function (req, file, cb) {
        cb(
          null,
          path.basename(file.originalname, path.extname(file.originalname)) +
            "-" +
            Date.now() +
            path.extname(file.originalname)
        );
      },
    }),
    // limits:{ fileSize: 2000000 }, // In bytes: 2000000 bytes = 2 MB
    fileFilter: function (req, file, cb) {
      checkFileType(file, cb);
    },
  }).array("myFile", 5);

  profileImgUpload(req, res, (error) => {
    console.log("requestOkokok", req.files);
    if (error) {
      console.log("errors", error);
      req.error = error;
      next();
    } else {
      // If File not found
      if (req.files === undefined) {
        console.log("Error: No File Selected!");
        req.error = "Error: No File Selected!";
        next();
      } else {
        next();
      }
    }
  });
};
