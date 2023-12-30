import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import SavedTableDataDialog from "./SavedTableDataDialog";
import DataTable from "./DataTable";
import { Checkbox, IconButton, Tooltip } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { useNavigate } from "react-router-dom";
const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 440,
  },
});

export default function TemplateDataTable({ docData }) {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [showFieldArr,setShowFieldArr] = useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [selectedRows,setSelectedRows] = useState([]);
  const [editableRow,setEditableRow] = useState({})
  const [allSelected,setAllSelected] = useState(false)
  const [tableData, settableData] = useState([]);
  const [shwSavedTable, setshwSavedTable] = useState(false);
  const Navigate = useNavigate()
  const [tableDataRow, settableDataRow] = useState({
    headers: [],
    data: [],
    tableName: "",
  });

  const [sepTableData, setsepTableData] = useState({
    headers: [],
    data: [],
    tableName: "",
  });
  let dataRest = [];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleRowvalue = (rowVal, row) => {
    const handleCheckValue = (checkValues) => {
      let string = "";
      const isChecked = checkValues?.filter((val) => val.isChecked);
      isChecked?.forEach((values, i) => {
        string +=
          i === isChecked.length - 1
            ? `${values.optionValue}`
            : `${values.optionValue}/ `;
      });
      return string;
    };

    const viewTableDataHandler = () => {
      console.log("tableData", tableData);
      console.log("rowVal",rowVal);
      const clonedTableData = (rowVal.fieldValue.tableData || rowVal.fieldValue)?.map((clonedData) => ({
        ...clonedData,
        submittedBy: row.updatedBy
      }))
      console.log("clonedTableData",clonedTableData);
      setshwSavedTable(true);
      settableDataRow({
        headers: rowVal.fieldValue.headers,
        data: clonedTableData,
        tableName: rowVal.fieldName,
      });
    };

    if (["radio", "dropdown"].includes(rowVal.fieldType)) {
      return <TableCell key={rowVal.id}>{rowVal.choosedValue}</TableCell>;
    } else if (rowVal.fieldType === "checkbox") {
      return (
        <TableCell key={rowVal.id}>
          {handleCheckValue(rowVal.fieldValue)}
        </TableCell>
      );
    } else if (["text", "number", "date"].includes(rowVal.fieldType)) {
      return <TableCell key={rowVal.id}>{rowVal.fieldValue || "-"}</TableCell>;
    } else if (rowVal.fieldType === "text-1") {
      if(rowVal.fieldValue.type === "h4"){
        return <TableCell key={rowVal.id}>
          <h4>{rowVal.fieldName}</h4>
        </TableCell>;
      } else  if(rowVal.fieldValue.type === "h5"){
        return <TableCell key={rowVal.id}>
          <h5>{rowVal.fieldName}</h5>
        </TableCell>;
      } else {
        return <TableCell key={rowVal.id}>
          <p style={{fontSize:"16px"}}>{rowVal.fieldName}</p>
        </TableCell>;
      }
    } else if (rowVal.fieldType === "table" || rowVal.fieldType === "object") {
      return (
        <TableCell>
          <span
            style={{ color: "blue", cursor: "pointer" }}
            onClick={viewTableDataHandler}
          >
            <u>View</u>
          </span>
        </TableCell>
      );
    }
  };

  function getTableData(array, updatedBy) {
    if (array.length) {
      array.forEach((data) => {
        if (data.formvals) {
          getTableData(data.formvals, data.updatedBy);
        } else {
          if (data.fieldType === "table") {
            console.log("getTableData data", data);
            let tableData= [];
            data.fieldValue.tableData.forEach((tabData) => {
              tableData.push({
                ...tabData,
                submittedBy: updatedBy
              })
            })

            dataRest.push(...tableData);
            setsepTableData((prev) => ({
              ...prev,
              headers: data.fieldValue.headers,
              tableName: data.fieldName,
            }));
          }
        }
      });
      console.log("dataRest", dataRest);
      setsepTableData((prev) => ({
        ...prev,
        data: dataRest,
      }));
    }
  }

  useEffect(() => {
    settableData(docData);
    getTableData(docData);
    console.log("docData",docData);
  }, [docData]);
  console.log(tableData,"tabrr data")
  return (
    <>
      {selectedRows.length ? (
            <div
              style={{
                background: "#3f51b5",
                // width: "90vw",
                // margin: "auto",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0px 10px",
              }}
            >
              <h3 style={{ color: "#FFF", fontWeight: "normal" }}>
                {" "}
                {selectedRows.length} {selectedRows.length > 1 ? "rows" : "row"}{" "}
                selected
              </h3>
              <div>
                {selectedRows.length === 1 ? (
                  <Tooltip title="Edit">
                    <IconButton
                      aria-label="edit"
                      onClick={() =>
                        Navigate("/edit-document-data", { state : editableRow})
                      }
                    >
                      <EditIcon style={{ color: "#fff" }} />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <></>
                )}
                <Tooltip title="Delete">
                  <IconButton
                    aria-label="delete"
                    // onClick={() => setShowDeleteDailog(true)}
                  >
                    <DeleteIcon style={{ color: "#fff" }} />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
          ) : (
            <></>
          )}
      <Paper className={classes.root}>
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>
                  {selectedRows.length && !allSelected ? (
                              <Checkbox
                                checked={true}
                                style={{ color: "#3f51b5" }}
                                indeterminate
                                onChange={() => {
                                  setSelectedRows([]);
                                }}
                              />
                            ) : (
                              <Checkbox
                                style={{ color: "#3f51b5" }}
                                onChange={() => {
                                  setAllSelected(!allSelected);
                                  if (selectedRows.length) {
                                    setSelectedRows([]);
                                  } else {
                                    setSelectedRows(tableData.map((row) => {
                                      return row._id
                                    }));
                                  }
                                }}
                              />
                            )}
                </TableCell>
                <TableCell style={{ minWidth: 120 }}>S.No</TableCell>
                {tableData[0]?.formvals?.map((head) => {
                  return <TableCell key={head.fieldName} style={{ minWidth: 120 }}>
                  {head.fieldName}
                </TableCell>
                })}
                <TableCell style={{ minWidth: 120 }}>Updated By</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  console.log(row,"row")
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      <TableCell>
                      <Checkbox
                          checked={selectedRows.includes(row._id)}
                          color="primary"
                          onChange={() => {
                            console.log(row)
                            if (selectedRows.length === 0) {
                              setEditableRow(row);
                            } else {
                              setEditableRow({});
                            }
                            if (!selectedRows.includes(row._id)) {
                              setSelectedRows((prev) => [
                                ...prev,
                                row._id,
                              ]);
                            } else {
                              let data = selectedRows.filter((id) => {
                                return id !== row._id;
                              });
                              // console.log(data);
                              setSelectedRows(data);
                            }
                          }}
                        />
                </TableCell>
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                      {row.formvals.map((rowVal) => {
                        return handleRowvalue(rowVal, row);
                      })}
                     {showFieldArr ? <TableCell>
                      {
                        row.formvals.map((formField) => {
                          if(Array.isArray(formField.fieldValue)){
                            setShowFieldArr(true)
                            return <Table>
                              <TableHead>
                                <TableRow>
                                  {
                                    formField.fieldValue.map((val) => {
                                      return <TableCell>{val.fieldName}</TableCell>
                                    })
                                  }
                                </TableRow>
                              </TableHead>
                              {/* <TableBody>
                                {
                                  formField.fieldValue.map((row) => {
                                    return <TableRow>

                                    </TableRow>
                                  })
                                }
                              </TableBody> */}
                            </Table>
                          }
                        })
                      }
                      </TableCell> : <></>}
                      <TableCell>{row.updatedBy || "-"}</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={tableData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <SavedTableDataDialog
        shwDialog={shwSavedTable}
        handleClose={() => setshwSavedTable(false)}
        headers={tableDataRow.headers}
        rows={tableDataRow.data}
        tableName={tableDataRow.tableName}
      />
      {sepTableData.headers.length > 0 && sepTableData.data.length > 0 && <div style={{ marginTop: "30px" }}>
        <h5 style={{ marginBottom: "20px" }}>{sepTableData.tableName}</h5>
        <DataTable headers={sepTableData.headers} rows={sepTableData.data} />
      </div>}
    </>
  );
}
