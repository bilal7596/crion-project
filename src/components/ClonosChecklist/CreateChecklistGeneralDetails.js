import Styles from "../../ModuleStyles/ChecklistAndReports/ClonosChecklist/ChecklistCreationPage.module.css";
import { CustomSelect } from "../CommonComponents/CustomSelect/CustomSelect";
import SEARCHICON from "../../assets/UIUX/icons/search.svg";
import DOWNANGLEICON from "../../assets/UIUX/icons/chevron-down.svg";
import UPSELECTOR from "../../assets/UIUX/icons/chevron-up-angle.svg";
import DOWNSELECTOR from "../../assets/UIUX/icons/chevron-down-angle.svg";
import { ClonosToggleButton } from "../CommonComponents/ClonosToggleButton/ClonosToggleButton";
import { useEffect } from "react";
import { handleGetStaticDropdownValues } from "../../utils/DropdownsMethods/DropdownsMethods";
import {
  handleGetAssetDropdown,
  handleGetUsersDropdownData,
} from "../../utils/WorkOrderMethods/WorkOrderMethods";
import { useState } from "react";
import { useDispatch } from "react-redux";
import DynamicDropdown from "../CommonComponents/DynamicDropdown/DynamicDropdown";
import { useRef } from "react";
import {
  getSelectedValueFromChecklistDropdown,
  handleEditChecklistGeneralDetails,
  handleGetSingleChecklist,
  handleRepeatationNumber,
  handleSaveChecklistGeneralDetails,
  showRepeatationFrequency,
  validateChecklistGeneralDetails,
  validateStartAndEndDate,
} from "../../utils/ChecklistAndReportsMethods/ChecklistMethod";
import { ClonosButton } from "../CommonComponents/Button/Button";
import { useLocation, useNavigate } from "react-router-dom";
import { commonActions } from "../../Store/Reducers/CommonReducer";
import { getSingleChecklistAPI } from "../../Api/ChecklistAndReports/Checklist";
import { getDayMonthYear, getFormatedDate, globalHandleGetCurrentDateTime, handleLoginExpiry, handleRedirectAfterEvent, handleShowErrorAndWarning } from "../../utils/clonosCommon";
import { postAuditLog } from "../../Api/User/UserApi";
import { ChecklistConstants } from "../../utils/ChecklistAndReportsMethods/checklistConstants";
import ClonosSelect from "../CommonComponents/ClonosSelect/ClonosSelect";
import FrequencySelector from "../FrequencySelector/FrequencySelector";
import ClonosInput from "../CommonComponents/ClonosInput/ClonosInput";
import ClonosTextarea from "../CommonComponents/ClonosTextarea/ClonosTextarea";


let primaryObject = {}
export const CreateChecklistGeneralDetails = ({ mode }) => {
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const [formData, setFormData] = useState({ isRecurring: false });
  console.log('formData:', formData)
  const [changedData, setChangedData] = useState({})
  const [errors, setErrors] = useState({});
  console.log('errors:', errors)
  const [assetDropdownData, setAssetDropdownData] = useState([]);
  const [teamDropdownData, setTeamDropdownData] = useState([]);
  const [typeDropdownData, setTypeDropdownData] = useState([]);
  const [frequencyDropdownData, setFrequencyDropdownData] = useState([]);
  console.log('frequencyDropdownData:', frequencyDropdownData)
  const [usersDropdownData, setUsersDropdownData] = useState([]);
  const [showUsersLibrary, setShowUsersLibrary] = useState(false);
  const [showTeamsLibrary, setShowTeamsLibrary] = useState(false);
  const [assetPaginationCurrentPage, setAssetPaginationCurrentPage] = useState(1);
  const [showAssetLibrary, setShowAssetLibrary] = useState(false);
  const LOCATION = useLocation();
  const { state } = LOCATION;


  // New States 
  const [lcValues, setLcValues] = useState({ "editLoading": false });
  const [lcIntervals, setLcIntervals] = useState({}); // This state will handle all the intervals Ids of all APIs
  const { singleChecklistServerResponse } = lcValues; // This state will handle all kind of local value , server response, flag states.
  const noneRenderableState = {}; // If we just want to store the data and don't want to render the component, at the time we will save the those values in this state.

  console.log('singleChecklistServerResponse:', singleChecklistServerResponse)
  console.log('lcValues:', lcValues)



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

  const handleGetValues = (props) => {
    const { name, selectedOption, updatedValue, uniqueKey, type } = props;

    if (type == "dynamicDropdown") {
      const valueSetter = handlePrimaryObjectModifier({ uniqueKey, response: selectedOption })
      setFormData((prev) => {
        return { ...prev, [uniqueKey]: valueSetter ? selectedOption[0]?.id : null }
      })
    }
    else if (type == "select") {
      const valueSetter = handlePrimaryObjectModifier({ uniqueKey, response: updatedValue })
      setFormData((prev) => {
        return { ...prev, [uniqueKey]: valueSetter ? updatedValue?.label : null }
      })
    }

    else if (type == "text" || type == "date" || type == "time" || type == "datetime-local") {
      const valueSetter = handlePrimaryObjectModifier({ uniqueKey, response: updatedValue })
      setFormData((prev) => {
        return { ...prev, [uniqueKey]: valueSetter ? updatedValue : null }
      })
    }

    else if (mode === "edit") {
      setChangedData((prev) => ({
        ...prev,
        [name]: { name: selectedOption[0]?.name, id: selectedOption[0]?.id },
      }))
    }
    else {
      setFormData((prev) => {
        return { ...prev, ...updatedValue }
      });
    }

  };

  const handlePrimaryObjectModifier = ({ uniqueKey, response }) => {
    console.log('primaryObject[uniqueKey]:', primaryObject[uniqueKey])
    if (response === null) {
      primaryObject = { ...primaryObject, [uniqueKey]: { ...primaryObject[uniqueKey], "value": false } }
      return false
    }
    else {
      primaryObject = { ...primaryObject, [uniqueKey]: { ...primaryObject[uniqueKey], "value": true } }
      return true
    }
  }


  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(value)
    const validCharactersRegex = /^[a-zA-Z0-9\s]*$/;
    if (name === "documentNumber") {
      if (validCharactersRegex.test(value)) {
        setFormData((prev) => ({
          ...prev,
          [name]: value
        }))
        if (mode === "edit") {
          setChangedData((prev) => ({
            ...prev,
            [name]: value
          }))
        }
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }))
      if (mode === "edit") {
        setChangedData((prev) => ({
          ...prev,
          [name]: value
        }))
      }
    }

  };

  const handleSaveDraftOrcontinue = (savingType) => {
    if (formData?.name && formData?.startDate && formData?.endDate) {
      handleSaveChecklistGeneralDetails({ payload: formData, dispatch, Navigate, savingType });
    } else {
      dispatch(
        commonActions.handleSnackbar({
          type: "error",
          message: "Please provide all require field.",
          show: true,
        })
      );
    }
  };

  const lcHandleFrequency = (props) => {
    setFormData((prev) => {
      return { ...prev, ...props?.updatedValue }
    });
  }

  const handleGetErrorActivatorInformation = (props) => {
    console.log('props:', props)
    primaryObject = { ...primaryObject, [props.uniqueKey]: props }
  }

  const handleGoToEditTemplate = () => {
    // Navigate("")
  }

  useEffect(() => {
    if (mode === "edit") {
      handleGetSingleChecklist({ dispatch, checklistId: state?.id, responseSetterMethod: setLcValues, uniqueKey: "singleChecklistServerResponse" })
    }

    handleGetAssetDropdown({
      setAssetDropdownData,
      assetDropdownData,
      assetPaginationCurrentPage,
      dispatch,
    });
    handleGetStaticDropdownValues({
      staticDropdownNameOrId: "Team",
      dispatch,
      setterFunctionForValues: setTeamDropdownData,
    });
    handleGetUsersDropdownData({
      setUsersDropdownData,
      usersDropdownData,
      dispatch,
    });
    handleGetStaticDropdownValues({
      staticDropdownNameOrId: "Frequency",
      dispatch,
      setterFunctionForValues: setFrequencyDropdownData,
    });
    handleGetStaticDropdownValues({
      staticDropdownNameOrId: "AssetDepartment",
      dispatch,
      setterFunctionForValues: setTypeDropdownData,
    });

    return () => {
      primaryObject = {};
      clearInterval(lcIntervals?.navigateInterval)
    }
  }, [mode])

  useEffect(() => {
    if (mode === "edit") {
      if (lcValues?.singleChecklistServerResponse) {
        setLcValues(prev => {// Here we are segregating the ISO 8601 date and time format into year, month, day, time, hour, minute, second
          const lcStartDate = getDayMonthYear(singleChecklistServerResponse?.startDate)
          const lcEndDate = getDayMonthYear(singleChecklistServerResponse?.endDate)
          return { ...prev, ["formatedStartDateServerResponse"]: lcStartDate, ['formatedEndDateServerResponse']: lcEndDate }
        })
      }
    }
  }, [lcValues?.singleChecklistServerResponse])




  console.log(changedData, mode, "changedData")
  return (
    <>
      <div area-aria-label="Parent container for general details">
        <header className={Styles.checklist_gen_details_header}>
          General Details
        </header>
        <div
          aria-label="Container to get fields values."
          className={Styles.fieldsContainer}
        >
          <div
            area-aria-label="field container to get Name"
            className={Styles.fieldItemBox}
          >
            <div
              area-aria-label="input to get value for Name"
              className={Styles.checklist_general_details_fieldValueTaker}
            >
              <ClonosInput
                label="Name"
                isLabel={true}
                placeholder="Name"
                isMandatory={true}
                type="text"
                limit='100'
                uniqueKey="name"
                defaultValue={state?.mode == "edit" && singleChecklistServerResponse?.name}
                handleGetValues={handleGetValues}
                handleGetErrorActivatorInformation={handleGetErrorActivatorInformation}
              />
            </div>
            {errors.name && <span className={Styles.error}>{errors.name}</span>}
          </div>
          <div
            area-aria-label="field container to get Description"
            className={Styles.fieldItemBox}
          >
            <div
              area-aria-label="textarea to get value for Description"
              className={Styles.checklist_general_details_fieldValueTaker}
            >
              <ClonosTextarea
                label="Description"
                isLabel={true}
                placeholder="Description"
                isMandatory={false}
                type="text"
                uniqueKey="description"
                defaultValue={state?.mode == "edit" && singleChecklistServerResponse?.description}
                handleGetValues={handleGetValues}
              />
            </div>
          </div>
          <div
            area-aria-label="field container to get Document Number"
            className={Styles.fieldItemBox}
          >
            <div
              area-aria-label="textarea to get value for Document Number"
              className={Styles.checklist_general_details_fieldValueTaker}
            >
              <ClonosInput
                label="Document Number"
                isLabel={true}
                placeholder="Document Number"
                isMandatory={false}
                type="text"
                uniqueKey="documentNumber"
                defaultValue={state?.mode == "edit" && singleChecklistServerResponse?.documentNumber}
                handleGetValues={handleGetValues}
                handleGetErrorActivatorInformation={handleGetErrorActivatorInformation}
              />
            </div>
          </div>
          <div
            onClick={() => setShowAssetLibrary(true)}
            area-aria-label="field container to get Document Number"
            className={Styles.fieldItemBox}
          >
            <DynamicDropdown
              title={"Asset"}
              labelActivator={"Asset Name"}
              isOpen={showAssetLibrary}
              uniqueKey={"assetId"}
              heading={"Select from Asset Library"}
              placeholder={"Search"}
              isSearchable={true}
              isCheckbox={false}
              isUser={true}
              isDynamicLoad={true}
              data={assetDropdownData}
              isActivator={true}
              isMandatory={true}
              url={SEARCHICON}
              defaultValue={state?.mode == "edit" && [{ "name": singleChecklistServerResponse?.asset?.assetName }]}
              handleMoreData={handleMoreData}
              handleGetValues={handleGetValues}
              handleGetErrorActivatorInformation={handleGetErrorActivatorInformation}
            />
          </div>
          <div
            area-aria-label="field container to get Type"
            className={Styles.fieldItemBox}
          >

            <ClonosSelect
              type="select"
              label="Type"
              isLabel={true}
              uniqueKey="type"
              placeholder="Select"
              options={typeDropdownData?.map((type) => ({
                label: type?.name,
                value: type?.id,
                isNeeded: true
              }))}
              defaultValue={state?.mode == "edit" && singleChecklistServerResponse?.type}
              handleGetValues={handleGetValues}
              handleGetErrorActivatorInformation={handleGetErrorActivatorInformation}
            />
          </div>
          <div
            area-aria-label="field container to get Team"
            className={Styles.fieldItemBox}
            onClick={() => setShowTeamsLibrary(true)}
          >
            <DynamicDropdown
              handleGetErrorMethods={() => { }}
              title={"Team"}
              uniqueKey={"team"}
              labelActivator={"Team Name"}
              heading={"Select from Team Library"}
              placeholder={"Search"}
              isSearchable={true}
              isCheckbox={false}
              isDynamicLoad={false}
              data={teamDropdownData}
              isActivator={true}
              isMandatory={true}
              url={SEARCHICON}
              defaultValue={state?.mode == "edit" && [{ "name": singleChecklistServerResponse?.team?.dropdownValues }]}
              handleMoreData={handleMoreData}
              handleGetValues={handleGetValues}
              handleGetErrorActivatorInformation={handleGetErrorActivatorInformation}
            />
          </div>
          <div
            area-aria-label="field container to get Assignee"
            className={Styles.fieldItemBox}
            onClick={() => setShowUsersLibrary(true)}
          >
            <DynamicDropdown
              handleGetErrorMethods={() => { }}
              title={"Assignee"}
              uniqueKey={"assignee"}
              labelActivator={"User Name"}
              isOpen={showUsersLibrary}
              isOpenMethod={setShowUsersLibrary}
              heading={"Select from Users Library"}
              placeholder={"Search"}
              isSearchable={true}
              isCheckbox={false}
              isUser={true}
              isDynamicLoad={false}
              data={usersDropdownData}
              isActivator={true}
              isMandatory={true}
              url={SEARCHICON}
              defaultValue={state?.mode == "edit" && [{ "name": singleChecklistServerResponse?.assignee?.name }]}
              handleMoreData={handleMoreData}
              handleGetValues={handleGetValues}
              handleGetErrorActivatorInformation={handleGetErrorActivatorInformation}

            />
          </div>
          <div>
            <div className={Styles.checklist_gen_details_horizontalFlexBox}>
              <div
                area-aria-label="field container to get start and end date"
                className={Styles.fieldItemBox}
              >
                <div
                  area-aria-label="to get value for end date"
                  className={Styles.checklist_general_details_fieldValueTaker}
                >
                  <ClonosInput
                    label="Start Date"
                    isLabel={true}
                    placeholder="Start Date"
                    isMandatory={true}
                    type="datetime-local"
                    min={globalHandleGetCurrentDateTime()}
                    uniqueKey="startDate"
                    defaultValue={state?.mode == "edit" && `${lcValues?.formatedStartDateServerResponse?.year}-${lcValues?.formatedStartDateServerResponse?.month}-${lcValues?.formatedStartDateServerResponse?.day}T${lcValues?.formatedStartDateServerResponse?.hours}:${lcValues?.formatedStartDateServerResponse?.minutes}`}
                    handleGetValues={handleGetValues}
                    handleGetErrorActivatorInformation={handleGetErrorActivatorInformation}
                  />
                </div>
                {errors.startDate && (
                  <span className={Styles.error}>{errors.startDate}</span>
                )}
              </div>
              <div
                area-aria-label="field container to get end date"
                className={Styles.fieldItemBox}
              >
                <div
                  area-aria-label="to get value for end date"
                  className={Styles.checklist_general_details_fieldValueTaker}
                >
                  <ClonosInput
                    label="End Date"
                    isLabel={true}
                    placeholder="End Date"
                    isMandatory={true}
                    type="datetime-local"
                    uniqueKey="endDate"
                    defaultValue={state?.mode == "edit" && `${lcValues?.formatedEndDateServerResponse?.year}-${lcValues?.formatedEndDateServerResponse?.month}-${lcValues?.formatedEndDateServerResponse?.day}T${lcValues?.formatedEndDateServerResponse?.hours}:${lcValues?.formatedEndDateServerResponse?.minutes}`}
                    min={globalHandleGetCurrentDateTime()}
                    handleGetValues={handleGetValues}
                    handleGetErrorActivatorInformation={handleGetErrorActivatorInformation}
                  />
                </div>
              </div>
            </div>
          </div>
          <div
            area-aria-label="field container to get Assignee"
            className={Styles.fieldItemBox}
          >
            <div
              area-aria-label="label for Field"
              className={Styles.checklist_general_details_label}
            >
              Is Recurring
            </div>
            <div
              area-aria-label="textarea to get value for Document Number"
              className={Styles.checklist_general_details_fieldValueTaker}
            >
              <FrequencySelector
                selectTagProps={{
                  isLabel: true,
                  label: "Frequency",
                  position: "top",
                  uniqueKey: "frequencyType",
                  options: frequencyDropdownData?.map((item) => {
                    return { "label": item?.name, "value": item?.id, "isNeeded": true }
                  }),
                  defaultValue: singleChecklistServerResponse?.frequencyType?.dropdownValues
                }}
                inputTagProps={{
                  isLabel: true,
                  label: "Every",
                  type: "number",
                  placeholder: "0",
                  maxLength: "2",
                  uniqueKey: "frequencyPeriod",
                  defaultValue: singleChecklistServerResponse?.frequencyPeriod
                }}
                handleGetValues={lcHandleFrequency}
                defaultValue={
                  {
                    isRecurring: singleChecklistServerResponse?.isRecurring,
                    isCustomFrequency: singleChecklistServerResponse?.frequencyPeriod ? true : false

                  }}
              />
            </div>
          </div>
        </div>
        <footer className={Styles.checklist_gen_details_footer}>
          <div>

            {
              mode !== "edit" && <>
                <ClonosButton
                  onClick={() => {
                    handleSaveChecklistGeneralDetails({ payload: formData, dispatch, Navigate, savingType: "draft" });
                  }}
                  isHollow={true}
                  style={{
                    color: "#06337E",
                    border: "1px solid #06337E",
                    fontSize: "16px",
                    padding: "0.5rem 1rem",
                  }}
                >Save as Draft
                </ClonosButton>
                <ClonosButton
                  onClick={() => {
                    let flag = false;
                    let count = 0;
                    for (let key in primaryObject) {
                      if (primaryObject[key].value == false) {
                        primaryObject[key]?.errorActivatorMethod(true)
                        count++
                      }
                    }
                    if (count === 0) flag = true
                    flag && handleSaveChecklistGeneralDetails({ payload: formData, dispatch, Navigate, savingType: "submitted" });
                  }}
                  style={{ fontSize: "16px", padding: "0.5rem 1rem" }}
                >
                  Continue
                </ClonosButton>
              </>
            }
            {
              mode == "edit" && <>
                <ClonosButton isHollow={true}
                  onClick={() => {
                    Navigate("/checklist-view", { state: { id: singleChecklistServerResponse?.id } })
                  }}
                >{lcValues?.isChecklistEdited ? "Go Back" : "Cancel"}
                </ClonosButton>
                <ClonosButton onClick={handleGoToEditTemplate}>Continue For Edit Template</ClonosButton>
                {!lcValues?.isChecklistEdited && <ClonosButton
                  onClick={() => {
                    handleEditChecklistGeneralDetails({ dispatch, payload: formData, checklistId: singleChecklistServerResponse?.id, responseSetterMethod: setLcValues })
                  }}
                  loading={lcValues?.editLoading}
                  style={{ fontSize: "16px", padding: "0.5rem 1rem" }}
                >Update
                </ClonosButton>}
              </>
            }
          </div>
        </footer >
      </div >
    </>
  );
};
