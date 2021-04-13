const { google } = require("googleapis");
const axios = require("axios");

exports.authenticateToDrive = async (
  clientId,
  clientSecret,
  clientRedirect,
  tokens
) => {
  const oAuth2Client = new google.auth.OAuth2(
    //client id
    clientId,
    //client secret
    clientSecret,
    //link to redirect
    clientRedirect
  );

  oAuth2Client.setCredentials(tokens);

  const drive = google.drive({ version: "v3", auth: oAuth2Client });
  let x;
  try {
    x = await drive.files.list({ fields: "files(*)" }).then((res) => {
      const files = res.data.files;
      //console.log(files)
      const file = [];
      for (let i = 0; i < files.length; i++) {
        if (
          files[i].mimeType == "image/jpeg" ||
          files[i].mimeType == "image/png" ||
          files[i].mimeType == "application/pdf"
        ) {
          file.push(files[i]);
        }
      }
      return file;
    });
  } catch (error) {
    return error;
  }

  return x;
};

exports.getDocsFromDrive = async (
  clientId,
  clientSecret,
  clientRedirect,
  driveCred,
  idArray
) => {
  const oAuth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    clientRedirect
  );
  oAuth2Client.setCredentials(driveCred);
  const drive = google.drive({ version: "v3", auth: oAuth2Client });

  const bufferArr = [];

  for (let i = 0; i < idArray.length; i++) {
    const fileData = idArray[i];

    if (fileData.id != null) {
      let response = await axios.get(
        `https://www.googleapis.com/drive/v3/files/${fileData.id}?alt=media`,
        {
          responseType: "arraybuffer",
          headers: {
            Authorization: `Bearer ${driveCred.access_token}`,
          },
        }
      );
      console.log("response", response.data);
      bufferArr.push(response.data);
    }
  }

  return bufferArr;
};
