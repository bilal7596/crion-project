import { useNavigate } from "react-router-dom";
import {
  createAsset,
  createReferenceManualForAsset,
  deleteAsset,
  editAsset,
  getAllAssets,
  getAllAssetsWithoutLimit,
  getAssetModeDropdown,
  getAssetTypes,
  getFilteredAssets,
  getRunningModeDropdown,
  getexportableData,
} from "../../Api/Asset/assetApi";
import { postAuditLog } from "../../Api/User/UserApi";
import { assetActions } from "../../Store/Reducers/ClonosAssetReducer";
import { commonActions } from "../../Store/Reducers/CommonReducer";
import {
  binaryDataToFile,
  getFormatedDate,
  handleLoginExpiry,
  handleShowErrorAndWarning,
  removeUserSession,
} from "../clonosCommon";
import * as xlsx from "xlsx";
import Papa from "papaparse";
import { editAssociateDocs, uploadAssociateDocs } from "../../Api/Documents/DocumentApi";
import { getAllAssetsDataMethod } from "./AssetsList";
// FOR HANDLING REQUIRED FIELD ERRORS :

export const validateForm = ({
  value,
  name,
  formData,
  setErrors,
  pageName,
  label,
}) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const newErrors = {};
  if (name) {
    if (name === "warrantyPeriod") {
      console.log(
        formData?.warrantyPeriodNumber,
        formData?.warrantyPeriodDurr,
        "hhhh"
      );
      if (
        !formData?.warrantyPeriodNumber ||
        !formData?.warrantyPeriodDurr?.name
      ) {
        setErrors((prev) => ({
          ...prev,
          warrantyPeriod: "Warranty Period is required!",
        }));
      }
      if (
        formData?.warrantyPeriodNumber &&
        formData?.warrantyPeriodDurr?.name
      ) {
        setErrors((prev) => ({ ...prev, warrantyPeriod: "" }));
      }
    } else if (name === "supplierEmail") {
      if (!formData[name]) {
        setErrors((prev) => {
          let temp = {
            ...prev,
            [name]: "Supplier Email is required!.",
          };
          return temp;
        });
      } else {
        setErrors((prev) => {
          return {
            ...prev,
            [name]: emailRegex.test(formData.supplierEmail)
              ? ""
              : "Please provide valid Email.",
          };
        });
      }
    } else if (
      name === "zoneClassification" ||
      name === "gasGroup" ||
      name === "temperatureClassification"
    ) {
      if (!formData.hazardousAreaDetails[name]) {
        setErrors((prev) => {
          let temp = {
            ...prev,
            [name]: `${label} is required!`,
          };
          return temp;
        });
      } else {
        setErrors((prev) => {
          return {
            ...prev,
            [name]: ``,
          };
        });
      }
    } else if (
      name === "latitude" ||
      name === "longitude" ||
      name === "elevation"
    ) {
      if (!formData.geoLocation[name]) {
        setErrors((prev) => {
          let temp = {
            ...prev,
            [name]: `${label} is required!`,
          };
          return temp;
        });
      } else {
        setErrors((prev) => {
          return {
            ...prev,
            [name]: ``,
          };
        });
      }
    } else {
      if (!formData[name]) {
        console.log(name, formData, "from errrr");
        setErrors((prev) => {
          let temp = {
            ...prev,
            [name]: `${label} is Required!.`,
          };
          return temp;
        });
      } else {
        setErrors((prev) => {
          let temp = {
            ...prev,
            [name]: ``,
          };
          return temp;
        });
      }
    }
  } else {
    if (pageName === "general details") {
      let tempErrors = {};
      let requiredFields = [
        { key: "assetName", label: "Asset Name" },
        { key: "assetNumber", label: "Asset Number" },
        { key: "assetDepartment", label: "Asset Department" },
        { key: "assetCategory", label: "Asset Category" },
        { key: "criticalityLevel", label: "Criticality Level" },
        { key: "functionalArea", label: "Functional Area" },
        { key: "assetOwner", label: "Asset Owner" },
      ];
      requiredFields.map((field) => {
        if (!formData[field.key]) {
          tempErrors[field.key] = `${field.label} is required!`;
        } else {
          tempErrors[field.key] = `${field.label} is required!`;
        }
      });
      setErrors(tempErrors);
    } else if (pageName === "specification") {
      let tempErrors = {};
      let requiredFields = [
        { key: "assetType", label: "Asset Type" },
        { key: "assetMake", label: "Asset Make" },
        { key: "assetModel", label: "Asset Model" },
        { key: "manufacturer", label: "Manufacturer" },
        { key: "installationDate", label: "Installation Date" },
        { key: "serviceLiquid", label: "Service Liquid" },
        { key: "zoneClassification", label: "Zone Classification" },
        { key: "gasGroup", label: "Gas Group" },
        {
          key: "temperatureClassification",
          label: "Temperature Classification",
        },
        { key: "supplierName", label: "Supplier Name" },
        { key: "supplierEmail", label: "Supplier Email" },
        { key: "warrantyEndDate", label: "WarrantyEnd Date" },
        { key: "warrantyPeriod", label: "Warranty Period" },
      ];
      requiredFields.map((field) => {
        if (
          field.key === "zoneClassification" ||
          field.key === "temperatureClassification" ||
          field.key === "gasGroup"
        ) {
          if (
            !formData?.hazardousAreaDetails ||
            !formData?.hazardousAreaDetails[field.key]
          ) {
            tempErrors[field.key] = `${field.label} is required!`;
          } else {
            tempErrors[field.key] = ``;
          }
        }
        if (!formData[field.key]) {
          tempErrors[field.key] = `${field.label} is required!`;
        } else {
          tempErrors[field.key] = ``;
        }
      });
      console.log(tempErrors, "errerjkwerkewjr");
      setErrors(tempErrors);
    }
  }
  return Object.keys(newErrors).length === 0; // Returns true if no errors
};
// VALIDATE REQUIRED FIELDS
const validateRequiredFields = (requiredFields, payload) => {
  let len = requiredFields?.length;
  let isAllRequiredFieldsPresents = true;
  for (let i = 0; i < len; i++) {
    if (payload["isWarrantyIncluded"]) {
      isAllRequiredFieldsPresents =
        payload["supplierName"] &&
        payload["warrantyEndDate"] &&
        payload["supplierEmail"];
      if (!isAllRequiredFieldsPresents) {
        break;
      }
    } else {
      if (!payload[requiredFields[i]]) {
        isAllRequiredFieldsPresents = false;
        break;
      }
    }
  }
  return isAllRequiredFieldsPresents;
};

// TO VALIDATE MULTISTEP FORM DATA WHILE CREATING OR EDITING ASSET
export const validGeneralDetails = (formData) => {
  if (
    formData?.assetName &&
    formData?.assetNumber &&
    formData?.assetDepartment?.name &&
    formData?.criticalityLevel?.name &&
    formData?.functionalArea?.name &&
    formData?.assetOwner?.name &&
    formData?.assetCategory?.name
  ) {
    return true;
  } else {
    return false;
  }
  // return true;
};

export const validSpecificationsDetails = (formData) => {
  if (
    formData?.assetMake &&
    formData?.assetType &&
    formData?.assetModel &&
    formData?.manufacturer &&
    formData?.installationDate &&
    formData?.serviceLiquid &&
    formData?.hazardousAreaDetails?.zoneClassification &&
    formData?.hazardousAreaDetails?.gasGroup &&
    formData?.hazardousAreaDetails?.temperatureClassification
  ) {
    if (formData?.isWarrantyIncluded) {
      if (
        formData?.supplierEmail &&
        formData?.supplierName &&
        formData?.warrantyPeriodNumber &&
        formData?.warrantyPeriodDurr?.id &&
        formData?.warrantyEndDate
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  } else {
    return false;
  }
  // return true;
};

export const validLocationDetails = (formData) => {
  if (
    formData?.location?.name &&
    formData?.geoLocation?.latitude &&
    formData?.geoLocation?.longitude &&
    formData?.geoLocation?.elevation
  ) {
    return true;
  } else {
    return false;
  }
  // return true;
};
export const validate3DDetails = (formData) => {
  return (
    !isNaN(formData?.asset3DmodelPosition?.x) &&
    !isNaN(formData?.asset3DmodelPosition?.y) &&
    !isNaN(formData?.asset3DmodelPosition?.z) &&
    !isNaN(formData?.asset3DmodelRotation?.x) &&
    !isNaN(formData?.asset3DmodelRotation?.y) &&
    !isNaN(formData?.asset3DmodelRotation?.z) &&
    formData?.asset3DModel &&
    formData?.assetLayoutImage
  );
  // return true;
};
export const validateAssetParametersValue = (formData) => {
  let allSet = true;
  if (!formData?.assetParameters?.length) return false;
  formData?.assetParameters?.map((param) => {
    if (!param?.name || !param?.description || !param?.unit) {
      allSet = false;
      return allSet;
    }
  });
  return allSet;
};

export const validateReferenceManualsValue = (formData) => {
  let allSet = true;
  if (!formData?.instructionsDocuments?.length) return false;
  formData?.instructionsDocuments?.forEach((ref) => {
    if (!ref?.instructions?.length) {
      allSet = false;
      return allSet;
    }
    ref?.instructions?.forEach((instruction) => {
      if (!instruction?.instructionTitle || !instruction?.instructionFile) {
        allSet = false;
        return allSet;
      }
    });
  });
  return allSet;
};
const requiredFields = [
  "assetName",
  "assetNumber",
  "assetDepartment",
  "criticalityLevel",
  "functionalArea",
  "assetOwner",
  "assetMake",
  "assetModel",
  "manufacturer",
  "installationDate",
  "serviceLiquid",
  "location",
];

const validateAssetParameters = (parameters) => {
  let validParameters = parameters?.filter((param) => {
    return param?.name || param?.description || param?.unit;
  });
  return validParameters;
};

// TO GET VALUES FROM CLONOS CUSTOM COMPONENTS LIKE SELECT, INPUT AND SYNAMIC DROPDOWN
export const handleGetValuesMethod = ({
  val,
  setFormData,
  getData,
  getChangedValues,
  changedData,
}) => {
  let { type } = val;
  if (type === "select") {
    let { uniqueKey, updatedValue } = val;
    setFormData((prev) => {
      let temp = {
        ...prev,
        [uniqueKey]: { name: updatedValue?.label, id: updatedValue?.value },
      };
      if (getChangedValues) {
        let changeIn = {
          ...changedData,
          [uniqueKey]: { name: updatedValue?.label, id: updatedValue?.value },
        };
        getChangedValues(changeIn);
      }
      if(getData) getData(temp);
      return temp;
    });
  } else if (type === "dynamicDropdown") {
    let { name, selectedOption } = val;
    if (name === "assetowner") name = "assetOwner";
    if (name === "parentasset") name = "parentAsset";
    setFormData((prev) => {
      let temp = {
        ...prev,
        [name]: selectedOption?.length ?  { name: selectedOption[0]?.name, id: selectedOption[0]?.id } : null,
      };
      if (getChangedValues) {
        let changeIn = {
          ...changedData,
          [name]: selectedOption?.length ?  { name: selectedOption[0]?.name, id: selectedOption[0]?.id } : null
        };
        getChangedValues(changeIn);
      }
      if(getData) getData(temp);
      return temp;
    });
  } else if (
    type === "text" ||
    type === "number" ||
    type === "textarea" ||
    type === "date"
  ) {
    let { uniqueKey, updatedValue } = val;
    setFormData((prev) => {
      let temp = {
        ...prev,
        [uniqueKey]: updatedValue,
      };
      if (getChangedValues) {
        let changeIn = { ...changedData, [uniqueKey]: updatedValue };
        getChangedValues(changeIn);
      }
      if(getData) getData(temp);
      return temp;
    });
  }
};
// TO CREATE A NEW ASSET
export const createNewAsset = ({
  formData,
  loggedUser,
  dispatch,
  getUpdatedStatusOFAssetCreation,
  operationType,
  getCreatedAssetDetails,
  setShowAssetCreationModal,
}) => {
  formData["installationDate"] = new Date(
    formData?.installationDate
  ).toISOString();
  if (formData?.warrantyEndDate) {
    formData["warrantyEndDate"] = new Date(
      formData?.warrantyEndDate
    ).toISOString();
  }
  const parameters = validateAssetParameters(formData?.assetParameters);
  const form_data = new FormData();
  form_data.append(
    `assetStatus`,
    operationType === "created"
      ? "Scheduled"
      : operationType === "drafted"
      ? "Draft"
      : ""
  );
  formData?.assetName && form_data.append(`assetName`, formData?.assetName);
  formData?.assetNumber &&
    form_data.append(`assetNumber`, formData?.assetNumber);
  formData?.assetDescription &&
    form_data.append(`assetDescription`, formData?.assetDescription);
  formData?.assetMode && form_data.append(`assetMode`, formData?.assetMode?.id);
  formData?.runningMode &&
    form_data.append(`runningMode`, formData?.runningMode?.id);
  formData?.assetDepartment &&
    form_data.append(`assetDepartment`, formData?.assetDepartment?.id);
  formData?.assetCategory &&
    form_data.append(`assetCategory`, formData?.assetCategory?.id);
  formData?.criticalityLevel &&
    form_data.append(`criticalityLevel`, formData?.criticalityLevel?.id);
  formData?.functionalArea &&
    form_data.append(`functionalArea`, formData?.functionalArea?.id);
  formData?.assetOwner &&
    form_data.append(`assetOwner`, formData?.assetOwner?.id);
  formData?.censusNumber &&
    form_data.append(`censusNumber`, formData?.censusNumber);
  formData?.assetType && form_data.append(`assetType`, formData?.assetType);
  formData?.assetMake && form_data.append(`assetMake`, formData?.assetMake);
  formData?.assetModel && form_data.append(`assetModel`, formData?.assetModel);
  formData?.serialNumber &&
    form_data.append(`serialNumber`, formData?.serialNumber);
  formData?.manufacturer &&
    form_data.append(`manufacturer`, formData?.manufacturer);
  formData?.installationDate &&
    form_data.append(`installationDate`, formData?.installationDate);
  formData?.serviceLiquid &&
    form_data.append(`serviceLiquid`, formData?.serviceLiquid);
  formData?.hazardousAreaDetails &&
    form_data.append(
      `hazardousAreaDetails`,
      JSON.stringify(formData?.hazardousAreaDetails)
    );
  formData?.location && form_data.append(`location`, formData?.location?.id);
  formData?.geoLocation &&
    form_data.append(`geoLocation`, JSON.stringify(formData?.geoLocation));
  formData?.parentAsset?.id &&
    form_data.append(`parentAsset`, formData?.parentAsset?.id);
  form_data.append(
    `isWarrantyIncluded`,
    formData?.isWarrantyIncluded ? formData?.isWarrantyIncluded : false
  );
  formData?.supplierName &&
    form_data.append(`supplierName`, formData?.supplierName);
  formData?.supplierEmail &&
    form_data.append(`supplierEmail`, formData?.supplierEmail);
  formData?.isWarrantyIncluded &&
    form_data.append(`warrantyPeriodNumber`, formData?.warrantyPeriodNumber);
  formData?.isWarrantyIncluded &&
    form_data.append(`warrantyPeriodDurr`, formData?.warrantyPeriodDurr?.id);
  formData?.isWarrantyIncluded &&
    form_data.append(`warrantyPeriod`, formData?.warrantyPeriod);
  formData?.warrantyEndDate &&
    form_data.append(`warrantyEndDate`, formData?.warrantyEndDate);
  formData.asset3DmodelRotation = {
    x: formData?.asset3DmodelRotation?.x || "0",
    y: formData?.asset3DmodelRotation?.y || "0",
    z: formData?.asset3DmodelRotation?.z || "0",
  };
  formData?.asset3DmodelRotation &&
    form_data.append(
      `asset3DmodelRotation`,
      JSON.stringify(formData?.asset3DmodelRotation)
    );
  formData.asset3DmodelPosition = {
    x: formData?.asset3DmodelPosition?.x || "0",
    y: formData?.asset3DmodelPosition?.y || "0",
    z: formData?.asset3DmodelPosition?.z || "0",
  };
  formData?.asset3DmodelPosition &&
    form_data.append(
      `asset3DmodelPosition`,
      JSON.stringify(formData?.asset3DmodelPosition)
    );
  formData?.asset3DModel &&
    form_data.append(`asset3DModel`, formData?.asset3DModel);
  formData?.assetLayoutImage &&
    form_data.append(`assetLayoutImage`, formData?.assetLayoutImage);
  formData?.assetStatus &&
    form_data.append(`assetStatus`, formData?.assetStatus);
  formData?.assetImage?.length >= 0 &&
    formData?.assetImage.forEach((file, index) => {
      form_data.append(`assetImage${index}`, file);
    });
  formData?.termsAndConditions?.length >= 0 &&
    formData?.termsAndConditions.forEach((file, index) => {
      form_data.append(`assetTermsAndConditions${index}`, file);
    });
  parameters?.length > 0 &&
    form_data.append(`assetParameters`, JSON.stringify(parameters));
  createAsset(form_data)
    .then((res) => {
      if(operationType === "created") dispatch(assetActions.setAssetCreationLoading(true))
      if(operationType === "drafted") dispatch(assetActions.setAssetDraftLoading(true))
      const assetId = res?.data?.result?._id;
      if(res?.data?.status == 201 || res?.data?.status == 200){
        if (formData?.instructionsDocuments?.length > 0) {
          createReferenceManuals({getUpdatedStatusOFAssetCreation,getCreatedAssetDetails,assetId,dispatch, operationType,assetDetails:formData});
        }  else {
          createAssetDocuments({getUpdatedStatusOFAssetCreation,getCreatedAssetDetails,assetId,dispatch, operationType,assetDetails:formData});
        } 
      }
    })
    .catch((err) => {
      console.log(err,"err from cach")
      if(operationType === "created") dispatch(assetActions.setAssetCreationLoading(false))
      if(operationType === "drafted") dispatch(assetActions.setAssetDraftLoading(false))
      handleLoginExpiry(err,dispatch)
      if (err?.response?.data?.status != 401) {
        dispatch(
          commonActions.handleSnackbar({
            show: true,
            message: err?.response?.data?.message,
            type: "error",
          })
        );
      }
    });
};

// TO CREATE ASSOCIATED DOCUMENTS WITH ASSET

const createAssetDocuments = ({getUpdatedStatusOFAssetCreation,getCreatedAssetDetails,assetId,dispatch, operationType,assetDetails}) => {
      let documentsCount = 0;
      let document_checks = {}
      assetDetails?.documents.map((file, index) => {
        const form_data1 = new FormData();
        form_data1.append("assetId", assetId);
          if (file?.file) {
            documentsCount++;
            file?.file && form_data1.append(`file1`, file?.file);
            file?.documentName && form_data1.append(`documentName`, file?.documentName);
            file?.documentNumber && form_data1.append(`documentNumber`, file?.documentNumber);
            file?.documentType && form_data1.append(`documentType`, file?.documentType?.id);
            file?.revisionNumber && form_data1.append(`revisionNumber`, file?.revisionNumber);
            file?.status?.id && form_data1.append(`status`, file?.status?.id);
            form_data1.append("noOfFiles", 1);
            document_checks[`${file.id}`] = true;
            uploadAssociateDocs(form_data1)
              .then((response) => {
                if (response?.data?.status == "200" || response?.data?.status == "201") {
                    delete document_checks[`${file.id}`]
                }
              })
              .catch((err) => {
                handleLoginExpiry(err, dispatch);
                if(operationType === "created") dispatch(assetActions.setAssetCreationLoading(false));
                if(operationType === "drafted") dispatch(assetActions.setAssetDraftLoading(false));
                getUpdatedStatusOFAssetCreation(true);
                getCreatedAssetDetails({
                  assetId,
                  operationType,
                  message: `Asset ${operationType} successfully, but documents failed!`,
                });
              }).finally (() => {
                if(operationType === "created") dispatch(assetActions.setAssetCreationLoading(false));
                if(operationType === "drafted") dispatch(assetActions.setAssetDraftLoading(false));
                getUpdatedStatusOFAssetCreation(true);
                getCreatedAssetDetails({
                  assetId,
                  operationType,
                  message: `Asset ${operationType} successfully.`,
                  failedDocuments:document_checks
                });
              })
          }
        });
};
// TO  CREATE REFERENCE MANUALS OF ASSET

const createReferenceManuals = ({getUpdatedStatusOFAssetCreation,getCreatedAssetDetails,assetId,dispatch, operationType,assetDetails}) => {
  const form_data = new FormData();
  const instructionsDocuments = assetDetails?.instructionsDocuments[0];
  instructionsDocuments?.instructionDocumentName && form_data.append("name",instructionsDocuments?.instructionDocumentName);
  const files = instructionsDocuments?.instructions;
  const instructionTitles = [];
  form_data.append("noOfFiles", files?.length);
  files?.map((file, index) => {
    instructionTitles.push(file?.instructionTitle);
    file?.instructionFile && form_data.append(`file${index + 1}`, file?.instructionFile);
  });
  instructionTitles?.length && form_data.append("instructions",JSON.stringify(instructionTitles));

  
  createReferenceManualForAsset(assetId, form_data)
    .then((ref_response) => {
      if (ref_response?.data?.status == 201 || ref_response?.data?.status == 200) {
        if (assetId) {
          if(assetDetails?.documents?.length > 0){
            createAssetDocuments({getUpdatedStatusOFAssetCreation,getCreatedAssetDetails,assetId,dispatch, operationType,assetDetails})
          } else {
            if(operationType === "created") dispatch(assetActions.setAssetCreationLoading(false));
            if(operationType === "drafted") dispatch(assetActions.setAssetDraftLoading(false));
            getUpdatedStatusOFAssetCreation(true);
            getCreatedAssetDetails({
              assetId,
              operationType,
              message: `Asset ${operationType} successfully.`,
            });
          }
        }
      }
    })
    .catch((err) => {
      handleLoginExpiry(err, dispatch);
      if(operationType === "created") dispatch(assetActions.setAssetCreationLoading(false));
      if(operationType === "drafted") dispatch(assetActions.setAssetDraftLoading(false));
      getUpdatedStatusOFAssetCreation(true);
      getCreatedAssetDetails({
        assetId,
        operationType,
        message: `Asset ${operationType} successfully, but reference manual failed!`,
      });
    });
};

// TO DELETE ASSETS
export const handleDeleteAsset = ({
  payload,
  activePage,
  limit,
  dispatch,
  setShowDeleteDailog,
  setSelectedRows,
  setActivePage,
  setTotalPage,
  Navigate,
  setAllAssets,
}) => {
  deleteAsset(payload).then((res) => {
    dispatch(
      commonActions.handleSnackbar({
        show: true,
        message: `Successfully Deleted`,
        type: "success",
      })
    );
    setShowDeleteDailog(false);
    if (setSelectedRows) setSelectedRows([]);
    getFilteredAssets({
      page: 1,
      limit,
      optionalParams: { assetDepartment: 1, criticalityLevel: 1 },
    }).then((res) => {
      console.log("getAllAssets RESPONSE", activePage, limit);
      dispatch(assetActions.getAllAssets(res?.data?.result?.assets));
      dispatch(commonActions.showApiLoader(false));
      getAllAssetsDataMethod({ setAllAssets });
      Navigate("/all-assets");
      // setTotalPage(res?.data?.result?.totalPages);
      // if (res?.data?.result?.assets.length % limit === 0 && activePage !== 1) {
      //   setActivePage((prev) => prev - 1);
      // }
    });
  });
};

// TO EDIT ASSET
export const handleEditAsset = ({
  assetId,
  formData,
  loggedUser,
  dispatch,
  Navigate,
  page,
  limit,
  getCreatedAssetDetails,
  getUpdatedStatusOFAssetCreation,
}) => {
  console.log(formData,"from edit funct")
    if (formData["installationDate"])
    formData["installationDate"] = new Date(
      formData?.installationDate
    ).toISOString();
  if (formData["warrantyEndDate"])
    formData["warrantyEndDate"] = new Date(
      formData?.warrantyEndDate
    ).toISOString();
  const form_data = new FormData();
  const parameters = validateAssetParameters(formData?.assetParameters);
  let assetParametersToEdit = [];
  let assetParametersToCreate = [];
  parameters?.filter((param) => {
    if (param?.isActive) {
      assetParametersToEdit.push(param);
    } else {
      assetParametersToCreate.push(param);
    }
  });
  assetId && form_data.append("assetId", assetId);
  formData?.assetName && form_data.append(`assetName`, formData?.assetName);
  formData?.assetNumber &&
    form_data.append(`assetNumber`, formData?.assetNumber);
  formData?.assetDescription &&
    form_data.append(`assetDescription`, formData?.assetDescription);
  formData?.assetMode?.id &&
    form_data.append(`assetMode`, formData?.assetMode?.id);
  formData?.runningMode?.id &&
    form_data.append(`runningMode`, formData?.runningMode?.id);
  formData?.assetDepartment?.id &&
    form_data.append(`assetDepartment`, formData?.assetDepartment?.id);
  formData?.criticalityLevel?.id &&
    form_data.append(`criticalityLevel`, formData?.criticalityLevel?.id);
  formData?.functionalArea?.id &&
    form_data.append(`functionalArea`, formData?.functionalArea?.id);
  formData?.assetOwner?.id &&
    form_data.append(`assetOwner`, formData?.assetOwner?.id);
  formData?.censusNumber &&
    form_data.append(`censusNumber`, formData?.censusNumber);
  formData?.assetType && form_data.append(`assetType`, formData?.assetType);
  formData?.assetMake && form_data.append(`assetMake`, formData?.assetMake);
  formData?.assetModel && form_data.append(`assetModel`, formData?.assetModel);
  formData?.serialNumber &&
    form_data.append(`serialNumber`, formData?.serialNumber);
  formData?.manufacturer &&
    form_data.append(`manufacturer`, formData?.manufacturer);
  formData?.installationDate &&
    form_data.append(`installationDate`, formData?.installationDate);
  formData?.serviceLiquid &&
    form_data.append(`serviceLiquid`, formData?.serviceLiquid);
  formData?.hazardousAreaDetails &&
    form_data.append(
      `hazardousAreaDetails`,
      JSON.stringify(formData?.hazardousAreaDetails)
    );
  formData?.location?.id &&
    form_data.append(`location`, formData?.location?.id);
  formData?.geoLocation &&
    form_data.append(`geoLocation`, JSON.stringify(formData?.geoLocation));
  formData?.parentAsset &&
    form_data.append(`parentAsset`, formData?.parentAsset);
  formData?.isWarrantyIncluded &&
    form_data.append(`isWarrantyIncluded`, formData?.isWarrantyIncluded);
  formData?.warrantyPeriodNumber &&
    form_data.append(`warrantyPeriodNumber`, formData?.warrantyPeriodNumber);
  formData?.warrantyPeriodDurr?.id &&
    form_data.append(`warrantyPeriodDurr`, formData?.warrantyPeriodDurr?.id);
  formData?.warrantyPeriod &&
    form_data.append(`warrantyPeriod`, formData?.warrantyPeriod);
  formData?.supplierName &&
    form_data.append(`supplierName`, formData?.supplierName);
  formData?.supplierEmail &&
    form_data.append(`supplierEmail`, formData?.supplierEmail);
  formData?.warrantyEndDate &&
    form_data.append(`warrantyEndDate`, formData?.warrantyEndDate);
  formData?.asset3DmodelRotation &&
    form_data.append(
      `asset3DmodelRotation`,
      JSON.stringify(formData?.asset3DmodelRotation)
    );
  formData?.asset3DmodelPosition &&
    form_data.append(
      `asset3DmodelPosition`,
      JSON.stringify(formData?.asset3DmodelPosition)
    );
  formData?.asset3DModel &&
    form_data.append(`asset3DModel`, formData?.asset3DModel);
  formData?.assetLayoutImage &&
    form_data.append(`assetLayoutImage`, formData?.assetLayoutImage);
  formData?.assetImagesToDelete?.length &&
    form_data.append(`assetImagesToDelete`, JSON.stringify(formData?.assetImagesToDelete));
  formData?.assetImages?.length >= 0 &&
    formData?.assetImages.forEach((file, index) => {
      form_data.append(`assetImage${index}`, file);
    });
  formData?.termsAndConditions?.length > 0 &&
    formData?.termsAndConditions.forEach((file, index) => {
      form_data.append(`assetTermsAndConditions${index}`, file);
    });
  formData?.assetParametersToDelete?.length > 0 && form_data.append("assetParametersToDelete",JSON.stringify(formData?.assetParametersToDelete))  
  assetParametersToCreate?.length > 0 &&
    form_data.append(
      "createAssetParameters",
      JSON.stringify(assetParametersToCreate)
    );
  assetParametersToEdit?.length > 0 &&
    form_data.append(
      "assetParameters",
      JSON.stringify(assetParametersToEdit)
    );

  editAsset(form_data).then((res) => {
    if(res?.data?.status == 200){
      if(formData?.referenceManuals?.length > 0){

      } else {
        handleEditAssetDocuments({documents:formData?.documents,assetId:assetId,dispatch,getUpdatedStatusOFAssetCreation,getCreatedAssetDetails})
      }

      // getAllAssetsWithoutLimit({optionalParams:{assetDepartment: 1,criticalityLevel: 1,}})
      // .then((res) => {
      //   dispatch(assetActions.getAllAssets(res?.data?.result));
      //   Navigate("/all-assets");
      // })
      // .catch((err) => {
      //   if (
      //     err?.response?.data?.status === 401 &&
      //     JSON.parse(localStorage.getItem("loginUser")) !== null
      //   ) {
      //     dispatch(commonActions.handleExpiryAlert(true));
      //     removeUserSession();
      //     localStorage.removeItem("loginUser");
      //   } else {
      //     if (err?.response) {
      //       dispatch(
      //         commonActions.handleSnackbar({
      //           show: true,
      //           message: `${err?.response?.data?.message}`,
      //           type: "error",
      //         })
      //       );
      //       const error = err?.response?.data?.error;
      //       postAuditLog({ action: "Edit Asset", message: error });
      //     }
      //   }
      // });

    }
  });
};

//  TO EDIT ASSET DOCUMENTS
export const handleEditAssetDocuments = ({documents,assetId,dispatch,operationType,getUpdatedStatusOFAssetCreation,getCreatedAssetDetails}) => {
  try {
    let document_checks = {};
    documents?.map( (doc) => {
      const form_data = new FormData();
      const {file,docId,replaceDocument,documentName,documentNumber,revisionNumber,documentType,status} = doc;
      file && form_data.append("file0",file)
      assetId && form_data.append("assetId",assetId)
      docId && form_data.append("docId",docId);
      documentName && form_data.append("documentName",documentName)
      documentNumber && form_data.append("documentNumber",documentNumber)
      documentType?.id && form_data.append("documentType",documentType?.id)
      status?.id && form_data.append("status",status?.id) 
      replaceDocument && form_data.append("replaceDocument",replaceDocument)
      revisionNumber && form_data.append("revisionNumber",revisionNumber);
      file && form_data.append("noOfFiles",1)
      document_checks[`${docId}`] = true;
      editAssociateDocs(form_data).then((res) => {
        if (res?.data?.status == "200" || res?.data?.status == "201") {
          delete document_checks[`${file.id}`]
      }
      }).catch((err) => {
        handleLoginExpiry(err, dispatch);
        if(operationType === "created") dispatch(assetActions.setAssetCreationLoading(false));
        if(operationType === "drafted") dispatch(assetActions.setAssetDraftLoading(false));
        getUpdatedStatusOFAssetCreation(true);
        getCreatedAssetDetails({
          assetId,
          operationType,
          message: `Asset updated successfully, but documents failed!`,
        });
      }).finally(() => {
        if(operationType === "created") dispatch(assetActions.setAssetCreationLoading(false));
        if(operationType === "drafted") dispatch(assetActions.setAssetDraftLoading(false));
        getUpdatedStatusOFAssetCreation(true);
        getCreatedAssetDetails({
          assetId,
          operationType,
          message: `Asset updated successfully.`,
          failedDocuments:document_checks
        });
      })

    })
  } catch (error) {
      handleLoginExpiry(error,dispatch);
      if(error?.response?.data?.status !== 401){
        handleShowErrorAndWarning({dispatch,message:"something went wrong, Document update failed!",type:"error",showTime:"50000"})
      }
  }
}

// TO EDIT REFERENCE MANUALS
export const handleEditReferenceManuals = ({getUpdatedStatusOFAssetCreation,getCreatedAssetDetails,assetId,dispatch, operationType,assetDetails}) => {
  const form_data = new FormData();
  const instructionsDocuments = assetDetails?.referenceManuals[0];
  instructionsDocuments?.instructionDocumentName && form_data.append("name",instructionsDocuments?.instructionDocumentName);
  const files = instructionsDocuments?.instructions;
  const instructionTitles = [];
  form_data.append("noOfFiles", files?.length);
  files?.map((file, index) => {
    instructionTitles.push(file?.instructionTitle);
    file?.instructionFile && form_data.append(`file${index + 1}`, file?.instructionFile);
  });
  instructionTitles?.length && form_data.append("instructions",JSON.stringify(instructionTitles));

  
  createReferenceManualForAsset(assetId, form_data)
    .then((ref_response) => {
      if (ref_response?.data?.status == 201 || ref_response?.data?.status == 200) {
        if (assetId) {
          if(assetDetails?.documents?.length > 0){
            createAssetDocuments({getUpdatedStatusOFAssetCreation,getCreatedAssetDetails,assetId,dispatch, operationType,assetDetails})
          } else {
            if(operationType === "created") dispatch(assetActions.setAssetCreationLoading(false));
            if(operationType === "drafted") dispatch(assetActions.setAssetDraftLoading(false));
            getUpdatedStatusOFAssetCreation(true);
            getCreatedAssetDetails({
              assetId,
              operationType,
              message: `Asset ${operationType} successfully.`,
            });
          }
        }
      }
    })
    .catch((err) => {
      handleLoginExpiry(err, dispatch);
      if(operationType === "created") dispatch(assetActions.setAssetCreationLoading(false));
      if(operationType === "drafted") dispatch(assetActions.setAssetDraftLoading(false));
      getUpdatedStatusOFAssetCreation(true);
      getCreatedAssetDetails({
        assetId,
        operationType,
        message: `Asset ${operationType} successfully, but reference manual failed!`,
      });
    });
};


// TO DOWNLOAD EXCEL DATA
export const downloadExcel = (filters) => {
  const optionalParams = {
    assetDepartment: 1,
    criticalityLevel: 1,
    functionalArea: 1,
    location: 1,
  };
  getexportableData(filters, optionalParams).then((res) => {
    console.log(res?.data, "resss");
    let filteredArray = res?.data?.result?.map((asset) => {
      return {
        assetName: asset?.assetName,
        assetNumber: asset?.assetNumber,
        tagId: asset?.tagId,
        description: asset?.description,
        department: asset?.assetDepartment,
        criticalityLevel: asset?.criticalityLevel,
        functionalArea: asset?.functionalArea,
        assetMake: asset?.assetMake,
        assetModel: asset?.assetModel,
        serialNumber: asset?.serialNumber,
        manufacturer: asset?.manufacturer,
        installationDate: getFormatedDate(asset?.installationDate),
        supplierName: asset?.supplierName,
        supplierEmail: asset?.supplierEmail,
        location: asset?.location,
        assetLevel: asset?.assetLevel,
        decommissionedDate: getFormatedDate(asset?.decommissionedDate),
      };
    });
    console.log(filteredArray, "downloaded data");
    const worksheet = xlsx.utils.json_to_sheet(filteredArray);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    xlsx.writeFile(workbook, "AssetsData.xlsx");
  });
};

// TO DOWNLOAD 3D EXCEL DATA

export const download3DExcel = (filters) => {
  getexportableData(filters).then((res) => {
    let filteredArray = res?.data?.result?.assets?.map((asset) => {
      return {
        uuid: asset?.assetId,
        assetName: asset?.assetName,
        assetNumber: asset?.assetNumber,
        tagId: asset?.tagId,
        description: asset?.description,
        department: asset?.assetDepartment,
        criticalityLevel: asset?.criticalityLevel,
        functionalArea: asset?.functionalArea,
        assetMake: asset?.assetMake,
        assetModel: asset?.assetModel,
        serialNumber: asset?.serialNumber,
        manufacturer: asset?.manufacturer,
        installationDate: getFormatedDate(asset?.installationDate),
        supplierName: asset?.supplierName,
        supplierEmail: asset?.supplierEmail,
        location: asset?.location,
        assetLevel: asset?.assetLevel,
        decommissionedDate: getFormatedDate(asset?.decommissionedDate),
      };
    });
    console.log(filteredArray, "downloaded data");
    const worksheet = xlsx.utils.json_to_sheet(filteredArray);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    xlsx.writeFile(workbook, "AssetsData-3d-system.xlsx");
  });
};

// TO DOWNLOAD CSV DATA

export const downloadCSV = (filters) => {
  getexportableData(filters).then((res) => {
    let filteredArray = res?.data?.result?.assets?.map((asset) => {
      return {
        assetName: asset?.assetName,
        assetNumber: asset?.assetNumber,
        tagId: asset?.tagId,
        description: asset?.description,
        department: asset?.assetDepartment,
        criticalityLevel: asset?.criticalityLevel,
        functionalArea: asset?.functionalArea,
        assetMake: asset?.assetMake,
        assetModel: asset?.assetModel,
        serialNumber: asset?.serialNumber,
        manufacturer: asset?.manufacturer,
        installationDate: getFormatedDate(asset?.installationDate),
        supplierName: asset?.supplierName,
        supplierEmail: asset?.supplierEmail,
        location: asset?.location,
        assetLevel: asset?.assetLevel,
        decommissionedDate: getFormatedDate(asset?.decommissionedDate),
      };
    });

    //
    const csv = Papa.unparse(filteredArray);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "assetsData.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
};

// To validate files and images while uploading

export const validatedFiles = (
  dispatch,
  selectedFiles,
  presentFiles,
  allowedExtensions
) => {
  let files = [];
  let allFiles = presentFiles?.length
    ? [...presentFiles, ...selectedFiles]
    : [...selectedFiles];
  if (allFiles.length > 10) {
    dispatch(
      commonActions.handleSnackbar({
        show: true,
        message: "You can not upload more than 10 files.",
        type: "error",
      })
    );
  }
  files = allFiles?.filter((file, index) => index < 10);
  let presentFileNames = presentFiles?.map((img) => {
    return img?.name;
  });
  if (presentFileNames?.length) {
    files = allFiles?.filter((file) => {
      return !presentFileNames.includes(file?.name);
    });
  }
  console.log(files.length, "length");
  // Filter the files to only include those with allowed extensions
  let wrongExtensionFiles = files?.filter((file) => {
    const extension = file?.name?.split(".").pop()?.toLowerCase();
    return !allowedExtensions.includes("." + extension);
  });

  let wrongFileNames = "";
  wrongExtensionFiles?.forEach((file) => {
    wrongFileNames += file?.name + ",";
  });
  if (wrongExtensionFiles?.length) {
    dispatch(
      commonActions.handleSnackbar({
        show: true,
        message:
          wrongExtensionFiles?.length > 1
            ? `The following files are not supported : ${wrongFileNames} `
            : `The following file is not supported : ${wrongFileNames} `,
        type: "error",
        closeIn: 10000,
      })
    );
  }
  // Filter the files to only include those with size <= 10MB

  let overSizeFiles = files?.filter((file) => {
    return file?.size > 10 * 1024 * 1024; // 10MB in bytes
  });
  let overSizeFileNames = "";
  overSizeFiles?.forEach((file) => {
    overSizeFileNames += file?.name + ",";
  });
  if (overSizeFiles?.length) {
    dispatch(
      commonActions.handleSnackbar({
        show: true,
        message: `The following files are exceeds the size limit of 10MB. ${overSizeFileNames} `,
        type: "error",
        closeIn: 10000,
      })
    );
  }
  files = files?.filter((file) => {
    const extension = file?.name?.split(".").pop()?.toLowerCase();
    return allowedExtensions.includes("." + extension);
  });

  files = files?.filter((file) => {
    return file?.size <= 10 * 1024 * 1024; // 10MB in bytes
  });
  return files;
};

// TO GET ASSET MODE DROPDOWN VALUES

export const getAssetModeDropdownData = async (setAssetMode, dispatch) => {
  try {
    const response = await getAssetModeDropdown();
    console.log("usersResponse:", response);
    setAssetMode(response?.data?.result);
    // dispatch(userActions.getAllUsers(response?.data?.result))
  } catch (error) {
    handleLoginExpiry(error, dispatch);
  }
};

// TO GET RUNNING MODE DROPDOWN VALUES

export const getRunningModeDropdownData = async (setRunningMode, dispatch) => {
  try {
    const response = await getRunningModeDropdown();
    console.log("usersResponse:", response);
    setRunningMode(response?.data?.result);
    // dispatch(userActions.getAllUsers(response?.data?.result))
  } catch (error) {
    handleLoginExpiry(error, dispatch);
  }
};

export const handleGetValueFromSelect = ({
  field,
  type,
  formData,
  setFormData,
  getData,
  getChangedValues,
  changedData,
  setErrors,
}) => {
  if (field === "deselected") {
    delete formData[type];
    if (type === "warrantyPeriodDurr") {
      delete formData?.warrantyPeriod;
      delete formData?.warrantyEndDate;
      validateForm({
        name: "warrantyPeriod",
        formData,
        setErrors,
        label: "Warranty Period",
      });
    }
    validateForm({ name: "", formData, setErrors, label: "" });
    setFormData({ ...formData });
    getData({ ...formData });
    if (changedData && getChangedValues) {
      delete changedData[type];
      if (type === "warrantyPeriodDurr") {
        delete changedData?.warrantyPeriod;
        delete changedData?.warrantyEndDate;
      }
      getChangedValues({ ...changedData });
    }
  } else {
    let temp = {};
    setFormData((prev) => {
      if (type === "warrantyPeriodDurr") {
        temp = {
          ...prev,
          [type]: { id: field?.value, name: field?.label },
          warrantyPeriod: formData?.warrantyPeriodNumber
            ? `${formData?.warrantyPeriodNumber} ${field?.value}`
            : `0 ${field?.value}`,
        };
        validateForm({
          name: "warrantyPeriod",
          formData: temp,
          setErrors,
          label: "Warranty Period",
        });
      } else {
        temp = {
          ...prev,
          [type]: { id: field?.value, name: field?.label },
        };
      }
      // validateForm({formData:temp,setErrors})
      getData(temp);
      if (changedData && getChangedValues) {
        let changeIn = {
          ...changedData,
          [type]: { id: field?.value, name: field?.label },
        };
        console.log(changeIn, "compare from parent son");
        getChangedValues(changeIn);
      }
      return temp;
    });
  }
};
