import React, { useState } from 'react'
import ClonosDataGrid from '../../../../components/CommonComponents/ClonosDataGrid/ClonosDataGrid'
import { getFormatedDate } from '../../../../utils/clonosCommon'
import { useNavigate } from 'react-router-dom'
import { handleDeleteChecklist, handleEditChecklist } from '../../../../utils/ChecklistAndReportsMethods/ChecklistMethod'
import { useDispatch } from 'react-redux'

const ChecklistListingTable = ({ tableData, lcDataSetterMethod }) => {
    const [selectedRows, setSelectedRows] = useState([]);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    console.log('selectedRows:', selectedRows)

    const columns = [
        {
            field: "checklistNumber",
            headerName: "CHECKLIST NUMBER",
            flex: 1,
            disableColumnFilter: true,
            headerClassName: "ast_column_header",
            filterPanelClassName: "ast_column_filterPanel",
            // valueGetter: (params) => params?.row?.woNumber || "Not Available"
        },
        {
            field: "name",
            headerName: "CHECKLIST NAME",
            // width:"200",
            flex: 1,
            disableColumnFilter: true,
            headerClassName: "ast_column_header",
            renderCell: (params) => {
                return <p onClick={() => handleGotoChecklistView({ id: params?.row?.id })} style={{ textDecoration: "underline", color: "#3f51b5", cursor: "pointer" }}>{params?.row?.name ? params?.row?.name : "Not Available"}</p>

            }
        },
        {
            field: "assignee",
            headerName: "ASSIGNED USER",
            flex: 1,
            disableColumnFilter: true,
            headerClassName: "ast_column_header",
            valueGetter: (params) => params?.row?.assignee?.name ? params?.row?.assignee?.name : "Not Available"
        },
        {
            field: "team",
            headerName: "TEAM",
            flex: 1,
            disableColumnFilter: true,
            headerClassName: "ast_column_header",
            valueGetter: (params) => params?.row?.team?.dropdownValues || "Not Available"
        },
        {
            field: "frequencyType",
            headerName: "FREQUENCY",
            flex: 1,
            disableColumnFilter: true,
            headerClassName: "ast_column_header",
            // valueGetter: (params) => params?.row?.asset && params?.row?.asset[0]?.name || "Not Available"
        },
        {
            field: "department",
            headerName: "DEPARTMENT",
            flex: 1,
            disableColumnFilter: true,
            headerClassName: "ast_column_header",
            // valueGetter: (params) => params?.row?.status || "Not Available"
        },
        {
            field: "status",
            headerName: "STATUS",
            flex: 1,
            disableColumnFilter: true,
            headerClassName: "ast_column_header",
            // valueGetter: (params) => params?.row?.createdDate ? getFormatedDate(params?.row?.createdDate) : "Not Available"
        },
        {
            field: "createdDate",
            headerName: "CREATED ON",
            flex: 1,
            disableColumnFilter: true,
            headerClassName: "ast_column_header",
            valueGetter: (params) => params?.row?.createdDate ? getFormatedDate(params?.row?.createdDate) : "Not Available"
        },
        {
            field: "updatedDate",
            headerName: "LAST UPDATED ON",
            flex: 1,
            disableColumnFilter: true,
            headerClassName: "ast_column_header",
            valueGetter: (params) => params?.row?.updatedDate ? getFormatedDate(params?.row?.updatedDate) : "Not Available"
        }
    ]


    /**
     * "handleGetSelectedRowsMethod" help to get all the selected rows from the ClonosDataGrid Component.
     * @param {Object} props  
     * @property {Array} props.selectedRows This will contain the the selected rows IDs
     */
    const handleGetSelectedRowsMethod = (props) => {
        setSelectedRows(props.selectedRows)
    }

    /**
     * "handleGoToChecklistView" function help to redirect user from checklist to checklist view
     * @param {Object} props Contain the ID of of the checklist that we awant to view. 
     */
    const handleGotoChecklistView = (props) => {
        navigate("/checklist-view", { state: { id: props?.id } })
    }


    /**
     * "handleGoToEditChecklist" function helps to redirect to edit checklist page.
     */
    const handleGoToEditChecklist = () => {
        // alert("Edit Page Are Not Ready!")
    }


    return (
        <ClonosDataGrid
            rows={tableData}
            columns={columns}
            handleGetSelectedRowsMethod={handleGetSelectedRowsMethod}
            pageLimit={10}
            isEdit={true}
            isDelete={true}
            editPermission={"ckl003"}
            deletePermission={"ckl002"}
            uniqueIdField={"id"}
            height={"650"}
            isEditMethod={handleGoToEditChecklist}
            isDeleteMethod={() => handleDeleteChecklist({ dispatch, selectedRows, lcDataSetterMethod, isLocalUpdate: true })}
        />
    )
}

export default React.memo(ChecklistListingTable)