import { createBulkAssets, getAllAssetsWithoutLimit } from "../../Api/Asset/assetApi";
import { commonActions } from "../../Store/Reducers/CommonReducer";
import configs from "../../config";
import * as xlsx from "xlsx";
import { getUser, handleLoginExpiry, removeUserSession } from "../clonosCommon";
const user = getUser();
export const handleDownloadTemp = () => {
  window.open(`${configs.url}/api/v1/asset/assetsfile`, "_self");
};

function toCamel(o) {
  var newO, origKey, newKey, value;
  if (o instanceof Array) {
    return o.map(function (value) {
      if (typeof value === "object") {
        value = toCamel(value);
      }
      return value;
    });
  } else {
    newO = {};
    for (origKey in o) {
      if (o.hasOwnProperty(origKey)) {
        newKey = (origKey.charAt(0).toLowerCase() + origKey.slice(1) || origKey)
          .toString()
          .replace(/\s(.)/g, function ($1) {
            return $1.toUpperCase();
          })
          .replace(/\s/g, "")
          .replace(/^(.)/, function ($1) {
            return $1.toLowerCase();
          });
        value = o[origKey];
        if (
          value instanceof Array ||
          (value !== null && value.constructor === Object)
        ) {
          value = toCamel(value);
        }

        newO[newKey] = value;
      }
    }
  }

  return newO;
}

export const handleUploadSheet = (e, dispatch, setrenderUserTable) => {
  dispatch(commonActions.showApiLoader(true));
  var errorData = false;

  const fileTemp = {
    assetName: "",
    assetNumber: "",
    tagId: "",
    assetType: "",
    assetId: "",
    assetCategory: "",
    criticalityLevel: "",
    description: "",
    functionalArea: "",
    assetMake: "",
    serialNumber: "",
    manufacturer: "",
    supplierName: "",
    supplierEmail: "",
    location: "",
    geoLongitude: "",
    geoLatitude: "",
    geoAltitude: "",
    subAssets: "",
    assetLevel: "",
    currentStage: "",
    isRootAsset: "",
    createdBy: "",
    updatedBy: "",
  };

  function compareKeys(a, b, notMandatory) {
    var aKeys = Object.keys(a)
      .filter((field) => {
        if (!notMandatory.includes(field)) {
          return field;
        }
      })
      .sort();
    var bKeys = Object.keys(b)
      .filter((field) => {
        if (!notMandatory.includes(field)) {
          return field;
        }
      })
      .sort();
    return JSON.stringify(aKeys) === JSON.stringify(bKeys);
  }
  e.preventDefault();
  if (e.target.files) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = xlsx.read(data, { type: "array" });
      console.log("workbook", workbook);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = xlsx.utils.sheet_to_json(worksheet);
      json.forEach((asset) => {
        asset.createdBy = user?.userId;
      });

      const convertedJson = json.map((obj) => {
        return toCamel(obj);
      });

      if (convertedJson.length > 0) {
        errorData = compareKeys(convertedJson[0], fileTemp, [
          "assetId",
          "description",
        ]);
      }
      if (errorData) {
        createBulkAssets(convertedJson)
          .then((res) => {
            console.log("createBulkAssets RESPONSE", res);
            dispatch(commonActions.showApiLoader(false));
            dispatch(
              commonActions.handleSnackbar({
                show: true,
                message: `${convertedJson.length} ${
                  convertedJson.length > 1 ? "Assets" : "Asset"
                } created successfully`,
                type: "success",
              })
            );
            setrenderUserTable((prev) => !prev);
          })
          .catch((err) => {
            if (
              err.response.data.status === 401 &&
              JSON.parse(localStorage.getItem("loginUser")) !== null
            ) {
              dispatch(commonActions.handleExpiryAlert(true));
              removeUserSession();
              localStorage.removeItem("loginUser");
            } else {
              console.log("createBulkAssets err", err);
              dispatch(commonActions.showApiLoader(false));
              dispatch(
                commonActions.handleSnackbar({
                  show: true,
                  message: err.response.data.message,
                  type: "error",
                })
              );
              setrenderUserTable((prev) => !prev);
            }
          });
      } else {
        dispatch(commonActions.showApiLoader(false));
        dispatch(
          commonActions.handleSnackbar({
            show: true,
            message: "Wrong File Uploaded",
            type: "error",
          })
        );
      }

      console.log("convertedJson", convertedJson);
    };
    reader.readAsArrayBuffer(e.target.files[0]);
  }
};


export const getAllAssetsDataMethod = async ({setAllAssets,dispatch}) => {
  try {
    const optionalParams = {
      assetImages : 1,
      assetLayoutImage : 1,
      asset3DModel : 1,
      location : 1,
      runningMode : 1,
      assetDepartment : 1,
      criticalityLevel : 1,
      functionalArea : 1,
      createdBy : 1,
      assetOwner : 1,
      parentAsset : 1,
      assetTermsAndConditions : 1,
    }
    let response = await getAllAssetsWithoutLimit({optionalParams});
    let data = response?.data?.result;
    setAllAssets(data)
  } catch (error) {
    handleLoginExpiry(error,dispatch)
  }
}

