import React from 'react'
import Styles from "../../ModuleStyles/Notifications/NotificationsList.module.css"
import Tooltip from '@material-ui/core/Tooltip';
import Checkbox from '@material-ui/core/Checkbox';
import { useState } from 'react';
import { handleLoggedInUser } from '../../utils/clonosCommon';
import MultiSelectionController from '../CommonComponents/MultiSelectionController/MultiSelectionController';
import MenuController from '../WorkOrder/Menu';
import { handleDeleteDocuments, handleDownloadDocument } from '../../utils/DocumentMethods/documentMethods';
import { useDispatch } from 'react-redux';
import { documentActions } from '../../Store/Reducers/ClonosDocumentReducer';
import CheckBox from "../ClonosDocuments/CheckBox";
import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';



const NotificationsListTable = ({ tableData, handleGotoDV, currentPage, setCurrentPage, setTotalDocuments, needToFilter }) => {
    console.log('setTotalDocuments:', setTotalDocuments)
    console.log('setCurrentPage:', setCurrentPage)
    // Local States 
    const [needToDelete, setNeedToDelete] = useState([]) // This state will store the docuement for multiple delete.
    const [anchorEl, setAnchorEl] = useState(null);
    const [checked, setChecked] = useState(false);
    const [isEdit, setIsEdit] = useState(false)
    const dispatch = useDispatch()
    const open = Boolean(anchorEl);
    const [selectedRows,setSelectedRows] = useState([]);

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
            field:"alarmName",
            headerName:"ALARM NAME",
            // width:"200",
            flex:1,
            disableColumnFilter:true,
            headerClassName:"ast_column_header",
            filterPanelClassName:"ast_column_filterPanel",
            renderCell : (params) => {
                return  <p style={{textDecoration:"underline",color:"#3f51b5",cursor:"pointer"}}>{params?.row?.alarmName ? params?.row?.alarmName : "Not Available"}</p> 
            }
          },
          {
            field:"status",
            headerName:"STATUS",
            // width:"200",
            flex:1,
            disableColumnFilter:true,
            headerClassName:"ast_column_header",
            valueGetter:(params) => params?.row?.status || "Not Available"
          },
          {
            field:"asset",
            headerName:"ASSET NAME",
            // width:"200",
            flex:1,
            disableColumnFilter:true,
            headerClassName:"ast_column_header",
            valueGetter : (params) => params?.row?.asset?.name || "Not Available"
          },
          {
            field:"urgencyLevel",
            headerName:"URGENCY LEVEL",          
            // width:"200",
            flex:1,
            disableColumnFilter:true,
            headerClassName:"ast_column_header",
            valueGetter : (params) => params?.row?.urgencyLevel?.name || "Not Available"
          },
          {
            field:"personInCharge",
            headerName:"PERSON INCHARGE",
            // width:"200",
            flex:1,
            disableColumnFilter:true,
            headerClassName:"ast_column_header",
            valueGetter : (params) => params?.row?.personInCharge?.name || "Not Available"
          },
          {
            field:"alernateIncharge",
            headerName:"ALTERNATE INCHARGE",
            // width:"200",
            flex:1,
            disableColumnFilter:true,
            headerClassName:"ast_column_header",
            valueGetter : (params) => params?.row?.alernateIncharge?.name || "Not Available"
          },
          {
            field:"createdOn",
            headerName:"CREATED ON",
            // width:"200",
            flex:1,
            disableColumnFilter:true,
            headerClassName:"ast_column_header",
            valueGetter : (params) => params?.row?.createdOn || "Not Available"
          },
    ]
    console.log('needToDelete:', needToDelete)

    const handleChange = (event) => {
        setChecked(event?.target?.checked);
        setIsEdit(!isEdit)
        if (needToDelete?.length > 0) return setNeedToDelete([])
        let selectedElements = tableData.map(doc => doc.notId)
        setNeedToDelete(selectedElements)
    };

    const handleDeleteMultipleDocuments = () => {
        handleDeleteDocuments({ dispatch, documentActions, isMultipleDelete: true, currentPage, setCurrentPage, setTotalDocuments, needToDelete, setNeedToDelete, setIsEdit })
    }

    const handleCollectDocumentsForMultipleDelete = ({ notId }) => {
        if (!needToDelete?.includes(notId)) {
            setNeedToDelete((prev) => {
                let updateValue = [...prev, notId]
                if (updateValue.length >= 2) setIsEdit(true)
                return updateValue
            })
        } else {
            let updateValue = needToDelete?.filter(item => item != notId)
            if (updateValue.length < 2) {
                setIsEdit(false)
                setChecked(false)
                if (checked) updateValue = []
            }
            setNeedToDelete(updateValue)
        }
    }


    console.log('needToDelete:', tableData)
    return (
        <div className={Styles.nl_table_container}>
            <MultiSelectionController isActiveComponent={selectedRows?.length > 0 ? true : false} isDelete={true} deletePermission={"doc003"} isDeleteMethod={handleDeleteMultipleDocuments} selectedRowCount={selectedRows?.length} />
            <Box sx={{ height: 500, width:"100%",margin:"auto"}}>
            <DataGrid
                rows={tableData?.length > 0 ? tableData : []}
                getRowId={(row) => row.notId}
                columns={columns}
                initialState={{
                pagination: {
                    paginationModel: {
                    pageSize: 10,
                    },
                },
                }} 
                // disableColumnFilter
                // disableColumnSelector
                onRowSelectionModelChange={(selectedRow) => {
                   setSelectedRows([...selectedRow])
                }}
                pageSizeOptions={[10]}
                checkboxSelection
                disableRowSelectionOnClick
            />
            </Box>
        </div>
    )
}

export default NotificationsListTable