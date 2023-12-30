import React from 'react'
import Styles from "../../ModuleStyles/Documents/DocumentsList.module.css"
import Tooltip from '@material-ui/core/Tooltip';
import Checkbox from '@material-ui/core/Checkbox';
import { useState } from 'react';
import { BsThreeDotsVertical } from "react-icons/bs"
import { Box, Menu, MenuItem } from '@material-ui/core';
import Fade from '@material-ui/core/Fade';
import CheckBox from './CheckBox';
import DeleteIcon from "@material-ui/icons/Delete";
import { handleLoggedInUser } from '../../utils/clonosCommon';
import MultiSelectionController from '../CommonComponents/MultiSelectionController/MultiSelectionController';
import MenuController from '../WorkOrder/Menu';
import { handleDeleteDocuments, handleDownloadDocument } from '../../utils/DocumentMethods/documentMethods';
import { useDispatch } from 'react-redux';
import { documentActions } from '../../Store/Reducers/ClonosDocumentReducer';
import { DataGrid } from '@mui/x-data-grid';



const DocumentsListTable = ({ handleGotoDV, tableData, currentPage, setCurrentPage, setTotalDocuments, needToFilter }) => {
  console.log('setTotalDocuments:', setTotalDocuments)
  console.log('setCurrentPage:', setCurrentPage)
  // Local States 
  const [needToDelete, setNeedToDelete] = useState([]) // This state will store the docuement for multiple delete.
  const [anchorEl, setAnchorEl] = useState(null);
  const [checked, setChecked] = useState(false);
  const [selectedRows,setSelectedRows] = useState([])
  const [isEdit, setIsEdit] = useState(false)
  const dispatch = useDispatch()
  const open = Boolean(anchorEl);
  const columns = [
    {
      field:"documentNumber",
      headerName:"DOCUMENT NUMBER",
      // width:"200",
      flex:1,
      disableColumnFilter:true,
      headerClassName:"ast_column_header",
      filterPanelClassName:"ast_column_filterPanel",
      valueGetter : (params) => params?.row?.documentNumber || "Not Available"
    },
    {
      field:"documentName",
      headerName:"DOCUMENT NAME",
      // width:"200",
      flex:1,
      disableColumnFilter:true,
      headerClassName:"ast_column_header",
      filterPanelClassName:"ast_column_filterPanel",
      valueGetter : (params) => params?.row?.documentName || "Not Available"
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
      field:"documentType",
      headerName:"DOCUMENT TYPE",
      // width:"200",
      flex:1,
      disableColumnFilter:true,
      headerClassName:"ast_column_header",
      valueGetter : (params) => params?.row?.documentType?.name || "Not Available"
    },
    {
      field:"documentType",
      headerName:"DOCUMENT TYPE",
      // width:"200",
      flex:1,
      disableColumnFilter:true,
      headerClassName:"ast_column_header",
      valueGetter : (params) => params?.row?.documentType?.name || "Not Available"
    },
    {
      field:"approvalStatus",
      headerName:"STATUS",
      // width:"200",
      flex:1,
      disableColumnFilter:true,
      headerClassName:"ast_column_header",
      valueGetter : (params) => params?.row?.approvalStatus?.name || "Not Available"
    },
    {
      field:"revisionNumber",
      headerName:"REVISOIN NUMBER",
      // width:"200",
      flex:1,
      disableColumnFilter:true,
      headerClassName:"ast_column_header",
      valueGetter : (params) => params?.row?.revisionNumber || "Not Available"
    },
    {
      field:"fileName",
      headerName:"VIEW DOCUMENT",
      // width:"200",
      flex:1,
      disableColumnFilter:true,
      headerClassName:"ast_column_header",
      renderCell : (params) => {
        return <p style={{textDecoration:"underline",color:"#3F51B5",cursor:"pointer"}}>{params?.row?.fileName ?  params?.row?.fileName : "Not Available"}</p>
      }
    },
    {
      field:"edit",
      headerName:"EDIT",
      // width:"200",
      flex:1,
      disableColumnFilter:true,
      headerClassName:"ast_column_header",
      renderCell : (params) => {
        return <p style={{textDecoration:"underline",color:"#3F51B5",cursor:"pointer"}}>Edit</p>
      }
    },
  ]
  console.log('needToDelete......:', tableData)

  const handleClick = (event) => {
    console.log('eventt:', event)
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (event) => {
    setChecked(event?.target?.checked);
    setIsEdit(!isEdit)
    if (needToDelete?.length > 0) return setNeedToDelete([])
    let selectedElements = tableData.map(doc => doc.docId)
    setNeedToDelete(selectedElements)
  };

  const handleDeleteMultipleDocuments = () => {
    handleDeleteDocuments({ dispatch, documentActions, isMultipleDelete: true, currentPage, setCurrentPage, setTotalDocuments, needToDelete : selectedRows, setNeedToDelete, setIsEdit })
  }
  const handleCollectDocumentsForMultipleDelete = ({ docId }) => {
    if (!needToDelete?.includes(docId)) {
      setNeedToDelete((prev) => {
        let updateValue = [...prev, docId]
        if (updateValue.length >= 2) setIsEdit(true)
        return updateValue
      })
    } else {
      let updateValue = needToDelete?.filter(item => item != docId)
      if (updateValue.length < 2) {
        setIsEdit(false)
        setChecked(false)
        if (checked) updateValue = []
      }
      setNeedToDelete(updateValue)
    }
  }

console.log(tableData,"ooooo")
  return (
    <div className={Styles.dl_table_container}>
      <MultiSelectionController isActiveComponent={selectedRows?.length > 0 ? true : false} isDelete={true} deletePermission={"doc003"} isDeleteMethod={handleDeleteMultipleDocuments} selectedRowCount={selectedRows?.length} />
            <Box sx={{ height: 500, width:"100%",margin:"auto"}}>
            <DataGrid
                rows={tableData?.length > 0 ? tableData : []  }
                getRowId={(row) => row?.docId}
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

export default DocumentsListTable