import React, { useState } from "react";
import { Camera } from "./camera/Camera";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    position: 'relative',
    display: "flex",
    flexDirection: "column",
    width: "90%",
    height: "90%",
    borderRadius: "3px",
    backgroundColor: "#FAFAFA",
    boxShadow: "0 0 5px 2px rgb(0,0,0, 0.05)",
    border: "0.5px solid rgba(0,0,0,0.1)",
  },
  cameraCtr: {
    flex: 1,
    width: '100%'
  },
  callToActionBtn: {
    padding: "10px",
  },
});

const CameraSetup = () => {
  const classes = useStyles();

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cardImage, setCardImage] = useState();

  var formData = new FormData();

  console.log(cardImage);

  return (
    <>
      {!isCameraOpen ? (
        <div className={classes.root}>
          <h2>Please click on open camera</h2>
          <Button
            variant="contained"
            color="primary"
            size="large"
            style={{ padding: "10px 30px" }}
            onClick={() => setIsCameraOpen(true)}
          >
            <AddAPhotoIcon style={{ paddingRight: "7px", paddingBottom: "4px" }} />
            Open Camera
          </Button>
        </div>
      ) : (
        <div className={classes.fileContainer}>
          <div className={classes.cameraCtr}>
            <Camera cardImage={cardImage} setCardImage={setCardImage}
              isCameraOpen={isCameraOpen} setIsCameraOpen={setIsCameraOpen}
              onCapture={(blob) => {
                formData.append("userpic", blob, "chris1.jpg");
                setCardImage(blob);
              }}
              onClear={() => setCardImage(undefined)}
            />
          </div>
        </div>
      )}
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

export default CameraSetup;
