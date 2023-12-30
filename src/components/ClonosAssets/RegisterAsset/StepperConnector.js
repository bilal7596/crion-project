import { StepConnector, makeStyles, withStyles } from "@material-ui/core";
import { clsx } from "clsx";
import PropTypes from "prop-types";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import CheckIcon from "@material-ui/icons/Check";
import {
  validGeneralDetails,
  validLocationDetails,
  validSpecificationsDetails,
  validate3DDetails,
  validateAssetParametersValue,
  validateReferenceManualsValue,
} from "../../../utils/AssetsMethods/AssetRegister";
import { commonActions } from "../../../Store/Reducers/CommonReducer";
import { useDispatch } from "react-redux";
export const StepperConnector = withStyles({
  alternativeLabel: {
    top: 22,
  },
  active: {
    "& $line": {
      // backgroundImage:
      //   'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
      // backgroundColor:"#3f51b5"
      border: "1px solid #06337E",
    },
  },
  completed: {
    "& $line": {
      // backgroundImage:
      //   'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
      // backgroundColor:"#3f51b5"
      border: "1px solid #06337E",
    },
  },
  line: {
    height: 3,
    border: 0,
    backgroundColor: "#eaeaf0",
    borderRadius: 1,
  },
})(StepConnector);

const useStepIconStyles = makeStyles({
  root: {
    backgroundColor: "#ccc",
    zIndex: 1,
    color: "#fff",
    width: 30,
    height: 30,
    display: "flex",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  active: {
    // backgroundImage:
    //   'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
    // boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
    // backgroundColor:"#3f51b5"
    border: "1px solid #06337E",
    color: "#06337E",
  },
  completed: {
    // backgroundImage:
    //   'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
    // backgroundColor:"#3f51b5"
    border: "1px solid #06337E",
    color: "#06337E",
  },
});

export const StepIcon = (props) => {
  const classes = useStepIconStyles();
  const dispatch = useDispatch();
  const {
    active,
    completed,
    handleSetActiveStep,
    activeStep,
    formData,
    index,
  } = props;
  console.log(
    formData,
    validSpecificationsDetails(formData),
    "data from stepper"
  );
  const icons = {
    1: validGeneralDetails(formData) ? (
      <CheckIcon fontSize="small" />
    ) : (
      <FiberManualRecordIcon fontSize="small" />
    ),
    2: validSpecificationsDetails(formData) ? (
      <CheckIcon fontSize="small" />
    ) : (
      <FiberManualRecordIcon fontSize="small" />
    ),
    3: validLocationDetails(formData) ? (
      <CheckIcon fontSize="small" />
    ) : (
      <FiberManualRecordIcon fontSize="small" />
    ),
    4:
      activeStep > index || validate3DDetails(formData) ? (
        <CheckIcon fontSize="small" />
      ) : (
        <FiberManualRecordIcon fontSize="small" />
      ),
    5:
      activeStep > index ? (
        <CheckIcon fontSize="small" />
      ) : (
        <FiberManualRecordIcon fontSize="small" />
      ),
    6:
      activeStep > index || validateAssetParametersValue(formData) ? (
        <CheckIcon fontSize="small" />
      ) : (
        <FiberManualRecordIcon fontSize="small" />
      ),
    7:
      activeStep > index || validateReferenceManualsValue(formData) ? (
        <CheckIcon fontSize="small" />
      ) : (
        <FiberManualRecordIcon fontSize="small" />
      ),
  };

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed,
      })}
      onClick={() => {
        if (activeStep < index) {
          if (index == 1) {
            if (validGeneralDetails(formData)) {
              handleSetActiveStep();
            } else {
              dispatch(
                commonActions.handleSnackbar({
                  show: true,
                  message: `Please fill all the required fields`,
                  type: "error",
                  closeIn: 2000,
                })
              );
            }
          } else if (index == 2) {
            if (
              validGeneralDetails(formData) &&
              validSpecificationsDetails(formData)
            ) {
              handleSetActiveStep();
            } else {
              dispatch(
                commonActions.handleSnackbar({
                  show: true,
                  message: `Please fill all the required fields`,
                  type: "error",
                  closeIn: 2000,
                })
              );
            }
          } else if (index == 3) {
            if (
              validGeneralDetails(formData) &&
              validSpecificationsDetails(formData) &&
              validLocationDetails(formData)
            ) {
              handleSetActiveStep();
            } else {
              dispatch(
                commonActions.handleSnackbar({
                  show: true,
                  message: `Please fill all the required fields`,
                  type: "error",
                  closeIn: 2000,
                })
              );
            }
          } else if (index == 4) {
            if (
              validGeneralDetails(formData) &&
              validSpecificationsDetails(formData) &&
              validLocationDetails(formData)
            ) {
              handleSetActiveStep();
            } else {
              dispatch(
                commonActions.handleSnackbar({
                  show: true,
                  message: `Please fill all the required fields`,
                  type: "error",
                  closeIn: 2000,
                })
              );
            }
          } else if (index == 5) {
            handleSetActiveStep();
            // if(validGeneralDetails(formData) && validSpecificationsDetails(formData) && validLocationDetails(formData)) {
            // } else {
            //   dispatch(
            //     commonActions.handleSnackbar({
            //       show: true,
            //       message: `Please fill all the required fields`,
            //       type: "error",
            //       closeIn: 2000,
            //     })
            //   );
            // }
          } else if (index == 6) {
            handleSetActiveStep();
            // if(validGeneralDetails(formData) && validSpecificationsDetails(formData) && validLocationDetails(formData)) {
            // } else {
            //   dispatch(
            //     commonActions.handleSnackbar({
            //       show: true,
            //       message: `Please fill all the required fields`,
            //       type: "error",
            //       closeIn: 2000,
            //     })
            //   );
            // }
          }
        } else {
          handleSetActiveStep();
        }
      }}
    >
      {icons[String(props.icon)]}
    </div>
  );
};

StepIcon.propTypes = {
  /**
   * Whether this step is active.
   */
  active: PropTypes.bool,
  /**
   * Mark the step as completed. Is passed to child components.
   */
  completed: PropTypes.bool,
  /**
   * The label displayed in the step icon.
   */
  icon: PropTypes.node,
};
