import React, { useState } from "react";
import { Button, TextField } from "@material-ui/core";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import apiS3 from "../apis/Api_S3";
import apiLink from "../apis/Api_link";
import AlertDialog from "./AlertDialog";
import CardPreview from "./CardPreview";
import VisibilityIcon from '@material-ui/icons/Visibility';
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
  textInput: {
    width: "80%",
  },
  callToActionBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "10px",
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
});

const LinkInputField = withStyles({
  root: {
    "& input:valid + fieldset": {
      borderColor: "#583E81",
      borderWidth: 2,
    },
  },
})(TextField);

const LinkSetup = () => {
  const classes = useStyles();

  const [linkUrl, setLinkUrl] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState("");
  const [imgData, setImgData] = useState("");

  const reSetState = () => {
    setLinkUrl("");
    setIsPreview(false);
    setAlertOpen(false);
  };

  const handleLinkUrlChange = (event) => {
    setLinkUrl(event.target.value);
  };

  function toArrayBuffer(buf) {
    var ab = new ArrayBuffer(buf.length);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buf.length; ++i) {
      view[i] = buf[i];
    }
    return ab;
  }

  const previewImg = async () => {
    let ext, mimeType;
    // name = linkUrl.split('/')[3]
    ext = linkUrl.split(".")[linkUrl.split(".").length - 1];
    if (ext === "jpg" || ext === 'jpeg') {
      mimeType = "image/jpeg";
    } else if (ext === "png") {
      mimeType = "image/png";
    } else {
      setLinkUrl('');
      return errorToast('File type is not supported');
    }
    const res = (await apiLink.getFile(linkUrl)).data;
    console.log(res.data)
    const bufferData = toArrayBuffer(res.data.data);

    //   console.log(resp.data)
    const blob = new Blob([bufferData], { type: mimeType });
    const file = new File([blob], `random.${ext}`, { type: mimeType });
    setImgData(file);
    setPreviewFile(URL.createObjectURL(file));
    setIsPreview(true);
  };

  const uploadImg = async () => {
    if (!localStorage.getItem("s3token")) {
      setAlertOpen(true);
      return;
    }
    try {
      const result = await apiS3.sendFilesToS3([[0, imgData]]);
      if (result.error) {
        console.log(result.error);
        return errorToast('This type of file is not supported');
      }
      successToast("Files are uploaded to S3");
      reSetState();
    } catch (error) {
      errorToast("Unable to upload files to S3");
    }
  };

  const onCancel = () => {
    reSetState();
  };

  return (
    <div className={classes.root}>
      {!isPreview ? (
        <>
          <LinkInputField
            className={classes.textInput}
            id="outlined-basic-Link"
            placeholder="Enter or paste your link here"
            variant="outlined"
            value={linkUrl}
            onChange={handleLinkUrlChange}

          />
          <Button
            size="large"
            style={{ padding: "10px 30px", marginTop: "10px" }}
            variant="contained"
            color="primary"
            onClick={previewImg}
          >
            <VisibilityIcon style={{ paddingRight: "7px" }} />
            Preview
          </Button>
        </>
      ) : (
        <CardPreview imgUrl={previewFile} name={"Random"} />

      )}
      <div className={classes.callToActionBtn}>
        {/* {linkUrl && !isPreview && (
          <Button
            style={{ marginRight: "20px" }}
            variant="contained"
            color="primary"
            onClick={previewImg}
          >
            Preview
          </Button>
        )} */}
        {linkUrl && isPreview && (
          <>
            <Button
              style={{
                marginRight: "20px",
              }}
              variant="contained"
              onClick={uploadImg}
              color="primary"
            >
              Upload
          </Button>
            <Button color="secondary" variant="contained" onClick={onCancel}>
              Cancel
        </Button>
          </>
        )}

      </div>
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
    </div>
  );
};

export default LinkSetup;
