const router = require("express").Router();
const { authS3, authGoogleDrive, authDigiMocker } = require("../controllers/auth");

router.post("/s3", authS3);
router.post("/google", authGoogleDrive);
router.post("/digiMocker", authDigiMocker);

module.exports = router
