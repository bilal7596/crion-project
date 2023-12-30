import Modal from "../../CommonComponents/Modal/Modal";
import Styles from "../../../ModuleStyles/Assets/uploadDoumentModal.module.css";
import CLOSEICON from "../../../assets/UIUX/icons/x-circle-fill.svg";
import { CustomSelect } from "../../CommonComponents/CustomSelect/CustomSelect";
import DOWNANGLE from "../../../assets/UIUX/icons/chevron-down.svg";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { handleGetStaticDropdownValues } from "../../../utils/DropdownsMethods/DropdownsMethods";
import { useDispatch } from "react-redux";
import UPLOADFILEICON from "../../../assets/UIUX/icons/fileuploadIcon.svg";
import FILE from "../../../assets/UIUX/icons/file.svg";
import DELETEICON from "../../../assets/UIUX/icons/redTrash.svg";
import { Tooltip } from "@material-ui/core";
import {
  handleGetValueFromSelect,
  handleGetValuesMethod,
  validateForm,
} from "../../../utils/AssetsMethods/AssetRegister";
import ClonosSelect from "../../CommonComponents/ClonosSelect/ClonosSelect";
let primaryObject = {};
export const UploadDocumentModal = ({
  data,
  getData,
  open,
  closeModalMethod,
  getDocumentData,
  getChangedValues,
  mode
}) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState();
  const [changedData,setChangedData] = useState({})
  const [docTypes, setDocTypes] = useState([]);
  const [status, setStatus] = useState([]);
  const [errors, setErrors] = useState({});
  const fileUploaderRef = useRef(null);

  const handleChange = (e) => {
    let { name, value } = e.target;
    const specialCharacters = `!"#$%&'()*+,-./:;<=>?@[\\]^\`{|}~`;
    let charArr = value.split("");
    const newValue = charArr
      .filter((char) => {
        return !specialCharacters.includes(char);
      })
      .join("");
    console.log(name, newValue, "modal data");
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
    setChangedData((prev) => {
      return {...prev,[name]:newValue}
    })
  };

  const handleUploadFile = (e) => {
    let file = e.target.files[0];
    setFormData((prev) =>({ ...prev, file:file,fileName:file?.name }));
    setChangedData((prev) => ({...prev,file,replaceDocument:true}))
  };

  const handleGetValues = (val) => {
    console.log(val);
    const { type, uniqueKey, updatedValue } = val;
    if (uniqueKey === "documentType") {
      primaryObject = {
        ...primaryObject,
        [uniqueKey]: { ...primaryObject[uniqueKey], value: true },
      };
    }
    setFormData((prev) => {
      return {
        ...prev,
        [uniqueKey]: { name: updatedValue?.label, id: updatedValue?.value },
      };
    });
    setChangedData((prev) => ({
        ...prev,
        [uniqueKey]: { name: updatedValue?.label, id: updatedValue?.value },
    }))
  };

  const handleFieldsError = (err) => {
    console.log(err, "errr");
    const { uniqueKey } = err;
    primaryObject = {
      ...primaryObject,
      [uniqueKey]: {
        ...err,
        value: formData[err.uniqueKey] ? true : false,
      },
    };
  };
  const handleSaveData = () => {
    if (
      formData?.documentName &&
      formData?.documentType?.name &&
      formData?.documentNumber
    ) {
      getDocumentData(formData);
      // if(mode === "edit"){
      //   getChangedValues({...changedData,id:formData?.docId});
      //   setChangedData({})
      // }
      closeModalMethod();
      setFormData({});
    } else {
      setErrors((prev) => {
        let temp = {
          ...prev,
          documentName: formData?.documentName
            ? ""
            : "Document Name is Required!",
          documentNumber: formData?.documentNumber
            ? ""
            : "Document Number is Required!",
        };
        return temp;
      });
      for (let key in primaryObject) {
        if (!primaryObject[key].value) {
          primaryObject[key]?.errorActivatorMethod(true);
        }
      }
    }
  };

  const handleRemoveFile = () => {
    setFormData((prev) => ({ ...prev, file: null }))
    if(mode === "edit"){
      setFormData((prev) => ({ ...prev, fileName: null }))
      setChangedData((prev) => {
        return {...prev,replaceDocument:true}
      })
    }
  }


  useEffect(() => {
    handleGetStaticDropdownValues({
      staticDropdownNameOrId: "DocumentType",
      dispatch,
      setterFunctionForValues: setDocTypes,
    });
    handleGetStaticDropdownValues({
      staticDropdownNameOrId: "ApprovalStatus",
      dispatch,
      setterFunctionForValues: setStatus,
    });
  }, []);

  useEffect(() => {
    setFormData({ ...data });
  }, [data]);
  console.log(formData, "modal data",mode);
  return (
    <Modal isOpen={open} closeModalMethod={closeModalMethod}>
      <div className={Styles.modalContainer}>
        <div className={Styles.headerContainer}>
          <h4 className={Styles.header}>Upload Document</h4>
          <div onClick={closeModalMethod} style={{ cursor: "pointer" }}>
            <img src={CLOSEICON} />
          </div>
        </div>
        <div className={Styles.inputsContainer}>
          <div className={Styles.flexBox}>
            <div className={Styles.fieldContainer}>
              <label>
                Document Name <span style={{ color: "red" }}>*</span>
              </label>
              <input
                // onChange={handleChange}
                name="documentName"
                value={formData?.documentName}
                placeholder="Document Title"
              />
            </div>
            <div className={Styles.fieldContainer}>
              <label>
                Document Number <span style={{ color: "red" }}>*</span>
              </label>
              <input
                onChange={handleChange}
                name="documentNumber"
                onBlur={() =>
                  validateForm({
                    name: "documentNumber",
                    formData,
                    setErrors,
                    label: "Document Number",
                  })
                }
                value={formData?.documentNumber}
                placeholder="Document Number"
              />
              {errors.documentNumber && (
                <span className={Styles.error}>{errors.documentNumber}</span>
              )}
            </div>
          </div>
          <div className={Styles.flexBox}>
            <div className={Styles.fieldContainer}>
              <label>Revision Number</label>
              <input
                onChange={handleChange}
                name="revisionNumber"
                value={formData?.revisionNumber}
                placeholder="Revision Number"
              />
            </div>
            <div className={Styles.fieldContainer}>
              <ClonosSelect
                type="select"
                placeholder="Select"
                label={"Document Type"}
                isLabel={true}
                uniqueKey="documentType"
                defaultValue={formData?.documentType?.name}
                isMandatory={true}
                options={docTypes?.map((opt) => ({
                  label: opt?.name,
                  value: opt?.id,
                  isNeeded: true,
                }))}
                errorMessage={"Document type is Required!."}
                icon={DOWNANGLE}
                handleGetValues={(value) => handleGetValues(value)}
                handleGetErrorActivatorInformation={(err) =>
                  handleFieldsError(err)
                }
              />
            </div>
          </div>
          <div className={Styles.flexBox}>
            <div className={Styles.fieldContainer}>
              <ClonosSelect
                type="select"
                placeholder="Select"
                label={"Document Status"}
                isLabel={true}
                uniqueKey="status"
                defaultValue={formData?.status?.name}
                isMandatory={false}
                options={status?.map((opt) => ({
                  label: opt?.name,
                  value: opt?.id,
                  isNeeded: true,
                }))}
                // errorMessage={"Document status is Required!."}
                icon={DOWNANGLE}
                handleGetValues={(value) => handleGetValues(value)}
                // handleGetErrorActivatorInformation={(err) => handleFieldsError(err)}
              />
            </div>
          </div>
          <div className={Styles.flexBox}>
            <div className={Styles.fieldContainer}>
              <label>Upload Document</label>
              <input
                id={"document"}
                name="document"
                type="file"
                ref={fileUploaderRef}
                accept=".pdf"
                style={{ display: "none" }}
                onChange={handleUploadFile}
              />
              <div className={Styles.fileUploaderContainer}>
                <div
                  className={Styles.custom_button}
                  onClick={() => fileUploaderRef.current.click()}
                >
                  <img src={UPLOADFILEICON} />
                  <h4>Upload</h4>
                </div>
                {(formData?.file?.name || formData?.fileName )&& (
                  <div className={Styles.filePreviewBox}>
                    <div className={Styles.fileNameBox}>
                      <img src={FILE} />
                      <Tooltip title={formData?.file?.name || formData?.fileName}>
                        <h4>{formData?.file?.name || formData?.fileName} </h4>
                      </Tooltip>
                    </div>
                    <div
                      className={Styles.deleteFileBox}
                      onClick={handleRemoveFile}
                    >
                      <img src={DELETEICON} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className={Styles.btnController}>
          <div>
            <button className={Styles.cancleBtn} onClick={closeModalMethod}>
              Cancel
            </button>
            <button onClick={handleSaveData} className={Styles.saveBtn}>
              Save
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
