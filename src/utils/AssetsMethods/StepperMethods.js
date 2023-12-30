import { commonActions } from "../../Store/Reducers/CommonReducer";
import { validGeneralDetails, validLocationDetails, validSpecificationsDetails, validateForm } from "./AssetRegister";

export const handleStepperActiveStep = ({index,activeStep,dispatch,formData,setErrors,proceedNext}) => {
    if(activeStep < index){
        if(index == 1) {
          if(validGeneralDetails(formData)) {
            proceedNext()
          } else {
            dispatch(
              commonActions.handleSnackbar({
                show: true,
                message: `Please fill all the required fields`,
                type: "error",
                closeIn: 2000,
              })
            );
            // validateForm({formData,setErrors})
          }
        } else if(index == 2 ) {
          if(validGeneralDetails(formData) && validSpecificationsDetails(formData)) {
            proceedNext()
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
        } else if(index == 3) {
          if(validGeneralDetails(formData) && validSpecificationsDetails(formData) && validLocationDetails(formData)) {
            proceedNext()
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
        } else if(index == 4 || index === 5 || index === 6) {
          if(validGeneralDetails(formData) && validSpecificationsDetails(formData) && validLocationDetails(formData)) {
            proceedNext()
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
        } 
      } else {
        proceedNext()
      }
}