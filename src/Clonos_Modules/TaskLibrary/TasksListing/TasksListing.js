import { memo } from "react"
import Styles from "../../../ModuleStyles/TasksLibrary/TasksLibrary.module.css"
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import Subbar from "../../../components/WorkOrder/Subbar";
import { Navigate, useNavigate } from "react-router";
import ClonosDataGrid from "../../../components/CommonComponents/ClonosDataGrid/ClonosDataGrid";
import { useEffect } from "react";
import { deleteTasks, getTasksLibrary } from "../../../Api/TasksLibrary/tasksLibraryAPI";
import { useState } from "react";
import { getToken, handleLoginExpiry, handleShowErrorAndWarning } from "../../../utils/clonosCommon";
import { commonActions } from "../../../Store/Reducers/CommonReducer";
import ClonosConfirmationDialog from "../../../components/Dialogs/ClonosConfirmationDialog";
import { getTasksLibraryMethod } from "../../../utils/TasksLibraryMethods/TasksLibrarymethods";
const TasksListing = () => {
    const dispatch = useDispatch();
    const Navigate = useNavigate();
    const { mainLayoutChildrenPositionsToolkitState } = useSelector(store => store.globalEntitiesStateManagement);
    const [tasksList,setTasksList] = useState([]);
    const [selectedRows,setSelectedRows] = useState([])
    const [showConfirmationDailog,setShowConfirmationDailog] = useState(false);
    const columns = [
        {
            field:"index",
            headerName:"SI.NO",
            width:100
        },
        {
            field:"taskName",
            headerName:"TASK NAME",
            flex:2
        },
        {
            field:"assetCategory",
            headerName:"ASSET CATEGORY",
            flex:1,
            renderCell:(param) => {
                return <p>{param?.row?.assetCategory?.values || "Not Available"}</p>
            }
        },
    ]

    const handleDeleteTask = () => {
        deleteTasks({taskLibraryIds:selectedRows}).then((res) => {
            if(res?.data?.status == "200"){
                handleShowErrorAndWarning({ dispatch, type: "success", message: `Task Deleted successfully.`, showTime: 5000 })
                getTasksLibraryMethod({dispatch,setMethod:setTasksList})
                setShowConfirmationDailog(false)
            }
        }).catch((err) => {
            handleLoginExpiry(err, dispatch)
            if(err?.response?.data?.status != 401){
            handleShowErrorAndWarning({ dispatch, type: "error", message: `Something went wrong, Please try again.`, showTime: 5000 })

            }
        })
    }
    useEffect(() => {
        getTasksLibraryMethod({dispatch,setMethod:setTasksList})
    },[])
    console.log(tasksList,"tasklibrary")
    return (
        <div className={Styles.task_library_container} style={{ height: mainLayoutChildrenPositionsToolkitState?.viewPortUnit?.remainingPart?.height }}>
            <div className={Styles.task_library_nav}>
            <Subbar buttons={
                        [
                            {
                                buttonMethod: () => Navigate("/create-task"),
                                isHollow: false,
                                buttonText: "Create Task",
                                isActive: true
                            },
                        ]
                    }
                    />
            </div>
            <div className={Styles.task_library_list_container} style={{ height: `${mainLayoutChildrenPositionsToolkitState?.remUnit?.remainingPart?.height?.split("r")[0] - 4.375}rem` }}>
                <div className={Styles.task_library_list_sub_container}>
                <div className={Styles.datagrid_wrapper}>
                <ClonosDataGrid handleGetSelectedRowsMethod={(val) => setSelectedRows(val?.selectedRows)} rows={tasksList?.map((task,index) =>({...task,index:index+1,id:index+1}) )} columns={columns} uniqueIdField={"_id"}  pageLimit={10} height={600} isEdit={true} isDelete={true} deletePermission="adm005" editPermission="adm005" isEditMethod={() => Navigate("/edit-task",{state:{id:selectedRows[0]}})} isDeleteMethod={() => setShowConfirmationDailog(true)} />
                </div>
                </div>
            </div>
            <ClonosConfirmationDialog
                Open={showConfirmationDailog}
                CloseDialog={() => setShowConfirmationDailog(false)}
                Title="Delete Task"
                Content="Are you sure you want to delete?"
                ProceedDialog={handleDeleteTask}
            />
        </div>
    )
}

export default memo(TasksListing)