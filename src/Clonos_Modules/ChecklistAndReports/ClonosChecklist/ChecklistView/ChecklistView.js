import React, { useState } from 'react'
import Styles from "../../../../ModuleStyles/ChecklistAndReports/ClonosChecklist/ChecklistView/ChecklistView.module.css"
import { useSelector } from 'react-redux';
import Subbar from '../../../../components/WorkOrder/Subbar';
import { useLocation, useNavigate } from 'react-router-dom';
import { exportChecklistInformaiton, handleApproveTheValidateRequest, handleChangeChecklistStatus, handleCreateValidateRequests, handleDeleteChecklist, handleEditChecklist, handleGetSingleChecklist, handleGetSingleChecklistDetaSets, handleGetValidateRequests } from '../../../../utils/ChecklistAndReportsMethods/ChecklistMethod';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { generateUniqueId, getDayMonthYear, getFormatedDate, getToken, handleGetENVVariables, handleLoggedInUser, handleRedirectAfterEvent } from '../../../../utils/clonosCommon';
import ClonosConfirmationDialog from '../../../../components/Dialogs/ClonosConfirmationDialog';
import { useRef } from 'react';
import { Tooltip } from '@mui/material';
import Modal from '../../../../components/CommonComponents/Modal/Modal';
import ClonosExportOptions from '../../../../components/CommonComponents/ClonosExportOptions/ClonosExportOptions';
import { ClonosButton } from '../../../../components/CommonComponents/Button/Button';
import ClonosDataGrid from '../../../../components/CommonComponents/ClonosDataGrid/ClonosDataGrid';
import COMMON_EYE_ICON from "../../../../assets/UIUX/icons/Common_Icon/COMMON_EYE_ICON.svg"
import ClonosInput from '../../../../components/CommonComponents/ClonosInput/ClonosInput';
import { ChecklistTemplatePreview } from '../../../../components/ClonosChecklist/ChecklistTemplatePreview';
import ClonosConfirmationBox from '../../../../components/CommonComponents/ClonosConfirmationBox/ClonosConfirmationBox';
import { DataGrid } from '@material-ui/data-grid';

const ChecklistView = () => {
    // Global States 
    const { mainLayoutChildrenPositionsToolkitState } = useSelector(store => store.globalEntitiesStateManagement);
    console.log('mainLayoutChildrenPositionsToolkitState:', mainLayoutChildrenPositionsToolkitState)

    // Local States
    const LOCATION = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const generalDetailsRef = useRef(null)
    const [lcIntervals, setLcIntervals] = useState({});
    const [isDownloadModal, setIsDownloadModal] = useState(false);
    const [isPreviewTemplateModal, setIsPreviewTemplateModal] = useState(false);
    const [needToExportFileDetails, setNeedToExportFileDetails] = useState({})
    const [allAreasThatNeedsToExportAsPDFState, setAllAreasThatNeedsToExportAsPDFState] = useState([])
    const [confirmationDialogStates, setConfirmationDialogStates] = useState({ checklistDeleteState: false })
    const [lcValues, setLcValues] = useState({
        validateLoading: false,
        approveLoading: false,
        reviseLoading: false,
        validateRequestServerResponse: null
    })
    const [isValidateConfirmationModal, setIsValidateConfirmationModal] = useState(false);
    console.log('lcValues:', lcValues)
    const { lcChecklistData, singleChecklistDataSetsDetails, validateRequestServerResponse } = lcValues;
    console.log('singleChecklistDataSetsDetails:', singleChecklistDataSetsDetails)



    const columns = [
        {
            field: "index",
            headerName: "SI.NO",
            // width:"200",
            flex: 1,
            disableColumnFilter: true,
            headerClassName: "ast_column_header",
            filterPanelClassName: "ast_column_filterPanel",
            valueGetter: (params) => params?.row?.index || "Not Available"
        },
        {
            field: "fieldName",
            headerName: "Field Name",
            // width:"200",
            flex: 1,
            disableColumnFilter: true,
            headerClassName: "ast_column_header",
            valueGetter: (params) => params?.row?.fieldName || "Not Available",
        },
        {
            field: "fieldValue",
            headerName: "Value",
            // width:"200",
            flex: 1,
            disableColumnFilter: true,
            headerClassName: "ast_column_header",
            valueGetter: (params) => params?.row?.fieldValue ?
                (params?.row?.attributeName == "text" || params?.row?.attributeName == "number" || params?.row?.attributeName == "date") ? params?.row?.fieldValue[params?.row?.attributeName] ? params?.row?.fieldValue[params?.row?.attributeName] : "Not Mentioned"
                    :
                    params?.row?.fieldValue[params?.row?.attributeName]?.filter((item) => {
                        if (item?.isSelected) return item?.optionValue
                        // if(index==params?.row?.fieldValue[params?.row?.attributeName]?.length) 
                    }).join(",") :
                "Not Available"
        }
    ]

    console.log('lcChecklistData:', lcChecklistData)

    const handleGetDetails = (props) => {
        setNeedToExportFileDetails(props)
    }

    const handleExportFile = () => {
        exportChecklistInformaiton(
            {
                fileName: needToExportFileDetails?.fileName,
                type: needToExportFileDetails?.format,
                pdfData: allAreasThatNeedsToExportAsPDFState,
                pageType: needToExportFileDetails?.pageType,
                xlsxData: lcChecklistData
            })
        setIsDownloadModal(false)
    }

    const lcHandleGoToChecklistEdit = () => {
        navigate("/create-checklist-generaldetails", { state: { "mode": "edit", "id": LOCATION?.state?.id } })
    }

    useEffect(() => {
        handleGetSingleChecklist({ dispatch, responseSetterMethod: setLcValues, checklistId: LOCATION?.state?.id, uniqueKey: "lcChecklistData" }) // Getting the single checklist informaiton.
        handleGetSingleChecklistDetaSets({ dispatch, responseSetterMethod: setLcValues, checklistId: LOCATION?.state?.id }) // Getting the single checklist data sets informaiton.
        setAllAreasThatNeedsToExportAsPDFState([...allAreasThatNeedsToExportAsPDFState, generalDetailsRef.current]) // Here we are stoting all those element that we want to print in PDF exports.

        handleGetValidateRequests({ responseSetterMethod: setLcValues, checklistId: LOCATION?.state?.id, dispatch, uniqueKey: "validateRequestServerResponse" })

        return () => {
            clearInterval(lcIntervals?.deleteChecklist)
        }
    }, [])


    const checkMethod = (requestId) => {
        console.log('requestId:', requestId)
        const apiUrl = `http://20.204.85.50:3333/api/v1/checklists/aprroveValidateRequest/${requestId}`; // Replace with your API endpoint
        // handleApproveTheValidateRequest({ dispatch, checklistId: lcChecklistData?.id, requestId: validateRequestServerResponse[0]?._id, responseSetterMethod: setLcValues, uniqueKey: "approveLoading", payload: { status: "completed" } })
        const token = getToken()
        console.log('getToken:', getToken)
        const payload = { status: "completed" }

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Set the content type based on your API's requirements
                // Add any other headers if needed
                Authorization: `Bearer ${token}`

            },
            body: JSON.stringify(payload),

        };


        fetch(apiUrl, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('PUT request successful', data);
                // Handle the successful response data here
                handleChangeChecklistStatus({ checklistId: lcChecklistData?.id, dispatch, payload: { status: payload?.status }, isGetResponse: true })
            })
            .catch(error => {
                console.error('Error making PUT request', error);
                // Handle errors here
            });
    }



    useEffect(() => {
        if (validateRequestServerResponse?.length) {
            handleGetSingleChecklist({ dispatch, responseSetterMethod: setLcValues, checklistId: LOCATION?.state?.id, uniqueKey: "lcChecklistData" }) // Getting the single checklist informaiton.
        }
    }, [validateRequestServerResponse?.length])


    console.log(lcChecklistData, "setLcChecklistData")
    return (
        <>
            <div className={Styles.checklistListing_container} style={{ height: mainLayoutChildrenPositionsToolkitState?.viewPortUnit?.remainingPart?.height }}>
                <nav className={Styles.checklist_view_nav} >
                    <Subbar
                        isCopy={handleLoggedInUser()?.permissions.includes("ckl016")}
                        isEdit={handleLoggedInUser()?.permissions.includes("ckl002")}
                        isDelete={handleLoggedInUser()?.permissions.includes("ckl003")}
                        isDownload={handleLoggedInUser()?.permissions.includes("ckl008")}
                        isStatus={true}
                        isEditMethod={lcHandleGoToChecklistEdit}
                        isDeleteMethod={() => setConfirmationDialogStates({ ...confirmationDialogStates, ["checklistDeleteState"]: true })}
                        isDownloadMethod={() => setIsDownloadModal(true)}
                        subbarData={lcChecklistData}
                        staticElements={
                            [
                                { "key": "Last Updated On:", value: getFormatedDate(lcChecklistData?.updatedDate) },
                                { "key": "Last Updated By:", value: lcChecklistData?.updatedBy?.name },
                            ]
                        }
                        htmlElements={[
                            <div key={generateUniqueId(2)} onClick={() => setIsPreviewTemplateModal(true)}>
                                <img src={COMMON_EYE_ICON} alt='Eye Icon' loading='lazy' />
                                <span style={{
                                    color: "#0A5FFF",
                                    fontFamily: "Roboto",
                                    fontSize: "1rem",
                                    fontStyle: "normal",
                                    fontWeight: "600",
                                    lineHeight: "normal"
                                }}>Preview</span>
                            </div>
                        ]}
                    />
                </nav >
                <section className={Styles.checklist_view_content_container} style={{ height: `${mainLayoutChildrenPositionsToolkitState?.remUnit?.remainingPart?.height?.split("r")[0] - 4.375}rem` }}>
                    <div className={Styles.checklist_view_content_body} id='checklist_view_content_body'>
                        <div aria-label='template preview and general detail container' className={Styles.checklist_view_template_and_general_detail_container}>
                            <div className={Styles.checklist_view_general_details_container}>
                                <section aria-label='General details' className={Styles.checklist_view_general_details} >
                                    <div className={Styles.checklist_view_general_details_child_container}>
                                        <table>
                                            <tr>
                                                <td>Document Number</td>
                                                <td>{lcChecklistData?.documentNumber ? lcChecklistData?.documentNumber : "Not Mentioned"}</td>
                                            </tr>
                                            <tr>
                                                <td>Name</td>
                                                <td>{lcChecklistData?.name ? lcChecklistData?.name : "Not Mentioned"}</td>
                                            </tr>
                                            <tr>
                                                <td>Description</td>
                                                <Tooltip title={lcChecklistData?.description}>
                                                    <td>{lcChecklistData?.description ? lcChecklistData?.description : "Not Mentioned"}</td>

                                                </Tooltip>
                                            </tr>
                                            <tr>
                                                <td>Assigned User</td>
                                                <td>{lcChecklistData?.assignee?.name ? lcChecklistData?.assignee?.name : "Not Mentioned"}</td>
                                            </tr>
                                            <tr>
                                                <td>Team</td>
                                                <td>{lcChecklistData?.team?.dropdownValues ? lcChecklistData?.team?.dropdownValues : "Not Mentioned"}</td>
                                            </tr>
                                        </table>
                                        <table>
                                            <tr>
                                                <td>Frequency</td>
                                                <td>{lcChecklistData?.frequencyType?.dropdownValues ? `${lcChecklistData?.frequencyType?.dropdownValues} ${lcChecklistData?.frequencyPeriod && `(Every ${lcChecklistData?.frequencyPeriod})`}` : "Not Mentioned"}</td>
                                            </tr>
                                            <tr>
                                                <td>Asset</td>
                                                <td style={{ color: "#0A5FFF" }}>{lcChecklistData?.asset?.assetName ? lcChecklistData?.asset?.assetName : "Not Mentioned"}</td>
                                            </tr>
                                            <tr>
                                                <td>Scheduled Time</td>
                                                <td>{lcChecklistData?.startDate ? `${getFormatedDate(lcChecklistData?.startDate)} ${getDayMonthYear(lcChecklistData?.startDate).time}` : "Not Mentioned"}</td>
                                            </tr>
                                            <tr>
                                                <td>Created On</td>
                                                <td>{lcChecklistData?.createdDate ? getFormatedDate(lcChecklistData?.createdDate) : "Not Mentioned"}</td>
                                            </tr>
                                            <tr>
                                                <td>Last Updated On</td>
                                                <td>{lcChecklistData?.updatedDate ? getFormatedDate(lcChecklistData?.updatedDate) : "Not Mentioned"}</td>
                                            </tr>
                                        </table>
                                    </div>
                                </section>
                                <div className={Styles.validate_container} aria-label='Validate the checklist data sets contianer'>
                                    {
                                        handleLoggedInUser()?.role_id === handleGetENVVariables().REACT_APP_USER_ROLE_OF_MANAGER && validateRequestServerResponse?.length > 0 && <>
                                            <ClonosButton loading={lcValues?.reviseLoading} isDisabled={lcValues?.reviseLoading} isHollow={true}>Revise</ClonosButton>
                                            <ClonosButton
                                                loading={lcValues?.validateLoading || lcValues?.approveLoading}
                                                isDisabled={lcValues?.validateLoading || lcValues?.approveLoading}
                                                onClick={() => setIsValidateConfirmationModal(true)}
                                            >APPROVE</ClonosButton>
                                        </>
                                    }
                                    {

                                        handleLoggedInUser()?.role_id !== handleGetENVVariables().REACT_APP_USER_ROLE_OF_OPERATOR && handleLoggedInUser().role_id === "086" && lcChecklistData?.status !== "completed" && <ClonosButton
                                            loading={lcValues?.validateLoading || lcValues?.approveLoading}
                                            isDisabled={lcValues?.validateLoading || validateRequestServerResponse?.length}
                                            onClick={() => setIsValidateConfirmationModal(true)}
                                        >Validate</ClonosButton>
                                    }
                                </div>
                            </div>
                            <div className={Styles.checklist_view_template_container}>
                                <ClonosDataGrid
                                    rows={singleChecklistDataSetsDetails ? singleChecklistDataSetsDetails : []}
                                    columns={columns}
                                    pageLimit={10}
                                    height={"400"}
                                    isEdit={false}
                                    isDelete={false}
                                    uniqueIdField="id"
                                    checkboxSelection={true}
                                />
                            </div>

                        </div>
                    </div>
                </section >
            </div >
            <Modal isOpen={isDownloadModal} closeModalMethod={setIsDownloadModal}>
                <ClonosExportOptions handleGetDetails={handleGetDetails} handleExportFile={handleExportFile} formats={["pdf", "excel", "xlsx"]} />
            </Modal>
            <Modal isOpen={isPreviewTemplateModal} closeModalMethod={setIsPreviewTemplateModal}>
                <div className={Styles.preview_container}>
                    <ChecklistTemplatePreview attributes={lcChecklistData?.dataSets} isEdit={false} />
                </div>
            </Modal>

            <ClonosConfirmationBox
                isOpen={isValidateConfirmationModal}
                confirmingMethod={() => {
                    if (handleLoggedInUser()?.role_id === handleGetENVVariables().REACT_APP_USER_ROLE_OF_MANAGER) {
                        handleApproveTheValidateRequest({ dispatch, checklistId: lcChecklistData?.id, requestId: validateRequestServerResponse[0]?.requestId, responseSetterMethod: setLcValues, uniqueKey: "approveLoading", payload: { status: "completed" } })
                        // checkMethod(validateRequestServerResponse[0]?.requestId)
                    } else {
                        handleCreateValidateRequests({ dispatch, checklistId: lcChecklistData?.id, responseSetterMethod: setLcValues, uniqueKey: "validateLoading" })
                    }
                    setIsValidateConfirmationModal(false)
                }}
                closeModalMethod={setIsValidateConfirmationModal}
                headerTitle="Sending for approval."
                message="Do you confirm that you are sending this checklist for further approval ?"
            />

            <ClonosConfirmationDialog
                Open={confirmationDialogStates?.checklistDeleteState}
                Title="Delete Checklist"
                Content="Are you sure, You want to delete this checklist?"
                CloseDialog={() => setConfirmationDialogStates({ ...confirmationDialogStates, ["checklistDeleteState"]: false })}
                ProceedDialog={async () => {
                    try {
                        const response = await handleDeleteChecklist({ dispatch, selectedRows: [lcChecklistData.id], isLocalUpdate: false }); // here it will return the response and based on the status we are restructing the user to redirect to the next page like if the status is note

                        if (response && (response.status === 200 || response.status === 201)) {
                            let interval = handleRedirectAfterEvent({ targetRoute: "/checklist-listing", timeout: 1000, navigate });
                            setLcIntervals({ ...lcIntervals, "deleteChecklist": interval });
                        }
                    } catch (error) {
                        console.error('Error during checklist deletion:', error);
                    } finally {
                        setConfirmationDialogStates({ ...confirmationDialogStates, ["checklistDeleteState"]: false });
                    }
                }}
            />

        </>
    )
}

export default React.memo(ChecklistView)