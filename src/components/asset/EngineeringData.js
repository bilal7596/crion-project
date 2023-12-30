import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import AssessmentIcon from "@material-ui/icons/Assessment";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import {
  deleteEngineerData,
  getAllEngData,
  getEngineeringDataOfAsset,
  getFilteredEngData,
  updateEngineerData,
} from "../../Api/EngineeringData/engineeringData";
import Input from "@material-ui/core/Input";
import Tooltip from "@material-ui/core/Tooltip";
import { CheckPicker } from "rsuite";
import Dropdown from "rsuite/Dropdown";

// Icons
import EditIcon from "@material-ui/icons/Edit";
import DoneIcon from "@material-ui/icons/DoneAllTwoTone";
import RevertIcon from "@material-ui/icons/NotInterestedOutlined";
import DeleteIcon from "@material-ui/icons/Delete";
import { useDispatch } from "react-redux";
import { commonActions } from "../../Store/Reducers/CommonReducer";
import AddBoxIcon from "@material-ui/icons/AddBox";

import { Button, Toolbar } from "@material-ui/core";
import { assetActions } from "../../Store/Reducers/ClonosAssetReducer";
import { getAssetTypes } from "../../Api/Asset/assetApi";
import { DateRangePicker } from "rsuite";
import { useLocation, useNavigate } from "react-router-dom";
import AddEngDataDialog from "../engineeringData/AddEngDataDialog";
import { render } from "react-dom";
import { getUser, removeUserSession } from "../../utils/clonosCommon";

const useStyles = makeStyles((theme) => ({
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxShadow: "0px 0px 5px #bcbcbc",
    padding: "1rem 2rem",
    backgroundColor: "#fff",
    borderTop: "5px solid #007bfd",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: "#007bfd",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, -1, 2),
    // backgroundColor: "#007bfd",
    // color: "#fff",
    // "&:hover": {
    //   backgroundColor: "#007bfd",
    //   color: "#fff",
    // },
  },
  cancel: {
    margin: theme.spacing(3, 1, 2),
    // backgroundColor: "red",
    // color: "#fff",
    // "&:hover": {
    //   backgroundColor: "red",
    //   color: "#fff",
    // },
  },
  input: {
    display: "none",
  },
  uploadBtns: {
    // backgroundColor: "#007bfd",
    // color: "#fff",
    width: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  fab: {
    // margin: theme.spacing(1),
    height: "40px",
    width: "40px",
  },
  button: {
    backgroundColor: "#3f51b5",
    color: "#fff",
    padding: "0.5rem 2rem",
    fontWeight: "600",
    border: "none",
    cursor: "pointer",
    width: "90%",
  },
}));

const EngineeringData = () => {
  const user = getUser()
  const dispatch = useDispatch();
  const NAVIGATE = useNavigate();
  const [selectedId, setselectedId] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [engineeringData, setengineeringData] = useState({});

  const location = useLocation();
  const [openAddEngDataDialog, setopenAddEngDataDialog] = useState(false);

  const [renderTable, setrenderTable] = useState(false);

  const [showEdit, setshowEdit] = useState(true);

  const [showDelete, setshowDelete] = useState(true);

  const [editedEngData, seteditedEngData] = useState([]);

  const onToggleEditMode = (id, data) => {
    setselectedId((prev) => [...prev, id]);
    seteditedEngData([
      {
        engDataId: id,
        fieldName: data.fieldName,
        fieldValue: data.fieldValue,
        fieldType: data.fieldType,
        updatedBy:user?.userId
      },
    ]);
  };

  const addEngineer = (asset) => {
    console.log("aset",asset);
    dispatch(assetActions.setAssetEngData(asset));
    setopenAddEngDataDialog(true);
  };

  const handleAddEngData = () => {};

  const onRevert = () => {
    setselectedId("");
    seteditedEngData([]);
  };

  const onChangeData = (e, field, index) => {
    const edited = editedEngData?.map((data) => ({ ...data }));
    edited[0][`${field}`] = e.target.value;
    seteditedEngData(edited);
  };

  const onEditingDone = () => {
    dispatch(commonActions.showApiLoader(true));
    editedEngData["updatedBy"] = user?.userId
    console.log("onEditingDone data", editedEngData);
    updateEngineerData(editedEngData)
      .then((res) => {
        console.log("updateEngineerData RESPONSE", res);
        setrenderTable((prev) => !prev);
        setselectedId([]);
        dispatch(commonActions.showApiLoader(false));
        dispatch(
          commonActions.handleSnackbar({
            show: true,
            message: res.data.message,
            type: "success",
          })
        );

      })
      .catch((err) => {
        if(err.response.data.status=== 401 && JSON.parse(localStorage.getItem("loginUser")) !== null){
          dispatch(commonActions.handleExpiryAlert(true));
          removeUserSession();
          localStorage.removeItem("loginUser")
        } else {
          console.log("updateEngineerData ERROR", err);
          dispatch(commonActions.showApiLoader(false));
          dispatch(
            commonActions.handleSnackbar({
              show: true,
              message: err.data.message,
              type: "error",
            })
          );
        }
      });
  };

  const handleDeleteEngData = (id) => {
    dispatch(commonActions.showApiLoader(true));
    const data = {
      engDataId: [id],
      isActive: false,
      deletedBy:user?.userId
    };

    deleteEngineerData(data)
      .then((res) => {
        console.log("deleteEngineerData RESPONSE", res);
        setrenderTable((prev) => !prev);
        dispatch(commonActions.showApiLoader(false));
        dispatch(
          commonActions.handleSnackbar({
            show: true,
            message: res.data.message,
            type: "success",
          })
        );

      })
      .catch((err) => {
        if(err.response.data.status=== 401 && JSON.parse(localStorage.getItem("loginUser")) !== null){
          dispatch(commonActions.handleExpiryAlert(true));
          removeUserSession();
          localStorage.removeItem("loginUser")
        } else {
          console.log("deleteEngineerData ERROR", err);
          dispatch(commonActions.showApiLoader(false));
          dispatch(
            commonActions.handleSnackbar({
              show: true,
              message: err.data.message,
              type: "error",
            })
          );
        }
      });
  };
  useEffect(() => {
    getEngineeringDataOfAsset(location.state?.assetId)
      .then((res) => {
        console.log("getEngineeringDataOfAsset RESPONSE", res);
        setengineeringData(res.data?.result);
      })
      .catch((err) => {
        if(err.response.data.status=== 401 && JSON.parse(localStorage.getItem("loginUser")) !== null){
          dispatch(commonActions.handleExpiryAlert(true));
          removeUserSession();
          localStorage.removeItem("loginUser")
        }
      })
  }, [renderTable]);

  const editEngineer = (data) => {
    setshowEdit(false);
  };

  const deleteEngineer = (data) => {
    setshowDelete(false);
  };

  return (
    <React.Fragment>
      <div
        style={{
          margin: "5rem 10rem",
          padding: "2rem 5rem",
          boxShadow: "0px 0px 5px #bcbcbc",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          <h6>{`${location?.state?.assetName} --> `} Engineering Data </h6>
          <Button
            variant="contained"
            color="primary"
            endIcon={<ArrowBackIcon>send</ArrowBackIcon>}
            onClick={() => NAVIGATE(-1)}
          >
            Back
          </Button>
        </div>
        <Box margin={1} style={{ boxShadow: "0px 0px 2px #bcbcbc" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              backgroundColor: "#3f51b5",
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              component="div"
              style={{ padding: "10px 20px", color: "#fff" }}
            >
              <strong>Engineering Data </strong>
            </Typography>

            <div>
              <Tooltip title="Delete Engineering Data">
                <IconButton
                  aria-label="delete-engineering-data"
                  onClick={() =>
                    !showDelete
                      ? setshowDelete(true)
                      : deleteEngineer(engineeringData)
                  }
                >
                  {!showDelete ? (
                    <RevertIcon style={{ color: "#fff" }} />
                  ) : (
                    <DeleteIcon style={{ color: "#fff" }} />
                  )}
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit Engineering Data">
                <IconButton
                  aria-label="edit-engineering-data"
                  onClick={() =>
                    !showEdit
                      ? setshowEdit(true)
                      : editEngineer(engineeringData)
                  }
                >
                  {!showEdit ? (
                    <RevertIcon style={{ color: "#fff" }} />
                  ) : (
                    <EditIcon style={{ color: "#fff" }} />
                  )}
                </IconButton>
              </Tooltip>

              <Tooltip title="Add Engineering Data">
                <IconButton
                  aria-label="add-engineering-data"
                  onClick={() => {
                    addEngineer(engineeringData);
                  }}
                >
                  <AddBoxIcon style={{ color: "#fff" }} />
                </IconButton>
              </Tooltip>
            </div>
          </div>
          <Table size="small" aria-label="purchases" style={{minHeight: "7rem"}}>
            <TableHead>
              <TableRow>
                <TableCell>S.No</TableCell>
                <TableCell>Field Name</TableCell>
                <TableCell>Field Value</TableCell>
                {/* <TableCell>Field Type</TableCell> */}
                {/* <TableCell>Created Date</TableCell> */}
                {!showDelete && <TableCell>Delete</TableCell>}
                {!showEdit && <TableCell>Edit</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {engineeringData?.engineeringData?.map((engData, index) => (
                <TableRow key={engData.engDataId}>
                  <TableCell component="th" scope="row">
                    {index + 1}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {selectedId.includes(engData?.engDataId) ? (
                      <Input
                        value={editedEngData[0]?.fieldName}
                        name={editedEngData[0]?.fieldName}
                        onChange={(e) => onChangeData(e, "fieldName", index)}
                        // className={classes.input}
                      />
                    ) : (
                      engData.fieldName
                    )}
                  </TableCell>
                  <TableCell>
                    {selectedId.includes(engData?.engDataId) ? (
                      <Input
                        value={editedEngData[0]?.fieldValue}
                        name={editedEngData[0]?.fieldValue}
                        onChange={(e) => onChangeData(e, "fieldValue", index)}
                        // className={classes.input}
                      />
                    ) : (
                      engData.fieldValue
                    )}
                  </TableCell>
                  {/* <TableCell>{engData.fieldType}</TableCell> */}
                  {/* <TableCell>{engData.createdDate}</TableCell> */}
                  {!showDelete && (
                    <TableCell>
                      <Tooltip title="Delete Engineer Data">
                        <IconButton
                          aria-label="delete"
                          onClick={() =>
                            handleDeleteEngData(engData?.engDataId)
                          }
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  )}
                  <TableCell 
                  style={{
                     padding: " 0px ",
                     minHeight: "1rem", 
                     }}>
                    {selectedId.includes(engData?.engDataId) ? (
                      <TableCell>
                        {!showEdit && (
                          <>
                            {" "}
                            <IconButton
                              aria-label="done"
                              onClick={() =>
                                onEditingDone(engData.engDataId, engData)
                              }
                            >
                              <DoneIcon />
                            </IconButton>
                            <IconButton
                              aria-label="revert"
                              onClick={() => onRevert(engData.engDataId)}
                            >
                              <RevertIcon />
                            </IconButton>
                          </>
                        )}
                      </TableCell>
                    ) : (
                      !showEdit && (
                        <TableCell style={{ padding: " 0px " }}>
                          <IconButton
                            aria-label="edit"
                            onClick={() =>
                              onToggleEditMode(engData.engDataId, engData)
                            }
                          >
                            <EditIcon />
                          </IconButton>
                        </TableCell>
                      )
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </div>
      <AddEngDataDialog
        Open={openAddEngDataDialog}
        HandleClose={() => {
          setrenderTable((prev) => !prev);
          setopenAddEngDataDialog(false);
        }}
        HandleProceed={() => handleAddEngData()}
        SelectedAsset={location?.state}
      />
    </React.Fragment>
  );
};

export default EngineeringData;
