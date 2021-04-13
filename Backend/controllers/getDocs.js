const {
  getDocsFromDrive,
  getDocsFromMocker,
  getSpecificDocsFromMocker,
  getLinkData
} = require("slicedoclib");

const axios = require('axios');

exports.drive = async (req, res) => {
  const { driveCred, idArray } = req.body;
  const response = await getDocsFromDrive(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URIS,
    driveCred,
    idArray
  )

  console.log(response)
  res.send(response)
};

exports.digiMocker = async (req, res) => {
  const { email } = req.body;
  const token = req.get("auth-token");

  const data = await getDocsFromMocker(email, token);

  res.json({
    data: data,
  });
};

exports.digiMockerSpecific = async (req, res) => {
  const { name } = req.params;
  const { email } = req.body;
  const token = req.get("auth-token");

  const data = await getSpecificDocsFromMocker(name, email, token);

  res.json({
    data: data,
  });
};

exports.getLinkRawData = async (req, res) => {
  const { url } = req.body;

  let response = await getLinkData(url)

  console.log(response.data)

  res.json({
    data: response.data
  })
}
