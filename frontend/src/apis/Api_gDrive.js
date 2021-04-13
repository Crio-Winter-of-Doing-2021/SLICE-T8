import axios from "axios";

class Api_gDrive {
  
    gDriveAuth = (response) => {
    return axios.post("http://localhost:8001/auth/google", {
      tokens: response.tokenObj,
    });
  };

  gDriveDownload = (idArray) => {
    const driveCred = JSON.parse(localStorage.getItem("driveCred"))
    return axios.post('http://localhost:8001/getdocs/drive', {
        driveCred: driveCred,
        idArray: idArray
    })
  }

  gDriveGetFiles = (idArray) => {
    const driveCred = JSON.parse(localStorage.getItem("driveCred"))
    // console.log(`http://localhost:8001/${fileData.id}.${fileData.fullFileExtension}`)
    return axios.post(`http://localhost:8001/getdocs/drive`, {
      driveCred: driveCred,
        idArray: idArray
    })
  }

  gDriveDeleteFiles = (idArray) => {
    console.log(idArray)
    return axios.delete('http://localhost:8001/getdocs/drive', { data : {
      idArray: idArray
    } })
  }
}

export default new Api_gDrive();
