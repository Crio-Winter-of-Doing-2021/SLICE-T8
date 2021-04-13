import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

const useStyles = makeStyles({
  panelRoot: {
    display: "flex",
    flexGrow: 1,
  },
  panelContent: {
    flexGrow: 1,
    display: "flex",
    flexDirection: 'column',
    justifyContent: "center",
    alignItems: "center",
    // justifyContent: 'center',
  },
});

const TabPanel = (props) => {
  const classes = useStyles();

  const { children, value, index, ...other } = props;

  return (
    <div
      className={value === index ? classes.panelRoot : "false"}
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        //TODO: This part will be updated
        <div className={classes.panelContent}>{children}</div>
      )}
    </div>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

export default TabPanel;
