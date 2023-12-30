import React from 'react'
import useToggler from '../../../CustomHooks/TogglerHook'
import { useEffect } from 'react'
import { useState } from 'react'
import MultiSelectionController from '../MultiSelectionController/MultiSelectionController'
import { DataGrid } from '@mui/x-data-grid'

/**
 * A reusable component for rendering a DataGrid with loading state control.
 *
 * @param {object[]} rows - An array of data rows to display in the DataGrid.
 * @param {object[]} columns - An array of columns configuration for the DataGrid.
 * @param {function} handleGetSelectedRowsMethod - A callback function to handle selected rows that will return an object with one keys "selectedRows". 
 * @param {number} pageLimit - The number of rows per page in the DataGrid.
 */
const ClonosDataGrid = React.memo(({ rows, columns, isIndex, indexHeaderName, typeOfString = "upper", indexFieldName, handleGetSelectedRowsMethod, pageLimit, isEdit, isDelete, editPermission, deletePermission, createPermission, isEditMethod, isDeleteMethod, isCreateMethod, height, uniqueIdField, checkboxSelection = true }) => {

    const [isLoading, setIsLoading] = useState(false)
    const [selectedRows, setSelectedRows] = useState([])
    const [lcValues, setLcValues] = useState({ rows: [], columns: [] })



    function capitalizeString(string, typeOfString) {
        switch (typeOfString) {
            case "lower":
                return string.toLowerCase();
            case "upper":
                return string.toUpperCase();
            case "cap":
                return string.charAt(0).toUpperCase() + string.slice(1);
            default:
                return string;
        }
    }


    // Use useEffect to control the loading state based on the presence of data.
    useEffect(() => {
        // If there are rows, set isLoading to false; otherwise, set it to true.
        rows?.length > 0 ? setIsLoading(false) : setIsLoading(true)

        const interval = setTimeout(() => { // To Stop the loading while not getting data for 3 seconds
            setIsLoading(false)
        }, 3000)



        if (isIndex) {
            const indexKey = indexFieldName ? indexFieldName : "index"
            const lcIndexHeaderName = capitalizeString(indexHeaderName ? indexHeaderName : indexKey, typeOfString)
            const lcRows = rows && rows?.length > 0 && rows?.map((item, index) => {
                return { ...item, [indexKey]: index + 1 }
            })

            const lcColumns = columns && columns?.length > 0 && [{
                field: indexKey,
                headerName: lcIndexHeaderName,
                disableColumnFilter: true,
                headerClassName: "ast_column_header",
                filterPanelClassName: "ast_column_filterPanel",
            }, ...columns]

            setLcValues(prev => {
                return { ...prev, ["columns"]: lcColumns, ["rows"]: lcRows }
            })

        }


        return () => {
            clearInterval(interval)
        }
    }, [rows?.length])

    console.log('rowss:', rows)
    console.log('columns:', columns)
    console.log('lcValues:', lcValues)


    return (
        <div>
            <MultiSelectionController
                isActiveComponent={selectedRows.length > 0 && true}
                isDelete={isDelete}
                isEdit={selectedRows.length == 1 && isEdit}
                isEditMethod={isEditMethod}
                isDeleteMethod={isDeleteMethod}
                isCreateMethod={isCreateMethod}
                selectedRowCount={selectedRows?.length}
                editPermission={editPermission}
                deletePermission={deletePermission}
                createPermission={createPermission}
            />
            <DataGrid
                // Display the DataGrid only if there are rows available.
                rows={isIndex ? lcValues?.rows : rows?.length > 0 && rows}
                columns={isIndex ? lcValues?.columns : columns?.length > 0 && columns}
                getRowId={(row) => row[uniqueIdField]}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: pageLimit,
                        },
                    },
                }}
                style={{ height: `${height}px` }}
                // Other DataGrid configuration options:
                // disableColumnFilter
                // disableColumnSelector
                onRowSelectionModelChange={(selectedRow) => {
                    setSelectedRows(selectedRow)
                    handleGetSelectedRowsMethod({ selectedRows: [...selectedRow] })
                }}
                pageSizeOptions={[pageLimit]}
                checkboxSelection={checkboxSelection}
                disableRowSelectionOnClick
                loading={isLoading}
            />
        </div>
    )
})

export default ClonosDataGrid
