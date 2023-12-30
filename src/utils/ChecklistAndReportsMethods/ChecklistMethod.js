import {
    getChecklistAPI, saveChecklistDataSets, saveChecklistGeneralDetails, getSingleChecklistAPI, saveChecklistAsDraft, getSingleChecklistDataSetsAPI,
    createChecklistFromStaging,
    editChecklistGeneralDetails,
    editChecklistGeneralDetailsAPI,
    changeChecklistStatusAPI,
    getValidateRequestsAPI,
    approveTheValidateRequestAPI,
    createValidateRequestsAPI,
} from "../../Api/ChecklistAndReports/Checklist";
import { postAuditLog } from "../../Api/User/UserApi";
import { ChecklistAndReportsAction } from "../../Store/Reducers/ClonosChecklistAndReportsReducer";
import { commonActions } from "../../Store/Reducers/CommonReducer";
import {
    exportInformation,
    handleLoggedInUser,
    handleLoginExpiry,
    handleShowErrorAndWarning,
    toCamelCase,
} from "../clonosCommon";
import { deleteChecklistAPI } from "../../Api/ChecklistAndReports/Checklist";
import { useDispatch } from "react-redux";
// import { handleLoggedInUser, handleLoginExpiry, handleShowErrorAndWarning, } from "../clonosCommon";

export const validateChecklistGeneralDetails = (formData, setErrors) => {
    const newErrors = {};
    const currentDate = new Date().toISOString().split("T")[0];
    // Validate Name
    if (!formData?.name) {
        newErrors.name = "Name is required";
    }

    // Validate Asset
    if (!formData?.asset) {
        newErrors.asset = "Asset is required";
    }

    // Validate Start Date
    if (!formData?.startDate) {
        newErrors.startDate = "Start Date is required";
    }

    // Validate End Date
    if (!formData?.endDate) {
        newErrors.endDate = "End Date is required";
    }

    // Validate Start Date
    if (formData?.startDate < currentDate) {
        newErrors.startDate = "Please provide current or future date.";
    }
    // Validate End Date
    if (formData?.endDate < currentDate) {
        newErrors.endDate = "Please provide current or future date.";
    }

    if (formData?.endDate && formData?.startDate) {
        if (formData?.startDate > formData?.endDate) {
            newErrors.startDate = "Start date can not be  greater than End Date.";
            newErrors.endDate = "End date can not be  lesser than Start Date.";
        }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Returns true if no errors
};

/**
 * To get the selected value from dropdown.
 *
 * @param {object} props - The function's input properties.
 * @property {object} props.value - The returned value from the dropdown.
 * @property {object} props.type - Key name of that particular field.
 * @property {object} props.formData - State to store local changes.
 * @property {object} props.setFormData - Method to update local changes in state.
 */
export const getSelectedValueFromChecklistDropdown = ({
    value,
    type,
    formData,
    setFormData,
}) => {
    if (value === "deselected") {
        delete formData[type];
        setFormData({ ...formData });
    } else {
        setFormData((prev) => ({
            ...prev,
            [type]: { name: value?.label, id: value?.value },
        }));
    }
};
/**
 * To handle the value of repeatation number based on frequency change
 * @property {object} props.count - Input value for repeatation number
 * @property {object} props.formData - State to store local changes.
 * @property {object} props.setFormData - Method to update local changes in state.
 */
export const handleRepeatationNumber = ({ count, formData, setFormData }) => {
    console.log('formData:', formData)
    console.log('setFormData:', setFormData)
    let numAsString = count.toString();
    if (numAsString?.length > 2) {
        let firstTwoDigits = numAsString.slice(0, 2);
        count = parseInt(firstTwoDigits, 10);
    }
    if (formData?.frequencyType?.name) {
        if (count === 1) {
            if (
                formData?.frequency?.name === "Hourly" &&
                formData?.frequencyPeriod < 23
            ) {
                setFormData((prev) => ({
                    ...prev,
                    frequencyPeriod: (Number(formData?.frequencyPeriod) || 0) + count,
                }));
            } else {
                setFormData((prev) => ({
                    ...prev,
                    frequencyPeriod: (Number(formData?.frequencyPeriod) || 0) + count,
                }));
            }
        } else if (count === -1) {
            if (formData?.frequencyPeriod) {
                setFormData((prev) => ({
                    ...prev,
                    frequencyPeriod: Number(formData?.frequencyPeriod) + count,
                }));
            }
        } else {
            if (Number(count) >= 0) {
                if (formData?.frequency?.name === "Hourly" && count > 23) {
                    setFormData((prev) => ({
                        ...prev,
                        frequencyPeriod: 23,
                    }));
                } else {
                    setFormData((prev) => ({
                        ...prev,
                        frequencyPeriod: count,
                    }));
                }
            }
        }
    }
};
/**
 * To get Repeatation duration based on frequency change
 * @property {object} props.formData - State to store local changes.
 */
export const showRepeatationFrequency = (formData) => {
    if (formData?.frequency?.name === "Hourly") {
        return "Hours";
    } else if (formData?.frequency?.name === "Daily") {
        return "Days";
    } else if (formData?.frequency?.name === "Weekly") {
        return "Weeks";
    } else if (formData?.frequency?.name === "Monthly") {
        return "Month";
    } else if (formData?.frequency?.name === "Quarterly") {
        return "Months";
    } else if (formData?.frequency?.name === "Half-yearly") {
        return "Months";
    } else if (formData?.frequency?.name === "Annualy") {
        return "Years";
    }
    return "";
};

// ********************* TEMPLATE METHODS *********************

export const handleReturnedFieldValue = ({
    id,
    fieldName,
    fieldValue,
    dispatch,
    attributes,
}) => {
    let updatedAttributes = attributes?.map((attribute) => {
        if (attribute?.id === id) {
            return {
                ...attribute,
                fieldName,
                fieldValue,
            };
        } else {
            return attribute;
        }
    });
    dispatch(
        ChecklistAndReportsAction.setSelectedAttributesToolkitState(
            updatedAttributes
        )
    );
};

//  *********************  METHODS TO VALIDATE UPLOADED FILES  *********************
/**
 * Checks if the number of uploaded files exceeds a specified limit.
 *
 * @param {object} props - The function's input properties.
 * @param {number} props.limit - The maximum number of allowed files.
 * @param {array} props.files - The list of uploaded files.
 * @returns {boolean} - Returns true if the number of files is within the limit, or false if it exceeds the limit.
 */
export const validateFilesLimit = ({ limit, files, dispatch }) => {
    if (files.length > limit) {
        handleShowErrorAndWarning({
            dispatch,
            type: "error",
            showTime: 20000,
            message: `You can't upload more than ${limit} files.`,
        });
        return false;
    }
    // if (defaultValue && defaultValue.length + files.length > limit) {
    //     handleShowErrorAndWarning({ dispatch, type: "error", showTime: 20000, message: `You have already uploaded ${defaultValue.length} file, So you can only upload ${limit - defaultValue.length} files more, because the limit is ${limit}!.` });
    //     return false
    // }
    return true;
};

/**
 * Checks if files need to be uploaded are not already present in the list of uploaded files.
 *
 * @param {object} props - The function's input properties.
 * @param {array} props.needToUploadedFiles - The files that need to be uploaded.
 * @param {array} props.uploadedFiles - The list of already uploaded files.
 * @returns {array} - Returns a modified list of files with unique items.
 */
export const handleCheckFileIsPresentOrNot = ({
    needToUploadedFiles,
    uploadedFiles,
    limit,
}) => {
    let uploadedFilesLc = uploadedFiles?.map((ele) => ele.name);
    let needToUploadedFilesLc = needToUploadedFiles.filter(
        (item) => !uploadedFilesLc.includes(item.name)
    );
    needToUploadedFilesLc = [...needToUploadedFilesLc, ...uploadedFiles];
    return needToUploadedFilesLc;
};

/**
 * Checks if the file types of the uploaded files are valid.
 *
 * @param {object} props - The function's input properties.
 * @param {array} props.files - The list of uploaded files.
 * @param {array} props.acceptableFileTypes - The list of supported file types.
 * @returns {boolean} - Returns true if all file types are valid, or false if any file type is unsupported.
 */
export const handleValidateFilesType = ({
    files,
    acceptableFileTypes,
    dispatch,
}) => {
    let fileNames = files.map((item) => item.name);
    let count = 0;
    for (let i = 0; i < fileNames.length; i++) {
        let tempElement = fileNames[i].split(".");
        if (
            acceptableFileTypes.includes(`.${[tempElement[tempElement.length - 1]]}`)
        )
            count++;
    }
    if (count === fileNames.length) return true;
    else {
        handleShowErrorAndWarning({
            dispatch,
            type: "error",
            message: "Please upload supported file types!",
            showTime: 5000,
        });
        return false;
    }
};

/**
 * Checks if the size of each uploaded file is within the specified limit.
 *
 * @param {object} props - The function's input properties.
 * @param {array} props.files - The list of uploaded files to check.
 * @param {number} props.fileSizeInMB - The maximum file size allowed in megabytes.
 * @returns {boolean} - Returns true if all file sizes are within the limit, or false if any file size exceeds the limit.
 */
export const handleValidateFileSize = ({ files, fileSizeInMB, dispatch }) => {
    files.forEach((file) => {
        let sizeInBytes = fileSizeInMB * 1024 * 1024;
        if (file.size > sizeInBytes) {
            // Notify that the file size is greater (consider using a more user-friendly notification)
            handleShowErrorAndWarning({
                dispatch,
                type: "error",
                message: `File size should be less than ${fileSizeInMB}MB!`,
                showTime: 15000,
            });
            return false; // Return false if a file size exceeds the limit
        }
    });
    return true; // Return true if all file sizes are within the limit
};

/*
 To show linear progress while uploading file
*/

export const handleLinearProgress = ({ files, setUploadProgress }) => {
    let tempProgress = {};
    files?.forEach((file) => {
        const formData = new FormData();
        formData.append("file", file);

        // Simulate a file upload progress
        let progress = 0;
        const interval = setInterval(() => {
            if (progress < 100) {
                progress += 10;
                setUploadProgress((prevProgress) => {
                    tempProgress = {
                        ...prevProgress,
                        [file.name]: progress,
                    };
                    return tempProgress;
                });
            } else {
                clearInterval(interval);
            }
        }, 200);
    });
};

/*
To validate start date & end date while creation of checklist general details.
*/
export const validateStartAndEndDate = ({
    formData,
    setFormData,
    dispatch,
}) => {
    const currentDate = new Date().toISOString().split("T")[0];
    if (formData?.startDate < currentDate) {
        dispatch(
            commonActions.handleSnackbar({
                show: true,
                message: "Please provide current or future date",
                type: "error",
            })
        );
        // setFormData((prev) => ({ ...prev, startDate: "" }))
    }
    if (formData?.endDate < currentDate) {
        dispatch(
            commonActions.handleSnackbar({
                show: true,
                message: "Please provide current or future date",
                type: "error",
            })
        );
        // setFormData((prev) => ({ ...prev, endDate: "" }))
    }
    if (formData?.startDate > formData?.endDate) {
        if (formData?.startDate >= formData?.endDate) {
            dispatch(
                commonActions.handleSnackbar({
                    show: true,
                    message: "Please provide valid start and end date",
                    type: "error",
                })
            );
            //   setFormData((prev) => ({...prev,startDate:"",endDate:""}))
        }
    }
};

// CHECKLIST CRUD

/**
 * Handles the retrieval of checklist data and filters it based on the logged-in user.
 * @param {Object} options - Options object containing dispatch and responseSetterMethod.
 */
export const handleGetChecklist = async ({
    dispatch,
    responseSetterMethod,
}) => {
    try {
        // Retrieve checklist data from the API.
        const response = await getChecklistAPI();
        console.log("response:", response);
        const loggedInUserDetails = handleLoggedInUser();

        // Check if the request was successful (status 200 or 201).
        if (response.status == 200 || response.status == 201) {
            // Extract checklist items from the response.
            const data = response?.data?.result;
            console.log("data:", data);

            // Filter checklist items based on the logged-in user or who created that checklist.
            let filteredData = null; // A variable that will store that will store the filtered data based on the below conditions.
            if (loggedInUserDetails.role_id == "086") {
                // Here we are filtering data based on which Ingineering created that checklist.
                filteredData = data.filter(
                    (item) => item.createdBy == loggedInUserDetails?.userId
                );
            } else if (loggedInUserDetails.role_id == "076") {
                // Same for Operator
                filteredData = data.filter(
                    (item) => item?.assignee?.userId == loggedInUserDetails?.userId
                );
            } else {
                // Remaining roles will comes under here.
                filteredData = data;
            }
            // Set the filtered data using the provided responseSetterMethod.
            responseSetterMethod(data);
        } else {
            // If there is an issue with the request, show an error message.
            handleShowErrorAndWarning({
                dispatch,
                type: "error",
                message: `Something Went Wrong!`,
                showTime: 5000,
            });
        }
    } catch (err) {
        // Handle errors, including login expiration and display error messages.
        handleLoginExpiry(err, dispatch);

        // Check if the error status is not 401 (Unauthorized).
        if (err?.response?.data?.status !== 401) {
            // Show an error message with the specific error details.
            handleShowErrorAndWarning({
                dispatch,
                type: "error",
                message: `${err.response.data.message}`,
                showTime: 5000,
            });

            // Log the error in the audit log.
            const error = err.response.data.error;
            postAuditLog({ action: "Work Order Created", message: error });
        }
    }
};

// Delete Checklists

/**
 * Handles the deletion of checklist items through the API and updates the local checklist dataset.
 * @param {Object} options - Options object containing the necessary parameters.
 * @param {function} options.dispatch - The dispatch function from a React context or Redux store for handling state updates.
 * @param {Array} options.selectedRows - An array of checklist item IDs selected for deletion.
 * @param {Boolean} options.isLocalUpdate - Based on "isLocalUpdate" key we can control that we want to do local DOM update or not
 * @param {function} options.lcDataSetterMethod - A function responsible for updating the local checklist dataset after deletion.
 *        This function should take the previous state as an argument and return the updated state based on the deleted items.
 */
export const handleDeleteChecklist = async ({
    dispatch,
    selectedRows,
    lcDataSetterMethod,
    isLocalUpdate,
}) => {
    try {
        // Send API request to delete selected checklist items.
        const response = await deleteChecklistAPI({ checklistIds: selectedRows });
        // Check if the deletion request was successful (status 200 or 201).
        if (response.status == 200 || response.status == 201) {
            // Based on "isLocalUpdate" key we can control that we want to do local DOM update or not
            if (isLocalUpdate) {
                // Update the local checklist dataset based on the deleted items.
                lcDataSetterMethod((prev) => {
                    let filteredData = null;
                    if (selectedRows.length == 1) {
                        // If only one item is deleted, filter it out.
                        filteredData = prev.filter((item) => item.id != selectedRows[0]);
                        return filteredData;
                    } else {
                        // If multiple items are deleted, filter them out.
                        filteredData = prev.filter(
                            (item) => !selectedRows.includes(item.id)
                        );
                        return filteredData;
                    }
                });
            } else {
                // Calling for getting updated data from the server.
                handleGetChecklist({
                    dispatch,
                    responseSetterMethod: lcDataSetterMethod,
                });
            }
            handleShowErrorAndWarning({
                dispatch,
                type: "success",
                message: `Checklist has been deleted.`,
                showTime: 5000,
            }); // for show the message.
            return response; // here we are returning the status of the response and based on that some operation will heppen.
        }
    } catch (err) {
        // Handle errors, including login expiration and display error messages.
        handleLoginExpiry(err, dispatch);

        // Check if the error status is not 401 (Unauthorized).
        if (err?.response?.data?.status !== 401) {
            // Show an error message with the specific error details.
            handleShowErrorAndWarning({
                dispatch,
                type: "error",
                message: `${err.response.data.message}`,
                showTime: 5000,
            });

            // Log the error in the audit log.
            const error = err.response.data.error;
            postAuditLog({ action: "Checklist Deleted", message: error });
        }
    }
};

// Edit Checklists

export const handleEditChecklistGeneralDetails = async ({ dispatch, payload, checklistId, responseSetterMethod }) => {
    responseSetterMethod(prev => {
        return { ...prev, "editLoading": true }
    })
    let lcPayload = {};
    lcPayload.checklistId = checklistId
    payload?.name && (lcPayload.name = payload?.name)
    payload?.assetId && (lcPayload.assetId = payload?.assetId)
    payload?.assignee && (lcPayload.assignee = payload?.assignee)
    payload?.description && (lcPayload.description = payload?.description)
    payload?.documentNumber && (lcPayload.documentNumber = payload?.documentNumber)
    payload?.startDate && (lcPayload.startDate = payload?.startDate)
    payload?.endDate && (lcPayload.endDate = payload?.endDate)
    payload?.team && (lcPayload.team = payload?.team)
    payload?.type && (lcPayload.type = payload?.type)
    payload?.frequencyType?.name && (lcPayload.frequencyType = payload?.frequencyType?.name)
    payload?.isRecurring && (lcPayload.isRecurring = payload?.isRecurring)
    if (payload?.isRecurring) {
        lcPayload.frequencyType = payload?.frequencyType?.id
        lcPayload.frequencyPeriod = payload?.frequencyPeriod
    }

    try {
        const response = await editChecklistGeneralDetailsAPI({ payload: lcPayload })
        console.log('response:', response)
        if (response.status == "200" || response.status == "201") {
            handleShowErrorAndWarning({ dispatch, type: "success", message: `Checklist General Details Edited`, showTime: 5000 })
            responseSetterMethod(prev => {
                return { ...prev, "isChecklistEdited": true }
            })
        }
    } catch (err) {
        console.log('err:', err)
        // Handle errors, including login expiration and display error messages.
        handleLoginExpiry(err, dispatch);

        // Check if the error status is not 401 (Unauthorized).
        if (err?.response?.data?.status !== 401) {
            // Show an error message with the specific error details.
            handleShowErrorAndWarning({ dispatch, type: "error", message: `${err.response.data.message}`, showTime: 5000 })

            // Log the error in the audit log.
            const error = err.response.data.error;
            postAuditLog({ action: "Checklist Edit General Details", message: error });
        }
        responseSetterMethod(prev => {
            return { ...prev, "isChecklistEdited": false }
        })

    }
    finally {
        responseSetterMethod(prev => {
            return { ...prev, "editLoading": false }
        })
    }
};

// Get Single Checklist Details

export const handleGetSingleChecklist = async ({
    dispatch,
    responseSetterMethod,
    checklistId,
    uniqueKey
}) => {
    console.log('uniqueKey:', uniqueKey)
    try {
        const response = await getSingleChecklistAPI({ checklistId, optionalParams: { dataSets: 1, asset: 1, assignee: 1, team: 1, frequencyType: 1, updatedBy: 1 } });
        console.log('ChecklistResponse:', response)

        // Check if the request was successful (status 200 or 201).
        if (response.status == 200 || response.status == 201) {
            // Extract checklist items from the response.
            if (response && response?.data) {
                let data = response?.data?.result;
                console.log('data:', data)
                const updatedDataSets = data?.dataSets?.map((item, index) => {
                    return { ...item, "index": index + 1 }
                })
                responseSetterMethod(prev => {
                    console.log('prev:', prev)
                    return { ...prev, [uniqueKey]: { ...data, "dataSets": updatedDataSets } }
                });
            }
        }
    } catch (err) {
        // Handle errors, including login expiration and display error messages.
        handleLoginExpiry(err, dispatch);

        // Check if the error status is not 401 (Unauthorized).
        if (err?.response?.data?.status !== 401) {
            // Show an error message with the specific error details.
            handleShowErrorAndWarning({ dispatch, type: "error", message: `${err?.response?.data?.message}`, showTime: 5000 })
            // Log the error in the audit log.
            const error = err?.response?.data?.error;
            postAuditLog({ action: "Get Single Checklist", message: error });
        }
    }
}

// Get Single Checklist DetaSets Details

export const handleGetSingleChecklistDetaSets = async ({ dispatch, responseSetterMethod, checklistId }) => {
    try {
        const response = await getSingleChecklistDataSetsAPI({ checklistId, optionalParams: { images: 1, fieldValue: 1 } })
        console.log('responseDataSets:', response)

        // Check if the request was successful (status 200 or 201).
        if (response.status == 200 || response.status == 201) {
            // Extract checklist items from the response.
            const data = response?.data?.result
            const updatedDataSets = data?.map((item, index) => {
                return { ...item, "index": index + 1 }
            })
            responseSetterMethod(prev => {
                return { ...prev, ["singleChecklistDataSetsDetails"]: updatedDataSets }
            })

        }
    }
    catch (err) {
        // Handle errors, including login expiration and display error messages.
        handleLoginExpiry(err, dispatch)

        // Check if the error status is not 401 (Unauthorized).
        if (err?.response?.data?.status !== 401) {
            // Show an error message with the specific error details.
            handleShowErrorAndWarning({ dispatch, type: "error", message: `${err.message}`, showTime: 5000 })
            // Log the error in the audit log.
            postAuditLog({ action: "Get Single Checklist Data Sets", message: "Server Error with status code 400" });
        }
    }
}

// export checklist information

export const exportChecklistInformaiton = ({
    type,
    fileName,
    pdfData,
    xlsxData,
    pageType,
}) => {
    if (type == "pdf")
        exportInformation({ data: pdfData, type, fileName, pageType });
    else if (type == "xlsx") {
        exportInformation({ data: [xlsxData], type, fileName });
    }
};

/**
 * To save checklist general details..
 * @param {Object} payload - genaral details of checklist.
 */
export const handleSaveChecklistGeneralDetails = async ({ payload, dispatch, Navigate, savingType }) => {
    try {
        let newPayload = {};
        if (savingType === "draft") (newPayload.status = savingType);
        newPayload.name = payload?.name;
        newPayload.assetId = payload?.assetId;
        newPayload.assignee = payload?.assignee
        newPayload.description = payload?.description;
        newPayload.documentNumber = payload?.documentNumber;
        newPayload.startDate = payload?.startDate
        newPayload.endDate = payload?.endDate
        newPayload.team = payload?.team;
        newPayload.type = payload?.type;
        newPayload.frequencyType = payload?.frequencyType?.name
        newPayload.isRecurring = payload?.isRecurring;
        if (savingType !== "draft") newPayload.isStaging = true
        if (payload?.isRecurring) {
            newPayload.frequencyType = payload?.frequencyType?.id
            newPayload.frequencyPeriod = payload?.frequencyPeriod
        }
        console.log('newPayload:', newPayload)
        dispatch(commonActions.showApiLoader(true))
        let response = await saveChecklistGeneralDetails(newPayload);
        // Check the API response status and show appropriate notifications.
        if (response.status == "200" || response.status == "201") {
            dispatch(commonActions.showApiLoader(false))
            dispatch(ChecklistAndReportsAction.setChecklistGeneralDetailsCreationDetails({ id: response?.data?.result?.id, name: payload?.name }))
            savingType === "draft" && Navigate("/checklist-listing")
            savingType === "submitted" && Navigate("/create-checklist-template", { state: { generalDetails: { name: payload?.name, description: payload?.description } } })
        } else {
            dispatch(commonActions.showApiLoader(false))
            dispatch(commonActions.handleSnackbar({
                show: true,
                message: `Something Went Wrong!.`,
                type: "error",
            }));
        }
    } catch (err) {
        console.log('err:', err)
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
            postAuditLog({ action: "Checklist drafted", message: error });
        }
    }
    finally {
        dispatch(commonActions.showApiLoader(false))
    }
}


/*
TO SAVE CHECKLIST AS TEMPLATE
*/

export const handleSaveChecklistDataSetsMethod = ({
    checklistId,
    payload,
    dispatch,
    Navigate,
    savingType,
    files,
}) => {
    console.log('payload:', payload)
    console.log(files, "files.......from method");
    createChecklistFromStaging({
        stagedChecklistId: checklistId,
        isTemplate: savingType === "template" ? true : false,
    }).then((response) => {
        let createdFieldCount = 0;
        console.log('response:', response)
        if (response?.status == 201) {
            for (let i = 0; i < payload?.length; i++) {
                let formData = new FormData()
                formData.append("fieldName", payload[i]?.fieldName);
                formData.append("fieldValue", typeof (payload[i]?.fieldValue) == "array" ? JSON.stringify(payload[i]?.fieldValue) : JSON.stringify(payload[i]?.fieldValue));
                formData.append("notes", payload[i]?.notes);
                formData.append("attributeName", toCamelCase(payload[i]?.attributeName))
                formData.append("isTemplate", savingType === "template" ? true : false)

                files?.forEach((file) => {
                    if (file?.id == payload[i]?.id) {
                        file?.images?.forEach((img, index) => {
                            formData.append(`checklistDataImage${index}`, img?.file)
                        });
                    }
                });

                if (response?.status == 201) {
                    saveChecklistDataSets({
                        checklistId: response?.data?.result?.id,
                        payload: formData
                    }).then((dataSetsResponse) => {
                        if (dataSetsResponse?.status == 200 || dataSetsResponse?.status == 201) {
                            console.log('createdFieldCount:', createdFieldCount)
                            createdFieldCount++;
                        }
                        if (createdFieldCount == payload?.length) {
                            handleShowErrorAndWarning({ dispatch, type: "success", message: "Checklist created successfully.", showTime: 5000 })
                            Navigate("/checklist-listing");
                        }
                    }).catch(err => console.log("error", err))
                }

            }
        }
        console.log('createdFieldCount:', createdFieldCount)

    })
};


export const handleChangeChecklistStatus = async ({ responseSetterMethod, uniqueKey, checklistId, dispatch, payload, isGetResponse }) => {
    console.log('checklistId:', checklistId)
    console.log('isGetResponse:', isGetResponse)
    const lcPayload = { status: payload.status }
    try {
        const response = await changeChecklistStatusAPI({ checklistId, payload: lcPayload })
        console.log('responseStatus:', response)
        if (response.status == 200 || response.status == 201) {
            handleShowErrorAndWarning({ dispatch, type: "success", message: `Status has been changed.`, showTime: 5000 })
        } else {
            handleShowErrorAndWarning({ dispatch, type: "error", message: `Something Went wrong.`, showTime: 5000 })
        }
    }
    catch (err) {
        // Handle errors, including login expiration and display error messages.
        handleLoginExpiry(err, dispatch);
        // Check if the error status is not 401 (Unauthorized).
        if (err?.response?.data?.status !== 401) {
            // Show an error message with the specific error details.
            handleShowErrorAndWarning({ dispatch, type: "error", message: `${err.response.data.message}`, showTime: 5000 })
            // Log the error in the audit log.
            const error = err.response.data.error;
            postAuditLog({ action: "Change Checklist Status", message: error });
        }
    }
    finally {
    }
}


export const handleGetValidateRequests = async ({ responseSetterMethod, uniqueKey, checklistId, dispatch }) => {
    try {
        const response = await getValidateRequestsAPI({ checklistId })
        console.log('responseValidate:', response)
        if (response.status == 200 || response.status == 201) {
            const data = response?.data?.result
            responseSetterMethod(prev => {
                return { ...prev, [uniqueKey]: data }
            });
        } else {
            handleShowErrorAndWarning({ dispatch, type: "error", message: `Something Went wrong.`, showTime: 5000 })
        }
    }
    catch (err) {
        // Handle errors, including login expiration and display error messages.
        handleLoginExpiry(err, dispatch);
        // Check if the error status is not 401 (Unauthorized).
        if (err?.response?.data?.status !== 401) {
            // Show an error message with the specific error details.
            handleShowErrorAndWarning({ dispatch, type: "error", message: `${err.response.data.message}`, showTime: 5000 })
            // Log the error in the audit log.
            const error = err.response.data.error;
            postAuditLog({ action: "Get Checklist Validate Request", message: error });
        }
    }
    finally {
    }
}
export const handleCreateValidateRequests = async ({ responseSetterMethod, uniqueKey, checklistId, dispatch }) => {
    responseSetterMethod(prev => {
        return { ...prev, [uniqueKey]: true }
    });

    try {
        const response = await createValidateRequestsAPI({ checklistId })
        console.log('responseCreateValidate:', response)
        if (response.status == 200 || response.status == 201) {
            handleChangeChecklistStatus({ checklistId, dispatch, payload: { status: "pendingApproval", isGetResponse: true } })
            handleGetValidateRequests({ dispatch, responseSetterMethod, uniqueKey: "validateRequestServerResponse", checklistId })
            handleShowErrorAndWarning({ dispatch, type: "success", message: `Request has been sent for approval.`, showTime: 5000 })
        } else {
            handleShowErrorAndWarning({ dispatch, type: "error", message: `Something Went wrong.`, showTime: 5000 })
        }
    }
    catch (err) {
        // Handle errors, including login expiration and display error messages.
        handleLoginExpiry(err, dispatch);
        // Check if the error status is not 401 (Unauthorized).
        if (err?.response?.data?.status !== 401) {
            // Show an error message with the specific error details.
            handleShowErrorAndWarning({ dispatch, type: "error", message: `${err.response.data.message}`, showTime: 5000 })
            // Log the error in the audit log.
            const error = err.response.data.error;
            postAuditLog({ action: "Get Checklist Validate Request", message: error });
        }
    }
    finally {
        responseSetterMethod(prev => {
            return { ...prev, [uniqueKey]: false }
        });
    }
}

export const handleApproveTheValidateRequest = async ({ responseSetterMethod, uniqueKey, checklistId, requestId, dispatch, payload }) => {

    try {
        const response = await approveTheValidateRequestAPI({ requestId, payload })
        console.log('responseApproval:', response)
        if (response.status == 200 || response.status == 201) {
            handleChangeChecklistStatus({ checklistId, dispatch, payload: { status: payload?.status, isGetResponse: true } })
            handleGetValidateRequests({ dispatch, responseSetterMethod, uniqueKey: "validateRequestServerResponse", checklistId })
        } else {
            handleShowErrorAndWarning({ dispatch, type: "error", message: `Something Went wrong.`, showTime: 5000 })
        }
    }
    catch (err) {
        // Handle errors, including login expiration and display error messages.
        handleLoginExpiry(err, dispatch);
        // Check if the error status is not 401 (Unauthorized).
        if (err?.response?.data?.status !== 401) {
            // Show an error message with the specific error details.
            handleShowErrorAndWarning({ dispatch, type: "error", message: `${err.response.data.message}`, showTime: 5000 })
            // Log the error in the audit log.
            const error = err.response.data.error;
            postAuditLog({ action: "Approval Checklist Validate Request", message: error });
        }
    }
    finally {
        responseSetterMethod(prev => {
            return { ...prev, [uniqueKey]: false }
        });
    }
}