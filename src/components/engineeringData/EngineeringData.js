import React, { useEffect, useState } from "react";
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
import {
  deleteEngineerData,
  getAllEngData,
  getFilteredEngData,
  updateEngineerData,
} from "../../Api/EngineeringData/engineeringData";
import Input from "@material-ui/core/Input";
import Tooltip from "@material-ui/core/Tooltip";
import { CheckPicker } from "rsuite";
import Dropdown from "rsuite/Dropdown";
// Icons
import EditIcon from "@material-ui/icons/EditOutlined";
import DoneIcon from "@material-ui/icons/DoneAllTwoTone";
import RevertIcon from "@material-ui/icons/NotInterestedOutlined";
import DeleteIcon from "@material-ui/icons/Delete";
import { useDispatch } from "react-redux";
import { commonActions } from "../../Store/Reducers/CommonReducer";
import AddBoxIcon from "@material-ui/icons/AddBox";

import { Toolbar } from "@material-ui/core";
import AddEngDataDialog from "./AddEngDataDialog";
import { assetActions } from "../../Store/Reducers/ClonosAssetReducer";
import { getAssetTypes } from "../../Api/Asset/assetApi";
import { DateRangePicker } from "rsuite";
import { useContext } from "react";
import { getUser, removeUserSession } from "../../utils/clonosCommon";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto",
  },
  table: {
    minWidth: 650,
  },
  selectTableCell: {
    width: 60,
  },
  tableCell: {
    width: 130,
    height: 40,
  },
  input: {
    width: 130,
    height: 40,
  },
}));

const useRowStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
});

export default function EngineeringData() {
  const [allEngData, setallEngData] = useState([]);
  const USER_DETAILS = getUser()
  const [renderTable, setrenderTable] = useState(false);
  const [openAddEngDataDialog, setopenAddEngDataDialog] = useState(false);
  const [calenderChange, setcalenderChange] = useState(false);
  const [calendarVal, setcalendarVal] = useState([new Date()]);
  const [filters, setfilters] = useState({
    assetName: "",
    productName: "",
    fieldName: "",
    fieldValue: "",
    createdDate: "",
    assetType: "",
  });
  const [typevalue, settypevalue] = useState([]);
  const [assetTypes, setassetTypes] = useState([]);
  const [filterPayload, setfilterPayload] = useState({
    assetName: "",
    productName: "",
    fieldName: "",
    fieldValue: "",
    assetType: "",
    createdDate: "",
  });

  const dispatch = useDispatch();

  const handleClearFilter = () => {
    setfilterPayload({
      assetName: "",
      productName: "",
      fieldName: "",
      fieldValue: "",
      assetType: "",
      createdDate: "",
    });
    // setcalenderChange(false);
    setcalenderChange(false);
    settypevalue([]);
    setcalendarVal([new Date()])
    settypevalue([]);
  };

  const handleTitle = (name) => {
    if (name === "isActive") {
      return null;
    } else if (name === "tagId") {
      return "Tag Id ";
    }
    return name.replace(/([A-Z])/g, " $1").replace(/^./, function (str) {
      return str.toUpperCase();
    });
  };
        //filters changes to be made -----------------------------------------------------
        const handleDatechange = (value) => {
          if (value) {
            const data = {
              startDate: new Date(value[0]).toISOString(),
              endDate: new Date(value[1]).toISOString(),
            };
      
            setcalendarVal(value);
      
            console.log("handleDatechange data", data);
            setcalenderChange(true);
            setfilterPayload((prev) => ({ ...prev, createdDate: data }));
          } else {
            setcalendarVal([new Date()]);
            setcalenderChange(true);
            setfilterPayload((prev) => ({ ...prev, createdDate: "" }));
          }
      
          // const date = value.toDate();
          // const ISOString = date.toISOString();
          // var split = ISOString.split("T");
          // var convertedString = `${split[0]}`;
          // console.log("split", split);
      
          // setcalendarVal(value);
        };

  const renderDropdownitems = (prop, value) => {
    if (prop === "type") {
      return (
        
        null
      );
    } else {
      return (
        <>
          <Dropdown.Item
            onClick={(e) =>
              setfilterPayload((prev) => ({ ...prev, [prop]: "all" }))
            }
            // settypevalue
          >
            All
          </Dropdown.Item>
          {assetTypes?.map((val) => {
            if (prop === "type") {
              return (
                <>
                  <Dropdown.Item
                    onClick={(e) =>
                      setfilterPayload((prev) => ({ ...prev, [prop]: val }))
                    }
                  >
                    {val}
                  </Dropdown.Item>
                </>
              );
            }
            return (
              <>
                <Dropdown.Item
                  onClick={(e) =>
                    setfilterPayload((prev) => ({ ...prev, [prop]: val }))
                  }
                >
                  {val}
                </Dropdown.Item>
              </>
            );
          })}
        </>
      );
    }
  };

 

  function Row(props) {
    const { row } = props;
    const { rowIndex } = props;
    const user = JSON.parse(localStorage.getItem("loginUser"))
    const [open, setOpen] = React.useState(false);
    const classes = useRowStyles();

    const [selectedId, setselectedId] = useState("");
    const [asset, setasset] = useState("")


  const [editedEngData, seteditedEngData] = useState({
      fieldName: "",
      fieldValue: "",
      fieldType: "",
    });

    const onToggleEditMode = (id, data) => {
      setselectedId(id);
      seteditedEngData({
        fieldName: data.fieldName,
        fieldValue: data.fieldValue,
        fieldType: data.fieldType,
      });
    };

    const addEngineer = (asset) => {
      dispatch(assetActions.setAssetEngData(asset))
      setopenAddEngDataDialog(true);
      setasset(asset)
    };

    const handleAddEngData = () => {};

    const onRevert = () => {
      setselectedId("");
      seteditedEngData({
        fieldName: "",
        fieldValue: "",
        fieldType: "",
      });
    };

    const onChangeData = (e, field) => {
      seteditedEngData((prev) => ({ ...prev, [`${field}`]: e.target.value }));
    };

    const onEditingDone = () => {
      dispatch(commonActions.showApiLoader(true));
      const data = {
        engDataId: selectedId,
        ...editedEngData,
        updatedBy:USER_DETAILS?.userId
      };
      console.log("onEditingDone data", data);
      updateEngineerData([data])
        .then((res) => {
          console.log("updateEngineerData RESPONSE", res);
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
        deletedBy:USER_DETAILS?.userId
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

    return (
      <React.Fragment>
        <TableRow className={classes.root}>
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">
            {rowIndex + 1}
          </TableCell>
          <TableCell component="th" scope="row">
            {row.assetName}
          </TableCell>
          <TableCell>{row.productName}</TableCell>
          <TableCell>{row.assetType}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={1} style={{ boxShadow: "0px 0px 5px #bcbcbc" }}>
                <div
                  style={{ display: "flex", justifyContent: "space-between", backgroundColor: "#3f51b5" }}
                >
                  <Typography variant="h6" gutterBottom component="div" style={{ padding: "10px 20px", color: "#fff" }}>
                    <strong>Engineering Data</strong>
                  </Typography>
                  <Tooltip title="Add Engineering Data">
                    <IconButton
                      aria-label="add-engineering-data"
                      onClick={() =>{addEngineer(row)}}
                    >
                      <AddBoxIcon style={{ color: "#fff" }} />
                    </IconButton>
                  </Tooltip>
                </div>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell>S.No</TableCell>
                      <TableCell>Field Name</TableCell>
                      <TableCell>Field Value</TableCell>
                      <TableCell>Field Type</TableCell>
                      <TableCell>Created Date</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row?.engineeringData?.map((engData, index) => (
                      <TableRow key={engData.engDataId}>
                        {selectedId === engData?.engDataId ? (
                          <>
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
                        ) : (
                          <IconButton
                            aria-label="delete"
                            onClick={() =>
                              onToggleEditMode(engData.engDataId, engData)
                            }
                          >
                            <EditIcon />
                          </IconButton>
                        )}
                        <TableCell component="th" scope="row">
                          {index + 1}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {selectedId === engData?.engDataId ? (
                            <Input
                              value={editedEngData?.fieldName}
                              name={editedEngData?.fieldName}
                              onChange={(e) => onChangeData(e, "fieldName")}
                              className={classes.input}
                            />
                          ) : (
                            engData.fieldName
                          )}
                        </TableCell>
                        <TableCell>
                          {selectedId === engData?.engDataId ? (
                            <Input
                              value={editedEngData?.fieldValue}
                              name={editedEngData?.fieldValue}
                              onChange={(e) => onChangeData(e, "fieldValue")}
                              className={classes.input}
                            />
                          ) : (
                            engData.fieldValue
                          )}
                        </TableCell>
                        <TableCell>{engData.fieldType}</TableCell>
                        <TableCell>{new Date(`${engData.createdDate}`).toLocaleDateString()}</TableCell>
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
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
        <AddEngDataDialog
          Open={openAddEngDataDialog}
          HandleClose={() => {setrenderTable((prev) => !prev); setopenAddEngDataDialog(false)}}
          HandleProceed={() => handleAddEngData()}
          SelectedAsset={asset}
        />
      </React.Fragment>
    );
  }

  Row.propTypes = {
    row: PropTypes.shape({
      calories: PropTypes.number.isRequired,
      carbs: PropTypes.number.isRequired,
      fat: PropTypes.number.isRequired,
      history: PropTypes.arrayOf(
        PropTypes.shape({
          amount: PropTypes.number.isRequired,
          customerId: PropTypes.string.isRequired,
          date: PropTypes.string.isRequired,
        })
      ).isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      protein: PropTypes.number.isRequired,
    }).isRequired,
  };

  useEffect(() => {
    getAssetTypes()
    .then((res) => {
      console.log("getAssetTypes RESPONSE", res);
      setassetTypes(res.data.result);
    })
    .catch((err) => {
      if(err.response.data.status=== 401 && JSON.parse(localStorage.getItem("loginUser")) !== null){
        dispatch(commonActions.handleExpiryAlert(true));
        removeUserSession();
        localStorage.removeItem("loginUser")
      }
    })
  },[])

  useEffect(() => {
    getAllEngData()
      .then((res) => {
        console.log("getAllEngData RESPONSE", res);
        setallEngData(res?.data?.result);
      })
      .catch((err) => {
        if(err.response.data.status=== 401 && JSON.parse(localStorage.getItem("loginUser")) !== null){
          dispatch(commonActions.handleExpiryAlert(true));
          removeUserSession();
          localStorage.removeItem("loginUser")
        }
      })
  }, [renderTable]);

  useEffect(() => {
    let data = {};
    Object.keys(filterPayload).forEach((item) => {
      if (filterPayload[item] !== "" && filterPayload[item] !== "all") {
        data[item] = filterPayload[item];
      }
    });
    console.log("getFilteredEngData data", data);
    getFilteredEngData(data)
      .then((res) => {
        console.log("getFilteredEngData RESPONSE", res);
        setallEngData(res?.data?.engineeringDataObject)
      })
      .catch((err) => {
        if(err.response.data.status=== 401 && JSON.parse(localStorage.getItem("loginUser")) !== null){
          dispatch(commonActions.handleExpiryAlert(true));
          removeUserSession();
          localStorage.removeItem("loginUser")
        }
      })

    return () => {};
  }, [filterPayload]);

  return (
    <>
      <div style={{ display: " flex" }}>
        <span>
          <AssessmentIcon style={{ color: "#3f51b5", fontSize: "2.5rem" }} />
        </span>
        <h2
          style={{
            textAlign: "center",
            fontFamily: "calibri",
            marginLeft: "10px",
            marginTop: "-5px",
          }}
        >
          <i style={{ color: "#3f51b5" }}>Engineering Data</i>
        </h2>
      </div>

      <div
          style={{
            display: "flex",
            alignItems:"center",
            gridGap:"10px",
            // justifyContent: "flex-start",
            marginBottom: "10px",
            border: "1px solid #bcbcbc",
            borderRadius: "10px",
            padding: "15px 10px",
          }}
        >
          <h5 
          // style={{ position: "relative", top: "25px" }}
          >Filters:</h5>
          <div style={{display:"flex",gridGap:"10px",alignItems:"center"}}>
            {Object.keys(filters)?.map((item) => {
              if (item === "createdDate") {
                return (
                  <DateRangePicker
                  value={calendarVal}
                  onChange={handleDatechange}
                  format="dd-MM-yyyy"
                  placeholder="dd-mm-yyyy"
                  cleanable
                />
                );
              } else if (
                item === "tagId" ||
                item === "productName" ||
                item === "assetName" ||
                item === "fieldName" ||
                item === "fieldValue"
              ) {
                return (
                  <input
                    style={{
                      width: "120px",
                      marginLeft: "10px",
                      // position: "relative",
                      // top: "10px",
                      height: "36px",
                      border:"1px solid #CCCC",
                      borderRadius:"6px",
                      padding:"10px"
                      // left: "10px",
                    }}
                    placeholder={`${
                      item === "userId"
                        ? "User Id"
                        : item
                            .replace(/([A-Z])/g, " $1")
                            .charAt(0)
                            .toUpperCase() +
                          item.replace(/([A-Z])/g, " $1").slice(1)
                    }`}
                    label={`${
                      item
                        .replace(/([A-Z])/g, " $1")
                        .charAt(0)
                        .toUpperCase() +
                      item.replace(/([A-Z])/g, " $1").slice(1)
                    }`}
                    onChange={(e) =>
                      setfilterPayload((prev) => ({
                        ...prev,
                        [item]: e.target.value,
                      }))
                    }
                    type={"text"}
                    id={item}
                    value={filterPayload[item]}
                  />
                );
              } else if (item === "isActive") {
                return null;
              } else if (item === "assetType") {
                return (
                  <CheckPicker
                    data={assetTypes.map((item) => ({
                      label: item.name,
                      value: item.name,
                    }))}
                    placeholder="Type"
                    style={{ width: 224 }}
                    onChange={(val) => {
                      if (val.length < 1) {
                        setfilterPayload((prev) => ({
                          ...prev,
                          [item]: "",
                        }));
                      } else {
                        setfilterPayload((prev) => ({
                          ...prev,
                          [item]: val,
                        }));
                      }
                      settypevalue(val);
                    }}
                    value={typevalue}
                  />
                );
              }
              return (
                <Dropdown
                  title={handleTitle(item)}
                  style={{ margin: "15px 0 0 20px" }}
                >
                  {renderDropdownitems(item, filters[item])}
                </Dropdown>
              );
            })}
          </div>
          <div
            style={{
              // marginLeft: "50px",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <button
              style={{
                height: "30px",
                padding: "5px 20px",
                // position: "relative",
                // top: "20px",
                backgroundColor: "#FFCCCB",
              }}
              onClick={handleClearFilter}
            >
              Clear Filter
            </button>
            
          </div>
        </div>

      {allEngData.length > 0 ? <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>S.No</TableCell>
              <TableCell>Asset Name</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Type</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allEngData.map((row, index) => (
              <Row key={row.assetId} row={row} rowIndex={index} />
            ))}
          </TableBody>
        </Table>
      </TableContainer> : <p style={{ textAlign: "center" }}>No records found</p>}
    </>
  );
}
