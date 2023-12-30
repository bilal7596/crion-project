import { getAssetDropdown, getAssetDropdownAPI } from "../../Api/Asset/assetApi"
import { getAllUsersDropdownAPI, teamsDropdownAPI, usersDropdownAPI } from "../../Api/User/UserApi"
import { addWorkOrderRemarkAPI, createWorkOrderAPI, createWorkOrderRemarkAPI, deleteMultipleWorkOrderAPI, deleteWorkOrderAPI, deleteWorkOrderDocumentAPI, deleteWorkOrderTaskAPI, editWorkOrderAPI, editWorkOrderTaskAPI, extendingDueDateRequestsAPI, getAllExtendDueDateRequestsAPI, getSingleWorkOrderAPI, getWorkOrderAPI, getWorkOrderBasedOnAssetIdAPI, getWorkOrderPriorityDropdownAPI, getWorkOrderRemarkAPI, getWorkOrderStatusDropdownAPI, getWorkOrderViewImageAPI, requestToExtendDueDateAPI, updateWorkOrderStatusAPI, workOrderFilterAPI } from "../../Api/WorkOrder/WorkOrderApi"
import { postAuditLog } from "../../Api/User/UserApi";
import { commonActions } from "../../Store/Reducers/CommonReducer";
import { exportInformation, fileToBinaryData, handleDecryptData, handleEncryptionURLKeys, handleGetENVVariables, handleLoggedInUser, handleLoginExpiry, handleRedirectAfterEvent, handleShowErrorAndWarning } from "../clonosCommon";
import { assetActions } from "../../Store/Reducers/ClonosAssetReducer"
import { userActions } from "../../Store/Reducers/ClonosUserReducer"
import { workOrderStateManagementActions } from "../../Store/Reducers/ClonosWorkOrderReducer";
import { getAllTasksAPI } from "../../Api/TaskLibrary/TaskLibrary";

/**
 * Handle the submission of form values for creating or editing a work order.
 *
 * @param {Object} options - An object containing various parameters and data.
 * @property {Object} formValues - The form input values for the work order.
 * @property {Array} inputSubtastLength - An array of subtask names.
 * @property {Object} formValidation - Form validation data.
 * @property {function} dispatch - A function to dispatch actions (e.g., Redux dispatch).
 * @property {Object} commonActions - Actions related to common functionality.
 * @property {boolean} isEditable - Indicates if the form is for editing an existing work order.
 * @property {string} status - The status of the work order.
 * @property {function} navigate - A function for navigation (e.g., React Router navigation).
 */
export const handleSubmitFormValues = async ({ formValues, inputSubtastLength, formValidation, dispatch, isEditable, status, navigate }) => {
    console.log('formValues:', formValues)
    if (!isEditable) {
        // Check if the function is called for creating a new work order (not editing).
        let isValidated = true
        for (let key in formValidation) {
            let element = formValidation[key]
            console.log('element.value:', element.value)
            if ((element.value == undefined || element?.value == "") && element.isMandatory) {
                element.method(true)
                isValidated = false
            }
        }

        if (!isValidated) {
            // If form validation fails, show an error message and return.
            handleShowErrorAndWarning({ dispatch, type: "error", "message": "You have to fill all fields", "showTime": 1000 })
            return
        }
    }

    // Extract form values for different fields.
    let {
        asset,
        department,
        description,
        documents,
        endDate,
        estimationDays,
        hours,
        priority,
        startDate,
        team,
        title,
        assignee,
        predefineTasks
    } = formValues

    // Retrieve the logged-in user information.
    let loggedInUser = JSON.parse(localStorage.getItem("loginUser"))
    let formData = new FormData()

    // Map subtask names to the required format.
    inputSubtastLength = inputSubtastLength.map((ele) => {
        return { woTaskName: ele }
    })

    // Map "predifine tasks from task library to the required format" 
    predefineTasks = predefineTasks && predefineTasks?.map((ele) => {
        return { woTaskName: ele.name }
    })

    if (predefineTasks == undefined || predefineTasks == null) predefineTasks = []


    // Append uploaded documents to the form data.
    documents?.forEach((file, index) => {
        formData.append(`file${index + 1}`, file);
    });

    // Append various form fields to the form data.
    title && formData.append('title', title)
    hours && formData.append('hours', hours)
    department && formData.append('department', JSON.stringify(department))
    assignee && formData.append('assignee', JSON.stringify(assignee))
    endDate && formData.append('endDate', endDate) // Corrected 'endDate' field name.
    description && formData.append('description', description)
    asset && formData.append('asset', JSON.stringify(asset[0]))
    startDate && formData.append('startDate', startDate)
    estimationDays && formData.append('estimationDays', estimationDays)
    team && formData.append('team', JSON.stringify(team))
    formData.append('createdBy', loggedInUser.userId)
    formData.append('status', status)
    inputSubtastLength[0]?.woTaskName.length > 0 && formData.append("tasks", JSON.stringify([...inputSubtastLength, ...predefineTasks]))
    priority && formData.append("priority", JSON.stringify(priority))
    documents && formData.append('noOfFiles', documents?.length)

    try {
        // Make an API request to create a new work order with the provided form data.
        let response = await createWorkOrderAPI(formData);
        console.log('response:', response)
        if (response.status == "200" || response.status == "201") {
            // If the request is successful, show a success message and redirect to the work order list.
            dispatch(commonActions.handleSnackbar({
                show: true,
                message: `Work Order Created.`,
                type: "success",
            }))
            let interval = handleRedirectAfterEvent({ targetRoute: "/work-order-list", timeout: 1000, navigate })
            // clearInterval(interval)
        }
        else {
            // If there is an issue with the request, show an error message.
            dispatch(commonActions.handleSnackbar({
                show: true,
                message: `Something Went Wrong!`,
                type: "error",
            }))
        }
    } catch (err) {
        // Handle errors, including login expiration and display error messages.
        handleLoginExpiry(err, dispatch)
        if (err?.response?.data?.status !== 401) {
            dispatch(
                commonActions.handleSnackbar({
                    show: true,
                    message: `${err.response.data.message}`,
                    type: "error",
                })
            );
            const error = err.response.data.error;
            postAuditLog({ action: "Work Order Created", message: error });
        }
    }
}



export const handleGetWorkOrder = async ({ dispatch, assetId }) => {
    console.log('assetId:', assetId)
    let loggedInUser = JSON.parse(localStorage.getItem("loginUser"))
    try {
        let response = await getWorkOrderAPI({ offset: 0, payload: {}, assetId })
        console.log('responselist:', response)
        // Roles and Permission Check
        let workOrders = response?.data?.result?.workOrders;
        console.log('workOrders:', workOrders)
        let filteredResponse = workOrders?.filter((ele) => {
            let assignee = ele?.assignee && ele.assignee.length > 0 ? ele.assignee[0].id : null;
            if (loggedInUser.role_id == "001" || loggedInUser.role_id == "002" || loggedInUser.role_id == "066") {
                return ele
            }
            else if (loggedInUser.userId === ele?.createdBy && loggedInUser.role_id == "086") {
                return ele
            }
            else if (loggedInUser.role_id == "076" && (ele.status == "Accepted" || ele.status == "Scheduled" || ele.status == "On Hold" || ele.status == "Completed" || ele.status == "Expired") && assignee == loggedInUser.userId) {
                return ele
            }
        })
        console.log('filteredResponse:', filteredResponse)
        dispatch(workOrderStateManagementActions.setWorkOrderMethod(filteredResponse))

        // NOTE USEFUL CODE 
        // let pageCalculation = null
        // if (loggedInUser.role_id == "076") {
        //     setTotalWorkOrder(filteredResponse.length)
        //     pageCalculation = Math.ceil(filteredResponse.length / 6)
        // } else {
        //     setTotalWorkOrder(response?.data?.count)
        //     pageCalculation = Math.ceil(response?.data?.count / 6)
        // }
        // setCurrentPage(pageCalculation < currentPage ? pageCalculation : currentPage)
    }
    catch (err) {
        // Handle errors, including login expiration and display error messages.
        console.log(err, "******")
        handleLoginExpiry(err, dispatch)
        if (err?.response?.data?.status !== 401) {
            dispatch(
                commonActions.handleSnackbar({
                    show: true,
                    message: `${err.response.data.message}`,
                    type: "error",
                })
            );
            const error = err.response.data.error;
            postAuditLog({ action: "Get All Work Order", message: error });
        }
    }
}





/**
 * Fetches details of a single work order using the provided workOrderId and updates the state.
 *
 * @param {object} object - The function's input properties.
 * @property {function} dispatch - A function for dispatching actions in a state management system (e.g., Redux).
 * @property {string} workOrderId - The unique identifier of the work order to retrieve.
 * @property {object} workOrderStateManagementActions - Action creators for work order state management.
 */
export const handleGetSingleWorkOrder = async ({ dispatch, workOrderId }) => {
    try {



        // Fetch the single work order details from the API
        let response = await getSingleWorkOrderAPI(workOrderId);
        console.log('response:', response);
        console.log('single work order:', response);

        // Extract the work order details from the API response
        let woDetails = response?.data?.result;
        console.log('woDetails:', woDetails);

        // Check if work order details are available
        if (Object.keys(woDetails).length > 0) {
            // Prepare a payload for updating the work order state
            let payload = {
                ["workOrderDocuments"]: woDetails?.documents,
                ["workOrderTasks"]: woDetails?.tasks,
                ["workOrderDetails"]: woDetails
            };

            // Dispatch an action to update the state with the fetched work order details
            dispatch(workOrderStateManagementActions.setSingleWorkOrderMethod(payload));
        }
    } catch (err) {
        // Handle errors, including potential login expiration
        handleLoginExpiry(err, dispatch);

        // Show an error message in the user interface if the error is not related to authentication
        if (err?.response?.data?.status !== 401) {
            dispatch(
                commonActions.handleSnackbar({
                    show: true,
                    message: `${err.response.data.message}`,
                    type: "error",
                })
            );

            // Log the error in an audit log
            const error = err.response.data.error;
            postAuditLog({ action: "Get Single Work Order", message: error });
        }
    }
}

/**
 * 
 * @param {dispatch} param0: This will help to dispatch some nessessary actions after successful operation 
 * @param {isMultipleDelete} param1: This key will be one Boolean value, and it will be take care that which type of delete operation you are following. Example (Multiple or Single delete).
 */
export const handleDeleteWorkOrder = async ({ workOrderId, dispatch, isMultipleDelete, payload, setIsEdit, navigate }) => {

    // dispatch(commonActions.showApiLoader(true));
    try {
        let response = isMultipleDelete ? await deleteMultipleWorkOrderAPI({ payload }) : await deleteWorkOrderAPI(workOrderId)
        if (response?.status == 200 || response?.status == 201) {

            dispatch(commonActions.handleSnackbar({
                show: true,
                message: `${isMultipleDelete ? "Work Orders" : "Work Order"} Deleted Successfully.`,
                type: "success",
            }))
            if (isMultipleDelete) {
                setIsEdit(false)
                handleGetWorkOrder({ dispatch })
                dispatch(commonActions.showApiLoader(false));
            } else {
                handleRedirectAfterEvent({ targetRoute: -1, navigate, timeout: 1000 })
                dispatch(commonActions.showApiLoader(false));
            }
        } else {
            dispatch(commonActions.handleSnackbar({
                show: true,
                message: `Something went wrong!`,
                type: "error",
            }))
            dispatch(commonActions.showApiLoader(false));
        }
    } catch (err) {
        if (err?.response?.data?.status === 401 && handleLoggedInUser() !== null) {
            handleLoginExpiry(err, dispatch)
        } else {
            if (err.response) {
                dispatch(
                    commonActions.handleSnackbar({
                        show: true,
                        message: `${err.response.data.message}`,
                        type: "error",
                    })
                );
                const error = err.response.data.error;
                postAuditLog({ action: "Document Create", message: error });
            }
        }
        dispatch(commonActions.showApiLoader(false));
    }
}

export const handleDeleteWorkOrderTask = async ({ workOrderTaskIds, dispatch }) => {
    console.log('workOrderTaskIds:', workOrderTaskIds)
    try {
        let response = await deleteWorkOrderTaskAPI({ payload: workOrderTaskIds })
        console.log('responseDelete:', response)
        if (response.status == "200" || response.status == "201") {
            dispatch(commonActions.handleSnackbar({
                show: true,
                message: `Work Order Task Deleted.`,
                type: "success",
            }))
        }
        else {
            dispatch(commonActions.handleSnackbar({
                show: true,
                message: `Something Went Wrong!.`,
                type: "error",
            }))
        }
    } catch (err) {
        if (err?.response?.data?.status === 401 && handleLoggedInUser() !== null) {
            handleLoginExpiry(err, dispatch)
        } else {
            if (err.response) {
                dispatch(
                    commonActions.handleSnackbar({
                        show: true,
                        message: `${err.response.data.message}`,
                        type: "error",
                    })
                );
                const error = err.response.data.error;
                postAuditLog({ action: "Work Order Task Delete.", message: error });
            }
        }
        dispatch(commonActions.showApiLoader(false));
    }
}
export const handleEditWorkOrderTask = async ({ workOrderTasks, dispatch }) => {
    try {
        let response = await editWorkOrderTaskAPI({ payload: workOrderTasks })
        console.log('responseDelete:', response)
        if (response.status == "200" || response.status == "201") {
            dispatch(commonActions.handleSnackbar({
                show: true,
                message: `Work Order Task Edited.`,
                type: "success",
            }))
        }
        else {
            dispatch(commonActions.handleSnackbar({
                show: true,
                message: `Something Went Wrong!.`,
                type: "error",
            }))
        }
    } catch (err) {
        if (err?.response?.data?.status === 401 && handleLoggedInUser() !== null) {
            handleLoginExpiry(err, dispatch)
        } else {
            if (err.response) {
                dispatch(
                    commonActions.handleSnackbar({
                        show: true,
                        message: `${err.response.data.message}`,
                        type: "error",
                    })
                );
                const error = err.response.data.error;
                postAuditLog({ action: "Work Order Task Delete.", message: error });
            }
        }
        dispatch(commonActions.showApiLoader(false));
    }
}

// export const handleEditWorkOrderTask = async ({ workOrderTaskIds, dispatch }) => {
//     try {
//         let response = await deleteWorkOrderDocumentAPI(workOrderDocumentIds);
//         console.log('responseDoc:', response)
//     } catch (err) {

//     }
// }

/**
 * Deletes one or more work order documents by their unique identifiers.
 *
 * @param {object} props - The function's input properties.
 * @param {array} props.workOrderDocumentIds - The unique identifiers of the work order documents to delete.
 * @param {function} props.dispatch - The dispatch function used for state management.
 */
export const handleDeleteWorkOrderDocument = async ({ workOrderDocumentIds, dispatch }) => {
    try {
        // Attempt to delete the work order documents using the API.
        let response = await deleteWorkOrderDocumentAPI(workOrderDocumentIds);
        console.log('responseDoc:', response)

        // Check the API response status and show appropriate notifications.
        if (response.status == "200" || response.status == "201") {
            dispatch(commonActions.handleSnackbar({
                show: true,
                message: `Work Order Document Deleted.`,
                type: "success",
            }));
        } else {
            dispatch(commonActions.handleSnackbar({
                show: true,
                message: `Something Went Wrong!.`,
                type: "error",
            }));
        }
    } catch (err) {
        // Handle errors, including login expiration and display error messages.
        handleLoginExpiry(err, dispatch)
        if (err?.response?.data?.status !== 401) {
            dispatch(
                commonActions.handleSnackbar({
                    show: true,
                    message: `${err.response.data.message}`,
                    type: "error",
                })
            );
            const error = err.response.data.error;
            postAuditLog({ action: "Work Order Documents Deleted", message: error });
        }
    }
}

export const handleSubmitForEditWorkOrder = async ({ workOrderId, formValues, inputSubtastLength, formValidation, dispatch, isEditable, status, navigate }) => {

    if (!isEditable && status !== "Draft") {
        // Check if the function is called for creating a new work order (not editing).
        let isValidated = true
        for (let key in formValidation) {
            let element = formValidation[key]
            console.log('element.value:', element.value)
            if ((element.value == undefined || element?.value == "") && element.isMandatory) {
                element.method(true)
                isValidated = false
            }
        }

        if (!isValidated) {
            // If form validation fails, show an error message and return.
            handleShowErrorAndWarning({ dispatch, type: "error", "message": "You have to fill all fields", "showTime": 1000 })
            return
        }
    }

    // Extract form values for different fields.
    const {
        asset,
        department,
        description,
        documents,
        endDate,
        estimationDays,
        hours,
        priority,
        startDate,
        team,
        title,
        assignee
    } = formValues

    // Retrieve the logged-in user information.
    let loggedInUser = JSON.parse(localStorage.getItem("loginUser"))
    let formData = new FormData()

    // Map subtask names to the required format.
    inputSubtastLength = inputSubtastLength.map((ele) => {
        return { woTaskName: ele }
    })

    // Append uploaded documents to the form data.
    documents?.forEach((file, index) => {
        formData.append(`file${index + 1}`, file);
    });

    // Append various form fields to the form data.
    title && formData.append('title', title)
    hours && formData.append('hours', hours)
    department && formData.append('department', JSON.stringify(department))
    assignee && formData.append('assignee', JSON.stringify(assignee))
    endDate && formData.append('endDate', endDate) // Corrected 'endDate' field name.
    description && formData.append('description', description)
    asset && formData.append('asset', JSON.stringify(asset[0]))
    startDate && formData.append('startDate', startDate)
    estimationDays && formData.append('estimationDays', estimationDays)
    team && formData.append('team', JSON.stringify(team))
    formData.append('createdBy', loggedInUser.userId)
    formData.append('status', status)
    inputSubtastLength[0]?.woTaskName.length > 0 && formData.append("tasks", JSON.stringify(inputSubtastLength))
    priority && formData.append("priority", JSON.stringify(priority))
    documents && formData.append('noOfFiles', documents?.length)

    try {
        // Make an API request to create a new work order with the provided form data.
        let response = await editWorkOrderAPI({ workOrderId, formData });
        console.log('response:', response)
        if (response.status == "200" || response.status == "201") {
            // If the request is successful, show a success message and redirect to the work order list.
            dispatch(commonActions.handleSnackbar({
                show: true,
                message: `Work Order Edited.`,
                type: "success",
            }))
            let interval = handleRedirectAfterEvent({ targetRoute: -1, timeout: 1000, navigate })
            // clearInterval(interval)
        }
        else {
            // If there is an issue with the request, show an error message.
            dispatch(commonActions.handleSnackbar({
                show: true,
                message: `Something Went Wrong!`,
                type: "error",
            }))
        }
    } catch (err) {
        handleLoginExpiry(err, dispatch)
        if (err?.response?.data?.status !== 401) {
            dispatch(
                commonActions.handleSnackbar({
                    show: true,
                    message: `${err.response.data.message}`,
                    type: "error",
                })
            );
            const error = err.response.data.error;
            postAuditLog({ action: "Work Order Created", message: error });
        }
    }
}


export const handleGetUsersDropdownData = async ({ setUsersDropdownData, usersDropdownData, dispatch }) => {
    try {
        const response = await getAllUsersDropdownAPI()
        console.log('usersResponse:', response)
        if (response?.status == 200) {
            let data = response?.data?.result
            setUsersDropdownData(data)
            dispatch(userActions.setUsersDropdownMethod(data))
        } else {
            dispatch(commonActions.handleSnackbar({
                show: true,
                message: `Something went wrong!`,
                type: "error",
            }))
            dispatch(commonActions.showApiLoader(false));
        }

    } catch (err) {
        if (err?.response?.data?.status === 401 && handleLoggedInUser() !== null) {
            handleLoginExpiry(err, dispatch)
            dispatch(commonActions.showApiLoader(false));
        } else {
            if (err.response) {
                dispatch(
                    commonActions.handleSnackbar({
                        show: true,
                        message: `${err.response.data.message}`,
                        type: "error",
                    })
                );
                const error = err.response.data.error;
                postAuditLog({ action: "Get Users Dropdown Data", message: error });
            }
            dispatch(commonActions.showApiLoader(false));
        }
    }
}

export const handleGetTeamsDropDown = async ({ setTeamDropdownData, teamDropdownData, dispatch }) => {
    try {
        const response = await teamsDropdownAPI()
        console.log('response:', response)
        if (response?.status == 200) {
            let data = response?.data?.result
            setTeamDropdownData(data)
            dispatch(userActions.setTeamDropdownMethod(data))
        } else {
            dispatch(commonActions.handleSnackbar({
                show: true,
                message: `Something went wrong!`,
                type: "error",
            }))
            dispatch(commonActions.showApiLoader(false));
        }

    } catch (err) {
        if (err?.response?.data?.status === 401 && handleLoggedInUser() !== null) {
            handleLoginExpiry(err, dispatch)
            dispatch(commonActions.showApiLoader(false));
        } else {
            if (err.response) {
                dispatch(
                    commonActions.handleSnackbar({
                        show: true,
                        message: `${err.response.data.message}`,
                        type: "error",
                    })
                );
                const error = err.response.data.error;
                postAuditLog({ action: "Get Teams Dropdown Data", message: error });
            }
            dispatch(commonActions.showApiLoader(false));
        }
    }
}

export const handleGetAssetDropdown = async ({ setAssetDropdownData, assetDropdownData, assetPaginationCurrentPage, dispatch }) => {
    console.log('assetPaginationCurrentPage:', assetPaginationCurrentPage)
    console.log('assetActions:', assetActions)
    try {
        const response = await getAssetDropdown({ "limit": 0, assetPaginationCurrentPage })
        console.log('response:', response)
        if (response?.status == 200) {
            let data = [...assetDropdownData, ...response?.data?.result.assets]
            setAssetDropdownData(data)
            dispatch(assetActions.setAssetDropdownMethod(data))
        } else {
            dispatch(commonActions.handleSnackbar({
                show: true,
                message: `Something went wrong!`,
                type: "error",
            }))
            dispatch(commonActions.showApiLoader(false));
        }

    } catch (err) {
        if (err?.response?.data?.status === 401 && handleLoggedInUser() !== null) {
            handleLoginExpiry(err, dispatch)
            dispatch(commonActions.showApiLoader(false));
        } else {
            if (err.response) {
                dispatch(
                    commonActions.handleSnackbar({
                        show: true,
                        message: `${err.response.data.message}`,
                        type: "error",
                    })
                );
                const error = err.response.data.error;
                postAuditLog({ action: "Get Asset Dropdown Data", message: error });
            }
            dispatch(commonActions.showApiLoader(false));
        }
    }
}


export const handleGetPriorityDropdown = async (setPriorityDropdownData, dispatch, workOrderStateManagementActions) => {
    try {
        const response = await getWorkOrderPriorityDropdownAPI()
        console.log('response:', response)
        setPriorityDropdownData(response?.data?.result)
        dispatch(workOrderStateManagementActions.setWorkOrderPriorityDropdownMethod(response?.data?.result))
    } catch (err) {
        handleLoginExpiry(err, dispatch)
        if (err?.response?.data?.status !== 401) {
            dispatch(
                commonActions.handleSnackbar({
                    show: true,
                    message: `${err.response.data.message}`,
                    type: "error",
                })
            );
            const error = err.response.data.error;
            postAuditLog({ action: "Work Order Created", message: error });
        }
    }
}



/**
 * This API is getting use to get the all status of the specific Work Order.
 */
export const handleGetStatusDropdown = async ({ dispatch, workOrderStateManagementActions }) => {
    let loggedInUser = JSON.parse(localStorage.getItem("loginUser"))
    console.log('loggedInUser:', loggedInUser)
    try {
        let response = await getWorkOrderStatusDropdownAPI();
        console.log('responseStatus:', response)

        // Roles and Permission Check
        let status = response?.data?.result;
        let filteredResponse = []

        status.forEach((ele) => {
            if (loggedInUser.role_id == "001") {
                filteredResponse.push(ele)
            }
            else if (loggedInUser.role_id == "002") {
                filteredResponse.push(ele)
            }
            else if (loggedInUser.role_id == "076" && (ele.wo_status == "Accepted" || ele.wo_status == "Scheduled" || ele.wo_status == "On Hold" || ele.wo_status == "Completed")) {
                filteredResponse.push(ele)
            }
            else if (loggedInUser.role_id == "086" && (ele.wo_status == "Draft" || ele.wo_status == "Scheduled")) {
                filteredResponse.push(ele)
            }
        })

        dispatch(workOrderStateManagementActions.setWorkOrderStatusDropdownMethod(filteredResponse))
    } catch (err) {
        handleLoginExpiry(err, dispatch)
        if (err?.response?.data?.status !== 401) {
            dispatch(
                commonActions.handleSnackbar({
                    show: true,
                    message: `${err.response.data.message}`,
                    type: "error",
                })
            );
            const error = err.response.data.error;
            postAuditLog({ action: "Work Order Created", message: error });
        }
    }
}



/**
 * 
 * @param {dispatch} param0 To dispatch the action
 * @param {commonActions} param1 It contain the the some common alerts
 * @param {workOrderId} param1 Contain the work order Id 
 */

export const handleUpdateTheWorkOrderStatus = async ({ dispatch, workOrderId, status }) => {
    try {
        let response = await updateWorkOrderStatusAPI({ workOrderId, status })
        if (response.status == "200" || response.status == "201") {
            dispatch(commonActions.handleSnackbar({
                show: true,
                message: `Work Order Status has been updated.`,
                type: "success",
            }))
            handleGetSingleWorkOrder({ dispatch, workOrderId, workOrderStateManagementActions })
        }
        else {
            dispatch(commonActions.handleSnackbar({
                show: true,
                message: `Something Went Wrong!.`,
                type: "error",
            }))
        }
    }
    catch (err) {
        handleLoginExpiry(err, dispatch)
        if (err?.response?.data?.status !== 401) {
            dispatch(
                commonActions.handleSnackbar({
                    show: true,
                    message: err.message,
                    type: "error",
                })
            );
            const error = err.response.data.error;
            postAuditLog({ action: "Work Order Created", message: error });
        }
    }
}

export const handleDeleteSubtasks = (val, inputSubtastLength, setInputSubtastLength) => {
    if (inputSubtastLength.length > 1) {
        const deleteVal = [...inputSubtastLength];
        deleteVal.splice(val, 1);
        setInputSubtastLength(deleteVal);
    }
};

export const handleWorkOrderFilter = async ({ payload, dispatch }) => {
    try {
        const response = await getWorkOrderBasedOnAssetIdAPI({ assetId: payload?.assetId })
        const loggedInUser = handleLoggedInUser();
        console.log('responseAsset:', response)
        if (response.status == "200" || response.status == "201") {
            let workOrders = response?.data?.result?.workOrders;
            console.log('workOrders:', workOrders)
            let filteredResponse = workOrders?.filter((ele) => {
                let assignee = ele?.assignee && ele.assignee.length > 0 ? ele.assignee[0].id : null;
                if (loggedInUser.role_id == "001" || loggedInUser.role_id == "002") {
                    return ele
                }
                else if (loggedInUser.userId === ele?.createdBy && loggedInUser.role_id == "086") {
                    return ele
                }
                else if (loggedInUser.role_id == "076" && (ele.status == "Accepted" || ele.status == "Scheduled" || ele.status == "On Hold" || ele.status == "Completed" || ele.status == "Expired") && assignee == loggedInUser.userId) {
                    return ele
                }
            })
            dispatch(workOrderStateManagementActions.setWorkOrderMethod(filteredResponse))
        }
        else {
            dispatch(commonActions.handleSnackbar({
                show: true,
                message: `Something Went Wrong!.`,
                type: "error",
            }))
        }
    }
    catch (err) {
        handleLoginExpiry(err, dispatch)
        if (err?.response?.data?.status !== 401) {
            dispatch(
                commonActions.handleSnackbar({
                    show: true,
                    message: err.message,
                    type: "error",
                })
            );
            const error = err.response.data.error;
            postAuditLog({ action: "Work Order Created", message: error });
        }
    }
}



export const handleChange = (val, i, inputSubtastLength, setInputSubtastLength) => {
    const inputData = [...inputSubtastLength];
    inputData[i] = val.target.value;
    setInputSubtastLength(inputData);
};

export function getDateAndTime(dateString) {
    const currentDate = new Date(dateString);

    const optionsDate = { month: 'long', day: 'numeric', year: 'numeric' };
    const optionsTime = { hour: 'numeric', minute: 'numeric' };

    const formattedDate = currentDate.toLocaleDateString('en-US', optionsDate);
    const formattedTime = currentDate.toLocaleTimeString('en-US', optionsTime);

    return {
        date: formattedDate,
        time: formattedTime
    };
}


export const handleGetDocumentImage = async ({ documentId, setImageUrl }) => {
    try {
        const response = await getWorkOrderViewImageAPI(documentId)
        console.log('responseIMG:', response)
        setImageUrl(response?.data?.url)
    } catch (error) {

    }
}



export const downloadCSV = ({ data }) => {
    data = [data]
    const flattenedData = data.map((item) => {
        return {
            workOrderId: item.workOrderId,
            createdDate: item.createdDate,
            updatedDate: item.updatedDate,
            title: item.title,
            description: item.description,
            assetId: item.asset.assetId, // Nested object data
            assetName: item.asset.assetName, // Nested object data
            dueDate: item.dueDate,
            isDeleted: item.isDeleted,
            estimatedCompletionTime: item.estimatedCompletionTime,
            teamId: item.team.teamId, // Nested object data
            teamName: item.team.teamName, // Nested object data
            userId: item.users.userId, // Nested object data
            userName: item.users.userName, // Nested object data
            createdBy: item.createdBy,
            status: item.status,
            priorityId: item.priority.priorityId, // Nested object data
            priorityName: item.priority.priorityName, // Nested object data
            action: item.action,
            approvalDate: item.approvalDate,
        };
    });
    exportInformation({ data: flattenedData, type: "csv", fileName: "Work Order Details" })
};

export const downloadXLSX = ({ data }) => {
    console.log('data:', data)
    data = [data] // Need to convert the object into the array because we have to run loop on it.
    // Flatten the data to include nested objects

    let teamsData = {};
    data[0]?.team?.forEach((element, index) => {
        teamsData[`team${index + 1}`] = element.name
    })

    console.log('teamsData:', teamsData)
    const flattenedData = data.map((item) => {
        return {
            ...teamsData,
            workOrderId: item.workOrderId,
            createdDate: item.createdDate,
            updatedDate: item.updatedDate,
            title: item.title,
            description: item.description,
            assetId: item.asset[0].id, // Nested object data
            assetName: item.asset[0].name, // Nested object data
            startDate: item.startDate,
            endDate: item.endDate,
            isDeleted: item.isDeleted,
            estimationDays: item.estimationDays,
            hours: item.hours,
            assigneeName: item.assignee[0].name,
            assigneeId: item.assignee[0].id,
            createdBy: item.createdBy,
            status: item.status,
            priorityId: item.priority.priorityId, // Nested object data
            priorityName: item.priority.priorityName, // Nested object data
            action: item.action,
            approvalDate: item.approvalDate,
        };
    });
    exportInformation({ data: flattenedData, type: "xlsx", fileName: "Work Order Details" })
};



export const lcHandleDummyEncryption = async (stringValue) => {
    try {
        let encryptedValue = await handleEncryptionURLKeys({ needToEncrypt: stringValue })
        console.log('encryptedValue:', encryptedValue)
    }
    catch (err) {
        console.log('err:', err)
    }
}


export const handleCreateRemark = async ({ dispatch, payload, locallyResponseSetterMethod }) => {
    console.log('payload:', payload)
    try {
        // Retrieve checklist data from the API.
        const response = await createWorkOrderRemarkAPI({ payload });
        console.log('response:', response)

        // Check if the request was successful (status 200 or 201).
        if (response.status == 200 || response.status == 201) {
            handleGetRemark({ dispatch, workOrderId: payload?.workOrderId, locallyResponseSetterMethod })
        } else {
            // If there is an issue with the request, show an error message.
            handleShowErrorAndWarning({ dispatch, type: "error", message: `Something Went Wrong!`, showTime: 5000 })
        }
    } catch (err) {
        // Handle errors, including login expiration and display error messages.
        handleLoginExpiry(err, dispatch)

        // Check if the error status is not 401 (Unauthorized).
        if (err?.response?.data?.status !== 401) {
            // Show an error message with the specific error details.
            handleShowErrorAndWarning({ dispatch, type: "error", message: err?.message, showTime: 5000 })

            // Log the error in the audit log.
            const error = err.response.data.error;
            postAuditLog({ action: "Create Work Order Remark", message: error });
        }
    }
}

export const handleGetRemark = async ({ dispatch, workOrderId, locallyResponseSetterMethod }) => {
    try {
        // Retrieve checklist data from the API.
        const response = await getWorkOrderRemarkAPI({ workOrderId });
        console.log('response:', response)

        // Check if the request was successful (status 200 or 201).
        if (response.status == 200 || response.status == 201) {
            locallyResponseSetterMethod(prev => {
                return { ...prev, ["remarksResponse"]: response.data }
            })

        } else {
            // If there is an issue with the request, show an error message.
            handleShowErrorAndWarning({ dispatch, type: "error", message: `Something Went Wrong!`, showTime: 5000 })
        }
    } catch (err) {
        // Handle errors, including login expiration and display error messages.
        handleLoginExpiry(err, dispatch)

        // Check if the error status is not 401 (Unauthorized).
        if (err?.response?.data?.status !== 401) {
            // Show an error message with the specific error details.
            handleShowErrorAndWarning({ dispatch, type: "error", message: err?.message, showTime: 5000 })

            // Log the error in the audit log.
            const error = err.response.data.error;
            postAuditLog({ action: "Create Work Order Remark", message: error });
        }
    }
}

export const handleGetAllPredefineTasksFromTaskLibrary = async ({ dispatch, locallyResponseSetterMethod }) => {
    try {
        // Retrieve Task Library data from the API.
        const response = await getAllTasksAPI();
        console.log('response:', response)

        // Check if the request was successful (status 200 or 201).
        if (response.status == 200 || response.status == 201) {
            locallyResponseSetterMethod(response?.data)
        } else {
            // If there is an issue with the request, show an error message.
            handleShowErrorAndWarning({ dispatch, type: "error", message: `Something Went Wrong!`, showTime: 5000 })
        }
    } catch (err) {
        // Handle errors, including login expiration and display error messages.
        handleLoginExpiry(err, dispatch)

        // Check if the error status is not 401 (Unauthorized).
        if (err?.response?.data?.status !== 401) {
            // Show an error message with the specific error details.
            handleShowErrorAndWarning({ dispatch, type: "error", message: err?.message, showTime: 5000 })

            // Log the error in the audit log.
            const error = err.response.data.error;
            postAuditLog({ action: "Create Work Order Remark", message: error });
        }
    }
}

export const handleDeletePredefineTaskOfTaskLibrary = ({ lcValuesMethod, id }) => {
    lcValuesMethod(prev => {
        console.log('prev:', prev)
        const updatedData = prev?.predefineTasks?.filter(item => item._id != id)
        console.log('updatedData:', updatedData)
        return { ...prev, ["predefineTasks"]: updatedData }
    })
}



export const handleRequestToExtendDueDate = async ({ dispatch, payload, workOrderId, locallyResponseSetterMethod }) => {
    try {
        // Retrieve Task Library data from the API.
        const response = await requestToExtendDueDateAPI({ workOrderId, payload });
        console.log('response:', response)

        // Check if the request was successful (status 200 or 201).
        if (response.status == 200 || response.status == 201) {
            handleShowErrorAndWarning({ dispatch, type: "success", message: `Request Has been Sent.`, showTime: 5000 })
            handleGetAllDueDateRequests({ dispatch, workOrderId, locallyResponseSetterMethod })
        } else {
            // If there is an issue with the request, show an error message.
            handleShowErrorAndWarning({ dispatch, type: "error", message: `Something Went Wrong!`, showTime: 5000 })
        }
    } catch (err) {
        // Handle errors, including login expiration and display error messages.
        handleLoginExpiry(err, dispatch)

        // Check if the error status is not 401 (Unauthorized).
        if (err?.response?.data?.status !== 401) {
            // Show an error message with the specific error details.
            handleShowErrorAndWarning({ dispatch, type: "error", message: err?.message, showTime: 5000 })

            // Log the error in the audit log.
            const error = err.response.data.error;
            postAuditLog({ action: "Requesting to extend the work order end date.", message: error });
        }
    }
}

export const handleExtendingDueDate = async ({ dispatch, payload, workOrderId, locallyResponseSetterMethod }) => {
    try {
        // Retrieve Task Library data from the API.
        const response = await extendingDueDateRequestsAPI({ workOrderId, payload });
        console.log('response:', response)

        // Check if the request was successful (status 200 or 201).
        if (response.status == 200 || response.status == 201) {
            handleShowErrorAndWarning({ dispatch, type: "success", message: `Work Order end date has been extended.`, showTime: 5000 })
            handleGetAllDueDateRequests({ dispatch, workOrderId, locallyResponseSetterMethod })
            handleGetRemark({ dispatch, workOrderId, locallyResponseSetterMethod })
            handleGetSingleWorkOrder({ dispatch, workOrderId })
        } else {
            // If there is an issue with the request, show an error message.
            handleShowErrorAndWarning({ dispatch, type: "error", message: `Something Went Wrong!`, showTime: 5000 })
        }
    } catch (err) {
        // Handle errors, including login expiration and display error messages.
        handleLoginExpiry(err, dispatch)

        // Check if the error status is not 401 (Unauthorized).
        if (err?.response?.data?.status !== 401) {
            // Show an error message with the specific error details.
            handleShowErrorAndWarning({ dispatch, type: "error", message: err?.message, showTime: 5000 })

            // Log the error in the audit log.
            const error = err.response.data.error;
            postAuditLog({ action: "Extending the work order end date", message: error });
        }
    }
}

export const handleGetAllDueDateRequests = async ({ dispatch, workOrderId, locallyResponseSetterMethod }) => {
    try {
        // Retrieve Task Library data from the API.
        const response = await getAllExtendDueDateRequestsAPI({ workOrderId });
        console.log('responseRequest:', response)

        // Check if the request was successful (status 200 or 201).
        if (response.status == 200 || response.status == 201) {
            locallyResponseSetterMethod(prev => {
                return { ...prev, ["requestsForDueDateExtension"]: response?.data }
            })
        } else {
            // If there is an issue with the request, show an error message.
            handleShowErrorAndWarning({ dispatch, type: "error", message: `Something Went Wrong!`, showTime: 5000 })
        }
    } catch (err) {
        console.log('err:', err)
        // Handle errors, including login expiration and display error messages.
        handleLoginExpiry(err, dispatch)

        // Check if the error status is not 401 (Unauthorized).
        if (err?.response?.data?.status !== 401) {
            // Show an error message with the specific error details.
            handleShowErrorAndWarning({ dispatch, type: "error", message: err?.message, showTime: 5000 })
            // Log the error in the audit log.
            const error = err.response.data.error;
            postAuditLog({ action: "Get all requests for extend work order end date.", message: error });
        }
    }
};
