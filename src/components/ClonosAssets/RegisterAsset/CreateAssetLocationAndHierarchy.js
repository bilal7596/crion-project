import Styles from "../../../ModuleStyles/Assets/assets.module.css";
import { useEffect, useRef, useState } from "react";
import { getLocations } from "../../../Api/User/UserApi";
import { useDispatch } from "react-redux";
import SearchIcon from "@material-ui/icons/Search";
import {
  handleLoginExpiry,
  handleShowErrorAndWarning,
  limitDecimalDigits,
  limitLatitude,
  limitLongitude,
} from "../../../utils/clonosCommon";
import { ImmediateParentChildAssetTree } from "../ImidiateParentChildAssetTree/ImmediateParentChildAssetTree";
import DOWNANGLE from "../../../assets/UIUX/icons/chevron-down.svg";
import {
  handleGetValueFromSelect,
  handleGetValuesMethod,
  validateForm,
  validatedFiles,
} from "../../../utils/AssetsMethods/AssetRegister";
import { CustomSelect } from "../../CommonComponents/CustomSelect/CustomSelect";
import { commonActions } from "../../../Store/Reducers/CommonReducer";
import { handleGetAssetDropdown } from "../../../utils/WorkOrderMethods/WorkOrderMethods";
import DynamicDropdown from "../../CommonComponents/DynamicDropdown/DynamicDropdown";
import ClonosSelect from "../../CommonComponents/ClonosSelect/ClonosSelect";
let primaryObject = {};
export const CreateAssetLocationAndHierarchy = ({ getData, data }) => {
  const dispatch = useDispatch();
  const locationRef = useRef(null);
  const [locationsDropdown, setLocationsDropdown] = useState([
    {
      id: 1,
      locationId: "loc-203bc829-262c-4a77-b8cf-b15e89448776",
      name_of_city: "Mandapeta",
    },
    {
      id: 2,
      locationId: "loc-809e1938-d038-43eb-92ef-f64ce5b7889d",
      name_of_city: "Tatipaka",
    },
  ]);
  const [showHierarchyModal, setShowHierarchyModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [showLocations, setShowLocations] = useState(false);
  const [locationData, setLocationData] = useState({ ...data });
  const [geoLocation, setGeoLocation] = useState();
  const [assetPaginationCurrentPage, setAssetPaginationCurrentPage] =
    useState(1);
  const [assetDropdownData, setAssetDropdownData] = useState([]);
  const handleChange = (event) => {
    const { name, value, placeholder } = event.target;
    const fourDecimalValue = limitDecimalDigits(value);
    if (name === "geoLatitude") {
      // console.log(temp);
      setLocationData((prevData) => {
        let temp = {
          ...prevData,
          geoLocation: {
            ...prevData?.geoLocation,
            latitude: limitLatitude(fourDecimalValue),
          },
        };
        getData(temp);
        return temp;
      });
    } else if (name === "geoLongitude") {
      setLocationData((prevData) => {
        let temp = {
          ...prevData,
          geoLocation: {
            ...prevData?.geoLocation,
            longitude: limitLongitude(fourDecimalValue),
          },
        };
        getData(temp);
        return temp;
      });
    } else if (name === "geoElevation") {
      setLocationData((prevData) => {
        let temp = {
          ...prevData,
          geoLocation: { ...prevData?.geoLocation, elevation: value },
        };
        getData(temp);
        return temp;
      });
    }
  };

  const handleSetParent = (id) => {
    setLocationData((prev) => {
      let temp = {
        ...prev,
        parentAsset: id,
      };
      getData(temp);
      return temp;
    });
    setShowHierarchyModal(false);
  };

  const handleMoreData = ({ isActivator }) => {
    if (isActivator) {
      setAssetPaginationCurrentPage((prev) => {
        let updatedPageCount = prev + 1;
        handleGetAssetDropdown({
          setAssetDropdownData,
          assetDropdownData,
          assetPaginationCurrentPage: updatedPageCount,
          dispatch,
        });
        return updatedPageCount;
      });
    }
  };

  const handleFieldsError = (err) => {
    primaryObject = {
      ...primaryObject,
      [err.uniqueKey]: {
        ...err,
        value: locationData[err.uniqueKey] ? true : false,
      },
    };
  };
  const handleGetValues = (val) => {
    let { uniqueKey } = val;
    if (uniqueKey === "location") {
      primaryObject = {
        ...primaryObject,
        [uniqueKey]: { ...primaryObject[uniqueKey], value: true },
      };
    }
    handleGetValuesMethod({ val, setFormData: setLocationData, getData });
  };

  const handleHierarchy = (type) => {
    if (type === "remove") {
      handleSetParent(null);
    } else if (type === "change") {
      setShowHierarchyModal(true);
    }
  };
  useEffect(() => {
    // getLocations().then((res) => {
    //   setLocationsDropdown(res?.data?.result);
    // });
    handleGetAssetDropdown({
      setAssetDropdownData,
      assetDropdownData,
      assetPaginationCurrentPage,
      dispatch,
    });
  }, []);
  console.log(locationData, "ddd");
  return (
    <>
      <div className={Styles.locationContainer}>
        <div className={Styles.locationAndHierarchyLeftContainer}>
          <h4>Location Details</h4>
          <div className={Styles.locDetailsContainer}>
            <div>
              <ClonosSelect
                type="select"
                placeholder="Select"
                label={"Location"}
                isLabel={true}
                uniqueKey="location"
                defaultValue={locationData?.location?.name}
                isMandatory={true}
                options={locationsDropdown?.map((opt) => ({
                  label: opt?.name_of_city,
                  value: opt?.locationId,
                  isNeeded: true,
                }))}
                icon={DOWNANGLE}
                errorMessage={"Location is Required!."}
                handleGetValues={(value) => handleGetValues(value)}
                handleGetErrorActivatorInformation={(err) =>
                  handleFieldsError(err)
                }
              />
            </div>
            <div>
              <div className={Styles.geoLocationTitleContainer}>
                <label>
                  Geographical Co-ordinates{" "}
                  <span style={{ color: "red" }}>*</span>
                </label>
                <div className={Styles.arLocationLink}>
                  <p>Get the location from AR</p>
                </div>
              </div>
              <div className={Styles.geoLocation}>
                <div>
                  <label>
                    Latitude(deg) <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="number"
                    onChange={handleChange}
                    name="geoLatitude"
                    placeholder="Latitude "
                    value={locationData?.geoLocation?.latitude}
                    onBlur={() =>
                      validateForm({
                        name: "latitude",
                        formData: locationData,
                        setErrors,
                        label: "Latitude",
                      })
                    }
                  />
                  {errors.latitude && (
                    <span className={Styles.error}>{errors.latitude}</span>
                  )}
                </div>
                <div>
                  <label>
                    Longitude(deg) <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="number"
                    onChange={handleChange}
                    name="geoLongitude"
                    placeholder="Longitude"
                    value={locationData?.geoLocation?.longitude}
                    onBlur={() =>
                      validateForm({
                        name: "longitude",
                        formData: locationData,
                        setErrors,
                        label: "Longitude",
                      })
                    }
                  />
                  {errors.longitude && (
                    <span className={Styles.error}>{errors.longitude}</span>
                  )}
                </div>
                <div>
                  <label>
                    Elevation(m) <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="number"
                    onChange={handleChange}
                    name="geoElevation"
                    placeholder="Elevation"
                    value={locationData?.geoLocation?.elevation}
                    onBlur={() =>
                      validateForm({
                        name: "elevation",
                        formData: locationData,
                        setErrors,
                        label: "Elevation",
                      })
                    }
                  />
                  {errors.elevation && (
                    <span className={Styles.error}>{errors.elevation}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <h4>
            {locationData?.parentAsset ? "Asset Hierarchy" : "Set Hierarchy"}
          </h4>
          {!locationData?.parentAsset ? (
            <div className={Styles.setParentBtn}>
              <button
                onClick={() => {
                  console.log("clicker");
                  if (locationData?.assetName) {
                    setShowHierarchyModal(true);
                  } else {
                    handleShowErrorAndWarning({
                      dispatch,
                      type: "error",
                      message: "To set Parent, First provide Asset Name.",
                      showTime: 300,
                    });
                  }
                }}
              >
                Set Parent
              </button>
            </div>
          ) : (
            <></>
          )}
          {locationData?.assetName ? (
            <div className={Styles.currentHierarchyTree}>
              <ImmediateParentChildAssetTree
                assetGeneralDetails={locationData}
                dispatch={dispatch}
              />
              {locationData?.parentAsset ? (
                <div className={Styles.hierarchyControlers}>
                  <button onClick={() => handleHierarchy("remove")}>
                    Remove Hierarchy
                  </button>
                  <button onClick={() => handleHierarchy("change")}>
                    Change Hierarchy
                  </button>
                </div>
              ) : (
                <></>
              )}
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
      <DynamicDropdown
        title={"parentAsset"}
        labelActivator={""}
        isOpen={showHierarchyModal}
        isOpenMethod={setShowHierarchyModal}
        heading={"Select from Asset Library"}
        placeholder={"Search"}
        isSearchable={true}
        isCheckbox={false}
        isUser={true}
        isDynamicLoad={true}
        data={assetDropdownData}
        isActivator={false}
        isMandatory={false}
        url={SearchIcon}
        handleMoreData={handleMoreData}
        handleGetValues={(val) => handleGetValues(val)}
        handleGetErrorMethods={() => {}}
      />
    </>
  );
};
