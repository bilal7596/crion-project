import { memo, useState } from "react";
import Styles from "../../ModuleStyles/ChecklistAndReports/ClonosChecklist/ChecklistTemplateImagesNotesModal.module.css";
import { useDispatch } from "react-redux";
import { ChecklistAndReportsAction } from "../../Store/Reducers/ClonosChecklistAndReportsReducer";
import Modal from "../CommonComponents/Modal/Modal";
import CloseIcon from "../../assets/Clonos Common Indicators/Icon_Components/CloseIcon";
import { ClonosButton } from "../CommonComponents/Button/Button";
import Template_Creation_Upload_Button_Icon from "../../assets/UIUX/icons/Common_Component/File_Uploader/file_uploader_upload_button.svg";
import Template_Creation_Uploaded_File_Icon from "../../assets/UIUX/icons/Common_Component/File_Uploader/file_uploader_uploaded_file.svg";
import Template_Creation_Remove_File_Icon from "../../assets/UIUX/icons/Common_Component/File_Uploader/file_uploader_delete.svg";
import Template_Creation_Pencil_Icon from "../../assets/UIUX/icons/Checklist/pencil.svg";
import {
  handleCheckFileIsPresentOrNot,
  handleLinearProgress,
  handleValidateFileSize,
  handleValidateFilesType,
  validateFilesLimit,
} from "../../utils/ChecklistAndReportsMethods/ChecklistMethod";
import { LinearProgress, Tooltip } from "@material-ui/core";
import { ProgressBarWithLabel } from "../CommonComponents/FileUploader/FileUploader";
import { useEffect } from "react";
 const ChecklistTemplateImagesNotesModal = ({
  label,
  attribute,
  attributes,
  showFileUploader,
  showNotesEditor,
  setShowFileUploader,
  setShowNotesEditor,
  uploadedAttributesFiles,
  getUploadedAttributesFiles,
}) => {
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [noteDetails, setNoteDetails] = useState("");
  const dispatch = useDispatch();

  const handleSaveImages = () => {
    let updatedAttributesFiles = [...uploadedAttributesFiles];
    if(uploadedAttributesFiles?.length){
      updatedAttributesFiles = uploadedAttributesFiles?.map((file) => {
        if(file?.id === attribute?.id){
            return {
              ...file,
              images:uploadedFiles
            }
        }else {
          return {...file}
        }
      })
      //  If the attribute ID doesn't exist in uploadedAttributesFiles, add a new file
  const existingAttribute = updatedAttributesFiles.find(
    (file) => file.id === attribute?.id
  );
  if (!existingAttribute) {
    updatedAttributesFiles.push({
      id: attribute?.id,
      images: uploadedFiles,
    });
  }
    } else {
      updatedAttributesFiles = [
        {id:attribute?.id,images:uploadedFiles}
      ]
    }
    const temp = attributes?.map((att) => {
      if (att?.id === attribute?.id) {
        return {
          ...att,
          filesCount: uploadedFiles?.length,
          images:uploadedFiles?.map((file) => {
            return {name:file?.name,url:file?.url,size:file.size}
          })
        };
      } else {
        return att;
      }
    });
    console.log(updatedAttributesFiles,'updatedAttributesFiles',attribute?.id)
    getUploadedAttributesFiles(updatedAttributesFiles);
    dispatch(ChecklistAndReportsAction.setSelectedAttributesToolkitState(temp));
    setShowFileUploader(false);
  };

  const handleUploadFiles = (e) => {
    let files = Array.from(e.target.files);
    const backupFiles = [...files];
    if (
      validateFilesLimit({ limit: 8, files, dispatch }) &&
      handleValidateFileSize({ files, fileSizeInMB: 8, dispatch }) && handleValidateFilesType({files,acceptableFileTypes:[".jpg",".png",".jpeg"],dispatch})
    ) {
      files = handleCheckFileIsPresentOrNot({
        needToUploadedFiles: files,
        uploadedFiles,
        dispatch,
      })
      handleLinearProgress({files:backupFiles,setUploadProgress});
      // if(uploadedFiles?.length){
      //   files = [...files,...uploadedFiles]
      // }
      setUploadedFiles(files.map((file) => {
        return {file:file,url:file?.url ? file?.url : URL.createObjectURL(file),name:file?.name,size:file?.size}
      }));
    }
  };

  const handleDeselectFile = (fileToDelete) => {
      const updatedFiles = uploadedFiles?.filter((file) => (file?.name !== fileToDelete?.name))
      setUploadedFiles(updatedFiles)
  }

  const handleSaveNotes = () => {
    const updatedAttributes = attributes?.map((att) => {
      if (att?.id === attribute?.id) {
        return {
          ...att,
          notes: noteDetails,
        };
      }
      return att;
    });
    dispatch(
      ChecklistAndReportsAction.setSelectedAttributesToolkitState(
        updatedAttributes
      )
    );
    setShowNotesEditor(false);
  };


  const handleSave = () => {
    if (label === "Image") handleSaveImages();
    if (label === "Notes") handleSaveNotes();
  };
  useEffect(() => {
  setUploadedFiles(attribute?.images)
  },[])
  console.log(uploadedFiles,"jjjjjjjjjjjjjjjjjjjj",attribute)
  return (
    <Modal
      isOpen={showFileUploader || showNotesEditor}
      closeModalMethod={
        label === "Image"
          ? setShowFileUploader
          : label === "Notes"
          ? setShowNotesEditor
          : setShowFileUploader
      }
    >
      <div className={Styles.modal_inner_container}>
        <div className={Styles.modal_header_container}>
          <h4>Add {label}</h4>
          <CloseIcon
            tooltipTitle={"Close"}
            onClick={() => {
              setShowFileUploader(false);
              setShowNotesEditor(false);
            }}
          />
        </div>
        {label === "Image" ? (
          <div className={Styles.ct_image_uploader_container}>
            {uploadedFiles?.length > 0 ? (
              <>
                <div className={Styles.ct_view_image_container}>
                  <div className={Styles.ct_image_list_container}>
                    {uploadedFiles?.map((file,index) => {
                      return (
                        <div key={index+1} className={Styles.ct_image_item}>
                          <div className={Styles.ct_img_item_left}>
                            <img
                              width={"30px"}
                              height={"30px"}
                              src={file?.url}
                            />
                            <div className={Styles.ct_filename_container}>
                              <Tooltip title={file?.name}><p>{file?.name}</p></Tooltip>
                              {uploadProgress[file?.name] &&
                              uploadProgress[file?.name] !== 100 ? (
                                <ProgressBarWithLabel
                                  progress={uploadProgress[file?.name]}
                                />
                              ) : (
                                <></>
                              )}
                            </div>
                          </div>
                          <div className={Styles.ct_img_item_right}>
                            <div>
                              <img src={Template_Creation_Pencil_Icon} />
                            </div>
                            <div onClick={() => handleDeselectFile(file)}>
                              <img src={Template_Creation_Remove_File_Icon} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className={Styles.ct_view_img_upload_btn_box}>
                  <label htmlFor="ct_view_image_uploader" name="ct_view_image_uploader">
                  <input
                        type="file"
                        style={{ display: "none" }}
                        id="ct_view_image_uploader"
                        accept=".jpg,.png,.jpeg"
                        multiple
                        name="ct_view_image_uploader"
                        onChange={handleUploadFiles}
                      />
                    <div className={Styles.ct_upload_btn}>
                      <span>
                        <img src={Template_Creation_Upload_Button_Icon} />
                      </span>{" "}
                      <span>upload</span>
                    </div>
                  </label>
                </div>
              </>
            ) : (
              <div className={Styles.ct_image_uploader_inner_container}>
                <div className={Styles.ct_drag_area_container}>
                  <label htmlFor="ct_image_uploader" name="ct_image_uploader">
                    <div className={Styles.ct_drag_area_content}>
                      <div>
                        <img />
                      </div>
                      <div>
                        <h4 className={Styles.drag_area_text}>
                          Drag & Drop Image to upload or
                        </h4>
                      </div>
                      <input
                        type="file"
                        style={{ display: "none" }}
                        id="ct_image_uploader"
                        accept=".jpg,.png,.jpeg"
                        multiple
                        name="ct_image_uploader"
                        onChange={handleUploadFiles}
                      />
                      <div>
                        <div className={Styles.ct_upload_btn}>
                          <span>
                            <img src={Template_Creation_Upload_Button_Icon} />
                          </span>{" "}
                          <span>upload</span>
                        </div>
                      </div>
                      <div className={Styles.drag_area_text}>
                        Supported formats .png, .jpg, or .jpeg
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            )}
          </div>
        ) : label === "Notes" ? (
          <div className={Styles.note_editor_content_container}>
            <div className={Styles.textarea_container}>
              <textarea
                onChange={(e) => setNoteDetails(e.target.value)}
                rows="20"
                cols="50"
                maxlength="5000"
                placeholder="Type here"
                defaultValue={attribute?.notes || noteDetails}
              ></textarea>
            </div>
          </div>
        ) : (
          <></>
        )}
        <div className={Styles.file_uploader_footer_container}>
          <ClonosButton
            onClick={() => {
              setShowFileUploader(false);
              setShowNotesEditor(false);
            }}
            style={{ color: "#06337E" }}
            isHollow={true}
            p={"0.5rem 2rem"}
          >
            Cancel
          </ClonosButton>
          <ClonosButton onClick={handleSave} p={"0.5rem 2rem"}>
            Save
          </ClonosButton>
        </div>
      </div>
    </Modal>
  );
};

export default memo(ChecklistTemplateImagesNotesModal)