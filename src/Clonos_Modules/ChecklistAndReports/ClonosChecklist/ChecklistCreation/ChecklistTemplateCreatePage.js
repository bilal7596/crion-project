import { useState, memo } from "react";
import Styles from "../../../../ModuleStyles/ChecklistAndReports/ClonosChecklist/TemplateCreationPage.module.css";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import PREVIEWICON from "../../../../assets/UIUX/icons/Checklist/eye-preview.svg";
import { ClonosButton } from "../../../../components/CommonComponents/Button/Button";
import { useSelector } from "react-redux";
import PLUSICON from "../../../../assets/UIUX/icons/Checklist/white-plus.svg";
import EXPANDDOWN from "../../../../assets/UIUX/icons/Checklist/caret-down.svg";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  handleUpdateLayoutDelaySetter,
  updateLayout,
} from "../../../../utils/clonosCommon";
import { TemplateAttributes } from "../../../../components/ClonosChecklist/TemplateAttributes";
import ChecklistTemplateTable from "../../../../components/ClonosChecklist/ChecklistTemplateTable";
import { v4 as uuidv4 } from "uuid";
import { ChecklistAndReportsAction } from "../../../../Store/Reducers/ClonosChecklistAndReportsReducer";
import Modal from "../../../../components/CommonComponents/Modal/Modal";
import { ChecklistTemplatePreview } from "../../../../components/ClonosChecklist/ChecklistTemplatePreview";
import CloseIcon from "../../../../assets/Clonos Common Indicators/Icon_Components/CloseIcon";
import { SaveChecklistAsTemplate } from "../../../../components/ClonosChecklist/CreateChecklist/SaveChecklistAsTemplateModal";
import { handleSaveChecklistDataSetsMethod } from "../../../../utils/ChecklistAndReportsMethods/ChecklistMethod";
import { useLocation, useNavigate } from "react-router-dom";
import { UnAuthorizedModal } from "../../../../components/CommonComponents/UnAuthorizedPage/UnAuthorizedModal";
const ChecklistTemplateCreatePage = () => {
  const { mainLayoutChildrenPositionsToolkitState } = useSelector(
    (store) => store.globalEntitiesStateManagement
  );
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const LOCATION = useLocation();
  const { state } = LOCATION;
  const [lcIntervals, setLcIntevals] = useState({});
  const [showAttributes, setShowAttributes] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showSaveTemplateModal, setShowSaveTemplateModal] = useState(false)
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const [uploadedAttributesFiles, setUploadedAttributesFiles] = useState([])
  const { checklistTemplateAttributes, checklistGeneralDetailsCreationDetails } = useSelector(
    (store) => store.checklistTemplateData
  );
  console.log('checklistTemplateAttributes:', checklistTemplateAttributes)
  console.log('checklistGeneralDetailsCreationDetails:', checklistGeneralDetailsCreationDetails)
  const getSelectedAttributeValue = (value) => {
    let tempAttribute = {
      id: uuidv4(),
      attributeName: value,
      fieldName: "",
      fieldValue: "",
      images: [],
      notes: "",
    };
    if (
      value === "Multiple Choice" ||
      value === "Dropdown" ||
      value === "Checkboxes"
    ) {
      tempAttribute.choosedValue = [];
      tempAttribute.fieldValue = [
        { optionId: uuidv4(), optionValue: "Option 1" },
        { optionId: uuidv4(), optionValue: "Option 2" }
      ]
    }
    dispatch(
      ChecklistAndReportsAction.setSelectedAttributesToolkitState([
        ...checklistTemplateAttributes,
        tempAttribute,
      ])
    );
  };

  const getUploadedAttributesFiles = (value) => {
    setUploadedAttributesFiles(value)
  }
  useEffect(() => {
    updateLayout({ dispatch });
    setLcIntevals({
      ...lcIntervals,
      updateLayoutInterval: handleUpdateLayoutDelaySetter({ dispatch }),
    });
  }, []);
  if (checklistGeneralDetailsCreationDetails?.id) return (
    <>
      <div
        className={Styles.checklist_main_container}
        style={{
          height:
            mainLayoutChildrenPositionsToolkitState?.viewPortUnit?.remainingPart
              ?.height,
        }}
      >
        <section
          aria-level={"Parent section of the input body section."}
          className={Styles.template_content_container}
        >
          <div className={Styles.checklist_template_nav}>
            <div className={Styles.nav_sub_container}>
              {checklistTemplateAttributes?.length > 0 && <div onClick={() => setShowPreviewModal(true)} className={Styles.preview_btn_box}>
                <img src={PREVIEWICON} />
                <p>Preview</p>
              </div>}
              <div>
                <ClonosButton onClick={() => setShowSaveTemplateModal(true)} style={{ color: "#06337E" }} isHollow={true}>
                  Save as Template
                </ClonosButton>
              </div>
              <div
                onClick={() => setShowAttributes(!showAttributes)}
                className={Styles.add_task_btn_box}
              >
                <img src={PLUSICON} />
                <p>Add Task</p>
                <span>
                  <img src={EXPANDDOWN} />
                </span>
                {showAttributes && (
                  <TemplateAttributes
                    getSelectedValue={(val) => getSelectedAttributeValue(val)}
                  />
                )}
              </div>
            </div>
          </div>
          <ChecklistTemplateTable
            attributes={checklistTemplateAttributes}
            uploadedAttributesFiles={uploadedAttributesFiles}
            getUploadedAttributesFiles={(value) => getUploadedAttributesFiles(value)}
          />
          <div className={Styles.btn_controller}>
            <div className={Styles.btns_container}>
              <ClonosButton isHollow={true}>Cancel</ClonosButton>
              <ClonosButton onClick={() => handleSaveChecklistDataSetsMethod({ checklistId: checklistGeneralDetailsCreationDetails?.id, payload: checklistTemplateAttributes, dispatch, Navigate, savingType: 'create', files: uploadedAttributesFiles })}>Create Checklist</ClonosButton>
            </div>
          </div>
        </section>
      </div>
      <Modal isOpen={showPreviewModal} closeModalMethod={setShowPreviewModal}>
        <div className={Styles.preview_modal_sub_container}>
          <div className={Styles.preview_modal_header}>
            <h4>{state?.generalDetails?.name}</h4>
            <div><CloseIcon onClick={() => setShowPreviewModal(false)} /></div>
          </div>
          <div aria-label="General Details" className={Styles.general_details_container}>
            <p>{state?.generalDetails?.description}</p>
          </div>
          <div className={Styles.preview_modal_content_container}>
            <ChecklistTemplatePreview attributes={checklistTemplateAttributes} uploadedAttributesFiles={uploadedAttributesFiles} getUploadedAttributesFiles={getUploadedAttributesFiles} getUpdatedValues={(val) => console.log(val, "from page")} />
          </div>
          {/* <div className={Styles.preview_modal_btn_controller}>
              
            </div> */}
        </div>
      </Modal>
      <SaveChecklistAsTemplate open={showSaveTemplateModal} closeMethod={setShowSaveTemplateModal} checklistGeneralDetailsCreationDetails={checklistGeneralDetailsCreationDetails} />
    </>
  );
  return <UnAuthorizedModal />
};

export default memo(ChecklistTemplateCreatePage);

