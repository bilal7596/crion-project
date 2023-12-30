import { useDispatch } from "react-redux";
import TEMPLATE_CREATION_ADDIMAGE from "../../assets/UIUX/icons/Checklist/add-image.svg";
import TEMPLATE_CREATION_VIEWIMAGE from "../../assets/UIUX/icons/Checklist/view-image.svg";
import TEMPLATE_CREATION_ADDNOTE from "../../assets/UIUX/icons/Checklist/add-note.svg";
import TEMPLATE_CREATION_VIEWNOTE from "../../assets/UIUX/icons/Checklist/view-note.svg";
import TEMPLATE_CREATION_REMOVEROW from "../../assets/UIUX/icons/Checklist/circle-minus.svg";
import Styles from "../../ModuleStyles/ChecklistAndReports/ClonosChecklist/TemplateCreationPage.module.css";
import { ChecklistAndReportsAction } from "../../Store/Reducers/ClonosChecklistAndReportsReducer";
import Modal from "../CommonComponents/Modal/Modal";
import { useState } from "react";
import FileUploader from "../CommonComponents/FileUploader/FileUploader";
import CLOSEICON from "../../assets/UIUX/icons/x-circle-fill.svg";
import { ClonosButton } from "../CommonComponents/Button/Button";
import  ChecklistTemplateImagesNotesModal  from "./ChecklistTemplateImagesNotesModal";
export const ChecklistTemplateRowActions = ({
  attribute,
  attributes,
  uploadedAttributesFiles,
  getUploadedAttributesFiles,
}) => {
  const dispatch = useDispatch();
  const [showFileUploader, setShowFileUploader] = useState(false);
  const [showNotesEditor, setShowNotesEditor] = useState(false);
  const [showActionsModal, setShowActionsModal] = useState(false);
  const [noteDetails, setNoteDetails] = useState("");
  const handleRemoveAttribute = () => {
    const updatedAttributes = attributes?.filter(
      (att) => att?.id !== attribute?.id
    );
    dispatch(
      ChecklistAndReportsAction.setSelectedAttributesToolkitState(
        updatedAttributes
      )
    );
  };
  const actions = [
    {
      id: 1,
      action: attribute?.filesCount > 0 ? "View Image" : "Add Image",
      icon:
        attribute?.filesCount > 0
          ? TEMPLATE_CREATION_VIEWIMAGE
          : TEMPLATE_CREATION_ADDIMAGE,
      style: { color: attribute?.filesCount > 0 ? "#0A5FFF" : "#000" },
      onclickMethod: () => setShowFileUploader(true),
    },
    {
      id: 2,
      action: attribute?.notes?.length > 0 ? "View Note" : "Add Note",
      icon: attribute?.notes?.length
        ? TEMPLATE_CREATION_VIEWNOTE
        : TEMPLATE_CREATION_ADDNOTE,
      style: { color: attribute?.notes?.length > 0 ? "#0A5FFF" : "#000" },
      onclickMethod: () => setShowNotesEditor(true),
    },
    {
      id: 3,
      icon: TEMPLATE_CREATION_REMOVEROW,
      onclickMethod: handleRemoveAttribute,
    },
  ];

  return (
    <>
      <div className={Styles.template_action_container}>
        {actions?.map((action) => {
          return (
            <div
              key={action?.id}
              className={Styles.template_action}
              onClick={action?.onclickMethod}
            >
              <div className={Styles.action_icon_container}>
                <img src={action?.icon} />
              </div>
              {action?.action && (
                <p style={action?.style} className={Styles.action_title}>
                  {action?.action}
                </p>
              )}
            </div>
          );
        })}
      </div>
      <ChecklistTemplateImagesNotesModal
        label={showFileUploader ? "Image" : showNotesEditor ? "Notes" : ""}
        attribute={attribute}
        attributes={attributes}
        showFileUploader={showFileUploader}
        showNotesEditor={showNotesEditor}
        setShowFileUploader={setShowFileUploader}
        setShowNotesEditor={setShowNotesEditor}
        uploadedAttributesFiles={uploadedAttributesFiles}
        getUploadedAttributesFiles={getUploadedAttributesFiles}
      />
    </>
  );
};
