import React, { useState } from "react";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import ComputerIcon from "@material-ui/icons/Computer";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import LinkIcon from "@material-ui/icons/Link";
import { AppBar } from "@material-ui/core";
import { Icon } from "@iconify/react";
import googleDrive from "@iconify-icons/entypo-social/google-drive";
import TabPanel from "../../components/TabPanel";
import MyDevice from "../../components/MyDevice";
import GoogleDrive from "../../components/GoogleDrive";
import "./style.css";
import Logo from "../../assets/images/Logo.png";
import MoveToInboxIcon from "@material-ui/icons/MoveToInbox";
import CameraSetup from "../../components/CameraSetup";
import LinkSetup from "../../components/LinkSetup";
import AuthS3 from "../../components/AuthS3";
import DigiMocker from "../../components/DigiMocker";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
  },
  authS3btnCtr: {
    position: "absolute",
    right: "5%",
    top: '50%',
    transform: 'translateY(-50%)'
  }
});

const Home = () => {
  const classes = useStyles();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <div className="mycontainer">
        <div className="logo">
          <img src={Logo} width="80px" alt="Logo" />
        </div>
        <div className="text">
          <h1 className="redo">sliceboxx</h1>
          <h4>Doc Library</h4>
        </div>
        <AuthS3 />
      </div>
      <AppBar style={{ backgroundColor: "#fff" }} position="static">
        <div>
          <Paper square style={{ marginTop: "1vh" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              variant="fullWidth"
              indicatorColor="primary"
              textColor="primary"
              aria-label="icon label tabs example"
            >
              <Tab
                icon={<ComputerIcon />}
                label="My Device"
                {...a11yProps(0)}
              />
              <Tab
                icon={<Icon icon={googleDrive} style={{ fontSize: "28px" }} />}
                label="Google Drive"
                {...a11yProps(1)}
              />
              <Tab icon={<MoveToInboxIcon />} label="DigiMocker" {...a11yProps(2)} />
              <Tab icon={<AddAPhotoIcon />} label="Camera" {...a11yProps(3)} />
              <Tab icon={<LinkIcon />} label="Link" {...a11yProps(4)} />
            </Tabs>
          </Paper>
        </div>
      </AppBar>
      <TabPanel value={value} index={0}>
        <MyDevice />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <GoogleDrive />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <DigiMocker />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <CameraSetup />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <LinkSetup />
      </TabPanel>
    </div>
  );
};

export default Home;
