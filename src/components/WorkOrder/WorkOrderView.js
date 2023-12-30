import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Styles from "../../ModuleStyles/WorkOrder/WorkOrderView.module.css"
import { downloadCSV, downloadXLSX, getDateAndTime, handleCreateRemark, handleDeleteWorkOrder, handleExtendingDueDate, handleGetAllDueDateRequests, handleGetDocumentImage, handleGetRemark, handleGetSingleWorkOrder, handleGetStatusDropdown, handleRequestToExtendDueDate, handleUpdateTheWorkOrderStatus, lcHandleDummyEncryption } from "../../utils/WorkOrderMethods/WorkOrderMethods"
import { workOrderStateManagementActions } from "../../Store/Reducers/ClonosWorkOrderReducer"
import CircularProgress from '@material-ui/core/CircularProgress';
import { useDispatch, useSelector } from 'react-redux'
import { getDayMonthYear, getFormattedTime, getToken, handleAllowDirectAccessPage, handleLoggedInUser, handleSegregateURL, handleShowErrorAndWarning, isDate1GreaterThanDate2, loginJumpLoadingStopper } from '../../utils/clonosCommon'
import Modal from '../CommonComponents/Modal/Modal'
import configs from '../../config'
import { commonActions } from "../../Store/Reducers/CommonReducer";
import useToggler from '../../CustomHooks/TogglerHook'
import ClonosConfirmationDialog from '../Dialogs/ClonosConfirmationDialog'
import { useRef } from 'react'
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { Container, Tooltip } from '@material-ui/core'
import Subbar from './Subbar'
import WO_Plus_Icon from "../../assets/UIUX/icons/WO/WO_Plus.svg"
import PartsAndToolsComp from './PartsAndToolsComp'
import PartsAndToolsCreateComp from './PartsAndToolsCreateComp'
import CloseIcon from '../../assets/Clonos Common Indicators/Icon_Components/CloseIcon'
import LabelDateComp from './LabelDateComp'
import { ClonosButton } from '../CommonComponents/Button/Button'
import { UnAuthorizedModal } from '../CommonComponents/UnAuthorizedPage/UnAuthorizedModal'
import ClonosInput from '../CommonComponents/ClonosInput/ClonosInput'
import RemarkMessage from './RemarkMessage'

const remarks = [
    {
        workOrderId: "string",
        remark: "string",
        createdOn: "data",
        createdBy: {
            name: "string",
            id: "string"
        },
        userImageURL: "https URL need",
        id: "string",
    },
    {
        workOrderId: "string",
        remark: "string",
        createdOn: "data",
        createdBy: {
            name: "string",
            id: "string"
        },
        userImageURL: "https URL need",
        id: "string",
    },
]

const WorkOrderView = () => {
    // Global States 
    const store = useSelector(store => store)
    const { mainLayoutChildrenPositionsToolkitState } = useSelector(store => store.globalEntitiesStateManagement);
    const { singleWorkOrderToolkitState, workOrderStatusDropdownToolkitState } = useSelector(store => store.workOrderStateManagement)
    const { workOrderDocuments, workOrderTasks, workOrderDetails } = singleWorkOrderToolkitState
    console.log('workOrderDetails:', workOrderDetails)

    // Local States
    const LOCATION = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const [imageUrl, setImageUrl] = useState("");
    const [statusAlert, setStatusAlert] = useToggler();
    const [statusChangeDialogBoxText, setStatusChangeDialogBoxText] = useState("");
    const statusRef = useRef(null);
    const [deleteWorkOrderAlert, setDeleteWorkOrderAlert] = useState(false);
    const [lcIntervals, setLcIntevals] = useState({});
    const [isExtendWorkOrderLimitModalOpen, setIsExtendWorkOrderLimitModalOpen] = useToggler();
    const [lsLocalLoading, setIsLocalLoading] = useToggler() // Custom Hook which returns boolean value (initial value : "false")
    const [isAddRemarkModalOpen, setIsAddRemarkModalOpen] = useState(false);
    const [isExtendDueDateModalOpen, setIsExtendDueDateModalOpen] = useState(false);
    const workOrderRemarkRef = useRef(null);
    const workOrderExtendDateReasonRef = useRef(null);
    const [lcValues, setLcValues] = useState({});
    console.log('lcValues:', lcValues)


    const repeatedElements = [{
        id: Math.random(),
        heading: "Parts Required",
        title: "Parts requested by the Assigned User",
        buttonText: "Add Parts",
        icon: WO_Plus_Icon
    },
    {
        id: Math.random(),
        heading: "Parts Required",
        title: "Parts requested by the Assigned User",
        buttonText: "Add Parts",
        icon: WO_Plus_Icon
    },
    {
        id: Math.random(),
        heading: "Tools Required",
        title: "Parts replaced by the Assigned User",
        buttonText: "Add Parts",
        icon: WO_Plus_Icon
    },
    {
        id: Math.random(),
        heading: "Consumables",
        title: "Parts replaced by the Assigned User",
        buttonText: "Add Parts",
        icon: WO_Plus_Icon
    },
    ]


    /**
     * WOE  = Work Order Edit
     * This function is getting use to jump to the edit page.
     */
    const handleGotoWOE = () => {
        navigate("/work-order-edit", { state: { workOrderId: workOrderDetails?.workOrderId } })
    }

    const handleGotoViewMaintenanceTask = () => {
        navigate("/view-maintenanceTask", { state: { maintenanceId: workOrderDetails?.maintenanceId } })
    }

    /**
     * This handler is getting use to see the images and pdf.
     * @param {string} documentId 
     * @param {string} type 
     */
    const handleViewDocuments = (documentId, type) => {
        const token = getToken();
        if (type == "png" || type == "jpg") {
            setIsOpen(true)
            handleGetDocumentImage({ documentId, setImageUrl })
        }
        else {
            window.open(`${configs.url}/?woDocId=${documentId}&token=${token}`);
        }
    }

    /**
     * donwload the work order detail in the CSV format.
     * @param {*} e => Synthetic Event 
     */
    const handleDownloadView = (e) => {
        if (e?.target?.value == "csv") {
            downloadCSV({ data: workOrderDetails })
        } else {
            downloadXLSX({ data: workOrderDetails })
        }
    }


    /**
     * This function will use to extent the end date of the work order.
     */
    const handleExtendDueDate = () => {
        setIsExtendDueDateModalOpen(true)
    }

    const lcHandleStatusChange = (e) => {
        const target = e?.target?.value
        if (workOrderDetails.status == target) {
            handleShowErrorAndWarning({ dispatch, type: "error", message: "Select different status!", showTime: 5000 })
            return
        }
        if (e.target.value == "On Hold") {
            setIsAddRemarkModalOpen(true)
            setLcValues({ ...lcValues, ["latestStatus"]: target })
        }
        else {
            handleUpdateTheWorkOrderStatus({ dispatch, workOrderId: workOrderDetails.workOrderId, status: target });
        }
    }

    const lcHandleAddRemark = () => {

        if (workOrderDetails.status == lcValues?.latestStatus) return
        handleCreateRemark({
            dispatch, payload: {
                workOrderId: workOrderDetails?.workOrderId,
                remarks: lcValues?.workOrderRemark,
                "createdBy": handleLoggedInUser()?.userId
            },
            locallyResponseSetterMethod: setLcValues
        });
        handleLoggedInUser()?.role_id == "076" && handleUpdateTheWorkOrderStatus({ dispatch, workOrderId: workOrderDetails.workOrderId, status: lcValues?.latestStatus });
        setIsAddRemarkModalOpen(false);
    }

    const lcHandleGetValues = ({ uniqueKey, updatedValue }) => {
        uniqueKey == "extendDueDate" && setLcValues({ ...lcValues, [uniqueKey]: updatedValue })
        uniqueKey == "extendDueDateReason" && setLcValues({ ...lcValues, [uniqueKey]: updatedValue })
        uniqueKey == "workOrderRemark" && setLcValues({ ...lcValues, [uniqueKey]: updatedValue })
    }

    const lcHandleExtendDueDate = () => {
        if ((lcValues?.extendDueDate && lcValues?.extendDueDateReason) || handleLoggedInUser().role_id == "086") {
            if (handleLoggedInUser().role_id == "076") {
                handleRequestToExtendDueDate(
                    {
                        workOrderId: workOrderDetails?.workOrderId,
                        dispatch,
                        payload: {
                            "remarks": lcValues?.extendDueDateReason,
                            "createdBy": handleLoggedInUser().userId,
                            "requestedDate": lcValues?.extendDueDate,
                            "isFromRequest": true
                        },
                        locallyResponseSetterMethod: setLcValues
                    })
            } else {
                handleExtendingDueDate(
                    {
                        workOrderId: workOrderDetails?.workOrderId,
                        dispatch,
                        payload: {
                            "remarks": lcValues?.extendDueDateReason ? lcValues?.extendDueDateReason : "Due Date Extended.",
                            "createdBy": handleLoggedInUser().userId,
                            "dueDate": lcValues?.extendDueDate ? lcValues?.extendDueDate : lcValues?.requestsForDueDateExtension[0]?.requestedDate,
                            "woDueDateId": lcValues?.requestsForDueDateExtension[0]?.woDueDateId,
                            "isFromRequest": true
                        },
                        locallyResponseSetterMethod: setLcValues
                    })
            }
        }
        else {
            handleShowErrorAndWarning({ dispatch, type: "error", message: `Please select both fields!`, showTime: 5000 })
        }
        setIsExtendDueDateModalOpen(false)
    }




    useEffect(() => {
        //Segregate URL parameters
        const URL = handleSegregateURL();

        //Check if Unity is enabled in the URL
        if (URL?.unity == 1) {
            (async () => {
                try {
                    //Allow direct access and fetch the work order ID
                    const workOrderId = await handleAllowDirectAccessPage({ keyName: "workOrderId" });
                    console.log('workOrderId:', workOrderId)
                    //Get and update the single work order based on the obtained ID
                    handleGetSingleWorkOrder({ dispatch, workOrderId, workOrderStateManagementActions });
                } catch (err) {
                    console.log('err:', err);
                }
            })();
        } else {
            //Unity not enabled, get work order ID from location state
            handleGetSingleWorkOrder({ dispatch, workOrderId: LOCATION?.state?.workOrderId, workOrderStateManagementActions });
        }

        //Perform dummy encryption
        lcHandleDummyEncryption(workOrderDetails?.workOrderId);

        //Fetch and set status dropdown options
        handleGetStatusDropdown({ dispatch, workOrderStateManagementActions });

        // Fetch Remarks
        handleGetRemark({ dispatch, workOrderId: LOCATION?.state?.workOrderId, locallyResponseSetterMethod: setLcValues })

        // Fetch All Work Order Extend Due Date Requests.
        handleGetAllDueDateRequests({ dispatch, workOrderId: LOCATION?.state?.workOrderId, locallyResponseSetterMethod: setLcValues })

        return () => {
            // Cleanup: Clear the loading interval
            clearInterval(lcIntervals['updateLayout']);
        };
    }, [workOrderDetails?.status]);  // Dependency: Re-run the effect when the status changes


    if (handleLoggedInUser()?.permissions?.includes('wko004')) {
        return (
            <>
                <div className={Styles.wov_container} style={{ height: mainLayoutChildrenPositionsToolkitState?.viewPortUnit?.remainingPart?.height }}>
                    <nav className={Styles.wov_nav} /** wol = work_order_list */ >
                        <Subbar
                            isCopy={handleLoggedInUser()?.permissions?.includes("wko016")}
                            isEdit={handleLoggedInUser()?.permissions?.includes("wko002")}
                            isDelete={handleLoggedInUser()?.permissions?.includes("wko003")}
                            isDownload={handleLoggedInUser()?.permissions?.includes("wko008")}
                            isHollow={false}
                            isPriority={true}
                            isStatus={true}
                            isCreatedOn={!isDate1GreaterThanDate2(new Date().toISOString().split('T')[0], workOrderDetails?.endDate)}
                            isExpiredOn={isDate1GreaterThanDate2(new Date().toISOString().split('T')[0], workOrderDetails?.endDate)}
                            subbarData={workOrderDetails}
                            isEditMethod={() => handleGotoWOE()}
                            isDownloadMethod={() => handleDownloadView("xlxs")}
                            isDeleteMethod={() => setDeleteWorkOrderAlert(true)}
                            buttons={
                                [
                                    {
                                        buttonMethod: "",
                                        isHollow: false,
                                        buttonText: "Change Status",
                                        // isActive: !isDate1GreaterThanDate2(new Date().toISOString().split('T')[0], workOrderDetails?.endDate)
                                        isActive: false,
                                        isDisabled: false
                                    },
                                    {
                                        buttonMethod: handleExtendDueDate,
                                        isHollow: true,
                                        buttonText: "Extend Due Date",
                                        isActive: lcValues?.requestsForDueDateExtension?.length > 0 && handleLoggedInUser().role_id == "086",
                                        isDisabled: false
                                    },
                                    {
                                        buttonMethod: handleExtendDueDate,
                                        isHollow: true,
                                        buttonText: "Request Extension",
                                        isActive: isDate1GreaterThanDate2(new Date().toISOString().split('T')[0], workOrderDetails?.endDate) && handleLoggedInUser().role_id == "076" && lcValues?.requestsForDueDateExtension?.length == 0,
                                        isDisabled: false
                                    },
                                    {
                                        type: "select",
                                        buttonMethod: lcHandleStatusChange,
                                        isHollow: true,
                                        buttonText: "Change Status",
                                        isActive: true,
                                        isDisabled: isDate1GreaterThanDate2(new Date().toISOString().split('T')[0], workOrderDetails?.endDate) || workOrderDetails?.status == "Completed",
                                        options: [
                                            { label: "Accepted", value: "Accepted", isDisabled: workOrderDetails?.status == "Accepted" || workOrderDetails?.status == "On Hold" || workOrderDetails?.status == "Continue", isNeeded: handleLoggedInUser().role_id == "076" },
                                            { label: "On Hold", value: "On Hold", isDisabled: isDate1GreaterThanDate2(new Date().toISOString().split('T')[0], workOrderDetails?.endDate) || workOrderDetails?.status == "Completed", isNeeded: true },
                                            { label: "Continue", value: "Continue", isDisabled: isDate1GreaterThanDate2(new Date().toISOString().split('T')[0], workOrderDetails?.endDate) || workOrderDetails?.status == "Completed", isNeeded: true },
                                            { label: "Completed", value: "Completed", isDisabled: isDate1GreaterThanDate2(new Date().toISOString().split('T')[0], workOrderDetails?.endDate) || workOrderDetails?.status == "Completed", isNeeded: true },
                                        ]
                                    }
                                ]
                            }
                        />
                    </nav>
                    <div className={Styles.wov_body_wrapper} style={{ height: `${mainLayoutChildrenPositionsToolkitState?.remUnit?.remainingPart?.height?.split("r")[0] - 4.375}rem` }}>
                        <section className={Styles.wov_body}>
                            <header className={Styles.wov_header}>
                                <div>
                                    <span className={Styles.wov_header_title}>{workOrderDetails?.title}</span>
                                    {
                                        workOrderDetails?.isAutoCreated == 1 && <span onClick={handleGotoViewMaintenanceTask} className={Styles.wov_view_maintenance_plan}>View Maintenance Plan</span>
                                    }
                                </div>
                            </header>
                            <section className={Styles.wov_body_split}>
                                <div>
                                    <div className={Styles.wov_bs_c1}>
                                        <table>
                                            <tr>
                                                <td>Work Order Number:</td>
                                                <td>
                                                    {workOrderDetails?.woNumber ? workOrderDetails?.woNumber : "Not Mentioned"}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Description:</td>
                                                <Tooltip title={workOrderDetails?.description}>
                                                    <td>
                                                        <p>
                                                            {workOrderDetails?.description ? workOrderDetails?.description : "Not Mentioned"}
                                                        </p>
                                                    </td>
                                                </Tooltip>
                                            </tr>
                                            <tr>
                                                <td>Department:</td>
                                                <td>{workOrderDetails?.department?.departmentName ? workOrderDetails?.department?.departmentName : "Not Mentioned"}</td>
                                            </tr>
                                            <tr>
                                                <td>Asset Name:</td>
                                                <td>{workOrderDetails?.asset ? workOrderDetails?.asset?.name : "Not Mentioned"}</td>
                                            </tr>
                                            <tr>
                                                <td>Start Date</td>
                                                <td>{workOrderDetails?.startDate ? workOrderDetails?.startDate?.split("-").join("/") : "Not Mentioned"}</td>
                                            </tr>
                                            <tr>
                                                <td>End Date</td>
                                                <td>{workOrderDetails?.endDate ? workOrderDetails?.endDate?.split("-").join("/") : "Not Mentioned"}</td>
                                            </tr>
                                            <tr>
                                                <td>Estimation Days</td>
                                                <td>{workOrderDetails?.estimationDays ? `${workOrderDetails?.estimationDays} Days` : "Not Mentioned"}</td>
                                            </tr>
                                            <tr>
                                                <td>Estimation Hours</td>
                                                <td>{workOrderDetails?.hours ? `${workOrderDetails?.hours} Hrs` : "Not Mentioned"}</td>
                                            </tr>
                                            <tr>
                                                <td>Assignee:</td>
                                                <td>{workOrderDetails?.assignee && Array.isArray(workOrderDetails?.assignee) ? workOrderDetails?.assignee[0]?.name : "Not Mentioned"}</td>
                                            </tr>
                                            <tr>
                                                <td>Team</td>
                                                <td>{workOrderDetails?.team?.length && Array.isArray(workOrderDetails?.team) ? workOrderDetails?.team?.map(ele => ele.name).join(" || ") : "Not Mentioned"}</td>
                                            </tr>

                                        </table>
                                    </div>
                                    <div className={Styles.wov_bs_c2}>
                                        <header><span>Tasks details</span></header>
                                        <div className={Styles.wov_bs_c2_tasks}>
                                            {
                                                workOrderTasks?.length ? workOrderTasks?.map((ele, index) => {
                                                    return <div key={ele?.woTaskId}>
                                                        <span>Task {index + 1} - </span>
                                                        <Tooltip title={ele?.woTaskName}>
                                                            <span>{ele?.woTaskName}</span>
                                                        </Tooltip>
                                                    </div>
                                                }) : <span>No Tasks Available!</span>
                                            }
                                        </div>
                                    </div>

                                    {
                                        !handleLoggedInUser()?.role_id == "086" ?
                                            <div className={Styles.wov_bs_c3}>
                                                {
                                                    ["Parts Required", "Parts Required", "Tools Required", "Consumables"]?.map((element) => {
                                                        return <PartsAndToolsComp title={element} data={[]} />
                                                    })
                                                }
                                            </div>
                                            :
                                            <div className={Styles.wov_bs_c3}>
                                                {
                                                    repeatedElements?.map((element) => {
                                                        return <PartsAndToolsCreateComp data={element} />
                                                    })
                                                }
                                            </div>
                                    }

                                </div>
                                <div>
                                    <div className={Styles.wov_bs_rc1}>
                                        <header><span>Documents</span></header>
                                        <div className={Styles.wov_bs_rc1_documents}>
                                            {
                                                workOrderDocuments?.length ? workOrderDocuments?.map((ele, index) => {
                                                    return <div key={ele.docId} onClick={() => handleViewDocuments(ele.docId, ele.type)}><span>{ele.documentName}</span></div>
                                                }) : <span>No Documents Available!</span>
                                            }
                                        </div>
                                    </div>
                                    <div aria-label="Remark" className={Styles.wov_remark_view_container}>
                                        {
                                            handleLoggedInUser().role_id == "086" && <div className={Styles.wov_remark_view_heading}>
                                                <span onClick={() => setIsAddRemarkModalOpen(true)}>+ Add Remarks</span>
                                            </div>
                                        }
                                        <h3>Remarks</h3>
                                        <div className={Styles.wov_remark_map_container}>
                                            {
                                                lcValues?.remarksResponse?.map((item, index) => {
                                                    return <RemarkMessage item={item} uniqueKey={item.id} prevDate={index > 0 && lcValues?.remarksResponse[index - 1]?.createdDate?.split("T")[0]} />
                                                })
                                            }
                                        </div>

                                    </div>
                                </div>
                            </section>
                        </section>
                    </div>
                </div >

                <Modal isOpen={isOpen} closeModalMethod={setIsOpen}>
                    <div className={Styles.wov_modal}>
                        {
                            imageUrl == "" ? <CircularProgress /> : <img src={imageUrl} />
                        }
                    </div>
                </Modal>

                <Modal isOpen={isExtendWorkOrderLimitModalOpen} closeModalMethod={setIsExtendWorkOrderLimitModalOpen}>
                    <div className={Styles.wov_extent_wo_limit_modal_container}>
                        <section className={Styles.wov_ewolmc_heading}>
                            <p>Extend Due Date</p>
                            <CloseIcon tooltipTitle="Close" onClick={() => setIsExtendWorkOrderLimitModalOpen(false)} />
                        </section>
                        <section className={Styles.wov_ewolmc_content}>
                            <LabelDateComp label="Extend Till" isMandatory={true} type="date" formValues={{ startDate: workOrderDetails?.startDate }} />
                            <div>
                                <ClonosButton>Cancel</ClonosButton>
                                <ClonosButton>Extend</ClonosButton>
                            </div>
                        </section>
                    </div>
                </Modal>

                <Modal isOpen={isAddRemarkModalOpen} closeModalMethod={setIsAddRemarkModalOpen}>
                    <div className={Styles.wov_remark_container}>
                        <header className={Styles.wov_remark_heading_container}>
                            <span className={Styles.wov_remark_heading}>Add Remark</span>
                            <CloseIcon tooltipTitle="Close" onClick={() => setIsAddRemarkModalOpen(false)} />
                        </header>
                        <section className={Styles.wov_remark_body}>
                            <div className={Styles.wov_remark_textarea}>
                                <label>Remark<sup>*</sup></label>
                                <textarea ref={workOrderRemarkRef} placeholder='Add Remark' onChange={(e) => lcHandleGetValues({ uniqueKey: "workOrderRemark", updatedValue: e.target.value })}></textarea>
                            </div>
                        </section>
                        <footer className={Styles.wov_remark_footer_container}>
                            <ClonosButton isHollow={true} onClick={() => setIsAddRemarkModalOpen(false)}>Cancel</ClonosButton>
                            <ClonosButton onClick={() => lcHandleAddRemark()}>Save</ClonosButton>
                        </footer>
                    </div>
                </Modal>

                <Modal isOpen={isExtendDueDateModalOpen} closeModalMethod={setIsExtendDueDateModalOpen}>
                    <div aria-label='Extend Due Date' className={Styles.wov_extend_due_date_container}>
                        <header className={Styles.wov_extend_due_date_header}>
                            <span className={Styles.wov_extend_due_date_heading}>{handleLoggedInUser().role_id == "076" ? "Add Remark" : "Extending Dua Date"}</span>
                            <CloseIcon tooltipTitle="Close" onClick={() => setIsExtendDueDateModalOpen(false)} />
                        </header>
                        <section className={Styles.wov_extend_due_date_body}>
                            {
                                handleLoggedInUser().role_id == "076" ?
                                    <div className={Styles.wov_extend_due_date_textarea}>
                                        <label>Reason<sup>*</sup></label>
                                        <textarea ref={workOrderExtendDateReasonRef} placeholder='Reason for delay' onChange={(e) => lcHandleGetValues({ uniqueKey: "extendDueDateReason", updatedValue: e.target.value })}></textarea>
                                    </div>
                                    :
                                    <div className={Styles.wov_extend_due_date_engineer_container}>
                                        <div className={Styles.wov_extend_due_date_engineer_reason}>
                                            <bdi>Reason</bdi>
                                            <span>{lcValues?.requestsForDueDateExtension && lcValues?.requestsForDueDateExtension[0]?.remarks}</span>
                                        </div>
                                        <div className={Styles.wov_extend_due_date_engineer_requestedDate}>
                                            <bdi>Requested Date</bdi>
                                            <div>
                                                <span>{lcValues?.requestsForDueDateExtension && getDayMonthYear(lcValues?.requestsForDueDateExtension[0]?.requestedDate).day}</span>
                                                <span>{lcValues?.requestsForDueDateExtension && getDayMonthYear(lcValues?.requestsForDueDateExtension[0]?.requestedDate).monthString}</span>
                                                <span>{lcValues?.requestsForDueDateExtension && getDayMonthYear(lcValues?.requestsForDueDateExtension[0]?.requestedDate).year}</span>
                                            </div>
                                        </div>
                                    </div>
                            }
                            <ClonosInput label="Extention Date" isLabel={true} isMandatory={true} type="date" placeholder="12/30/9999" uniqueKey="extendDueDate" handleGetValues={lcHandleGetValues} />
                            {
                                handleLoggedInUser()?.role_id == "086" && <div className={Styles.wov_extend_due_date_textarea}>
                                    <label>Add Remark</label>
                                    <textarea ref={workOrderExtendDateReasonRef} placeholder='Add Remark If Needed.' onChange={(e) => lcHandleGetValues({ uniqueKey: "extendDueDateReason", updatedValue: e.target.value })}></textarea>
                                </div>
                                //  <textarea ref={workOrderExtendDateReasonRef} placeholder='Reason for delay' onChange={(e) => lcHandleGetValues({ uniqueKey: "extendDueDateReason", updatedValue: e.target.value })}></textarea>
                            }
                        </section>
                        <footer className={Styles.wov_extend_due_date_footer}>
                            <ClonosButton onClick={() => lcHandleExtendDueDate()}>{handleLoggedInUser()?.role_id == "076" ? "Send Request" : "Approve"}</ClonosButton>
                        </footer>
                    </div>
                </Modal>

                <ClonosConfirmationDialog
                    Open={statusAlert}
                    Title="Status Work Order"
                    Content={statusChangeDialogBoxText}
                    CloseDialog={() => setStatusAlert(false)}
                    ProceedDialog={() => {
                        if (statusRef.current.value == "Completed" && workOrderDetails?.team && workOrderDetails?.users && workOrderDetails?.asset && workOrderDetails?.priority) {
                            handleUpdateTheWorkOrderStatus({ dispatch, commonActions, workOrderId: workOrderDetails?.workOrderId, status: { status: statusRef?.current?.value }, workOrderStateManagementActions })
                        }
                        setStatusAlert(false)
                    }}
                    warning={true}
                />

                <ClonosConfirmationDialog
                    Open={deleteWorkOrderAlert}
                    Title="Delete Work Order"
                    Content={"Are you really want to delete this work order?"}
                    CloseDialog={() => setDeleteWorkOrderAlert(false)}
                    ProceedDialog={() => {
                        handleDeleteWorkOrder({ workOrderId: workOrderDetails?.workOrderId, dispatch, navigate })
                        setDeleteWorkOrderAlert(false)
                    }}
                />
            </>
        )
    }
    return !lsLocalLoading ? <h1 style={{ textAlign: "center" }}>Loading...</h1> :
        <Container component="main" maxWidth="sm">
            <UnAuthorizedModal />
        </Container>
}

export default WorkOrderView

