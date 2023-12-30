import { memo } from "react"
import Styles from "../../ModuleStyles/ScheduledMaintenance/ViewMaintenanceTask.module.css"
import { useEffect } from "react";
import { getFormatedDate, handleLoginExpiry, handleShowErrorAndWarning, updateLayout } from "../../utils/clonosCommon";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import VIEW_MAINTENANCE_TASK_TODO_STATUS from "../../assets/UIUX/icons/alert-circle.svg";
import VIEW_MAINTENANCE_TASK_DONE_STATUS from "../../assets/UIUX/icons/ScheduleMaintenance/success-check.svg"
import VIEW_MAINTENANCE_TASK_PENDING_STATUS from "../../assets/UIUX/icons/ScheduleMaintenance/hourglass-empty.svg"
import { useState } from "react";
import { getScheduledMaintenanceDetails } from "../../Api/ScheduleMaintenance/ScheduleMaintenance";
import { postAuditLog } from "../../Api/User/UserApi";
import { useLocation } from "react-router";

const ViewScheduleMantenance = () => {
    const dispatch = useDispatch();
    const Location = useLocation();
    const [maintenanceTaskDetails,setMaintenanceTaskDetails] = useState({})
    const { mainLayoutChildrenPositionsToolkitState } = useSelector(
        (store) => store.globalEntitiesStateManagement
      );
    const maintenanceTask = [
        {
            _id:"1",
            name:"task1",
            status:"In Progress"
        },
        {
            _id:"2",
            name:"task1",
            status:"Done"
        },
        {
            _id:"3",
            name:"task1",
            status:"Yet to Start"
        }
    ]
    useEffect(() => {
        // Update the layout based on dispatch action.
    updateLayout({ dispatch });
    getScheduledMaintenanceDetails(Location?.state?.maintenanceId).then((res) => {
        setMaintenanceTaskDetails(res?.data?.result)
    }).catch((err) => {
        console.log(err)
         // Handle errors, including login expiration and display error messages.
         handleLoginExpiry(err, dispatch)
         // Check if the error status is not 401 (Unauthorized).
         if (err?.response?.data?.status !== 401) {
             // Show an error message with the specific error details.
             handleShowErrorAndWarning({ dispatch, type: "error", message: `Failed to Load Details!`, showTime: 5000 })
             // Log the error in the audit log.
             const error = err.response.data.error; 
             postAuditLog({ action: "Maintenance Task Created", message: error });
         }
    }) 
    },[Location?.state?.maintenanceId])  
    console.log(Location,"locationn")
    return <div className={Styles.view_s_m_main_container} style={{ height: mainLayoutChildrenPositionsToolkitState?.viewPortUnit?.remainingPart?.height }}>
        <div className={Styles.view_s_m_sub_container}>
            <div className={Styles.view_s_m_details_container}>
                <div className={Styles.view_s_m_details_left} >
                    <div className={Styles.view_s_field_wrapper}>
                    <h4 className={Styles.view_s_field_name_wrapper}>Maintenance Plan Number</h4>
                    <p className={Styles.view_s_field_value_wrapper}>{maintenanceTaskDetails?.maintenancePlanNumber || "Not Mentioned"}</p>
                    </div>
                    <div className={Styles.view_s_field_wrapper}>
                    <h4 className={Styles.view_s_field_name_wrapper}>Name</h4>
                    <p className={Styles.view_s_field_value_wrapper}>{maintenanceTaskDetails?.maintenancePlanName || "Not Mentioned"}</p>
                    </div>
                    <div className={Styles.view_s_field_wrapper}>
                    <h4 className={Styles.view_s_field_name_wrapper}>Description</h4>
                    <p className={Styles.view_s_field_value_wrapper}>{maintenanceTaskDetails?.description || "Not Mentioned"}</p>
                    </div>
                    <div className={Styles.view_s_field_wrapper}>
                    <h4 className={Styles.view_s_field_name_wrapper}>Assigned User</h4>
                    <p className={Styles.view_s_field_value_wrapper}>{maintenanceTaskDetails?.assignee?.length ?  maintenanceTaskDetails?.assignee[0]?.name : "Not Mentioned"}</p>
                    </div>
                    <div className={Styles.view_s_field_wrapper}>
                    <h4 className={Styles.view_s_field_name_wrapper}>Team</h4>
                    <p className={Styles.view_s_field_value_team_wrapper}>{
                        maintenanceTaskDetails?.team?.map((team) => {
                            return <span>{team?.name}</span>
                        })
                    }</p>
                    </div>
                </div>
                <div className={Styles.view_s_m_details_right}>
                <div className={Styles.view_s_field_wrapper}>
                    <h4 className={Styles.view_s_field_name_wrapper}>Frequency</h4>
                    <p className={Styles.view_s_field_value_wrapper}>{maintenanceTaskDetails?.frequencyType?.name || "Not Mentioned"}</p>
                    </div>
                    <div className={Styles.view_s_field_wrapper}>
                    <h4 className={Styles.view_s_field_name_wrapper}>Asset</h4>
                    <p className={Styles.view_s_field_value_wrapper}>{ maintenanceTaskDetails?.asset?.name || "Not Mentioned"}</p>
                    </div>
                    <div className={Styles.view_s_field_wrapper}>
                    <h4 className={Styles.view_s_field_name_wrapper}>Scheduled time</h4>
                    <p className={Styles.view_s_field_value_wrapper}>{getFormatedDate(maintenanceTaskDetails?.startDate) || "Not Mentioned"}</p>
                    </div>
                    <div className={Styles.view_s_field_wrapper}>
                    <h4 className={Styles.view_s_field_name_wrapper}>Created On</h4>
                    <p className={Styles.view_s_field_value_wrapper}>{getFormatedDate(maintenanceTaskDetails?.createdDate) || "Not Mentioned"}</p>
                    </div>
                    <div className={Styles.view_s_field_wrapper}>
                    <h4 className={Styles.view_s_field_name_wrapper}>Last Updated On</h4>
                    <p className={Styles.view_s_field_value_wrapper}>{getFormatedDate(maintenanceTaskDetails?.updatedDate) || "Not Mentioned"}</p>
                    </div>
                </div>
            </div>
            <div className={Styles.tasks_wrapper}>
            <div className={Styles.view_s_m_tasks_container}>
                {
                    maintenanceTaskDetails?.maintenanceTask?.map((task,index) => {
                        return <div key={task?.taskId} className={Styles.view_s_m_task_row} style={{background:task?.status === "Done" ? "#EBFAEC" : "#FFF",border:task?.status === "Done" ? "1px solid #60D468" : task?.status === "In Progress" ? "1px solid #E5B82F"  : "1px solid #8CA1C4"}}>
                            <div className={Styles.view_s_m_task_row_left}>
                                <h5>{`Task ${index+1} - `}</h5>
                                <p>{task?.task}</p>
                            </div>
                            <div className={Styles.view_s_m_task_row_right}>
                                <div></div>
                                <div className={Styles.s_m_status_wrapper}>
                                    <div><img src={task?.status === "Done" ? VIEW_MAINTENANCE_TASK_DONE_STATUS : task?.status === "In Progress" ? VIEW_MAINTENANCE_TASK_PENDING_STATUS  : VIEW_MAINTENANCE_TASK_TODO_STATUS  }/></div>
                                    <p>{task?.status}</p>
                                </div>
                            </div>
                        </div>
                    })
                }
            </div>
            </div>
        </div>
    </div>
}

export default memo(ViewScheduleMantenance)