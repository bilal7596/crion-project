import { deleteMultipleDocumentAPI, deleteSingleDocumentAPI, downloadDocumentAPI, getDocumentAPI, getDocumentsStatusDropdownAPI, uploadAssociateDocs } from "../../Api/Documents/DocumentApi";
import { postAuditLog } from "../../Api/User/UserApi";
import { commonActions } from "../../Store/Reducers/CommonReducer";
import { handleLoggedInUser, handleLoginExpiry } from "../clonosCommon";
import { getDocumentTypesDropdownAPI } from "../../Api/Documents/DocumentApi";

// To create document for particular asset
export const createDocument = (data, dispatch, setFormData, Navigate) => {
    const formData = new FormData();
    Object.keys(data).map((field) => {
        if (field === "asset" || field === "status" || field === "documentType" || field === "functionalArea" || field === "user") {
            formData.append(field, data[field] ? JSON.stringify(data[field]) : null)
        } else {
            formData.append(field, data[field])
        }
    })
    dispatch(commonActions.showApiLoader(true));
    uploadAssociateDocs(formData).then((res) => {
        postAuditLog({ action: "Create Document", message: res.data.message });
        dispatch(commonActions.showApiLoader(false));
        dispatch(
            commonActions.handleSnackbar({
                show: true,
                message: "Document Created Successfully",
                type: "success",
            })
        );
        Navigate("/documents")
        setFormData({})
    }).catch((err) => {
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
            postAuditLog({ action: "Document Create", message: error });
        }
    })
}

export const handleGetDocuments = async ({ payload, dispatch, documentActions, currentPage, setCurrentPage, setTotalDocuments }) => {
    console.log('setTotalDocuments:', setTotalDocuments)
    console.log('setCurrentPage:', setCurrentPage)
    console.log('currentPage:', currentPage)
    console.log('documentActions:', documentActions)
    console.log('payload:', payload)
    let limit = 6;

    let offset = (currentPage - 1) * limit
    if (offset < 0) offset = 0
    dispatch(commonActions.showApiLoader(true));
    try {
        let response = await getDocumentAPI({ payload, limit: limit, offset });
        console.log('document response:', response)
        let count = Math.ceil(response?.data?.count / limit)
        console.log('count:', count, "currentPage", currentPage)
        if (response?.status == 200) {
            dispatch(documentActions.setDocumentsMethod(response?.data?.data))
            setTotalDocuments(response?.data?.count)
            setCurrentPage(count < currentPage ? count : currentPage)
            dispatch(commonActions.showApiLoader(false));
        } else {
            dispatch(commonActions.handleSnackbar({
                show: true,
                message: `Something went wrong!`,
                type: "error",
            }))
            dispatch(commonActions.showApiLoader(false));
        }
    }
    catch (err) {
        console.log('err:', err)
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
                postAuditLog({ action: "Document Create", message: error });
            }
            dispatch(commonActions.showApiLoader(false));
        }
    }
}
// To check if the selected file name is already present or not for an asset.
export const checkForDuplicateDocuments = (associatedDocs, document) => {
    let flag = true;
    console.log(associatedDocs, document, "doc method")
    if (associatedDocs?.length) {
        associatedDocs?.map((doc) => {
            if (doc?.originalName === document?.name) {
                flag = false;
                return
            }
        })
    }
    return flag
}


/**
 * 
 * @param {dispatch} param0: This will help to dispatch some nessessary actions after successful operation 
 * @param {documentActions} param1: This method contain all the methods related to document store managemenet.
 */
export const handleGetDocumentsType = async ({ dispatch, documentActions }) => {
    try {
        let response = await getDocumentTypesDropdownAPI();
        console.log('response:', response)
        if (response?.status == 200) {
            dispatch(documentActions.setDocumentTypesMethod(response?.data?.result))
        } else {
            dispatch(commonActions.handleSnackbar({
                show: true,
                message: `Something went wrong!`,
                type: "error",
            }))
        }
    }
    catch (err) {
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
    }
}
/**
 * 
 * @param {dispatch} param0: This will help to dispatch some nessessary actions after successful operation 
 * @param {documentActions} param1: This method contain all the methods related to document store managemenet.
 */
export const handleGetDocumentsStatus = async ({ dispatch, documentActions }) => {
    try {
        let response = await getDocumentsStatusDropdownAPI();
        console.log('response:', response)
        if (response?.status == 200) {
            dispatch(documentActions.setDocumentStatusMethod(response?.data?.result))
        } else {
            dispatch(commonActions.handleSnackbar({
                show: true,
                message: `Something went wrong!`,
                type: "error",
            }))
        }
    }
    catch (err) {
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
    }
}


/**
 * 
 * @param {dispatch} param0: This will help to dispatch some nessessary actions after successful operation 
 * @param {documentActions} param1: This method contain all the methods related to document store managemenet.
 * @param {isMultipleDelete} param2: This key will be one Boolean value, and it will be take care that which type of delete operation you are following. Example (Multiple or Single delete).
 * @param {docId} param3: This argument contain the DocId which we want to delete.
 * @param {needToDelete} param4: This variable contain the Ids which we want to delete in the multi delete.
 * @param {needToFilter} param5: This variable contain the the list of filter keys, and based on that we will get the response.
 * @param {isSetEdit} paramlimit: This variable is the funciton, Who handles the visivility of the Edit component.
 * @param {setNeedToDelete} param7: This varialbe is the function which controls the data of the "needToDelete" varialble.
 * @param {currentPage} param8: Contain the record of the current page.
 * @param {setCurrentPage} param9:This is the function which handle the data of the "currentPage".
 * @param {setTotalDocuments} param5: This is the function which sets the record of the "totalDocuments" variable.
 * 
 */
export const handleDeleteDocuments = async ({ dispatch, documentActions, isMultipleDelete, docId, needToFilter, needToDelete, setIsEdit, setNeedToDelete, currentPage, setCurrentPage, setTotalDocuments }) => {
    dispatch(commonActions.showApiLoader(true));
    try {
        let response = isMultipleDelete ? await deleteMultipleDocumentAPI({ payload: needToDelete }) : await deleteSingleDocumentAPI({ docId })
        console.log('response:', response)
        if (response?.status == 200 || response?.status == 204) {
            handleGetDocuments({ payload: needToFilter, dispatch, documentActions, currentPage, setCurrentPage, setTotalDocuments })
            dispatch(commonActions.handleSnackbar({
                show: true,
                message: `${isMultipleDelete ? "Documents" : "Document"} Deleted Successfully.`,
                type: "success",
            }))
            setNeedToDelete([])
            setIsEdit(false)
            dispatch(commonActions.showApiLoader(false));
        } else {
            dispatch(commonActions.handleSnackbar({
                show: true,
                message: `Something went wrong!`,
                type: "error",
            }))
            dispatch(commonActions.showApiLoader(false));
        }
    }
    catch (err) {
        console.log('err:', err)
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


export const handleDownloadDocument = async ({ dispatch, docId }) => {
    dispatch(commonActions.showApiLoader(true));
    try {
        let response = await downloadDocumentAPI({ docId })
        console.log('response download:', response)
        if (response?.status == 200 || response?.status == 204) {
            const documentDownloadUrl = response?.data?.downloadUrl
            // Create an anchor element
            const anchor = document.createElement('a');
            anchor.href = documentDownloadUrl;
            anchor.click();
            dispatch(commonActions.handleSnackbar({
                show: true,
                message: `Document Downloaded Successfully.`,
                type: "success",
            }))
            dispatch(commonActions.showApiLoader(false));
        } else {
            dispatch(commonActions.handleSnackbar({
                show: true,
                message: `Something went wrong!`,
                type: "error",
            }))
            dispatch(commonActions.showApiLoader(false));
        }
    }
    catch (err) {
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