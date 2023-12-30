import {
  Step,
  StepConnector,
  StepLabel,
  Stepper,
  makeStyles,
} from "@material-ui/core";
import { StepIcon } from "./StepperConnector";
import { useEffect, useState } from "react";
import Styles from "../../../ModuleStyles/Assets/stepper.module.css";
import { useDispatch, useSelector } from "react-redux";
import { assetActions } from "../../../Store/Reducers/ClonosAssetReducer";
import CreateAssetGeneralDetails from "./CreateAssetGeneralDetails";
import { CreateAssetSpecifications } from "./CreateAssetSpecifications";
import { CreateAssetLocationAndHierarchy } from "./CreateAssetLocationAndHierarchy";
import { StepController } from "./StepController";
import { getUser } from "../../../utils/clonosCommon";
import {
  createNewAsset,
  validGeneralDetails,
  validLocationDetails,
  validSpecificationsDetails,
  validateForm,
} from "../../../utils/AssetsMethods/AssetRegister";
import { useNavigate } from "react-router-dom";
import { AssociatedDocuments } from "./AssociatedDocuments";
import { CreateAsset3DDetails } from "./CreateAsset3DDetails";
import { AssetCreationSuccessModal } from "./AssetCreationSuccessModal";
import { commonActions } from "../../../Store/Reducers/CommonReducer";
import CreateAssetParameters from "./CreateAssetParameters";
import CreateAssetReferenceManuals from "./CreateAssetReferenceManuals";
const useStyles = makeStyles((theme) => ({
  root: {
    width: "50%",
    margin: "auto",
    backgroundColor: "#fafafa",
    marginBottom: "2em",
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));
export const ClonosStepper = () => {
  const classes = useStyles();
  const loggedUser = getUser();
  const steps = [
    "General Details",
    "Specifications",
    "Location & Hierarchy",
    "3D",
    "Documents",
    "Parameter",
    "Reference Manuals",
  ];
  const [activeStep, setActiveStep] = useState(0);
  const [showAssetCreationSuccessModal, setShowAssetCreationModal] =
    useState(false);
  const dispatch = useDispatch();
  const NAVIGATE = useNavigate();
  const [createdAssetResponse, setCreatedAssetResponse] = useState({});
  const assetData = useSelector((state) => state.assetData.assetData);
  const [formData, setFormData] = useState({
    showGeneralDetailsFieldErrors: false,
    showSpecificationFieldErrors: false,
  });
  const [errors, setErrors] = useState({});
  const getUpdatedStatusOFAssetCreation = (val) => {
    setShowAssetCreationModal(val);
  };
  const showRequiredFieldError = () => {
    dispatch(
      commonActions.handleSnackbar({
        show: true,
        message: `Please fill all the required fields`,
        type: "error",
        closeIn: 2000,
      })
    );
  };

  const getCreatedAssetDetails = (res) => {
    console.log(res, "from fucnt");
    setCreatedAssetResponse({
      assetId: res?.assetId,
      operationType: res?.operationType,
      message: res?.message,
    });
  };

  const handleNext = () => {
    console.log(formData, "rrrrrrr");
    if (activeStep == 0) {
      if (validGeneralDetails(formData)) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      } else {
        setFormData((prev) => {
          let temp = {
            ...prev,
            showGeneralDetailsFieldErrors: true,
          };
          getChildData(temp);
          return temp;
        });
        showRequiredFieldError();
      }
    } else if (activeStep === 1) {
      if (validSpecificationsDetails(formData)) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      } else {
        setFormData((prev) => {
          let temp = {
            ...prev,
            showSpecificationFieldErrors: true,
          };
          getChildData(temp);
          return temp;
        });
        showRequiredFieldError();
      }
    } else if (activeStep === 2) {
      if (validLocationDetails(formData)) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      } else {
        setFormData((prev) => ({ ...prev, showFieldErrors: true }));
        showRequiredFieldError();
      }
    } else if (activeStep === 3) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else if (activeStep === 4) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else if (activeStep === 5) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else if (activeStep === 6) {
      createNewAsset({
        formData,
        loggedUser,
        dispatch,
        getUpdatedStatusOFAssetCreation,
        operationType: "created",
        getCreatedAssetDetails: (res) => getCreatedAssetDetails(res),
        setShowAssetCreationModal,
      });
    }
  };

  const handleBack = () => {
    if (activeStep === 6) {
      formData.assetStatus = "Draft";
      createNewAsset({
        formData,
        loggedUser,
        dispatch,
        getUpdatedStatusOFAssetCreation,
        operationType: "drafted",
        getCreatedAssetDetails: (res) => getCreatedAssetDetails(res),
        setShowAssetCreationModal,
      });
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const getChildData = (value) => {
    if (value) {
      setFormData(value);
    }
  };
  console.log(formData, "from stiip");
  return (
    <>
      <div className={Styles.StepperWrapper}>
        <Stepper
          alternativeLabel
          activeStep={activeStep}
          connector={<StepConnector />}
          style={{ background: "none" }}
        >
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel
                StepIconComponent={(props) => (
                  <StepIcon
                    {...props}
                    handleSetActiveStep={() => setActiveStep(index)}
                    activeStep={activeStep}
                    formData={formData}
                    index={index}
                  />
                )}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </div>
      {activeStep === 0 && (
        <CreateAssetGeneralDetails
          getData={getChildData}
          data={formData}
          fieldErrors={errors}
        />
      )}
      {activeStep === 1 && (
        <CreateAssetSpecifications getData={getChildData} data={formData} />
      )}
      {activeStep === 2 && (
        <CreateAssetLocationAndHierarchy
          getData={getChildData}
          data={formData}
        />
      )}
      {activeStep === 3 && (
        <CreateAsset3DDetails getData={getChildData} data={formData} />
      )}
      {activeStep === 4 && (
        <AssociatedDocuments getData={getChildData} data={formData} />
      )}
      {activeStep === 5 && (
        <CreateAssetParameters getData={getChildData} data={formData} />
      )}
      {activeStep === 6 && (
        <CreateAssetReferenceManuals getData={getChildData} data={formData} />
      )}
      <StepController
        handleBack={handleBack}
        handleNext={handleNext}
        activeStep={activeStep}
        steps={steps}
      />
      {showAssetCreationSuccessModal && (
        <AssetCreationSuccessModal
          open={showAssetCreationSuccessModal}
          closeModalMethod={setShowAssetCreationModal}
          label={"Asset"}
          number={formData?.assetNumber}
          name={formData?.assetName}
          viewItemURL={"view-asset"}
          libraryURL={"all-assets"}
          state={createdAssetResponse}
        />
      )}
    </>
  );
};
