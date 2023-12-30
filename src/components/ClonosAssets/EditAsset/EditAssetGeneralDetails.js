import Styles from "../../../ModuleStyles/Assets/assets.module.css";
import { LinearProgress } from "@material-ui/core";
import { useEffect, useState, memo } from "react";
import {
  handleGetValueFromSelect,
  handleGetValuesMethod,
  validateForm,
  validatedFiles,
} from "../../../utils/AssetsMethods/AssetRegister";
import { useDispatch } from "react-redux";
import { useRef } from "react";
import DOWNANGLE from "../../../assets/UIUX/icons/chevron-down.svg";
import SEARCHICON from "../../../assets/UIUX/icons/search (1).svg";
import { CustomSelect } from "../../CommonComponents/CustomSelect/CustomSelect";
import { handleGetStaticDropdownValues } from "../../../utils/DropdownsMethods/DropdownsMethods";
import FileUploader from "../../CommonComponents/FileUploader/FileUploader";
import DynamicDropdown from "../../CommonComponents/DynamicDropdown/DynamicDropdown";
import { handleGetUsersDropdownData } from "../../../utils/WorkOrderMethods/WorkOrderMethods";
import ClonosSelect from "../../CommonComponents/ClonosSelect/ClonosSelect";
let primaryObject = {};
const EditAssetGeneralDetails = ({
  getData,
  data,
  getChangedValues,
  changedData,
}) => {
  console.log("Data raw", data);
  const [progress, setProgress] = useState({
    show: false,
    percent: 0,
  });
  const [showAssetMode, setShowAssetMode] = useState(false);
  const [showRunningMode, setShowRunningMode] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showFunctionArea, setShowFunctionArea] = useState(false);
  const [showDepartment, setShowDepartment] = useState(false);
  const [showCriticalityLevel, setShowCriticalityLevel] = useState(false);
  const assetModeRef = useRef(null);
  const runningModeRef = useRef(null);
  const departmentRef = useRef(null);
  const criticalityRef = useRef(null);
  const functionAreaRef = useRef(null);
  const [assetDepartmentDropdwon, setAssetDepartmentDropdown] = useState([]);
  const [functionalAreaDropdown, setFunctionalAreaDropdown] = useState([]);
  const [criticalityLevelDropdown, setCriticalityDropdown] = useState([]);
  const [assetCategoryDropdownDown, setAssetCategoryDropdown] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [assetMode, setAssetMode] = useState([]);
  const [runningMode, setRunningMode] = useState([]);
  const [hoveredImg, setHoveredImg] = useState(false);
  const assetImageRef = useRef(null);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ ...data });
  const [errors, setErrors] = useState({});
  const fileTypes = ["jpg", "jpeg", "png"];
  const [showWrongFileAlert, setShowWrongFileAlert] = useState(false);
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

      let changeIn = {
        ...changedData,
        [name]: newValue,
      };

      getChangedValues(changeIn);
    } else {
      temp = {
        ...prev,
        [name]: value,
      };

      let changeIn = {
        ...changedData,
        [name]: value,
      };

      getChangedValues(changeIn);
    }
    if (label) {
      // Using the state updater function to access the most recent state
      validateForm({ name, formData: temp, setErrors, label });
    }

    return temp; // Return the updated state
  });
    // const { name, value } = e.target;
    // const specialCharacters = `!"#$%&'()*+,-./:;<=>?@[\\]^_\`{|}~`;
    // let temp = {};
    // if (name === "assetName" || name === "assetNumber") {
    //   let charArr = value.split("");
    //   const newValue = charArr
    //     .filter((char) => {
    //       return !specialCharacters.includes(char);
    //     })
    //     .join("");
    //   setFormData((prev) => {
    //      temp = {
    //       ...prev,
    //       [name]: newValue,
    //     };
    //     getData(temp);
    //     let changeIn = {
    //       ...changedData,
    //       [name]: newValue,
    //     };
    //     getChangedValues(changeIn);
    //     return temp;
    //   });
    // } else {
    //   setFormData((prev) => {
    //     temp = {
    //       ...prev,
    //       [name]: value,
    //     };
    //     getData(temp);
    //     let changeIn = {
    //       ...changedData,
    //       [name]: value,
    //     };
    //     getChangedValues(changeIn);
    //     return temp;
    //   });
    // }
    // if(label){
    //   validateForm({ name, formData:temp, setErrors, label });
    // }
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

  const handleGetUploadedFiles = (val) => {
    if (val?.name === "needToDeleteDocuments") {
      let prevFiles = formData?.assetImages;
      const filesTobeDeleted = val?.selectedOption || [];
      let newFiles = prevFiles?.filter((file) => {
        return !filesTobeDeleted.includes(file?.imageId);
      });
      let temp = {
        ...formData,
        assetImagesToDelete: filesTobeDeleted,
        assetImages: formData?.assetImages?.filter((file) => {
          return !filesTobeDeleted.includes(file?.imageId);
        }),
      };
      getData(temp);
      let changeIn = {
        ...changedData,
        assetImagesToDelete: filesTobeDeleted,
      };
      getChangedValues(changeIn);
    } else {
      let files = val?.files;
      let changeIn = {
        ...changedData,
        assetImages: [...files],
      };
      getChangedValues(changeIn);
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
    handleGetValuesMethod({
      val,
      setFormData,
      getData,
      getChangedValues,
      changedData,
    });
  };

  // const handleValidateDropdownValues = (data) => {
  //   validateForm(data, setErrors);
  // };

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
    setFormData(data);
  }, [Object.keys(data)?.length]);

  useEffect(() => {
    console.log(data,"heeyy")
    setFormData({...data})
  }, [Object.keys(data).length]);
  console.log(changedData,"chnagedData")
  console.log(primaryObject, "primaryObject");
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
                onChange={(e) => handleChange({e,label:"Asset Name"})}
                style={{ color: formData?.assetName ? "black" : "#8CA1C4" }}
              />
              {errors.assetName && !formData?.assetName && (
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
                onChange={(e) => handleChange({e,label:"Asset Number"})}
                style={{ color: formData?.assetNumber ? "black" : "#8CA1C4" }}
              />
              {errors.assetNumber && !formData?.assetNumber && (
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
                onChange={(e) => handleChange({e})}
                style={{
                  color: formData?.assetDescription ? "black" : "#8CA1C4",
                }}
                // onBlur={() => validateForm({name:"",formData, setErrors,label:""})}
              >{formData?.assetDescription}</textArea>
            </div>
            <div>
              <ClonosSelect
                type="select"
                placeholder="Select"
                label={"Asset Mode"}
                isLabel={true}
                uniqueKey="assetMode"
                defaultValue={formData?.assetMode?.name}
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
                defaultValue={data?.assetImages}
                localPreviousPageFiles={changedData?.assetImages}
                label={"Asset Image"}
                title={"assetImge"}
                typeOfRecord={"images"}
                isMandatory={false}
                limit={10}
                acceptableFileTypes={[".jpg", ".png", ".jpeg"]}
                fileSizeInMB={10}
                handleGetSelectedData={(value) => handleGetUploadedFiles(value)}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditAssetGeneralDetails;
