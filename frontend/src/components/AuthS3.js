import React, { useState } from "react";
import { Button, Dialog, TextField } from "@material-ui/core";
import s3api from "../apis/Api_S3";
import { makeStyles } from "@material-ui/core/styles";
import "react-toastify/dist/ReactToastify.css";
import { successToast, errorToast } from "./toasts";

const useStyles = makeStyles({
  textInput: {
    margin: '20px',
    width: '40vw'
  },
  actionBtnContainer: {
    margin: '0 0 20px 20px'
  },
  authS3btnCtr: {
    position: "absolute",
    right: "5%",
    top: '50%',
    transform: 'translateY(-50%)'
  }
})

const AuthS3 = ({ isS3Auth, setIsS3Auth }) => {
  const classes = useStyles();

  // For dialog part
  const [open, setOpen] = useState(false);
  const [accessKeyId, setAccessKeyId] = useState("");
  const [secretAccessKey, setSecretAccessKey] = useState("");
  const [Bucket, setBucket] = useState("");
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem('s3token'))

  const handleDialogClose = () => {
    setOpen(false);
  };

  const handleDialogOpen = () => {
    setOpen(true);
  };

  const handleAccessKeyIdChange = (event) => {
    setAccessKeyId(event.target.value);
  };

  const handleSecretAccessKeyChange = (event) => {
    setSecretAccessKey(event.target.value);
  };

  const handleBucketNameChange = (event) => {
    setBucket(event.target.value);
  };

  const submitS3AuthData = () => {
    s3api.authS3({ accessKeyId, secretAccessKey, Bucket })
      .then((data) => {
        if(data.error) {
          return errorToast(data.error);
        }
        localStorage.setItem("s3token", data.token);
        setIsAuth(true)
        successToast('S3 Authenticated Successfully')
      })
      .catch((err) => console.log(err));
    setOpen(false);
  };

  const logOut = () => {
    localStorage.removeItem('s3token');
    setIsAuth(false);
  }

  return (
    <div className={classes.authS3btnCtr}>
      {!isAuth ? (
        <>
        <Button variant="contained" color="primary" onClick={handleDialogOpen} disableElevation>
        authenticate S3
      </Button>
      <Dialog className={classes.dialogStyle} aria-labelledby="simple-dialog-title" open={open}>
        <TextField
          className={classes.textInput}
          id="outlined-basic-accessKeyId"
          label="accessKeyId"
          variant="outlined"
          value={accessKeyId}
          onChange={handleAccessKeyIdChange}
        />
        <TextField
          className={classes.textInput}
          id="outlined-basic-secretAccessKey"
          label="secretAccessKey"
          variant="outlined"
          value={secretAccessKey}
          onChange={handleSecretAccessKeyChange}
        />
        <TextField
          className={classes.textInput}
          id="outlined-basic-BucketName"
          label="BucketName"
          variant="outlined"
          value={Bucket}
          onChange={handleBucketNameChange}
        />
        <div className={classes.actionBtnContainer}>
        <Button style={{marginRight: '20px'}} variant="outlined" color="primary" onClick={submitS3AuthData}>
          Submit
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
      </>
      ) : (<Button style={{backgroundColor: "#e34b44", color: 'white'}} variant="contained" disableElevation onClick={logOut}>
          Logout S3
        </Button>
      )}
    </div>
  );
};

export default AuthS3;
