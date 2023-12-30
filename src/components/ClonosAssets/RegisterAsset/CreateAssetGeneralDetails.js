import { SelectPicker } from "rsuite";
import Styles from "../../../ModuleStyles/Assets/assets.module.css";
import { LinearProgress } from "@material-ui/core";
import { useEffect, useState, memo, useRef } from "react";
import DOWNANGLE from "../../../assets/UIUX/icons/chevron-down.svg";
import SEARCHICON from "../../../assets/UIUX/icons/search (1).svg";
import {
  getAssetModeDropdownData,
  getRunningModeDropdownData,
  handleGetValueFromSelect,
  handleGetValuesMethod,
  validateForm,
  validatedFiles,
} from "../../../utils/AssetsMethods/AssetRegister";
import { CloseOutlined } from "@material-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { removeUserSession } from "../../../utils/clonosCommon";
import { commonActions } from "../../../Store/Reducers/CommonReducer";
import { CustomSelect } from "../../CommonComponents/CustomSelect/CustomSelect";
import { getAllUsersDropdownData } from "../../../utils/UsersMethods/usersMethods";
import DropdownModal from "../../CommonComponents/DropDownModal/DropdownModal";
import { userActions } from "../../../Store/Reducers/ClonosUserReducer";
import UPLOADIMGICON from "../../../assets/UIUX/icons/uploadImageIcon.svg";
import UPLOADFILEICON from "../../../assets/UIUX/icons/fileuploadIcon.svg";
import IMAGEPREVIEWICON from "../../../assets/UIUX/icons/imagePreviewIcon.svg";
import REDTRASHICON from "../../../assets/UIUX/icons/redTrash.svg";
import { ProgressBarWithLabel } from "../../CommonComponents/ProgressBar/ProgressBarWithLabel";
import { handleGetStaticDropdownValues } from "../../../utils/DropdownsMethods/DropdownsMethods";
import FileUploader from "../../CommonComponents/FileUploader/FileUploader";
import DynamicDropdown from "../../CommonComponents/DynamicDropdown/DynamicDropdown";
import { handleGetUsersDropdownData } from "../../../utils/WorkOrderMethods/WorkOrderMethods";
import ClonosSelect from "../../CommonComponents/ClonosSelect/ClonosSelect";
import ClonosInput from "../../CommonComponents/ClonosInput/ClonosInput";
import ClonosTextarea from "../../CommonComponents/ClonosTextarea/ClonosTextarea";
import { getDocumentsListOfAssetCategory } from "../../../Api/Asset/assetApi";
// import LinearProgress from '@mui/material/LinearProgress';
let primaryObject = {};
const CreateAssetGeneralDetails = ({ getData, data, fieldErrors }) => {
  const [showUserModal, setShowUserModal] = useState(false);
  const [assetDepartmentDropdwon, setAssetDepartmentDropdown] = useState([]);
  const [functionalAreaDropdown, setFunctionalAreaDropdown] = useState([]);
  const [criticalityLevelDropdown, setCriticalityDropdown] = useState([]);
  const [assetCategoryDropdownDown, setAssetCategoryDropdown] = useState([]);
  const [assetMode, setAssetMode] = useState([]);
  const [runningMode, setRunningMode] = useState([]);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ ...data });
  const assetImgRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [assetPaginationCurrentPage, setAssetPaginationCurrentPage] =
    useState(1);
  const [usersDropdownData, setUsersDropdownData] = useState([]);


  const handleChange = ({e,label}) => {
  const { name, value } = e.target;
  const specialCharacters = `!"#$%&'()*+,./:;<=>?@[\\]^\`{|}~`;
  
  setFormData((prev) => {
    let temp = {};
    if (name === "assetName" || name === "assetNumber") {
      let charArr = value.split("");
      const newValue = charArr
        .filter((char) => !specialCharacters.includes(char))
        .join("");

      temp = {
        ...prev,
        [name]: newValue,
      };
    } else {
      temp = {
        ...prev,
        [name]: value,
      };
    }
    if (label) {
      // Using the state updater function to access the most recent state
      validateForm({ name, formData: temp, setErrors, label });
    }

    return temp; // Return the updated state
  });
  };

  const handleMoreData = ({ isActivator }) => {
    if (isActivator) {
      setAssetPaginationCurrentPage((prev) => {
        let updatedPageCount = prev + 1;
        handleGetUsersDropdownData({
          setUsersDropdownData,
          usersDropdownData,
          assetPaginationCurrentPage: updatedPageCount,
          dispatch,
        });
        return updatedPageCount;
      });
    }
  };

  const handleGetValues = (val) => {
    if (val.type === "select") {
      let { uniqueKey } = val;
      primaryObject = {
        ...primaryObject,
        [uniqueKey]: { ...primaryObject[uniqueKey], value: true },
      };
    } else if (val.type === "dynamicDropdown") {
      let { name } = val;
      primaryObject = {
        ...primaryObject,
        [name]: { ...primaryObject[name], value: true },
      };
    }
    handleGetValuesMethod({ val, getData, setFormData });
  };

  // new changes for file uploader

  const handleGetUploadedFiles = (val) => {
    const files = val?.files;
    setFormData((prev) => {
      let temp = {
        ...prev,
        assetImage: [...files],
      };
      getData(temp);
      return temp;
    });
  };

  const handleGetSelectedUser = (val) => {
    let user = val?.selectedOption[0];
    setFormData((prev) => {
      let temp = {
        ...prev,
        assetOwner: { name: user?.name, id: user?.id },
      };
      getData(temp);
      validateForm(temp, setErrors);
      return temp;
    });
  };

  const handleFieldsError = (err) => {
    if (err.uniqueKey === "assetowner") {
      primaryObject = {
        ...primaryObject,
        [err.uniqueKey]: {
          ...err,
          value: formData["assetOwner"]?.name ? true : false,
        },
      };
    } else {
      primaryObject = {
        ...primaryObject,
        [err.uniqueKey]: {
          ...err,
          value: formData[err.uniqueKey] ? true : false,
        },
      };
    }
  };
  console.log("formDataFile", formData);

  const handleValidateDropdownValues = (data) => {
    validateForm({ name: "assetNumber", formData, setErrors });
  };

  useEffect(() => {
    handleGetUsersDropdownData({
      setUsersDropdownData,
      usersDropdownData,
      dispatch,
    });
    handleGetStaticDropdownValues({
      staticDropdownNameOrId: "AssetMode",
      dispatch,
      setterFunctionForValues: setAssetMode,
    });
    handleGetStaticDropdownValues({
      staticDropdownNameOrId: "RunningMode",
      dispatch,
      setterFunctionForValues: setRunningMode,
    });
    handleGetStaticDropdownValues({
      staticDropdownNameOrId: "FunctionalArea",
      dispatch,
      setterFunctionForValues: setFunctionalAreaDropdown,
    });
    handleGetStaticDropdownValues({
      staticDropdownNameOrId: "AssetDepartment",
      dispatch,
      setterFunctionForValues: setAssetDepartmentDropdown,
    });
    handleGetStaticDropdownValues({
      staticDropdownNameOrId: "CriticalityLevel",
      dispatch,
      setterFunctionForValues: setCriticalityDropdown,
    });
    handleGetStaticDropdownValues({
      staticDropdownNameOrId: "AssetCategory",
      dispatch,
      setterFunctionForValues: setAssetCategoryDropdown,
    });
  }, []);

  useEffect(() => {
    if(formData?.assetCategory?.id){
      getDocumentsListOfAssetCategory(formData?.assetCategory?.id).then((res) => {
        let documents = res?.data?.result?.documents || [];
        documents = documents?.map((doc,index) => {
          let tempDoc = {  documentName:doc?.documentName,
                          id:doc?._id,
                          index:index +1,
                          documentType:null,
                          status:null,
                          documentNumber:null,
                          revisionNumber:null,
                          file:null,
                          action:"Upload"
                        }
          return tempDoc              
        })
        setFormData((prev) =>({...prev,documents}))
        getData({...data,documents})
      })
    }
  },[formData?.assetCategory?.id])

  // console.log(primaryObject,"primaryObject")
  useEffect(() => {
    setErrors(fieldErrors);
  }, [fieldErrors]);

  // useEffect(() => {
  //   if(data?.showGeneralDetailsFieldErrors) {
  //     validateForm({pageName:"general details",formData,setErrors});
  //     Object.keys(primaryObject).map((key) => {
  //       if(!primaryObject[key].value){
  //         primaryObject[key].errorActivatorMethod(true)
  //       }
  //     })
  //   }
  // },[data?.showGeneralDetailsFieldErrors])
  console.log(formData, "shiva_prem");
  return (
    <>
      <div className={Styles.generalDetailsContainer}>
        <div>
          <div className={Styles.generalDetails_left}>
            <div>
              <label>
                Asset Name <span style={{ color: "red" }}>*</span>
              </label>
              <input
                value={formData?.assetName}
                onBlur={() =>
                  validateForm({
                    name: "assetName",
                    formData,
                    setErrors,
                    label: "Asset Name",
                  })
                }
                placeholder="Asset Name"
                name="assetName"
                onChange={(e) => handleChange({ e, label: "Asset Name" })}
                style={{ color: formData?.assetName ? "black" : "#8CA1C4" }}
              />
              {errors.assetName && (
                <span className={Styles.error}>{errors.assetName}</span>
              )}
            </div>
            <div>
              <label>
                Asset Number <span style={{ color: "red" }}>*</span>
              </label>
              <input
                value={formData?.assetNumber}
                onBlur={() =>
                  validateForm({
                    name: "assetNumber",
                    formData,
                    setErrors,
                    label: "Asset Number",
                  })
                }
                placeholder="Asset Number"
                name="assetNumber"
                onChange={(e) => handleChange({ e, label: "Asset Number" })}
                style={{ color: formData?.assetNumber ? "black" : "#8CA1C4" }}
              />
              {errors.assetNumber && (
                <span className={Styles.error}>{errors.assetNumber}</span>
              )}
            </div>
            <div>
              <label>Asset Description</label>
              <textArea
                rows="4"
                value={formData?.assetDescription}
                placeholder="Asset Description"
                name="assetDescription"
                onChange={(e) => handleChange({ e, label: ""})}
                style={{
                  color: formData?.assetDescription ? "black" : "#8CA1C4",
                }}
                // onBlur={() => validateForm({name:"",formData, setErrors,label:""})}
              ></textArea>
            </div>
            <div>
              <ClonosSelect
                type="select"
                placeholder="Select"
                label={"Asset Mode"}
                isLabel={true}
                uniqueKey="assetMode"
                // defaultValue={formData?.assetMode?.name}
                isMandatory={false}
                options={assetMode?.map((opt) => ({
                  label: opt?.name,
                  value: opt?.id,
                  isNeeded: true,
                }))}
                errorMessage={"Asset Mode is Required!."}
                icon={DOWNANGLE}
                handleGetValues={(value) => handleGetValues(value)}
                // handleGetErrorActivatorInformation={(err) => handleFieldsError(err)}
              />
            </div>
            <div>
              <ClonosSelect
                type="select"
                placeholder="Select"
                label={"Running Mode"}
                isLabel={true}
                uniqueKey="runningMode"
                defaultValue={formData?.runningMode?.name}
                isMandatory={false}
                options={runningMode?.map((opt) => ({
                  label: opt?.name,
                  value: opt?.id,
                  isNeeded: true,
                }))}
                errorMessage={"Running Mode is Required!."}
                icon={DOWNANGLE}
                handleGetValues={(value) => handleGetValues(value)}
                // handleGetErrorActivatorInformation={(err) => handleFieldsError(err)}
              />
            </div>
            <div>
              <ClonosSelect
                type="select"
                placeholder="Select"
                label={"Asset Department"}
                isLabel={true}
                uniqueKey="assetDepartment"
                defaultValue={formData?.assetDepartment?.name}
                isMandatory={true}
                options={assetDepartmentDropdwon?.map((opt) => ({
                  label: opt?.name,
                  value: opt?.id,
                  isNeeded: true,
                }))}
                errorMessage={"Asset Department is Required!."}
                icon={DOWNANGLE}
                handleGetValues={(value) => handleGetValues(value)}
                handleGetErrorActivatorInformation={(err) =>
                  handleFieldsError(err)
                }
              />
            </div>
            <div>
              <ClonosSelect
                type="select"
                placeholder="Select"
                label={"Asset Category"}
                isLabel={true}
                uniqueKey="assetCategory"
                defaultValue={formData?.assetCategory?.name}
                isMandatory={true}
                options={assetCategoryDropdownDown?.map((opt) => ({
                  label: opt?.name,
                  value: opt?.id,
                  isNeeded: true,
                }))}
                errorMessage={"Asset Category is Required!."}
                icon={DOWNANGLE}
                handleGetValues={(value) => handleGetValues(value)}
                handleGetErrorActivatorInformation={(err) =>
                  handleFieldsError(err)
                }
              />
            </div>
            <div>
              <ClonosSelect
                type="select"
                placeholder="Select"
                label={"Criticality Level"}
                isLabel={true}
                uniqueKey="criticalityLevel"
                defaultValue={formData?.criticalityLevel?.name}
                isMandatory={true}
                errorMessage={"Criticality Level is Required!."}
                options={criticalityLevelDropdown?.map((opt) => ({
                  label: opt?.name,
                  value: opt?.id,
                  isNeeded: true,
                }))}
                icon={DOWNANGLE}
                handleGetValues={(value) => handleGetValues(value)}
                handleGetErrorActivatorInformation={(err) =>
                  handleFieldsError(err)
                }
              />
            </div>
            <div>
              <ClonosSelect
                type="select"
                placeholder="Select"
                label={"Functional Area"}
                isLabel={true}
                uniqueKey="functionalArea"
                defaultValue={formData?.functionalArea?.name}
                isMandatory={true}
                options={functionalAreaDropdown?.map((opt) => ({
                  label: opt?.name,
                  value: opt?.id,
                  isNeeded: true,
                }))}
                icon={DOWNANGLE}
                errorMessage={"Functional Area is Required!."}
                handleGetValues={(value) => handleGetValues(value)}
                handleGetErrorActivatorInformation={(err) =>
                  handleFieldsError(err)
                }
              />
            </div>
            <DynamicDropdown
              title={"assetOwner"}
              labelActivator={"User Name"}
              isOpen={showUserModal}
              isOpenMethod={setShowUserModal}
              heading={"Select from User Library"}
              placeholder={"Search"}
              isSearchable={true}
              isCheckbox={false}
              isUser={true}
              isDynamicLoad={true}
              data={usersDropdownData}
              isActivator={true}
              isMandatory={true}
              url={SEARCHICON}
              defaultValue={
                formData?.assetOwner?.name && [formData?.assetOwner]
              }
              handleMoreData={handleMoreData}
              errorMessage={"Asset Owner is Required!."}
              handleGetValues={(value) => handleGetValues(value)}
              handleGetErrorActivatorInformation={(err) =>
                handleFieldsError(err)
              }
            />
            <div>
              <label>Census Number</label>
              <input
                value={formData?.censusNumber}
                onBlur={() =>
                  validateForm({ name: "", formData, setErrors, label: "" })
                }
                placeholder="Enter Census Number"
                name="censusNumber"
                style={{ color: formData?.censusNumber ? "black" : "#8CA1C4" }}
                onChange={(e) => handleChange({e})}
              />
            </div>
          </div>
          <div className={Styles.generalDetails_right}>
            <div>
              <FileUploader
                label={"Asset Image"}
                title={"assetImge"}
                typeOfRecord={"images"}
                isMandatory={false}
                limit={10}
                acceptableFileTypes={[".jpg", ".png", ".jpeg"]}
                fileSizeInMB={10}
                localPreviousPageFiles={
                  formData?.assetImage && formData?.assetImage.length > 0
                    ? formData?.assetImage
                    : []
                }
                handleGetSelectedData={(value) => handleGetUploadedFiles(value)}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(CreateAssetGeneralDetails);
