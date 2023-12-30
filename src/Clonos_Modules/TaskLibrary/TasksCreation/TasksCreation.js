import { memo } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import Styles from "../../../ModuleStyles/TasksLibrary/TasksCreation.module.css";
import { useNavigate, useLocation } from "react-router";
import ClonosInput from "../../../components/CommonComponents/ClonosInput/ClonosInput";
import ClonosSelect from "../../../components/CommonComponents/ClonosSelect/ClonosSelect";
import { ClonosButton } from "../../../components/CommonComponents/Button/Button";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import TASK_CREATION_REMOVEROW from "../../../assets/UIUX/icons/Checklist/circle-minus.svg";
import { CreateTaskMethod, editTaskMethod } from "../../../utils/TasksLibraryMethods/TasksLibrarymethods";
import { commonActions } from "../../../Store/Reducers/CommonReducer";
import { useEffect } from "react";
import { handleGetStaticDropdownValues } from "../../../utils/DropdownsMethods/DropdownsMethods";
import {
  handleShowErrorAndWarning,
  restrictSpecialCharacters,
} from "../../../utils/clonosCommon";
import ClonosConfirmationDialog from "../../../components/Dialogs/ClonosConfirmationDialog";
import { getSingleTask } from "../../../Api/TasksLibrary/tasksLibraryAPI";
import {
  handleEditAsset,
  handleGetValuesMethod,
  validateForm,
} from "../../../utils/AssetsMethods/AssetRegister";
let primaryObject = {};
const TasksCreation = ({ mode }) => {
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const Location = useLocation();
  let nonRenderable = {};
  const [formData, setFormData] = useState({});
  const [changedData, setChangedData] = useState({});
  const [errors,setErrors] = useState({})
  const [assetCategories, setAssetCategories] = useState([]);
  const [tasksList, setTasksList] = useState([]);
  const { mainLayoutChildrenPositionsToolkitState } = useSelector(
    (store) => store.globalEntitiesStateManagement
  );
  const [showConfirmationDailog, setShowConfirmationDailog] = useState(false);
  const handleChange = ({ value, name ,label}) => {
    const specialCharacters = `!"#$%&'()*+,./:;<=>?@[\\]^\`{|}~`;
      const newValue = restrictSpecialCharacters({
        value: value,
        specialCharacters,
      });
    let temp ;
    let changeIn; 
    setFormData((prev) => {
      temp = {
        ...prev,
        [name] : newValue
      };
      validateForm({name,formData:temp,setErrors,label})
      return temp
    })
    if(mode === "edit"){
      setChangedData((prevData) => {
        return {...prevData,[name]:newValue}
      } )
    }
  };
  const handleChangeParameters = (e, id) => {
    const { value } = e.target;
    const specialCharacters = `!"#$%&'()*+,./:;<=>?@[\\]^\`{|}~`;
    const newValue = restrictSpecialCharacters({ value, specialCharacters });
    let newTasks = formData?.tasks?.map((task) => {
      if (task?.id === id) {
        return {
          ...task,
          name: newValue,
        };
      } else {
        return task;
      }
    });
    setFormData((prev) => ({ ...prev, tasks: newTasks }));
    if (mode === "edit") {
      // setChangedData((prev) => ({ ...prev, tasks: newTasks }));
      formData?.tasks?.map((task) => {
        if (task?.id === id) {
          let temp =  {
            ...task,
            name: newValue,
          };
          setChangedData((prev) => {
            if(prev?.tasks?.length){
              let isTaskPresent = false;
             let updatedTasks =  prev?.tasks?.map((taskDetails) => {
                if(taskDetails?.id === id){
                        isTaskPresent = true
                        return {...task,name:newValue}
                      } else {
                        return taskDetails
                      }
              })
              if(!isTaskPresent){
                updatedTasks = [...updatedTasks,{...task,name:newValue}]
              }
              return {...prev,tasks:updatedTasks}
            } else {
              return {...prev,tasks:[{...task,name:newValue}]}
            }
            // let tempData = {
            //   ...prev,
            //   tasks : prev?.tasks?.length ? prev?.tasks?.map((task) => {
            //     if(task?.id === id){
            //       return {...task,name:newValue}
            //     } else {
            //       return task
            //     }
            //   }) : [{...task,name:newValue}]
            // }
            // return tempData
            // const existingTaskIndex = prev?.tasks?.findIndex((task) => task?.id === id) || -1;

            // if (existingTaskIndex !== -1) {
            //   // If the task with the ID exists, update it
            //   const updatedTasks = [...prev.tasks];
            //   updatedTasks[existingTaskIndex] = { ...updatedTasks[existingTaskIndex], name: newValue };

            //   return {
            //     ...prev,
            //     tasks: updatedTasks,
            //   };
            // } else {
            //   // If the task doesn't exist, add it to the tasks array
            //   return {
            //     ...prev,
            //     tasks: [...prev.tasks, { id: id, name: newValue }],
            //   };
            // }
          })
        }
      })
    }
  };
  const handleAddTasks = () => {
    let task = {
      id: uuidv4(),
      name: "",
      status: "Yet to Start",
    };
    setFormData((prev) => {
      let updatedTasks = Array.isArray(prev.tasks)
        ? [...prev.tasks, task]
        : [task];
      return { ...prev, tasks: updatedTasks };
    });
    if (mode === "edit") {
      setChangedData((prev) => {
        let updatedTasks = Array.isArray(prev.tasks)
          ? [...prev.tasks, task]
          : [task];
        return { ...prev, tasks: updatedTasks };
      });
    }
    setTasksList((prev) => [...prev, task]);
  };

  const handleRemoveTask = (task) => {
    if (mode === "edit") {
      if (task?._id) {
        let remainingTasks = formData?.tasks?.filter(
          (item) => item?.id !== task?.id
        );
        setFormData((prev) => {
          let temp = {
            ...prev,
            tasks: remainingTasks,
          };
          return temp;
        });
        setChangedData((prev) => {
          let tasksToDelete = Array.isArray(prev.subtasksNeedToDelete)
            ? [...prev?.subtasksNeedToDelete, task?._id]
            : [task?.id];
          return {
            ...prev,
            subtasksNeedToDelete: tasksToDelete,
          };
        });
      } else {
        let remainingTasks = formData?.tasks?.filter(
          (item) => item?.id !== task?.id
        );
        setFormData((prev) => {
          return { ...prev, tasks: remainingTasks };
        });
        setChangedData((prev) => {
          return { ...prev, tasks: remainingTasks };
        });
      }
    } else {
      let remainingTasks = formData?.tasks?.filter(
        (item) => item?.id !== task?.id
      );
      setFormData((prev) => {
        return { ...prev, tasks: remainingTasks };
      });
    }
  };
  const handleSubmit = (operationType) => {
    if (!formData?.taskName || !formData?.assetCategory?.name) {
      handleShowErrorAndWarning({
        dispatch,
        type: "error",
        message: "Please provide all required fields.",
      });
      const requiredFields = [{name:"taskName",label:"Task Name"}];
      requiredFields?.map((field) => {
        validateForm({name:field?.name,formData,setErrors,label:field?.label})
      })
      for(let key in primaryObject){
        primaryObject[key].errorActivatorMethod(true)
      }
    }  else {
      if(operationType === "edit"){
        console.log(changedData,"from edit method")
        editTaskMethod({ payload: changedData, Navigate, dispatch,taskId:formData?.taskId });
      }
      if(operationType === "create"){
        if (!formData?.tasks?.length) {
          handleShowErrorAndWarning({
            dispatch,
            type: "error",
            message: "Please add some tasks.",
          });
        } else {
          CreateTaskMethod({ payload: formData, Navigate, dispatch });
        }
      }
    }
  };
  const handleGetValues = (val) => {
    if(val?.type === "select"){
      let {uniqueKey} = val
      primaryObject = {
        ...primaryObject,
        [uniqueKey]: {
          ...primaryObject[uniqueKey],
          value: formData[uniqueKey] ? true : false,
        },
      };
    }
    handleGetValuesMethod({ val, setFormData,getChangedValues:setChangedData,changedData });
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

  const cancelTaskCreation = () => {
    setFormData({});
    setTasksList([]);
    setShowConfirmationDailog(false);
    Navigate(-1);
  };
  useEffect(() => {
    handleGetStaticDropdownValues({
      staticDropdownNameOrId: "AssetCategory",
      dispatch,
      setterFunctionForValues: setAssetCategories,
    });
  }, []);

  useEffect(() => {
    if (mode === "edit") {
      getSingleTask(Location?.state?.id).then((res) => {
        let data = res?.data?.result;
        console.log(data, "api res");
        let temp = {};
        temp.taskName = data?.taskName;
        temp.taskId = data?._id
        temp.description = data?.description;
        temp.assetCategory = data?.assetCategory;
        temp.tasks = data?.tasks?.map((task) => ({ ...task, id: task?._id }));
        setFormData(temp);
      });
    }
  }, [mode]);
  console.log(changedData, "changedData");
  console.log(primaryObject,"primaryObject")
  return (
    <>
      <div
        className={Styles.task_creation_container}
        style={{
          height:
            mainLayoutChildrenPositionsToolkitState?.viewPortUnit?.remainingPart
              ?.height,
        }}
      >
        <div className={Styles.task_creation_sub_container}>
          <div className={Styles.task_creation_inner_content}>
            <div className={Styles.task_creation_gen_details}>
              <div className={Styles.task_creation_gen_details_left}>
                <div className={Styles.task_creation_field_wrapper}>
                  <label>Task Name <sup style={{color:"red"}}>*</sup></label>
                  <div>
                    <input
                      placeholder="Name"
                      value={formData?.taskName}
                      onBlur={() =>
                        validateForm({
                          name: "taskName",
                          formData,
                          setErrors,
                          label: "Task Name",
                        })
                      }
                      onChange={(e) =>
                        handleChange({
                          value: e.target.value,
                          name: "taskName",
                          label:"Task Name"
                        })
                      }
                      maxLength={"250"}
                    />
                    {errors.taskName && (
                      <span className={Styles.error}>{errors.taskName}</span>
                    )}
                  </div>
                </div>
                <div>
                  <ClonosSelect
                    type={"select"}
                    options={assetCategories?.map((category) => ({
                      label: category?.name,
                      value: category?.id,
                      isNeeded: true,
                    }))}
                    isLabel={true}
                    label="Asset Category"
                    uniqueKey="assetCategory"
                    defaultValue={formData?.assetCategory?.name}
                    placeholder="Select"
                    isMandatory={true}
                    handleGetValues={(value) => handleGetValues(value)}
                    handleGetErrorActivatorInformation={(err) =>
                      handleFieldsError(err)
                    }
                    errorMessage={"Please Select Asset Category."}
                  />
                </div>
              </div>
              <div className={Styles.task_creation_gen_details_right}>
                <div>
                  <label>Description</label>
                  <textarea
                    maxLength={250}
                    value={formData?.description}
                    onChange={(e) =>
                      handleChange({
                        value: e.target.value,
                        name: "description",
                        label:"Description"
                      })
                    }
                    name="description"
                    placeholder="Description"
                  >
                  </textarea>
                </div>
              </div>
            </div>
            <div className={Styles.task_creation_list_container}>
              <div className={Styles.task_count_controller}>
                <ClonosButton
                  onClick={handleAddTasks}
                  isHollow={true}
                  style={{
                    color: "#0A5FFF",
                    border: "none",
                    fontSize: "16px",
                    fontWeight: "normal",
                  }}
                >
                  {"+ Add Task"}
                </ClonosButton>
              </div>
              <div className={Styles.task_list_wrapper}>
                {formData?.tasks?.length > 0 ? (
                  formData?.tasks?.map((task, index) => {
                    return (
                      <div
                        className={Styles.singe_task_item}
                        key={`task-${index + 1}`}
                      >
                        <div className={Styles.task_content_wrapper}>
                          <p>{`Task-${index + 1}`}</p>
                          <div className={Styles.input_wrapper}>
                            <input
                              value={task?.name}
                              onChange={(e) =>
                                handleChangeParameters(e, task?.id)
                              }
                              placeholder="Enter Task..."
                              maxLength={"250"}
                            />
                          </div>
                        </div>
                        <div onClick={() => handleRemoveTask(task)}>
                          <img src={TASK_CREATION_REMOVEROW} />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className={Styles.empty_list}>
                    <h2> Add Tasks to Create.</h2>
                  </div>
                )}
              </div>
            </div>
            <div className={Styles.btn_controller}>
              <div>
                <ClonosButton
                  p={"0.5rem 2rem"}
                  style={{
                    background: "#FFF",
                    color: "#06337E",
                    border: "none",
                  }}
                  onClick={() =>
                    Object.keys(formData)?.length
                      ? setShowConfirmationDailog(true)
                      : Navigate(-1)
                  }
                >
                  Cancel
                </ClonosButton>
                {mode === "edit" ? (
                  <ClonosButton p={"0.5rem 2rem"} onClick={() => handleSubmit("edit",changedData)}>
                    Edit
                  </ClonosButton>
                ) : (
                  <ClonosButton p={"0.5rem 2rem"} onClick={() => handleSubmit("create",formData)}>
                    Create
                  </ClonosButton>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ClonosConfirmationDialog
        Open={showConfirmationDailog}
        CloseDialog={() => setShowConfirmationDailog(false)}
        Title="Cancel"
        Content="Are you sure you want to cancel?"
        ProceedDialog={cancelTaskCreation}
      />
    </>
  );
};

export default memo(TasksCreation);
