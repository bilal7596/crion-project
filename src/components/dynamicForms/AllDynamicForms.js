import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { DataGrid } from "@material-ui/data-grid";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { getAllDynamicForms } from "../../Api/DynamicForm/dynamicFormApi";
import ListAltIcon from "@material-ui/icons/ListAlt";
import { IconButton, Tooltip } from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});



export default function AllDynamicForms() {
  const classes = useStyles();
  const NAVIGATE = useNavigate();

  const [allDynamicForms, setallDynamicForms] = useState([]);


  const columns = [
    { field: "id", headerName: "ID", width: 150 },
    {
      field: "formName",
      headerName: "Form Name",
      width: 200,
    },
    {
      field: "createdDate",
      headerName: "Created Date",
      width: 200,
      valueGetter: (params) => {
        return new Date(`${params.row.createdDate}`).toLocaleDateString();
      },
    },
    {
      field: "action",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => {
        console.log(params,"pppppppppppppppppp")
        return (
          <Tooltip title="View Form">
            <IconButton
              onClick={() => NAVIGATE("/add-form-data", { state: params.row })}
              aria-label="view"
            >
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
        );
      },
    },
  ];

  useEffect(() => {
    getAllDynamicForms()
      .then((res) => {
        console.log("getAllDynamicForms RESPONSE", res);
        setallDynamicForms(res.data);
      })
      .catch((err) => console.log("getAllDynamicForms ERROR", err));
  }, []);

  return (
    <>
      <div style={{ display: " flex" }}>
        <span>
          <ListAltIcon
            style={{ color: "#3f51b5", fontSize: "2.5rem", marginTop: "2px" }}
          />
        </span>
        <h2
          style={{
            textAlign: "center",
            fontFamily: "calibri",
            marginLeft: "10px",
          }}
        >
          <i style={{ color: "#3f51b5" }}>All Forms</i>
        </h2>
      </div>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={allDynamicForms}
          columns={columns}
          pageSize={5}
          disableSelectionOnClick
        />
      </div>

      {/* <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>S.NO</TableCell>
              <TableCell>Form Name</TableCell>
              <TableCell>Created Date</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allDynamicForms?.map((row, index) => (
              <TableRow key={row.formId}>
                <TableCell component="th" scope="row">
                  {index + 1}
                </TableCell>
                <TableCell>{row.formName}</TableCell>
                <TableCell>
                  {new Date(`${row.createdDate}`).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Tooltip title="View Form">
                    <IconButton
                      onClick={() => NAVIGATE("/add-form-data", { state: row })}
                      aria-label="view"
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer> */}
    </>
  );
}
