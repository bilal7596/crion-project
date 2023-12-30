import { SelectPicker } from "rsuite";
import Styles from "../../../ModuleStyles/Assets/assets.module.css";
import AddBoxOutlinedIcon from "@material-ui/icons/AddBoxOutlined";
import {
  handleGetValueFromSelect,
  validateForm,
  validatedFiles,
} from "../../../utils/AssetsMethods/AssetRegister";
import { useState } from "react";
import Modal from "../../CommonComponents/Modal/Modal";
import { useDispatch, useSelector } from "react-redux";
import DeleteIcon from "@material-ui/icons/Delete";
import { getUser } from "../../../utils/clonosCommon";
import TextArea from "antd/es/input/TextArea";
import CancelIcon from "@material-ui/icons/Cancel";
import { useRef } from "react";
import { Tooltip } from "@material-ui/core";
import DOWNANGLE from "../../../assets/UIUX/icons/chevron-down.svg";
import { CustomSelect } from "../../CommonComponents/CustomSelect/CustomSelect";
import { ClonosButton } from "../../CommonComponents/Button/Button";
import FILEICON from "../../../assets/UIUX/icons/fileIcon.svg";
import UPLOADFILEICON from "../../../assets/UIUX/icons/fileuploadIcon.svg";
import FILEPREVIEWICON from "../../../assets/UIUX/icons/filePreviewIcon.svg";
import REDTRASHICON from "../../../assets/UIUX/icons/redTrash.svg";
import { ProgressBarWithLabel } from "../../CommonComponents/ProgressBar/ProgressBarWithLabel";
import { commonActions } from "../../../Store/Reducers/CommonReducer";
import { useEffect } from "react";
import FileUploader from "../../CommonComponents/FileUploader/FileUploader";
let primaryObject = {};
export const CreateAssetSpecifications = ({ getData, data }) => {
  const user = getUser();
  const warrantyPeriodDurrReff = useRef(null);
  const termsAndConditionsRef = useRef(null);
  const [uploadProgress, setUploadProgress] = useState({});
  const [showAddSpecs, setShowAddSpecs] = useState(false);
  const dispatch = useDispatch();
  const attrValueInputRef = useRef(null);
  const atttrNameInputValue = useRef(null);
  const [showWarrantyPeriodOptions, setShowWarrantyPeriodOptions] =
    useState(false);
  const [formData, setFormData] = useState({ ...data });
  const [techSpecsFields, setTechSpecsFields] = useState([
    {
      technicalSpecificationName: "",
      technicalSpecificationValue: "",
    },
  ]);
  const [errors, setErrors] = useState({});

  const handleChange = ({ e, label }) => {
    const { name, value, placeholder } = e.target;
    setFormData((prevData) => {
      let temp = null;
      if (
        name === "zoneClassification" ||
        name === "gasGroup" ||
        name === "temperatureClassification"
      ) {
        temp = {
          ...prevData,
          hazardousAreaDetails: {
            ...formData?.hazardousAreaDetails,
            [name]: value,
          },
        };
      } else if (name === "isWarrantyIncluded") {
        temp = {
          ...prevData,
          [name]: !formData[name] ? true : false,
        };
      } else if (
        name === "warrantyPeriod" 
      ) {
        temp = {
          ...prevData,
          [name]: value,
          warrantyPeriod: formData?.warrantyPeriodDurr?.name && formData?.warrantyPeriodNumber ? value + " " + formData?.warrantyPeriodDurr?.name : "",
        };
      } else {
        temp = {
          ...prevData,
          [name]: value,
        };
      }
      // if(name !== "hazardousArea" && value === "") delete temp[name]
      getData(temp);
      if(label){
        if(name === "warrantyPeriodNumber"){
          validateForm({ name:"warrantyPeriod", formData: temp, setErrors, label });
        } else {
          validateForm({ name, formData: temp, setErrors, label });
        }
      }
      return temp;
    });
  };

  const handleGetUploadedfiles = (val) => {
    const files = val.files;
    setFormData((prev) => {
      let temp = {
        ...prev,
        assetTermsAndConditions: [...files],
      };
      getData(temp);
      return temp;
    });
  };

  const handleFieldsError = (err) => {
    primaryObject = { ...primaryObject, [err.uniqueKey]: err };
  };

  const handleValidateDropdownValues = ({ name, data, label }) => {
    validateForm({ name, formData: data, setErrors, label });
  };

  // useEffect(() => {
  //   getData({...data,showFieldErros:false})
  // },[])

  // useEffect(() => {
  //   if (data?.showSpecificationFieldErrors) {
  //     alert("from useEffect");
  //     validateForm({ pageName: "specification", formData: data, setErrors });
  //     Object.keys(primaryObject).map((key) => {
  //       if (!primaryObject[key].value) {
  //         primaryObject[key].errorActivatorMethod(true);
  //       }
  //     });
  //   }
  // }, [data.showSpecificationFieldErrors]);
  console.log(data, errors, "errors $$$$$$4");
  useEffect(() => {
    if (
      formData?.warrantyPeriodNumber &&
      formData?.warrantyPeriodDurr &&
      formData?.installationDate
    ) {
      let months = 0;
      if (formData?.warrantyPeriodDurr?.name === "Years") {
        months = formData?.warrantyPeriodNumber * 12;
      } else {
        months = formData?.warrantyPeriodNumber;
      }
      let installationDate = formData?.installationDate;
      let date = new Date(installationDate);
      date.setMonth(date.getMonth() + Number(months));
      let updatedDate = date?.toISOString().slice(0, 10);
      setFormData((prev) => {
        let temp = {
          ...prev,
          warrantyEndDate: updatedDate,
          defaultWarrantyEndDate: updatedDate,
        };
        validateForm(temp, setErrors);
        getData(temp);
        return temp;
      });
    }
  }, [
    formData?.warrantyPeriodDurr,
    formData?.warrantyPeriodNumber,
    formData?.installationDate,
  ]);
  console.log(errors, "primary_object");
  return (
    <>
      <div className={Styles.specificationsContainer}>
        <div className={Styles.specifications_left}>
          <div className={Styles.manufacturingDetailsContainer}>
            <h4>Manufacturing Details</h4>
            <div className={Styles.inputFieldContainer}>
              <label>
                Asset Type <span style={{ color: "red" }}>*</span>
              </label>
              <div className={Styles.radioContainer}>
                {/* <label name="assetType"> */}
                <div>
                  <input
                    checked={formData?.assetType === "aty-001" ? true : false}
                    name="assetType"
                    id="standardAsset"
                    value={"aty-001"}
                    type="radio"
                    onChange={(e) => handleChange({ e, label: "Asset Type" })}
                  />
                  <label>Standard Asset</label>
                </div>
                <div>
                  <input
                    name="assetType"
                    checked={formData?.assetType === "aty-002" ? true : false}
                    id="fabricatedAsset"
                    value={"aty-002"}
                    type="radio"
                    onChange={(e) => handleChange({ e, label: "Asset Type" })}
                  />
                  <label>Fabricated Asset</label>
                </div>
                {/* </label> */}
              </div>
              {errors.assetType && (
                <span className={Styles.error}>{errors.assetType}</span>
              )}
            </div>
            <div className={Styles.inputFieldContainer}>
              <label>
                Asset Make <span style={{ color: "red" }}>*</span>
              </label>
              <input
                onChange={(e) => handleChange({ e, label: "Asset Make" })}
                onBlur={() =>
                  validateForm({
                    name: "assetMake",
                    formData,
                    setErrors,
                    label: "Asset Make",
                  })
                }
                name="assetMake"
                placeholder="Asset Make"
                value={formData?.assetMake}
              />
              {errors.assetMake && (
                <span className={Styles.error}>{errors.assetMake}</span>
              )}
            </div>
            <div className={Styles.inputFieldContainer}>
              <label>
                Asset Model <span style={{ color: "red" }}>*</span>
              </label>
              <input
                value={formData?.assetModel}
                onChange={(e) => handleChange({ e, label: "Asset Model" })}
                onBlur={() =>
                  validateForm({
                    name: "assetModel",
                    formData,
                    setErrors,
                    label: "Asset Model",
                  })
                }
                name="assetModel"
                placeholder="Asset Model"
              />
              {errors.assetModel && (
                <span className={Styles.error}>{errors.assetModel}</span>
              )}
            </div>
            <div className={Styles.inputFieldContainer}>
              <label>Serial Number</label>
              <input
                value={formData?.serialNumber}
                onChange={(e) => handleChange({ e, label: "Serial Number" })}
                onBlur={() =>
                  validateForm({
                    name: "serialNumber",
                    formData,
                    setErrors,
                    label: "Serial Number",
                  })
                }
                name="serialNumber"
                type="text"
                placeholder="Serial Number"
              />
            </div>
            <div className={Styles.inputFieldContainer}>
              <label>
                Manufacturer <span style={{ color: "red" }}>*</span>
              </label>
              <input
                value={formData?.manufacturer}
                onChange={(e) => handleChange({ e, label: "Manufacturer" })}
                onBlur={() =>
                  validateForm({
                    name: "manufacturer",
                    formData,
                    setErrors,
                    label: "Manufacturer",
                  })
                }
                name="manufacturer"
                placeholder="Manufacturer"
              />
              {errors.manufacturer && (
                <span className={Styles.error}>{errors.manufacturer}</span>
              )}
            </div>
            <div className={Styles.inputFieldContainer}>
              <label>
                Installation Date <span style={{ color: "red" }}>*</span>
              </label>
              <input
                value={formData?.installationDate}
                onChange={(e) =>
                  handleChange({ e, label: "Installation Date" })
                }
                onBlur={() =>
                  validateForm({
                    name: "installationDate",
                    formData,
                    setErrors,
                    label: "Installation Date",
                  })
                }
                name="installationDate"
                type="date"
              />
              {errors.installationDate && (
                <span className={Styles.error}>{errors.installationDate}</span>
              )}
            </div>
            <div className={Styles.inputFieldContainer}>
              <label>
                Service Liquid <span style={{ color: "red" }}>*</span>
              </label>
              <input
                value={formData?.serviceLiquid}
                onChange={(e) => handleChange({ e, label: "Service Liquid" })}
                onBlur={() =>
                  validateForm({
                    name: "serviceLiquid",
                    formData,
                    setErrors,
                    label: "Service Liquid",
                  })
                }
                name="serviceLiquid"
                placeholder="Enter Service Liquid"
              />
              {errors.serviceLiquid && (
                <span className={Styles.error}>{errors.serviceLiquid}</span>
              )}
            </div>
            <div className={Styles.areaDetailsContainer}>
              <h4>Hazardous Area Details</h4>
              <div>
                <div>
                  <label>
                    Zone Classification <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    value={
                      formData?.hazardousAreaDetails?.zoneClassification || ""
                    }
                    name="zoneClassification"
                    placeholder="0"
                    onChange={(e) =>
                      handleChange({ e, label: "Zone Classification" })
                    }
                    onBlur={() =>
                      validateForm({
                        name: "zoneClassification",
                        formData,
                        setErrors,
                        label: "Zone Classification",
                      })
                    }
                  />
                  {errors?.zoneClassification && (
                    <span className={Styles.error}>
                      {errors?.zoneClassification}
                    </span>
                  )}
                </div>
                <div>
                  <label>
                    Gas Group<span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    value={formData?.hazardousAreaDetails?.gasGroup || ""}
                    name="gasGroup"
                    placeholder="G2"
                    onChange={(e) => handleChange({ e, label: "Gas Group" })}
                    onBlur={() =>
                      validateForm({
                        name: "gasGroup",
                        formData,
                        setErrors,
                        label: "Gas Group",
                      })
                    }
                  />
                  {errors?.gasGroup && (
                    <span className={Styles.error}>{errors?.gasGroup}</span>
                  )}
                </div>
                <div>
                  <label>
                    Temperature Classification
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    value={
                      formData?.hazardousAreaDetails
                        ?.temperatureClassification || ""
                    }
                    name="temperatureClassification"
                    placeholder="T3"
                    onChange={(e) =>
                      handleChange({ e, label: "Temperature Classification" })
                    }
                    onBlur={() =>
                      validateForm({
                        name: "temperatureClassification",
                        formData,
                        setErrors,
                        label: "Temperature Classification",
                      })
                    }
                  />
                  {errors?.temperatureClassification && (
                    <span className={Styles.error}>
                      {errors?.temperatureClassification}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className={Styles.divBraker}></div>
          <div className={Styles.warrantyDetailsContainer}>
            <div className={Styles.warrantyDetailsLeftContainer}>
              <h4>Warranty Details</h4>
              <div className={Styles.warrantyInclusionBox}>
                <input
                  onChange={(e) =>
                    handleChange({ e, label: "Warranty Period" })
                  }
                  name="isWarrantyIncluded"
                  type="checkbox"
                  checked={formData?.isWarrantyIncluded}
                />
                <label>Warranty Included</label>
              </div>
              <div className={Styles.warrantySubContainer}>
                <div>
                  <label>
                    Supplier Name{" "}
                    <span
                      style={{
                        display: formData?.isWarrantyIncluded
                          ? "inline-block"
                          : "none",
                        color: "red",
                      }}
                    >
                      *
                    </span>
                  </label>
                  <input
                    value={formData?.supplierName}
                    onChange={(e) =>
                      handleChange({ e, label: "Supplier Name" })
                    }
                    onBlur={() =>
                      validateForm({
                        name: "supplierName",
                        formData,
                        setErrors,
                        label: "Supplier Name",
                      })
                    }
                    name="supplierName"
                    placeholder="Supplier Name"
                  />
                </div>
                {errors.supplierName && formData?.isWarrantyIncluded && (
                  <span className={Styles.error}>{errors.supplierName}</span>
                )}
                <div>
                  <label>
                    Email ID{" "}
                    <span
                      style={{
                        display: formData?.isWarrantyIncluded
                          ? "inline-block"
                          : "none",
                        color: "red",
                      }}
                    >
                      *
                    </span>
                  </label>
                  <input
                    value={formData?.supplierEmail}
                    onChange={(e) =>
                      handleChange({ e, label: "Supplier Email" })
                    }
                    onBlur={() =>
                      validateForm({
                        name: "supplierEmail",
                        formData,
                        setErrors,
                        label: "Email ID",
                      })
                    }
                    name="supplierEmail"
                    type="email"
                    placeholder="Email ID"
                  />
                </div>
                {errors.supplierEmail && formData?.isWarrantyIncluded && (
                  <span className={Styles.error}>{errors.supplierEmail}</span>
                )}
                <div>
                  <div className={Styles.wrntTimeContainer}>
                    <div className={Styles.wrntyPeriod}>
                      <label>
                        Warranty Period{" "}
                        <span
                          style={{
                            display: formData?.isWarrantyIncluded
                              ? "inline-block"
                              : "none",
                            color: "red",
                          }}
                        >
                          *
                        </span>
                      </label>
                      <div>
                        <input
                          value={formData?.warrantyPeriodNumber}
                          onChange={(e) =>
                            handleChange({ e, label: "Warranty Period" })
                          }
                          onBlur={() =>
                            validateForm({
                              name: "warrantyPeriod",
                              formData,
                              setErrors,
                              label: "Warranty Period",
                            })
                          }
                          name="warrantyPeriodNumber"
                          type="number"
                          style={{ width: "30%" }}
                        />
                        <div
                          style={{ width: "50%" }}
                          onClick={() =>
                            setShowWarrantyPeriodOptions(
                              !showWarrantyPeriodOptions
                            )
                          }
                        >
                          <CustomSelect
                            title={"Select"}
                            icon={DOWNANGLE}
                            elementRef={warrantyPeriodDurrReff}
                            isOpen={showWarrantyPeriodOptions}
                            closeMethod={() =>
                              setShowWarrantyPeriodOptions(false)
                            }
                            data={[
                              { label: "Months", value: "months" },
                              { label: "Years", value: "years" },
                            ]}
                            formData={formData}
                            setFormData={setFormData}
                            updateLocalData={getData}
                            validateField={() =>
                              handleValidateDropdownValues({
                                name: "warrantyPeriod",
                                data: formData,
                                label: "Warranty Period",
                              })
                            }
                            type={"warrantyPeriodDurr"}
                            getSelectedValue={(val) =>
                              handleGetValueFromSelect({
                                field: val,
                                type: "warrantyPeriodDurr",
                                formData,
                                setFormData,
                                getData,
                                setErrors,
                              })
                            }
                          />
                        </div>
                      </div>
                      {errors.warrantyPeriod &&
                        formData?.isWarrantyIncluded &&
                        errors?.warrantyPeriod && (
                          <span className={Styles.error}>
                            {errors.warrantyPeriod}
                          </span>
                        )}
                    </div>
                    <div className={Styles.wrntyEndDate}>
                      <label>
                        Warranty End Date{" "}
                        <span
                          style={{
                            display: formData?.isWarrantyIncluded
                              ? "inline-block"
                              : "none",
                            color: "red",
                          }}
                        >
                          *
                        </span>
                      </label>
                      <input
                        value={
                          formData?.warrantyEndDate
                            ? formData?.warrantyEndDate
                            : ""
                        }
                        name="warrantyEndDate"
                        onChange={(e) =>
                          handleChange({ e, label: "Warranty End Date" })
                        }
                        onBlur={() =>
                          validateForm({
                            name: "warrantyEndDate",
                            formData,
                            setErrors,
                            label: "Warranty End Date",
                          })
                        }
                        type="date"
                      />
                      {formData?.isWarrantyIncluded &&
                        errors.warrantyEndDate && (
                          <span className={Styles.error}>
                            {errors.warrantyEndDate}
                          </span>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={Styles.warrantyDetailsRightContainer}>
              <div>
                <FileUploader
                  label={"Terms & Conditions"}
                  title={"assetTermsAndConditions"}
                  typeOfRecord={"File"}
                  isMandatory={false}
                  limit={1}
                  acceptableFileTypes={[".pdf", ".doc", ".xls", ".ppt"]}
                  fileSizeInMB={10}
                  localPreviousPageFiles={
                    formData?.assetTermsAndConditions &&
                    formData?.assetTermsAndConditions.length > 0
                      ? formData?.assetTermsAndConditions
                      : []
                  }
                  handleGetSelectedData={(value) =>
                    handleGetUploadedfiles(value)
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
