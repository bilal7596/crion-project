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
import EditAssetGeneralDetails from "./EditAssetGeneralDetails";
import { EditAssetSpecifications } from "./EditAssetSpecifications";
import { EditAssetLocationAndHierarchy } from "./EditAssetLocationAndHierarchy";
import { StepController } from "./StepController";
import { getUser } from "../../../utils/clonosCommon";
import {
  createNewAsset,
  handleEditAsset,
  validGeneralDetails,
  validLocationDetails,
  validSpecificationsDetails,
} from "../../../utils/AssetsMethods/AssetRegister";
import { useNavigate } from "react-router-dom";
import { EditAsset3DDetails } from "./EditAsset3DDetails";
import { EditAssociatedDocuments } from "./EditAssociatedDocuments";
import { commonActions } from "../../../Store/Reducers/CommonReducer";
import { AssetCreationSuccessModal } from "../RegisterAsset/AssetCreationSuccessModal";
import ClonosConfirmationDialog from "../../Dialogs/ClonosConfirmationDialog";
import EditAssetParameters from "./EditAssetParameters";
import EditAssetReferenceManuals from "./EditAssetReferenceManuals";
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
export const ClonosStepperEditAsset = ({
  data,
  technicalSpecificationsOfAsset,page,limit
}) => {
 
  const [formData, setFormData] = useState({...data});
  const [technicalSpecs, setTechnicalSpecs] = useState([
    ...technicalSpecificationsOfAsset,
  ]);
  const loggedUser = getUser();
  const Navigate = useNavigate();
  const steps = ["General Details", "Specifications", "Location & Hierarchy","3D","Documents","Parameters","Reference Manuals"];
  const [showAssetCreationSuccessModal, setShowAssetCreationModal] =
    useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const dispatch = useDispatch();
  const [changeIN, setChangeIN] = useState({});
  const [updatedAssetResponse, setUpdatedAssetResponse] = useState({});
  const [showConfirmationDailaog,setShowConfirmationDailog] = useState(false)
  const getUpdatedStatusOFAssetCreation = (val) => {
    setShowAssetCreationModal(val);
  };

  const getCreatedAssetDetails = (res) => {
    console.log(res,"from fucnt")
    setUpdatedAssetResponse({assetId:res?._id,operationType:res?.operationType});
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
  }
  const handleNext = () => {
    if(activeStep === 0){
      if(validGeneralDetails(formData)){
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
    } else if (activeStep === 1){
      if(validSpecificationsDetails(formData)){
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      } else {
        showRequiredFieldError()
      }
    } else if (activeStep === 2){
      if(validLocationDetails(formData)){
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      } else {
        showRequiredFieldError()
      }
    }  else if (activeStep === 3 ){
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else if (activeStep === 4) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else if (activeStep === 5) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else if(activeStep === 6){
      handleEditAsset({assetId:data?._id,formData:changeIN, loggedUser, dispatch, Navigate,page,limit,getUpdatedStatusOFAssetCreation,
        operationType:"updated",
        getCreatedAssetDetails: (res) => getCreatedAssetDetails(res)});
    }
  };

  const handleBack = () => {
    if (activeStep === 6) {
      setShowConfirmationDailog(true)
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const getChildData = (value) => {
    setFormData({ ...value });
  };
  const getChangedValues = (value) => {
    console.log(value,".........")
    setChangeIN(value);
  };
  const getTechSpecs = (techSpecs) => {
    setTechnicalSpecs([...techSpecs]);
  };

  useEffect(() => {
    setFormData(data);
  }, [data]);
  console.log(formData,"formData from edit")
  return (
    <>
      <div className={Styles.StepperWrapper}>
        <Stepper
          alternativeLabel
          activeStep={activeStep}
          connector={<StepConnector  />}
          style={{ background: "none" }}
        >
          {steps.map((label,index) => (
            <Step key={label}>
              <StepLabel StepIconComponent={(props) => (
                <StepIcon {...props} handleSetActiveStep={() => setActiveStep(index)} activeStep={activeStep} index={index} formData={formData} />
              )}>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </div>
      {activeStep === 0 && (
        <EditAssetGeneralDetails
          getData={getChildData}
          data={formData}
          getChangedValues={getChangedValues}
          changedData={changeIN}
        />
      )}
      {activeStep === 1 && ( <EditAssetSpecifications getData={getChildData} getTechSpecs={getTechSpecs} getChangedValues={getChangedValues} changedData={changeIN}  data={formData} technicalSpecificationsOfAsset={technicalSpecs} /> )}
      {activeStep === 2 && ( <EditAssetLocationAndHierarchy getData={getChildData} data={formData} getChangedValues={getChangedValues} changedData={changeIN} /> )}
      {activeStep === 3 && ( <EditAsset3DDetails getData={getChildData} data={formData} getChangedValues={getChangedValues} changedData={changeIN} /> )}
      {activeStep === 4 && ( <EditAssociatedDocuments getData={getChildData} data={formData} getChangedValues={getChangedValues} changedData={changeIN} /> )}
      {activeStep === 5 && (
        <EditAssetParameters getData={getChildData} data={formData} getChangedValues={getChangedValues} changedData={changeIN} />
      )}
      {activeStep === 6 && (
        <EditAssetReferenceManuals getData={getChildData} data={formData} getChangedValues={getChangedValues} changedData={changeIN} />
      )}
      <StepController handleBack={handleBack} handleNext={handleNext} activeStep={activeStep} steps={steps}/>
      {showAssetCreationSuccessModal && (
        <AssetCreationSuccessModal
          open={showAssetCreationSuccessModal}
          closeModalMethod={setShowAssetCreationModal}
          label={"Asset"}
          number={formData?.assetNumber}
          name={formData?.assetName}
          viewItemURL={"view-asset"}
          libraryURL={"all-assets"}
          state={updatedAssetResponse}
        />
      )}
      {
        <ClonosConfirmationDialog Open={showConfirmationDailaog} CloseDialog={() => setShowConfirmationDailog(false)} Title={"Cancel Edit."} Content={"Are you sure you want to cancel ?"} ProceedDialog={() => Navigate(-1) }/>
      }
    </>
  );
};
