import { useState } from "react";
import Styles from "../../../ModuleStyles/Assets/stepper.module.css"
import { ClonosButton } from "../../CommonComponents/Button/Button"
import { useSelector } from "react-redux";
export const StepController = ({handleBack,handleNext,activeStep,steps}) => {
    console.log(activeStep,"active");
    const {showAssetCreationLoading,showAssetDraftLoading} = useSelector((store) => store.assetData);
    console.log(showAssetCreationLoading,"showAssetCreationLoading")
    return (
        <>
            <div className={Styles.controller_btn}>
                <div>
                {/* <button disabled={activeStep === 0} onClick={() => handleBack()}>{activeStep === steps.length - 1 ? "Save as Draft" : "Previous"}</button> */}
                <ClonosButton loading={showAssetDraftLoading} onClick={() => handleNext()}>{activeStep === steps.length - 1 ? "Save as Draft" : "Previous"}</ClonosButton>
                </div>
                <div>
                {/* <button  onClick={() => handleNext()}>{activeStep === steps.length - 1 ? 'Create' : 'Next'}</button> */}
                <ClonosButton loading={showAssetCreationLoading} onClick={() => handleNext()}>{activeStep === steps.length - 1 ? 'Create' : 'Next'}</ClonosButton>
                </div>
            </div>
        </>
    )   
}