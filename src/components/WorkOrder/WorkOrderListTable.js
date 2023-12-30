import React from 'react'
import Styles from "../../ModuleStyles/WorkOrder/WorkOrderList.module.css"
import { useNavigate } from 'react-router-dom';
import { BiDotsVerticalRounded } from "react-icons/bi"
import { AiFillDelete } from "react-icons/ai"
import { deleteWorkOrderAPI } from '../../Api/WorkOrder/WorkOrderApi';
import { useDispatch } from 'react-redux';
import { handleDeleteWorkOrder } from '../../utils/WorkOrderMethods/WorkOrderMethods';
import { commonActions } from '../../Store/Reducers/CommonReducer';
import { getFormatedDate, handleLoggedInUser } from '../../utils/clonosCommon';
import { FaBell } from "react-icons/fa"
import Tooltip from '@material-ui/core/Tooltip';
import MultiSelectionController from '../CommonComponents/MultiSelectionController/MultiSelectionController';
import CheckBox from '../ClonosDocuments/CheckBox';
import { useState } from 'react';
import MenuController from './Menu';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import { useEffect } from 'react';
import useToggler from '../../CustomHooks/TogglerHook';
import ClonosDataGrid from '../CommonComponents/ClonosDataGrid/ClonosDataGrid';

const WorkOrderListTable = ({ tableData, currentPage, workOrderStateManagementActions, setTotalWorkOrder, setCurrentPage }) => {
    // Local States 
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [isEdit, setIsEdit] = useState(false)
    const [checked, setChecked] = useState(false);
    const [selectedRows, setSelectedRows] = useState([])
    console.log('selectedRows:', selectedRows)
    const [needToDelete, setNeedToDelete] = useState([]) // This state will store the work orders ids for multiple delete.
    const [isLoading, setIsLoading] = useState(false)
    console.log('isLoading:', isLoading)
    const columns = [
        // {
        //     field:"workOrderId",
        //     headerName:"SI.No",
        //     // width:"200",
        //     flex:1,
        //     disableColumnFilter:true,
        //     headerClassName:"ast_column_header",
        //     renderCell: (params) => {
        //         const rowIndex = params.api.getRowIndex(params.row.workOrderId);
        //         return rowIndex + 1;
        //     },
        //   },
        {
            field: "woNumber",
            headerName: "WORK ORDER NUMBER",
            // width:"200",
            flex: 1,
            disableColumnFilter: true,
            headerClassName: "ast_column_header",
            filterPanelClassName: "ast_column_filterPanel",
            valueGetter: (params) => params?.row?.woNumber || "Not Available"
        },
        {
            field: "title",
            headerName: "WORK ORDER TITLE",
            // width:"200",
            flex: 1,
            disableColumnFilter: true,
            headerClassName: "ast_column_header",
            renderCell: (params) => {
                return <p onClick={() => handleGotoWOV(params?.row?.workOrderId, params?.row?.title)} style={{ textDecoration: "underline", color: "#3f51b5", cursor: "pointer" }}>{params?.row?.title ? params?.row?.title : "Not Available"}</p>
            }
        },
        {
            field: "dueDate",
            headerName: "END DATE",
            // width:"200",
            flex: 1,
            disableColumnFilter: true,
            headerClassName: "ast_column_header",
            valueGetter: (params) => params?.row?.endDate ? getFormatedDate(params?.row?.endDate) : "Not Available"
        },
        {
            field: "priority",
            headerName: "PRIORITY",
            // width:"200",
            flex: 1,
            disableColumnFilter: true,
            headerClassName: "ast_column_header",
            valueGetter: (params) => params?.row?.priority?.priorityName || "Not Available"
        },
        {
            field: "asset",
            headerName: "ASSET",
            // width:"200",
            flex: 1,
            disableColumnFilter: true,
            headerClassName: "ast_column_header",
            valueGetter: (params) => params?.row?.asset && params?.row?.asset?.name || "Not Available"
        },
        {
            field: "assignee",
            headerName: "ASSIGNED USER  ",
            // width:"200",
            flex: 1,
            disableColumnFilter: true,
            headerClassName: "ast_column_header",
            valueGetter: (params) => params?.row?.assignee && params?.row?.assignee[0]?.name || "Not Available"
        },
        {
            field: "status",
            headerName: "STATUS",
            // width:"200",
            flex: 1,
            disableColumnFilter: true,
            headerClassName: "ast_column_header",
            valueGetter: (params) => params?.row?.status || "Not Available"
        },
        {
            field: "createdDate",
            headerName: "CREATED ON",
            // width:"200",
            flex: 1,
            disableColumnFilter: true,
            headerClassName: "ast_column_header",
            valueGetter: (params) => params?.row?.createdDate ? getFormatedDate(params?.row?.createdDate) : "Not Available"
        },
    ]
    console.log('tableData:', tableData)


    /**
     * WOV  = Work Order View
     * This function is getting use to jump to the Work Order View page.
     */
    const handleGotoWOV = (workOrderId, workOrderNumber) => {
        navigate("/work-order-view", { state: { workOrderId, workOrderNumber } })
    }



    // const handleChange = (event) => {
    //     setChecked(event?.target?.checked);
    //     setIsEdit(!isEdit)
    //     if (needToDelete?.length > 0) return setNeedToDelete([])
    //     let selectedElements = tableData.map(workOrder => workOrder.workOrderId)
    //     setNeedToDelete(selectedElements)
    // };

    const handleDeleteMultipleDocuments = () => {
        handleDeleteWorkOrder({ dispatch, isMultipleDelete: true, payload: selectedRows, setIsEdit, navigate })
    }

    // const handleCollectDocumentsForMultipleDelete = ({ workOrderId }) => {
    //     if (!needToDelete?.includes(workOrderId)) {
    //         setNeedToDelete((prev) => {
    //             let updateValue = [...prev, workOrderId]
    //             if (updateValue.length >= 2) setIsEdit(true)
    //             return updateValue
    //         })
    //     } else {
    //         let updateValue = needToDelete?.filter(item => item != workOrderId)
    //         if (updateValue.length < 2) {
    //             setIsEdit(false)
    //             setChecked(false)
    //             if (checked) updateValue = []
    //         }
    //         setNeedToDelete(updateValue)
    //     }
    // }


    const handleEditWorkOrder = () => {
        navigate("/work-order-edit", { state: { workOrderId: selectedRows[0] } })
    }

    useEffect(() => {
        selectedRows?.length > 0 ? setIsEdit(true) : setIsEdit(false)
        if (tableData?.length == 0) setIsLoading(true)
        let interval = setTimeout(() => {
            setIsLoading(false)
        }, 2000)
        return () => {
            clearInterval(interval)
        }
    }, [selectedRows, tableData])


    // isIndex, indexHeaderName, typeOfString

    return (
        <div className={Styles.wol_table}>
            <ClonosDataGrid
                rows={tableData?.length > 0 ? tableData : []}
                columns={columns}
                handleGetSelectedRowsMethod={(selectedRowIds) => {
                    setSelectedRows(selectedRowIds?.selectedRows)
                }}
                pageLimit="10"
                isEdit={handleLoggedInUser()?.permissions?.includes("wko002")}
                isDelete={handleLoggedInUser()?.permissions?.includes("wko003")}
                editPermission={"wko002"}
                deletePermission={"wko003"}
                isEditMethod={handleEditWorkOrder}
                isDeleteMethod={handleDeleteMultipleDocuments}
                height={500}
                isIndex={true}
                indexHeaderName="SI.NO"
                uniqueIdField="workOrderId"
            />
        </div >
    )
}

export default WorkOrderListTable