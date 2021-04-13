import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import AddSharpIcon from "@material-ui/icons/AddSharp";
import s3api from "../apis/Api_S3";
import CardPreview from "./CardPreview";
import AlertDialog from "./AlertDialog";
import CircularProgress from "@material-ui/core/CircularProgress";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { successToast, errorToast } from "./toasts";

const useStyles = makeStyles({
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
  displayLoaderCtr: {
    flex: 1,
    borderBottom: "0.5px solid rgba(0,0,0,0.1)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  callToActionBtn: {
    padding: "10px",
  },
  dragNdrop: {
    height: "90%",
    width: "90%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    border: "2px dashed salmon",
    outline: "none",
  },
});

const MyDevice = () => {
  const classes = useStyles();
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [previewFiles, setPreviewFiles] = useState([]);
  const [alertOpen, setAlertOpen] = useState(false);
  // const [previewLoader, setPreviewLoader] = useState(false);
  const [uploadLoader, setUploadLoader] = useState(false);

  const handleFileChange = (event) => {
    console.log(event.target.files.length);
    // setPreviewLoader(true);
    setSelectedFiles(Object.entries(event.target.files));
    let x = [];
    for (let i = 0; i < event.target.files.length; i++) {
      x.push(URL.createObjectURL(event.target.files[i]));
      console.log(URL.createObjectURL(event.target.files[i]));
    }
    setPreviewFiles(x);
    // setPreviewLoader(false);
  };

  const onUploadFiles = () => {
    if (!localStorage.getItem("s3token")) {
      setAlertOpen(true);
      return;
    }
    setUploadLoader(true);
    s3api
      .sendFilesToS3(selectedFiles)
      .then((data) => {
        successToast("Files are uploaded to S3")
        setSelectedFiles(null);
        setPreviewFiles([]);
        setUploadLoader(false);
      })
      .catch((err) => errorToast("Unable to upload files to S3"));
  };

  const onCancel = () => {
    setSelectedFiles(null);
    setPreviewFiles([]);
  };

  // Setting drag n drop here

  const onDrop = useCallback((acceptedFiles) => {
    setSelectedFiles(acceptedFiles.map((file, index) => [index, file]));
    setPreviewFiles(acceptedFiles.map((file) => URL.createObjectURL(file)));
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noclick: true,
  });

  return (
    <>
      {!selectedFiles ? (
        <div className={classes.dragNdrop} {...getRootProps()}>
          {isDragActive ? (
            <>
              <input {...getInputProps()} />
              <h2>Drop the files here ...</h2>
            </>
          ) : (
            <h2>Drag 'n' drop some files here, or Click to Select Files</h2>
          )}
          <label htmlFor="upload-photo">
            <input
              style={{ display: "none" }}
              id="upload-photo"
              name="upload-photo"
              type="file"
              onChange={handleFileChange}
              multiple
            />
            <div>
              <Button
                variant="contained"
                color="primary"
                component="span"
                size="large"
              >
                <AddSharpIcon
                  style={{ paddingRight: "7px", fontWeight: "900" }}
                />
                Select Files
              </Button>
            </div>
          </label>
        </div>
      ) : (
        <div className={classes.fileContainer}>
          {uploadLoader ? (
            <div className={classes.displayLoaderCtr}>
              <h3 style={{ marginRight: "10px" }}>Uploading</h3>
              <CircularProgress />
            </div>
          ) : (
            <div className={classes.displayFilesSelected}>
              {previewFiles.map((file, index) => {
                return (
                  <CardPreview
                    key={index}
                    imgUrl={file}
                    name={selectedFiles[index][1].name}
                  />
                );
              })}
            </div>
          )}
          <div className={classes.callToActionBtn}>
            <Button
              style={{ marginRight: "20px" }}
              variant="contained"
              color="primary"
              onClick={onUploadFiles}
            >
              Upload Files
            </Button>
            <Button variant="contained" color="secondary" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Alert Dialog */}
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

export default MyDevice;
