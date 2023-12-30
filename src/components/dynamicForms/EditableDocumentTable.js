import {
  IconButton,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  makeStyles,
} from "@material-ui/core";
import Styles from "../../ModuleStyles/EditDocData.module.css";
import EditIcon from "@material-ui/icons/Edit";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import NotInterestedIcon from "@material-ui/icons/NotInterested";
import { useEffect, useState } from "react";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
    overflow: "auto",
  },
});
export const EditableDocumentTable = ({
  open,
  close,
  headers,
  rows,
  updateTableData,
  tableId
}) => {
  const classes = useStyles();
  const [showEditRow, setShowEditRow] = useState("");
  const [showEditHeader, setShowEditHeader] = useState("");
  const [tempTableData,setTempTableData] = useState({
    headers: headers,
    rows: rows,
  })
  const [tableData, setTableData] = useState({
    headers: headers,
    rows: rows,
  });

  const handleTableData = (data,id) => {
    updateTableData(data,id)
  };

  const handleChangeRowValue = (e, rowData, headerId) => {
    tempTableData?.rows?.map((row) => {
      if (row.rowId === rowData.rowId) {
        setTempTableData((prev) => ({
          ...prev,
          rows: tempTableData.rows.map((item) => {
            if (item.rowId === row.rowId) {
              return { ...item, [headerId]: e.target.value };
            } else return item;
          }),
        }));
      }
    });
  };
  const handleChangeHeaderValue = (e,headerId) => {
    console.log("entered",tempTableData.headers,headerId)
    tempTableData?.headers?.map((header) => {
      console.log(header)
      if (headerId === header.headerId) {
        setTempTableData((prev) => ({
          ...prev,
          headers: tempTableData?.headers?.map((item) => {
            if (item.headerId === header.headerId) {
              return { ...item, name: e.target.value };
            } else return item;
          }),
        }));
        console.log(e.target.value)
      } else {
        console.log("here")
      }
    });
  };
  useEffect(() => {
    console.log(tempTableData, "t");
  },[tempTableData])
  return (
    <>
      <Modal
        className={Styles.modalContainer}
        open={open}
        onClose={close}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div className={Styles.tableDailogContainer}>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="caption table">
              <TableHead>
                <TableRow>
                  <TableCell><strong>Sr.No</strong></TableCell>
                  <TableCell>
                    {showEditHeader ? (
                        <div className={Styles.actionIconsDiv}>
                          <span onClick={() => {
                            console.log(tempTableData)
                            setTableData({...tempTableData})
                            setShowEditHeader(false)
                          }}>
                            <DoneAllIcon />
                          </span>
                          <span onClick={() => setShowEditHeader(false)}>
                            <NotInterestedIcon />
                          </span>
                        </div>
                    ) : (
                      <span onClick={() => setShowEditHeader(true)}>
                        <EditIcon />
                      </span>
                    )}
                  </TableCell>
                  {tableData?.headers?.map((header) => {
                    return <TableCell align="right">

                      <strong>
                      {showEditHeader ? (
                            <input
                              onChange={(e) =>
                                handleChangeHeaderValue(e,header.headerId)
                              }
                              className={Styles.tableInput}
                              defaultValue={header.name}
                            />
                          ) : header.name}
                      </strong>
                          
                    </TableCell>;
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData?.rows?.map((row, index) => (
                  <TableRow key={row.name}>
                    <TableCell>{index + 1}</TableCell>
                    {showEditRow === row.rowId ? (
                      <TableCell>
                        <div className={Styles.actionIconsDiv}>
                          <span onClick={() => {
                            setTableData(tempTableData);
                            setShowEditRow(false)
                          }}>
                            <DoneAllIcon />
                          </span>
                          <span onClick={() => setShowEditRow("")}>
                            <NotInterestedIcon />
                          </span>
                        </div>
                      </TableCell>
                    ) : (
                      <TableCell onClick={() => setShowEditRow(row.rowId)}>
                        <EditIcon />
                      </TableCell>
                    )}
                    {tableData?.headers.map((header) => {
                      return (
                        <TableCell component="th" scope="row">
                          {showEditRow === row?.rowId ? (
                            <input
                              onChange={(e) =>
                                handleChangeRowValue(e, row, header.headerId)
                              }
                              className={Styles.tableInput}
                              defaultValue={row[`${header.headerId}`]}
                            />
                          ) : row[`${header.headerId}`] ? (
                            row[`${header.headerId}`]
                          ) : (
                            "-"
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <div className={Styles.tableBtnsDiv}>
            <button onClick={() => handleTableData(tableData,tableId)}>SAVE</button>
            <button onClick={close}>CANCEL</button>
          </div>
        </div>
      </Modal>
    </>
  );
};
