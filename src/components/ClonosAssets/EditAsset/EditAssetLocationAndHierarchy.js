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
export const EditAssetLocationAndHierarchy = ({ getData, data,getChangedValues,changedData }) => {
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

  const handleChange = ({e,label,fieldName}) => {
    const { name, value, placeholder } = e.target;
    const fourDecimalValue = limitDecimalDigits(value);
    let temp = null;
    let changeIn = null;
    setLocationData((prevData) => {
      if (name === "geoLatitude") {
        // console.log(temp);
          temp = {
            ...prevData,
            geoLocation: {
              ...prevData?.geoLocation,
              latitude: limitLatitude(fourDecimalValue),
            },
          };
          changeIn = {
            ...changedData,
            geoLocation: {
              ...prevData?.geoLocation,
              latitude: limitLatitude(fourDecimalValue),
            },
          };
      } else if (name === "geoLongitude") {
           temp = {
            ...prevData,
            geoLocation: {
              ...prevData?.geoLocation,
              longitude: limitLongitude(fourDecimalValue),
            },
          };
           changeIn = {
            ...changedData,
            geoLocation: {
              ...prevData?.geoLocation,
              longitude: limitLongitude(fourDecimalValue),
            },
          };
      } else if (name === "geoElevation") {
          temp = {
            ...prevData,
            geoLocation: { ...prevData?.geoLocation, elevation: value },
          };
          changeIn = {
            ...changedData,
            geoLocation: { ...prevData?.geoLocation, elevation: value },
          };
      }
      getData(temp);
      getChangedValues(changeIn)
      if(label){
        validateForm({name:fieldName,formData:temp,setErrors,label})
      }
      return temp
    })
  };


  const handleSetParent = (id) => {
    setLocationData((prev) => {
      let temp = {
        ...prev,
        parentAsset: id,
      };
      let changeIn = {
        ...prev,
        parentAsset: id,
      };
      getData(temp);
      getChangedValues(changeIn)
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
    handleGetValuesMethod({ val, setFormData: setLocationData, getData,getChangedValues,changedData });
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
  console.log(changedData, "ddd");
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
                    onChange={(e) => handleChange({e,label:"Latitude",fieldName:"latitude"})}
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
                    onChange={(e) => handleChange({e,label:"Longitude",fieldName:"longitude"})}
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
                    onChange={(e) => handleChange({e,label:"Elevation",fieldName:"elevation"})}
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






// import { SelectPicker } from "rsuite";
// import Styles from "../../../ModuleStyles/Assets/assets.module.css";
// import { useEffect, useRef, useState } from "react";
// import { getLocations } from "../../../Api/User/UserApi";
// import { useDispatch, useSelector } from "react-redux";
// import { assetActions } from "../../../Store/Reducers/ClonosAssetReducer";
// import Modal from "../../CommonComponents/Modal/Modal";
// import SearchIcon from "@material-ui/icons/Search";
// import CheckCircleIcon from "@material-ui/icons/CheckCircle";
// import {
//   getAssetDropdown,
//   getAssetLevelDropdown,
//   getFilteredAssetLevelDropdown,
// } from "../../../Api/Asset/assetApi";
// import { makeStyles } from "@material-ui/core/styles";
// import UPLOADIMGICON from "../../../assets/UIUX/icons/uploadImageIcon.svg";
// import UPLOADFILEICON from "../../../assets/UIUX/icons/fileuploadIcon.svg";
// import IMAGEPREVIEWICON from "../../../assets/UIUX/icons/imagePreviewIcon.svg";
// import REDTRASHICON from "../../../assets/UIUX/icons/redTrash.svg";
// import DOWNANGLE from "../../../assets/UIUX/icons/chevron-down.svg"
// import { ProgressBarWithLabel } from "../../CommonComponents/ProgressBar/ProgressBarWithLabel"
// import {
//   fileToBinaryData,
//   handleLoginExpiry,
//   limitDecimalDigits,
//   limitLatitude,
//   limitLongitude,
// } from "../../../utils/clonosCommon";
// import { debounce } from "lodash";
// import { ImmediateParentChildAssetTree } from "../ImidiateParentChildAssetTree/ImmediateParentChildAssetTree";
// import { CustomSelect } from "../../CommonComponents/CustomSelect/CustomSelect";
// import { commonActions } from "../../../Store/Reducers/CommonReducer";
// import { handleGetAssetDropdown } from "../../../utils/WorkOrderMethods/WorkOrderMethods";
// import DynamicDropdown from "../../CommonComponents/DynamicDropdown/DynamicDropdown";
// import { handleGetValueFromSelect, validateForm } from "../../../utils/AssetsMethods/AssetRegister";
// const useStyles = makeStyles({
//   root: {
//     height: 110,
//     flexGrow: 1,
//     maxWidth: 400,
//   },
// });
// export const EditAssetLocationAndHierarchy = ({
//   getData,
//   data,
//   getChangedValues,
//   changedData,
// }) => {
//   const ast3DModelRef = useRef(null);
//   const astLayoutRef = useRef(null);
//   const [formData,setFormData] = useState({...data})
//   const [locationsDropdown, setLocationsDropdown] = useState([]);
//   const locations = useSelector((state) => state.assetData.locationsOfAsset);
//   const [showHierarchyModal, setShowHierarchyModal] = useState(false);
//   const [hovered3DModel, setHovered3DModel] = useState(false);
//   const [hoveredLayoutImg, setHoveredLayoutImg] = useState(false);
//   const [progress, setProgress] = useState(false);
//   const dispatch = useDispatch();
//   const [showLocations,setShowLocations] = useState(false)
//   const [assetsWithLevels, setAssetsWithlevels] = useState([]);
//   const [selectedParent, setSelectedParent] = useState(data?.parentAsset);
//   const [selectedParentName, setSelectedParentName] = useState("");
//   const [showParentName, setShowParentName] = useState(false);
//   const debouncedSearchRef = useRef(debounce(() => {}, 500));
//   const [uploadProgress, setUploadProgress] = useState({});
//   const [errors,setErrors] = useState([])
//   const locationRef = useRef(null);
//   const [assetPaginationCurrentPage, setAssetPaginationCurrentPage] =
//     useState(1);
//   const [assetDropdownData, setAssetDropdownData] = useState([]);
//   const handleChange = (event, file) => {
//     const { name, value,placeholder } = event.target;
//     if (name === "geoLatitude") {
//       const fourDecimalValue = limitDecimalDigits(value);
//       console.log(limitLatitude(fourDecimalValue), ">>>>>>>>>>>>>>");
//       let temp = {
//         ...data,
//         geoLocation: {...data?.geoLocation,latitude : limitLatitude(fourDecimalValue)},
//       };
//       let changeIn = {
//         ...changedData,
//         geoLocation: {...data?.geoLocation,latitude : limitLatitude(fourDecimalValue)},
//       };
//       getChangedValues(changeIn);
//       getData(temp);
//     } else if (name === "geoLongitude") {
//       const fourDecimalValue = limitDecimalDigits(value);
//       let temp = {
//         ...data,
//         geoLocation: {...data?.geoLocation,longitude : limitLongitude(fourDecimalValue)},
//       };
//       let changeIn = {
//         ...changedData,
//         geoLocation: {...data?.geoLocation,longitude : limitLongitude(fourDecimalValue)},
//       };
//       getChangedValues(changeIn);
//       getData(temp);
//     } else if(name === "geoElevation"){
//       let temp = {
//         ...data,
//         geoLocation: {...data?.geoLocation,elevation : value},
//       };
//       let changeIn = {
//         ...changedData,
//         geoLocation: {...data?.geoLocation,elevation : value},
//       };
//       getChangedValues(changeIn);
//       getData(temp);
//     } else if(name === "asset3DmodelPosition"){
//       let temp = {
//         ...data,
//         position: {...data?.position,[placeholder] : value},
//       };
//       let changeIn = {
//         ...changedData,
//         position: {...changedData?.position,[placeholder] : value},
//       };
//       getChangedValues(changeIn);
//       getData(temp);
//     } else if(name === "asset3DmodelRotation"){
//       let temp = {
//         ...data,
//         rotation: {...data?.rotation,[placeholder] : value},
//       };
//       let changeIn = {
//         ...changedData,
//         rotation: {...changedData?.rotation,[placeholder] : value},
//       };
//       getChangedValues(changeIn);
//       getData(temp);
//     }
//   };

//   const handleSetParent = (id) => {
//     setShowParentName(true);
//     let temp = {
//       ...data,
//       parentAsset: id,
//     };
//     let changeIn = {
//       ...changedData,
//       parentAsset: id,
//     };
//     getChangedValues(changeIn);
//     getData(temp);
//     setShowHierarchyModal(false);
//   };

//   const handleMoreData = ({ isActivator }) => {
//     if (isActivator) {
//       setAssetPaginationCurrentPage((prev) => {
//         let updatedPageCount = prev + 1;
//         handleGetAssetDropdown({
//           setAssetDropdownData,
//           assetDropdownData,
//           assetPaginationCurrentPage: updatedPageCount,
//           dispatch,
//         });
//         return updatedPageCount;
//       });
//     }
//   };

//   const handleGetValues = (val) => {
//    let asset = val.selectedOption[0];
//    handleSetParent(asset?.id)
//   }

//   const handleHierarchy = (type) => {
//     if (type === "remove") {
//       handleSetParent(null)
//     } else if (type === "change") {
//       setShowHierarchyModal(true);
//     }
//   };

//   const handleValidateDropdownValues = (data) =>{
//     validateForm(data,setErrors)
//   }

//   useEffect(() => {
//     getLocations().then((res) => {
//       setLocationsDropdown(res.data.result);
//     });
//     handleGetAssetDropdown({ setAssetDropdownData, assetDropdownData, assetPaginationCurrentPage, dispatch })
//   }, []);
//   console.log(data,"data from location")
//   return (
//     <>
//       <div className={Styles.locationContainer}>
//         <div className={Styles.locationAndHierarchyLeftContainer}>
//           <h4>Location Details</h4>
//           <div className={Styles.locDetailsContainer}>
//             <div>
//               <label>
//                 Location <span style={{ color: "red" }}>*</span>
//               </label>
//               <CustomSelect
//                 elementRef={locationRef}
//                 title={"Select"}
//                 icon={DOWNANGLE}
//                 data={locationsDropdown.map((location) => {
//                   return {
//                     label: location?.name_of_city,
//                     value: location?.locationId,
//                   };
//                 })}
//                 isOpen={showLocations}
//                 closeMethod={setShowLocations}
//                 formData={data}
//                 validateField={handleValidateDropdownValues}
//                 type={"location"}
//                 getSelectedValue={(val) => handleGetValueFromSelect({field:val,type:"location",formData,setFormData,getData,getChangedValues,changedData,setErrors})}

//               />
//               {errors.location && (
//                 <span className={Styles.error}>{errors.location}</span>
//               )}
//             </div>
//             <div>
//               <div className={Styles.geoLocationTitleContainer}>
//                 <label>
//                   Geographical Co-ordinates{" "}
//                   <span style={{ color: "red" }}>*</span>
//                 </label>
//                 <div className={Styles.arLocationLink}>
//                   <p>Get the location from AR</p>
//                 </div>
//               </div>
//               <div className={Styles.geoLocation}>
//                 <div>
//                   <label>Latitude(deg) <span style={{color:"red"}}>*</span></label>
//                   <input
//                     type="number"
//                     onChange={handleChange}
//                     name="geoLatitude"
//                     placeholder="Latitude "
//                     value={data?.geoLocation?.latitude}
//                     onBlur={() => validateForm(data,setErrors)}
//                   />
//                   {errors.geoLatitude && (
//                 <span className={Styles.error}>{errors.geoLatitude}</span>
//                    )}
//                 </div>
//                 <div>
//                   <label>Longitude(deg) <span style={{color:"red"}}>*</span></label>
//                   <input
//                     type="number"
//                     onChange={handleChange}
//                     name="geoLongitude"
//                     placeholder="Longitude"
//                     value={data?.geoLocation?.longitude}
//                     onBlur={() => validateForm(data,setErrors)}
//                   />
//                   {errors.geoLongitude && (
//                 <span className={Styles.error}>{errors.geoLongitude}</span>
//                    )}
//                 </div>
//                 <div>
//                   <label>Elevation(m) <span style={{color:"red"}}>*</span></label>
//                   <input
//                     type="number"
//                     onChange={handleChange}
//                     name="geoElevation"
//                     placeholder="Elevation"
//                     value={data?.geoLocation?.elevation}
//                     onBlur={() => validateForm(data,setErrors)}
//                   />
//                   {errors.geoElevation && (
//                 <span className={Styles.error}>{errors.geoElevation}</span>
//                    )}
//                 </div>
//               </div>
//             </div>
//           </div>
//           <h4>
//             {data?.parentAsset ? "Asset Hierarchy" : "Set Hierarchy"}
//           </h4>
//           {!data?.parentAsset ? (
//             <div className={Styles.setParentBtn}>
//               <button
//                 onClick={() => {
//                   console.log("clicker");
//                   if (data?.assetName) {
//                     setShowHierarchyModal(true);
//                   } else {
//                     dispatch(
//                       commonActions.handleSnackbar({
//                         show: true,
//                         message: `To set Parent, First provide Asset Name.`,
//                         type: "error",
//                         closeIn: 3000,
//                       })
//                     );
//                   }
//                 }}
//               >
//                 Set Parent
//               </button>
//             </div>
//           ) : (
//             <></>
//           )}
//           {data?.assetName ? (
//             <div className={Styles.currentHierarchyTree}>
//               <ImmediateParentChildAssetTree
//                 assetGeneralDetails={data}
//                 dispatch={dispatch}
//               />
//               {data?.parentAsset ? (
//                 <div className={Styles.hierarchyControlers}>
//                   <button onClick={() => handleHierarchy("remove")}>
//                     Remove Hierarchy
//                   </button>
//                   <button onClick={() => handleHierarchy("change")}>
//                     Change Hierarchy
//                   </button>
//                 </div>
//               ) : (
//                 <></>
//               )}
//             </div>
//           ) : (
//             <></>
//           )}
//         </div>
//       </div>
//       <DynamicDropdown
//         title={"Asset Owner"}
//         labelActivator={"User Name"}
//         isOpen={showHierarchyModal}
//         isOpenMethod={setShowHierarchyModal}
//         heading={"Select from Asset Library"}
//         placeholder={"Search"}
//         isSearchable={true}
//         isCheckbox={false}
//         isUser={true}
//         isDynamicLoad={true}
//         data={assetDropdownData}
//         isActivator={false}
//         isMandatory={false}
//         url={SearchIcon}
//         handleMoreData={handleMoreData}
//         handleGetValues={handleGetValues}
//         handleGetErrorMethods={() => {}} 
//       />
//     </>
//   );
// };
