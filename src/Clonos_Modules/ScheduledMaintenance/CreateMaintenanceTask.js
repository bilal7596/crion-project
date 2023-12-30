import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import Styles from "../../ModuleStyles/ScheduledMaintenance/CreateMaintenanceTask.module.css";
import { memo } from "react";
import SEARCHICON from "../../assets/UIUX/icons/search.svg";
import ClonosInput from "../../components/CommonComponents/ClonosInput/ClonosInput";
import DynamicDropdown from "../../components/CommonComponents/DynamicDropdown/DynamicDropdown";
import { useState } from "react";
import {
    handleGetAllPredefineTasksFromTaskLibrary,
  handleGetAssetDropdown,
  handleGetUsersDropdownData,
} from "../../utils/WorkOrderMethods/WorkOrderMethods";
import LabelSelectComp from "../../components/WorkOrder/LabelSelectComp";
import { useEffect } from "react";
import { handleGetStaticDropdownValues } from "../../utils/DropdownsMethods/DropdownsMethods";
import selectDownIcon from "../../assets/UIUX/icons/chevron-down.svg";
import LabelDateComp from "../../components/WorkOrder/LabelDateComp";
import { ClonosToggleButton } from "../../components/CommonComponents/ClonosToggleButton/ClonosToggleButton";
import ClonosSelect from "../../components/CommonComponents/ClonosSelect/ClonosSelect";
import UPSELECTOR from "../../assets/UIUX/icons/chevron-up-angle.svg";
import DOWNSELECTOR from "../../assets/UIUX/icons/chevron-down-angle.svg";
import {
  handleRepeatationNumber,
  showRepeatationFrequency,
} from "../../utils/ChecklistAndReportsMethods/ChecklistMethod";
import { handleShowErrorAndWarning, restrictSpecialCharacters, updateLayout } from "../../utils/clonosCommon";
import { v4 as uuidv4 } from "uuid";
import Modal from "../../components/CommonComponents/Modal/Modal";
import TaskLibraryDropdown from "../TaskLibrary/Components/TaskLibraryDropdown/TaskLibraryDropdown";
import { ClonosButton } from "../../components/CommonComponents/Button/Button";
import { handleGetValuesOfMaintenanceTaskMethod, saveAsDraftOrCreateMaintenanceTaskMethod } from "../../utils/ScheduleMaintenanceMethods/ScheduleMaintenanceMethods";
import FrequencySelector from "../../components/FrequencySelector/FrequencySelector";
import { useNavigate } from "react-router-dom";
let primaryObject = {};
const CreateMaintenanceTask = () => {
  const Navigate = useNavigate()
  const dispatch = useDispatch();
  const store = useSelector((store) => store);
  const [formData, setFormData] = useState({isRecurring:false});
  const [tasks, setTasks] = useState([]);
  const [taskLibraryData,setTaskLibraryData] = useState([])
  const [isCustomFrequency, setIsCustomFrequency] = useState(false);
  const [isLoading,setIsLoading] = useState(false)
  const [assetPaginationCurrentPage, setAssetPaginationCurrentPage] =
    useState(1);
  const [assetDropdownData, setAssetDropdownData] = useState(
    store?.assetData?.assetDropdownToolkitState
  );
  const [showAssetLibrary, setShowAssetLibrary] = useState(false);
  const [isTogglerOn, setIsTogglerOn] = useState(false);
  const [isAssigneeDropdownOpen, setIsAssigneeDropdownOpen] = useState(
    store?.userData?.allUsersDropdownToolkitState
  );
  const [departmentDropdownData,setDepartmentDropdownData] = useState([])
  const [priorityDropdownData, setPriorityDropdownData] = useState(
    store?.workOrderStateManagement?.workOrderPriorityDropdownToolkitState
  );
  const [frequencyDropdownData, setFrequencyDropdownData] = useState([]);
  const [isAddTaskFromTaskLibraryModal, setIsAddTaskFromTaskLibraryModal] =
    useState(false);
  let [teamDropdownData, setTeamDropdownData] = useState(
    store?.userData?.teamsDropdownToolkitState
  );
  let [usersDropdownData, setUsersDropdownData] = useState(
    store?.userData?.allUsersDropdownToolkitState
  );
  const { mainLayoutChildrenPositionsToolkitState } = useSelector(
    (store) => store.globalEntitiesStateManagement
  );

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

  const handleFieldErr = (err) => {
    console.log(err,"err from task")
      primaryObject = {
        ...primaryObject,
        [err.uniqueKey]: {
          ...err,
          value: formData[err.uniqueKey] ? true : false,
        },
      };
  };

  const handleGetValues = (val) => {
    console.log(val,"from....")
      let {type} = val;
      if(type === "text" || type === "select" || type === "dynamicDropdown" || type === "datetime-local"){
        let { uniqueKey } = val;
      primaryObject = {
        ...primaryObject,
        [uniqueKey]: { ...primaryObject[uniqueKey], value: true },
      };
      }
      console.log(val,"val from tsak")
    handleGetValuesOfMaintenanceTaskMethod({val,formData,setFormData,setTasks})
  };

  const handleAddSingleTask = () => {
    let task = {
      _id: uuidv4(),
      name: "",
      status: "Yet to Start",
    };
    setFormData((prev) => ({...prev,tasks: prev?.tasks?.length > 0 ? [...prev?.tasks,task] : [task]}))
  };
  const handleChangeTask = (e,id) => {
    const {value} = e.target;
    const specialCharacters = `!"#$%&'()*+,./:;<=>?@[\\]^\`{|}~`;
    const newValue = restrictSpecialCharacters({ value, specialCharacters });
    let updatedTasks = formData?.tasks?.map((task) => {
        if(task?._id === id){
            return {
                ...task,
                name:newValue
            }
        } else {
            return task
        }
    }) 
    setFormData((prev) => ({...prev,tasks:updatedTasks}))
  }

  const handleSaveAsDraftOrCreate = (status) => {
    console.log(formData,"frmdaata")
    if(formData?.maintenancePlanName && formData?.asset?.length && formData?.priority?.id && formData?.team?.length && formData?.assignee?.length && formData?.startDate && formData?.endDate){
        if(status === "draft") formData.status = status
        saveAsDraftOrCreateMaintenanceTaskMethod({formData,dispatch,setFormData,Navigate})
    } else {
        for(let key in primaryObject){
          primaryObject[key].errorActivatorMethod(true)
        }
        handleShowErrorAndWarning({ dispatch, type: "error", message: `Please provide all required fields`, showTime: 5000 })
    }
  }

  const handleGetFrequencyValues = (val) => {
    console.log(val)
    setFormData((prev) => {
      let {frequencyType,frequencyPeriod,isRecurring} = val?.updatedValue;
      return {
        ...prev,
        frequencyPeriod: frequencyPeriod || 1,
        frequencyType,
        isRecurring
      }
    })
  }


  useEffect(() => {
    // Update the layout based on dispatch action.
    updateLayout({ dispatch });
    // Fetch and update user dropdown data.
    handleGetUsersDropdownData({
      setUsersDropdownData,
      usersDropdownData,
      dispatch,
    });
    // Fetch and update asset dropdown data along with pagination information.
    handleGetAssetDropdown({
      setAssetDropdownData,
      assetDropdownData,
      assetPaginationCurrentPage,
      dispatch,
    });
    // Fetch and update static dropdown values for Work Order Priority.
    handleGetStaticDropdownValues({
      staticDropdownNameOrId: "WorkOrderPriority",
      dispatch,
      setterFunctionForValues: setPriorityDropdownData,
    });
     // Fetch and update static dropdown values for Frequency
    handleGetStaticDropdownValues({
      staticDropdownNameOrId: "Frequency",
      dispatch,
      setterFunctionForValues: setFrequencyDropdownData,
    });
    // Fetch and update static dropdown values for Team.
    handleGetStaticDropdownValues({
      staticDropdownNameOrId: "Team",
      dispatch,
      setterFunctionForValues: setTeamDropdownData,
    });
    handleGetStaticDropdownValues({
      staticDropdownNameOrId: "AssetDepartment",
      dispatch,
      setterFunctionForValues: setDepartmentDropdownData,
    });
    // Fetch all the predefine tasks from the task library.
    handleGetAllPredefineTasksFromTaskLibrary({ dispatch, locallyResponseSetterMethod: setTaskLibraryData ,Navigate})
  }, []);
  console.log(primaryObject, "primaryObject");
  console.log(formData,"formData from task")
  return (
    <div
      className={Styles.s_m_container}
      style={{
        height:
          mainLayoutChildrenPositionsToolkitState?.viewPortUnit?.remainingPart
            ?.height,
      }}
    >
      <div className={Styles.s_m_sub_container}>
        <div className={Styles.s_m_content_wrapper}>
          <div className={Styles.s_m_content_wrapper_left}>
            <div className={Styles.s_m_fieldItem}>
              <ClonosInput
                style={{ width: "100%" }}
                isLabel={true}  
                label="Maintenance Plan Name"
                isMandatory={true}
                placeholder={"Plan Name"}
                type={"text"}
                uniqueKey={"maintenancePlanName"}
                // defaultValue={""}
                handleGetValues={(value) => handleGetValues(value)}
                handleGetErrorActivatorInformation={(err) => handleFieldErr(err)}
              />
            </div>
            <div className={Styles.s_m_fieldItem}>
              <ClonosInput
                style={{ width: "100%" }}
                isLabel={true}
                label="Description"
                isMandatory={false}
                placeholder={"Description"}
                type={"text"}
                uniqueKey={"description"}
                // defaultValue={""}
                handleGetValues={(value) => handleGetValues(value)}
                handleGetErrorActivatorInformation={(err) => handleFieldErr(err)}
              />
            </div>
            <div className={Styles.s_m_fieldItem}>
              <DynamicDropdown
                title={"asset"}
                labelActivator={"Asset Name"}
                uniqueKey="asset"
                isOpen={showAssetLibrary}
                isOpenMethod={setShowAssetLibrary}
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
                handleMoreData={handleMoreData}
                handleGetValues={(value) => handleGetValues(value)}
                errorMessage={"Asset is Required!"}
                handleGetErrorActivatorInformation={(err) => handleFieldErr(err)}
              />
            </div>
            <div className={Styles.s_m_fieldItem}>
              <ClonosSelect
                options={priorityDropdownData?.map((priority) => ({
                  label: priority?.name,
                  value: priority?.id,
                  isNeeded: true,
                }))}
                type={"select"}
                isLabel={true}
                label="Priority"
                uniqueKey="priority"
                // defaultValue={formData?.frequency?.name || ""}
                placeholder="Select"
                isMandatory={true}
                errorMessage={"Priority ir required!."}
                handleGetErrorActivatorInformation={(err) => handleFieldErr(err)}
                handleGetValues={(value) => handleGetValues(value)}
              />
            </div>
            <div className={Styles.s_m_fieldItem}>
              <ClonosSelect
                options={departmentDropdownData?.map((dept) => ({
                  label: dept?.name,
                  value: dept?.id,
                  isNeeded: true,
                }))}
                type={"select"}
                isLabel={true}
                label="Department"
                uniqueKey="department"
                // defaultValue={formData?.frequency?.name || ""}
                placeholder="Select"
                isMandatory={true}
                errorMessage={"Department is required!."}
                handleGetErrorActivatorInformation={(err) => handleFieldErr(err)}
                handleGetValues={(value) => handleGetValues(value)}
              />
            </div>
            <div className={Styles.s_m_fieldItem}>
              <DynamicDropdown
                title={"Team"}
                uniqueKey="team"
                labelActivator={"Team Name"}
                heading={"Select from Team Library"}
                placeholder={"Search"}
                isSearchable={true}
                isCheckbox={true}
                isDynamicLoad={false}
                data={teamDropdownData}
                isActivator={true}
                isMandatory={true}
                url={SEARCHICON}
                handleMoreData={handleMoreData}
                errorMessage={"Team is Required!"}
                handleGetErrorActivatorInformation={(err) => handleFieldErr(err)}
                handleGetValues={(value) => handleGetValues(value)}
              />
            </div>
            <div className={Styles.s_m_fieldItem}>
              <DynamicDropdown
                title={"Assignee"}
                uniqueKey="assignee"
                labelActivator={"User Name"}
                isOpen={isAssigneeDropdownOpen}
                isOpenMethod={setIsAssigneeDropdownOpen}
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
                handleMoreData={handleMoreData}
                handleGetValues={(value) => handleGetValues(value)}
                errorMessage={"Assigneee is Required!"}
                handleGetErrorActivatorInformation={(err) => handleFieldErr(err)}
              />
            </div>
            <div className={Styles.s_m_fieldItem}>
              <div className={Styles.s_m_dates_wrapper}>
                <div className={Styles.s_m_dates_wrapper_left}>
                  <ClonosInput
                    style={{ width: "100%" }}
                    isLabel={true}
                    label="Start Date"
                    isMandatory={true}
                    placeholder="DD/MM/YYYY"
                    type={"datetime-local"}
                    uniqueKey={"startDate"}
                    // defaultValue={formData?.startDate}
                    handleGetValues={(value) => handleGetValues(value)}
                    handleGetErrorActivatorInformation={(err) => handleFieldErr(err)}
                  />
                </div>
                <div className={Styles.s_m_dates_wrapper_right}>
                  <ClonosInput
                    type={"datetime-local"}
                    style={{ width: "100%" }}
                    isLabel={true}
                    label="End Date"
                    uniqueKey="endDate"
                    // defaultValue={formData?.endDate}
                    placeholder="DD/MM/YYYY"
                    isMandatory={true}
                    handleGetValues={(value) => handleGetValues(value)}
                    handleGetErrorActivatorInformation={(err) => handleFieldErr(err)}
                  />
                </div>
              </div>
            </div>
            <div className={Styles.s_m_fieldItem}>
              {/* <div className={Styles.toggler_wrapper}>
                <label className={Styles.s_m_frequency_label}>
                  Is Recurring
                </label>
                <ClonosToggleButton
                  isOn={isTogglerOn}
                  turnOffMethod={setIsTogglerOn}
                  setFormData={setFormData}
                />
              </div>
              {isTogglerOn && (
                <div>
                  <div className={Styles.s_m_frequency_wrapper}>
                    <div
                      area-aria-label="field container to get Frequency"
                      className={Styles.fieldItemBox}
                    >
                      <ClonosSelect
                        options={frequencyDropdownData?.map((time) => ({
                          label: time?.name,
                          value: time?.id,
                          isNeeded: true,
                        }))}
                        isLabel={true}
                        type={"select"}
                        label="Frequency"
                        uniqueKey="frequency"
                        // defaultValue={formData?.frequency?.name || ""}
                        placeholder="Select"
                        isMandatory={false}
                        handleGetValues={(value) => handleGetValues(value)}
                      />
                    </div>
                    {isCustomFrequency && (
                      <div
                        area-aria-label="field container to get Repeatation"
                        className={Styles.repeatation_wrapper}
                      >
                        <div
                          area-aria-label="label for Field"
                          className={Styles.s_m_frequency_label}
                        >
                          Every
                        </div>
                        <div
                          area-aria-label="to get value for repeatation number"
                          className={Styles.s_m_fieldValueTaker}
                        >
                          <div className={Styles.durrationContainer}>
                            <div className={Styles.custom_input_container}>
                              <input
                                onChange={(e) =>
                                  handleRepeatationNumber({
                                    count: e.target.value,
                                    formData,
                                    setFormData,
                                  })
                                }
                                value={formData?.frequencyPeriod}
                                type="number"
                                placeholder="0"
                                maxLength={2}
                              />
                              <div className={Styles.count_selector}>
                                <span
                                  onClick={() =>
                                    handleRepeatationNumber({
                                      count: -1,
                                      formData,
                                      setFormData,
                                    })
                                  }
                                >
                                  <img height={20} src={UPSELECTOR} />
                                </span>
                                <span
                                  onClick={() =>
                                    handleRepeatationNumber({
                                      count: 1,
                                      formData,
                                      setFormData,
                                    })
                                  }
                                >
                                  <img height={20} src={DOWNSELECTOR} />
                                </span>
                              </div>
                            </div>
                            <p className={Styles.s_m_durrationText}>
                              {showRepeatationFrequency(formData)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className={Styles.s_m_custome_frequency_taker}>
                    <input
                      onChange={() => setIsCustomFrequency(!isCustomFrequency)}
                      type="checkbox"
                    />
                    <label className={Styles.s_m_frequency_label}>Custom</label>
                  </div>
                </div>
              )} */}
              <FrequencySelector  handleGetValues={(val) => handleGetFrequencyValues(val)} selectTagProps={{
                  isLabel: true,
                  label: "Frequency",
                  position: "top",
                  uniqueKey: "frequencyType",
                  options: frequencyDropdownData?.map((item) => {
                    return { "label": item?.name, "value": item?.id, "isNeeded": true }
                  })
                }}
                inputTagProps={{
                  isLabel: true,
                  label: "Every",
                  type: "number",
                  placeholder: "0",
                  maxLength: "2",
                  uniqueKey: "frequencyPeriod",
                }}/>
            </div>
          </div>
          <div className={Styles.s_m_content_wrapper_right}>
            <div className={Styles.s_m_tasks_container}>
              <div className={Styles.s_m_tasks_container_header}>
                <p>
                  Add step-by-step procedures, safety precautions, required
                  tools or equipment, and any additional documentation or
                  references
                </p>
                <div>
                  <h4 onClick={() => setIsAddTaskFromTaskLibraryModal(true)}>Add from Task Library</h4>
                  <h4 onClick={handleAddSingleTask}>{`+ Add Task`}</h4>
                </div>
              </div>
              <div className={Styles.tasks_wrapper}>
                {formData?.tasks?.length > 0 ? (
                  formData?.tasks?.map((task, index) => {
                    return (
                      <div
                        key={task?._id}
                        className={Styles.single_task_wrapper}
                      >
                        <p>{`Task-${index + 1}`}</p>
                        <input value={task?.name} placeholder="Enter Task..." onChange={(e) => handleChangeTask(e,task?._id)}/>
                      </div>
                    );
                  })
                ) : (
                  <div></div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className={Styles.s_m_btn_controllers}>
            <div>
                <ClonosButton isHollow={true} p={"0.5rem 2rem"} style={{color:"#3f51b5"}} onClick={() => handleSaveAsDraftOrCreate("draft")}>Save As Draft</ClonosButton>
                <ClonosButton p={"0.5rem 2rem"} onClick={() => handleSaveAsDraftOrCreate("scheduled")} >Submit</ClonosButton>
            </div>
        </div>
      </div>
      <Modal
        isOpen={isAddTaskFromTaskLibraryModal}
        closeModalMethod={setIsAddTaskFromTaskLibraryModal}
      >
        <TaskLibraryDropdown
          data={taskLibraryData}
          closeModalMethod={setIsAddTaskFromTaskLibraryModal}
          uniqueKey={"predefineTasks"}
          handleGetValues={(value) => handleGetValues(value)}
          type={"taskLibrary"}
        />
      </Modal>
    </div>
  );
};

export default memo(CreateMaintenanceTask);



// scm-6583483ab72b3b0001f1c08e