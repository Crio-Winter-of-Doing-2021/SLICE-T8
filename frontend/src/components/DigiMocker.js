import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, TextField, Dialog } from "@material-ui/core";
import digiMockerApi from "../apis/Api_digimocker";
import Checkbox from "@material-ui/core/Checkbox";
import CardPreview from "./CardPreview";
import AlertDialog from "./AlertDialog";
import Api_digimocker from "../apis/Api_digimocker";
import MoveToInboxIcon from "@material-ui/icons/MoveToInbox";
import s3api from "../apis/Api_S3";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { successToast, errorToast } from "./toasts";

const useStyles = makeStyles({
  root: {
    height: "90%",
    width: "90%",
    borderRadius: "3px",
    backgroundColor: "#FAFAFA",
    border: "0.5px solid rgba(0,0,0,0.1)",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  fileContainer: {
    display: "flex",
    flexDirection: "column",
    width: "90%",
    height: "90%",
    borderRadius: "3px",
    backgroundColor: "#FAFAFA",
    boxShadow: "0 0 5px 2px rgb(0,0,0, 0.05)",
    border: "0.5px solid rgba(0,0,0,0.1)",
  },
  textInput: {
    margin: "20px",
    width: "40vw",
  },
  actionBtnContainer: {
    margin: "0 0 20px 20px",
  },
  displayFilesSelected: {
    borderBottom: "0.5px solid rgba(0,0,0,0.1)",
    flex: 1,
    margin: "20px 20px 0 20px",
    overflowY: "scroll",
  },
  callToActionBtn: {
    padding: "10px",
  },
});

const DigiMocker = () => {
  const classes = useStyles();

  useEffect(() => {
    return function cleanup() {
      localStorage.removeItem("digiToken");
    };
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem("digiToken"));
  const [metaData, setMetaData] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSelectedFiles, setIsSelectedFiles] = useState(false);
  const [rawData, setRawData] = useState([]);
  const [previewFiles, setPreviewFiles] = useState([]);
  const [alertOpen, setAlertOpen] = useState(false);

  const reSetState = () => {
    localStorage.removeItem("digiToken");
    setIsAuth(false);
    setMetaData([]);
    setSelectedFiles([]);
    setOpen(false);
    setIsSelectedFiles(false);
    setAlertOpen(false);
  };

  const handleDialogClose = () => {
    setOpen(false);
  };

  const handleDialogOpen = () => {
    setOpen(true);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const onLogIn = async () => {
    const x = [];

    try {
      const authRes = await digiMockerApi.authDigiMocker({ email, password });
      console.log(authRes.data)
      if(authRes.data.error) {
        return errorToast(authRes.data.error)
      }
      localStorage.setItem("digiToken", authRes.data.token);
      setIsAuth(true);
      successToast('User authenticated Successfully')
      const dataRes = await digiMockerApi.getAllMockerData({
        email,
        token: localStorage.getItem("digiToken"),
      });
      //console.log(dataRes.data)
      for (let i = 0; i < dataRes.data["data"].length; i++) {
        let url = dataRes.data["data"][i].url;
        let ext = url.split(".")[url.split(".").length - 1];

        if (ext === "jpg" || ext === "png" || ext === "pdf") {
          x.push(dataRes.data["data"][i]);
        }
      }
      //console.log(x);
      setMetaData(x);
    } catch (error) {
      errorToast(error)
    }
  };

  const selectFile = (event) => {
    if (event.target.checked) {
      let file = JSON.parse(event.target.value);
      let fullFileExtension = file.url.split(".")[
        file.url.split(".").length - 1
      ];
      let mimeType;

      if (fullFileExtension === "jpg") {
        mimeType = "image/jpeg";
      } else if (fullFileExtension === "png") {
        mimeType = "image/png";
      } else if (fullFileExtension === "pdf") {
        mimeType = "application/pdf";
      }

      setSelectedFiles([
        ...selectedFiles,
        {
          id: file.id,
          name: file.name,
          mimeType: mimeType,
          fullFileExtension: fullFileExtension,
          url: file.url,
        },
      ]);
    } else {
      let newSelectedFiles = selectedFiles;
      newSelectedFiles = newSelectedFiles.filter(
        (file) => file.id !== JSON.parse(event.target.value).id
      );
      setSelectedFiles(newSelectedFiles);
    }
    console.log(selectedFiles);
  };

  const onSelect = async () => {
    let previewUrl = [];
    let fileData = [];
    for (let i = 0; i < selectedFiles.length; i++) {
      let tempUrl = selectedFiles[i].url;
      const res = await Api_digimocker.getFile(tempUrl);
      const blob = new Blob([res.data], { type: selectedFiles[i].mimeType });
      const file = new File(
        [blob],
        `${selectedFiles[i].name}.${selectedFiles[i].fullFileExtension}`,
        { type: selectedFiles[i].mimeType }
      );
      fileData.push([i, file]);
      previewUrl.push(URL.createObjectURL(file));
    }

    setRawData(fileData);
    setPreviewFiles(previewUrl);
    setIsSelectedFiles(true);
  };

  const onCancel = () => {
    reSetState();
  };

  const onSubmit = async () => {
    if (!localStorage.getItem("s3token")) {
      setAlertOpen(true);
      return;
    }
    try {
      const s3response = await s3api.sendFilesToS3(rawData);
      if (s3response.data.error) {
        return errorToast(s3response.data.error);
      }
      successToast("Files are uploaded to S3");
      console.log(s3response.data);
      reSetState();
    } catch (error) {
      errorToast("Unable to upload files to S3");
    }
  };

  return (
    <>
      {!isAuth ? (
        <div className={classes.root}>
          <h2>Please authenticate with Digimocker to select files </h2>
          <Button
            variant="contained"
            color="primary"
            size="large"
            style={{ padding: "10px 30px" }}
            onClick={handleDialogOpen}
          >
            <MoveToInboxIcon style={{ paddingRight: "7px" }} />
            Connect to DigiMocker
          </Button>
          <Dialog
            className={classes.dialogStyle}
            aria-labelledby="simple-dialog-title"
            open={open}
          >
            <TextField
              className={classes.textInput}
              id="outlined-basic-Link"
              placeholder="Email"
              variant="outlined"
              value={email}
              onChange={handleEmailChange}
            />
            <TextField
              className={classes.textInput}
              id="outlined-basic-Link"
              placeholder="Password"
              variant="outlined"
              type="Password"
              value={password}
              onChange={handlePasswordChange}
            />
            <div className={classes.actionBtnContainer}>
              <Button
                style={{ marginRight: "20px" }}
                variant="outlined"
                color="primary"
                onClick={onLogIn}
              >
                Sign In
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleDialogClose}
              >
                Cancel
              </Button>
            </div>
          </Dialog>
        </div>
      ) : (
        <div className={classes.fileContainer}>
          {!isSelectedFiles ? (
            <div className={classes.displayFilesSelected}>
              {metaData.map((data, index) => {
                return (
                  <div key={index} style={{ marginBottom: "3px" }}>
                    <Checkbox
                      value={JSON.stringify({ id: index, ...data })}
                      color="primary"
                      onChange={selectFile}
                    />
                    <img
                      src={data.url}
                      style={{ maxHeight: "20px", maxWidth: "20px" }}
                      alt="Alternate Value"
                    />
                    <span
                      style={{
                        fontSize: "15px",
                        fontWeight: "bold",
                        marginLeft: "10px",
                      }}
                    >
                      {data.name}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={classes.displayFilesSelected}>
              {previewFiles.map((fileUrl, index) => {
                console.log(fileUrl);
                return (
                  <CardPreview
                    key={index}
                    imgUrl={fileUrl}
                    name={selectedFiles[index].name}
                  />
                );
              })}
            </div>
          )}
          <div className={classes.callToActionBtn}>
            {!isSelectedFiles ? (
              <Button
                style={{
                  marginRight: "20px",
                  visibility: selectedFiles.length ? "visible" : "hidden",
                }}
                variant="contained"
                color="primary"
                onClick={onSelect}
              >
                Select Files
              </Button>
            ) : (
              <Button
                style={{
                  marginRight: "20px",
                  visibility: selectedFiles.length ? "visible" : "hidden",
                }}
                variant="contained"
                color="primary"
                onClick={onSubmit}
              >
                Upload Files
              </Button>
            )}
            <Button
              style={{
                marginRight: "20px",
                visibility: selectedFiles.length ? "visible" : "hidden",
              }}
              variant="contained"
              color="secondary"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
      <AlertDialog alertOpen={alertOpen} setAlertOpen={setAlertOpen} />
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

export default DigiMocker;
