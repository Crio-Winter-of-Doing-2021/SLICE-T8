import axios from "axios";

class Api_S3 {
  authS3 = (s3cred) => {
    return fetch("http://localhost:8001/auth/S3", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(s3cred),
    })
      .then((response) => {
        return response.json();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  sendFilesToS3 = (selectedFiles) => {
    console.log(selectedFiles)
    const fd = new FormData();

    for (let i = 0; i < selectedFiles.length; i++) {
      fd.append("myFile", selectedFiles[i][1]);
      console.log(selectedFiles[i][1]);
    }

    return axios.post("http://localhost:8001/upload/S3", fd, {
      headers: {
        "content-type": "multipart/form-data",
        authorization: "Bearer " + localStorage.getItem("s3token"),
      },
    });
  };
}

export default new Api_S3();
