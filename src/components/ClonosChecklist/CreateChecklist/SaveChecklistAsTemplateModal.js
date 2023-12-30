import Modal from "../../CommonComponents/Modal/Modal"
import Styles from "../../../ModuleStyles/ChecklistAndReports/ClonosChecklist/SaveChecklistAsTemplate.module.css"
import CloseIcon from "../../../assets/Clonos Common Indicators/Icon_Components/CloseIcon"
import { ClonosButton } from "../../CommonComponents/Button/Button"
import { useSelector } from "react-redux"
import { handleSaveChecklistDataSetsMethod } from "../../../utils/ChecklistAndReportsMethods/ChecklistMethod"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
export const SaveChecklistAsTemplate = ({open,closeMethod}) => {
    const { checklistTemplateAttributes,checklistGeneralDetailsCreationDetails } = useSelector(
        (store) => store.checklistTemplateData
      );
    const Navigate = useNavigate()  
    const dispatch = useDispatch();  
    const handleSaveChecklistAsTemplate = () => {
        handleSaveChecklistDataSetsMethod({checklistId:checklistGeneralDetailsCreationDetails?.id,payload:checklistTemplateAttributes,dispatch,Navigate,savingType:'template'})
    }
    return (
        <Modal isOpen={open} closeModalMethod={closeMethod}>
            <div className={Styles.sct_subcontainer}>
                <div className={Styles.sct_header}>
                    <h4>Save As Template</h4>
                    <div><CloseIcon onClick={() => closeMethod(false) }/></div>
                </div>
                <div className={Styles.sct_content_container}>
                    <div className={Styles.sct_field_container}>
                        <label>Template Name<span className={Styles.required}>*</span></label>
                        <input value={checklistGeneralDetailsCreationDetails?.name}/>
                    </div>
                </div>
                <div className={Styles.cst_btn_controller}>
                    <div>
                        <ClonosButton p={"0.5rem 2rem"} isHollow={true} style={{color:"#06337E"}} onClick={() => closeMethod(false )}>Cancel</ClonosButton>
                        <ClonosButton p={"0.5rem 3rem"} onClick={handleSaveChecklistAsTemplate} >Save</ClonosButton>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

