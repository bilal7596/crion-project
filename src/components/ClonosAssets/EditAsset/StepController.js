import Styles from "../../../ModuleStyles/Assets/stepper.module.css"
export const StepController = ({handleBack,handleNext,activeStep,steps}) => {
    console.log(activeStep,"active")
    return (
        <>
            <div className={Styles.controller_btn}>
                <div>
                <button disabled={activeStep === 0} onClick={() => handleBack()}>{activeStep === steps?.length -1 ? "Cancel" : "Previous"}</button>
                </div>
                <div>
                <button  onClick={() => handleNext()}>{activeStep === steps.length - 1 ? 'Update' : 'Next'}</button>
                </div>
            </div>
        </>
    )   
}