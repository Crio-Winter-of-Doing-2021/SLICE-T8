const router = require("express").Router();
const { drive, deleteFiles, digiMocker, digiMockerSpecific, getLinkRawData } = require('../controllers/getDocs');

router.post('/drive', drive)
router.post('/digiMocker', digiMocker)
router.post('/digiMocker/:name', digiMockerSpecific)
router.post('/temp', getLinkRawData)

module.exports = router;