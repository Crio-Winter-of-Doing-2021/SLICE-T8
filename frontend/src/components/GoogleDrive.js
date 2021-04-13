import React, { useState } from "react";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { GoogleLogin } from "react-google-login";
import Checkbox from "@material-ui/core/Checkbox";
import { Icon } from "@iconify/react";
import googleDrive from "@iconify-icons/entypo-social/google-drive";
import Api_gDrive from "../apis/Api_gDrive";
import CardPreview from "./CardPreview";
import s3api from "../apis/Api_S3";
import AlertDialog from "./AlertDialog";
import CircularProgress from "@material-ui/core/CircularProgress";
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
  displayFilesSelected: {
    borderBottom: "0.5px solid rgba(0,0,0,0.1)",
    flex: 1,
    margin: "20px 20px 0 20px",
    overflowY: "scroll",
  },
  displayLoader: {
    flex: 1,
    borderBottom: "0.5px solid rgba(0,0,0,0.1)",
    display: "flex !important",
    justifyContent: "center",
    alignItems: "center",
  },
  callToActionBtn: {
    padding: "10px",
  },
  displayLoaderCtr: {
    flex: 1,
    borderBottom: "0.5px solid rgba(0,0,0,0.1)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

const DriveSetup = () => {
  const classes = useStyles();

  const [isAuth, setIsAuth] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [rawData, setRawData] = useState([]);
  const [previewFiles, setPreviewFiles] = useState([]);
  const [isSelectedFiles, setIsSelectedFiles] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);

  // Loaders
  const [documentsLoader, setDocumentsLoader] = useState(false);
  const [rawDataLoader, setRawDataLoader] = useState(false);
  const [uploadLoader, setUploadLoader] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  const reSetState = () => {
    localStorage.removeItem("driveCred");
    setIsAuth(false);
    setDocuments([]);
    setSelectedFiles([]);
    setRawData([]);
    setPreviewFiles([]);
    setIsSelectedFiles(false);
    setUploadLoader(false);
    setIsPreview(false);
  };

  const responseSuccess = (response) => {
    localStorage.setItem("driveCred", JSON.stringify(response.tokenObj));
    setIsAuth(true);
    setDocumentsLoader(true);
    Api_gDrive.gDriveAuth(response)
      .then((res) => {
        setDocuments(res.data);
        setDocumentsLoader(false);
        console.log(res);
      })
      .catch((err) => console.log(err));
    // console.log(response);
  };

  const onCancel = async () => {
    setUploadLoader(true);
    reSetState();
  };

  const responseError = () => {};

  const selectFile = (event) => {
    if (event.target.checked) {
      // let name = valueName.split('.').slice(0, valueName.split('.').length - 1).join()
      setSelectedFiles([
        ...selectedFiles,
        {
          id: JSON.parse(event.target.value).id,
          name: JSON.parse(event.target.value).name,
          mimeType: JSON.parse(event.target.value).mimeType,
          fullFileExtension: JSON.parse(event.target.value).fullFileExtension,
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

  const onSubmit = async () => {
    if (!localStorage.getItem("s3token")) {
      setAlertOpen(true);
      return;
    }

    setUploadLoader(true);
    try {
      const s3response = await s3api.sendFilesToS3(rawData);
      successToast("Files are uploaded to S3");
      console.log(s3response.data);
      reSetState(); 
    } catch (error) {
      errorToast("Unable to upload files to S3");
    }
  };

  function toArrayBuffer(buf) {
    var ab = new ArrayBuffer(buf.length);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buf.length; ++i) {
        view[i] = buf[i];
    }
    return ab;
}

  const onSelect = async () => {
    setIsPreview(true);
    setRawDataLoader(true);
    let newRawData = [];
    let x = [];
    const res = await Api_gDrive.gDriveGetFiles(selectedFiles);
    for (let i = 0; i < selectedFiles.length; i++) {
      const bufferData = toArrayBuffer(res.data[i].data);
      console.log(bufferData);
      let blob = new Blob([bufferData], { type: selectedFiles[i].mimeType });
      let file = new File([blob], `${selectedFiles[i].name}`, {
        type: selectedFiles[i].mimeType,
      });
      newRawData.push([i, file]);
      x.push(URL.createObjectURL(file));
    }
    setRawData(newRawData); //TODO: Update here later
    setIsSelectedFiles(true);
    setPreviewFiles(x);
    setRawDataLoader(false);
  };

  return (
    //
    <>
      {!isAuth ? (
        <div className={classes.root}>
          <h2>Please authenticate with Google Drive to select files </h2>
          <GoogleLogin
            clientId={process.env.REACT_APP_CLIENT_ID}
            scope="https://www.googleapis.com/auth/drive"
            render={(renderProps) => (
              <Button
                onClick={renderProps.onClick}
                variant="contained"
                color="primary"
                size="large"
                style={{ padding: "10px 30px" }}
                startIcon={
                  <Icon icon={googleDrive} style={{ fontSize: "20px" }} />
                }
              >
                Connect to Google Drive
              </Button>
            )}
            onSuccess={responseSuccess}
            onFailure={responseError}
            cookiePolicy={"single_host_origin"}
          />
        </div>
      ) : (
        <div className={classes.fileContainer}>
          {documentsLoader ? (
            <div className={classes.displayLoader}>
              <CircularProgress />
            </div>
          ) : (
            <div
              style={{ display: uploadLoader ? "none" : "initial" }}
              className={
                rawDataLoader
                  ? classes.displayLoader
                  : classes.displayFilesSelected
              }
            >
              {rawDataLoader && <CircularProgress />}
              {!rawDataLoader &&
                isSelectedFiles &&
                !uploadLoader &&
                previewFiles.map((fileUrl, index) => {
                  console.log(fileUrl);
                  return (
                    <CardPreview
                      key={index}
                      imgUrl={fileUrl}
                      name={selectedFiles[index].name}
                    />
                  );
                })}
              {!rawDataLoader &&
                (!isSelectedFiles || !isPreview) &&
                !uploadLoader &&
                documents &&
                documents.map((list) => (
                  <div key={list.id} style={{ marginBottom: "3px" }}>
                    <Checkbox
                      value={JSON.stringify(list)}
                      color="primary"
                      onChange={selectFile}
                    />
                    <img
                      src={list.thumbnailLink}
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
                      {list.name}
                    </span>
                  </div>
                ))}
            </div>
          )}
          {uploadLoader && (
            <div className={classes.displayLoaderCtr}>
              <h3 style={{ marginRight: "10px" }}>Uploading</h3>
              <CircularProgress />
            </div>
          )}
          <div className={classes.callToActionBtn}>
            {!isSelectedFiles && (
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
            )}
            {/* {isSelectedFiles && !isPreview && (
              <Button
                style={{
                  marginRight: "20px",
                  visibility: selectedFiles.length ? "visible" : "hidden",
                }}
                variant="contained"
                color="primary"
                onClick={onPreview}
              >
                Preview Files
              </Button>
            )} */}
            {isSelectedFiles && isPreview && (
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

export default DriveSetup;
