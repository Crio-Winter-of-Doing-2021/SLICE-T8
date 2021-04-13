const router = require("express").Router();
const { uploadToS3 } = require("../controllers/upload");
const { uploadToS3Middleware } = require("slicedoclib")

router.post("/s3", uploadToS3Middleware, uploadToS3);

module.exports = router;