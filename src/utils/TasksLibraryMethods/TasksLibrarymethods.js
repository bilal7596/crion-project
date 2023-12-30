import { CreateTask, editTask, getTasksLibrary } from "../../Api/TasksLibrary/tasksLibraryAPI"
import { commonActions } from "../../Store/Reducers/CommonReducer";
import { handleLoginExpiry, handleShowErrorAndWarning } from "../clonosCommon";

export const CreateTaskMethod = async ({payload,Navigate,dispatch}) => {
    try {
        let validatedTasks = payload?.tasks?.filter((task) => task?.name);
        const temp_payload = {...payload,taskName:payload?.taskName,assetCategory:payload?.assetCategory?.id,tasks:validatedTasks}
        const response = await CreateTask(temp_payload);
        if(response?.data?.status == "201" || response?.data?.status == "200"){
            handleShowErrorAndWarning({ dispatch, type: "success", message: `Task Created successfully.`, showTime: 5000 })
            Navigate("/tasks-library");
        }
    } catch (err) {
        handleLoginExpiry(err, dispatch)
           if (err?.response?.data?.status !== 401) {
            handleShowErrorAndWarning({ dispatch, type: "error", message: `Something went wrong, Please try again.`, showTime: 5000 })
        }
    }
}

export const getTasksLibraryMethod = async ({dispatch,setMethod,}) => {
    try {
        let response = await getTasksLibrary();
        console.log(response,"res from method")
        if(response?.status == "200"){
            setMethod(response?.data?.result);
        }
    } catch (err) {
        handleLoginExpiry(err, dispatch)
           if (err?.response?.data?.status !== 401) {
            handleShowErrorAndWarning({ dispatch, type: "error", message: `Something went wrong!.`, showTime: 5000 })
        }
    }
}

export const editTaskMethod = async ({payload,Navigate,dispatch,taskId}) => {
    try {
        let validatedTasks = payload?.tasks?.filter((task) => task?.name);
        const temp_payload = {};
        console.log("temp_payload",taskId)
        temp_payload.taskId = taskId
        if(payload?.taskName) temp_payload.taskName = payload.taskName
        if(payload?.description) temp_payload.taskName = payload.description;
        if(payload?.assetCategory?.id) temp_payload.assetCategory = payload.assetCategory?.id;
        if(validatedTasks?.length > 0) temp_payload.tasks = payload.tasks;
        if(payload?.subtasksNeedToDelete?.length > 0) temp_payload.subtasksNeedToDelete = payload.subtasksNeedToDelete;
        const response = await editTask(temp_payload);
        if(response?.data?.status == "201" || response?.data?.status == "200"){
            handleShowErrorAndWarning({ dispatch, type: "success", message: `Task Edited successfully.`, showTime: 5000 })
            Navigate("/tasks-library");
        }
    } catch (err) {
        handleLoginExpiry(err, dispatch)
           if (err?.response?.data?.status !== 401) {
            handleShowErrorAndWarning({ dispatch, type: "error", message: `Something went wrong, Please try again.`, showTime: 5000 })
        }
    }
}