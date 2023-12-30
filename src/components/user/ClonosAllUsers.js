import React, { useContext } from "react";
import ClonosUsersTable from "./ClonosUsersTable";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import { useNavigate } from "react-router-dom";
import Dropdown from "rsuite/Dropdown";
import { CheckPicker, Checkbox } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import { useEffect, useState, useRef } from "react";
import Grid from "@material-ui/core/Grid";
import HelpIcon from "@material-ui/icons/Help";
import Tooltip from "@material-ui/core/Tooltip";
import PeopleIcon from "@material-ui/icons/People";
import Container from "@material-ui/core/Container";
import {
  getUserFilters,
  postUserFilters,
  createBulkUsers,
  getDesignations,
  getAllRoles,
  getAllTeams,
} from "../../Api/User/UserApi";
// import DatePicker from "react-multi-date-picker";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import { CSVLink } from "react-csv";
import Papa from "papaparse";
import { useDispatch, useSelector } from "react-redux";
import { commonActions } from "../../Store/Reducers/CommonReducer";
import { getToken, getUser, loginJumpLoadingStopper, removeUserSession } from "../../utils/clonosCommon";
import * as xlsx from "xlsx";
import { Box, CssBaseline, Modal, TextField } from "@material-ui/core";
import jsPDF from "jspdf";
import { styled } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import DialogTitle from "@material-ui/core/DialogTitle";
import PropTypes from "prop-types";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Typography from "@material-ui/core/Typography";
import ALLUSERSIMG from "../../assets/images/all-users.png";
import { getAllPermissions } from "../../Api/User/UserApi";
import configs from "../../config";
import { DateRangePicker } from "rsuite";
import { userActions } from "../../Store/Reducers/ClonosUserReducer";
import useToggler from "../../CustomHooks/TogglerHook";
import { UnAuthorizedModal } from "../CommonComponents/UnAuthorizedPage/UnAuthorizedModal";

// HELP USER DIALOG________________________________________________________________________________________________
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;
  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          style={{
            position: "absolute",
            right: 10,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

const ClonosAllUsers = () => {
  const loginUser = getUser()
  const NAVIGATE = useNavigate();
  const [filters, setfilters] = useState({});
  const [filteredusers, setfilteredusers] = useState([]);
  const [calendarVal, setcalendarVal] = useState(new Date());
  const [filterPayload, setfilterPayload] = useState({
    name: "",
    userId: "",
    designation: "",
    isActive: "",
    createdDate: "",
    phone: "",
    roleId: "",
    team: ""
  });
  const [calenderChange, setcalenderChange] = useState(false);
  const dispatch = useDispatch();
  const [renderUserTable, setrenderUserTable] = useState(false);
  const [designations, setdesignations] = useState([]);
  const [designationsValue, setdesignationsValue] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([])
  const allRoles = useSelector(state => state.userData.allRoles);
  const allTeams = useSelector(state => state.userData.allDepartments)
  const renderDropdownitems = (prop, value) => {
    if (prop === "phone") {
      return (
        <Dropdown.Item key={prop}>
          <input
            onChange={(e) =>
              setfilterPayload((prev) => ({ ...prev, [prop]: e.target.value }))
            }
            type={prop === "phone" ? "number" : "text"}
            id={prop}
            name={`${prop}`}
            value={filterPayload[prop]}
            onKeyUp={(event) => {
              // console.log("e.keyCode",e.keyCode);
              // event.defaultPrevented = true
              console.log("event", event);
            }}
          />
        </Dropdown.Item>
      );
    } else if (prop === "designation") {
      return (
        <>
          {null}
          {/* <Dropdown.Item
            onClick={(e) =>
              setfilterPayload((prev) => ({ ...prev, [prop]: "all" }))
            }
          >
            All
          </Dropdown.Item>
          {designations?.map((type) => {
            console.log("dessssssssiiiiiiii", type);
            return (
              <Dropdown.Item
                onClick={(e) =>
                  setfilterPayload((prev) => ({
                    ...prev,
                    [prop]: type.designation,
                  }))
                }
              >
                {type.designation}
              </Dropdown.Item>
            );
          })} */}
        </>
      );
    } else {
      return (
        <>
          <Dropdown.Item
            onClick={(e) =>
              setfilterPayload((prev) => ({ ...prev, [prop]: "all" }))
            }
          >
            All
          </Dropdown.Item>
          {value?.map((val) => {
            if (prop === "isActive") {
              return (
                <>
                  <Dropdown.Item
                    onClick={(e) =>
                      setfilterPayload((prev) => ({ ...prev, [prop]: val }))
                    }
                  >
                    {val === 1 ? "Active" : "Inactive"}
                  </Dropdown.Item>
                </>
              );
            } else if (prop === "Is_Admin") {
              return (
                <>
                  <Dropdown.Item
                    onClick={(e) =>
                      setfilterPayload((prev) => ({
                        ...prev,
                        [prop]: val ? 1 : 0,
                      }))
                    }
                  >
                    {val ? "Admin" : "User"}
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

  const [lsLocalLoading, setIsLocalLoading] = useToggler() // Custom Hook which returns boolean value (initial value : "false")

  useEffect(() => {
    let interval = loginJumpLoadingStopper({ setterFunction: setIsLocalLoading, timeout: 5000 })
    return () => {
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    let data = {};
    Object.keys(filterPayload).forEach((item) => {
      if (filterPayload[item] !== "" && filterPayload[item] !== "all") {
        data[item] = filterPayload[item];
      }
    });
    console.log("postUserFilters data", data);
    postUserFilters(data)
      .then((res) => {
        console.log("postUserFilters RESPONSE", res);
        setfilteredusers(res?.data?.users || []);
      })
      .catch((err) => {
        if (err.response.data.status === 401 && JSON.parse(localStorage.getItem("loginUser")) !== null) {
          dispatch(commonActions.handleExpiryAlert(true));
          removeUserSession();
          localStorage.removeItem("loginUser")
        }
      })

    return () => { };
  }, [filterPayload]);

  useEffect(() => {
    getUserFilters()
      .then((res) => {
        console.log("getUserFilters RESPONSE", res);
        const orderData = {
          isActive: res.data.isActive,
          Is_Admin: res.data.Is_Admin,
          phone: res.data.phone,
          userId: res.data.userId,
          name: res.data.name,
          createdDate: res.data.createdDate,
          designation: res.data.designation,
          roleId: res.data.roleName,
          team: res.data.team
        };
        setfilters(orderData);
      })
      .catch((err) => {
        if (err.response.data.status === 401 && JSON.parse(localStorage.getItem("loginUser")) !== null) {
          dispatch(commonActions.handleExpiryAlert(true));
          removeUserSession();
          localStorage.removeItem("loginUser")
        }
      })

    getDesignations()
      .then((res) => {
        console.log("getDesignations RESPONSE", res);
        setdesignations(res.data.result);
      })
      .catch((err) => {
        if (err.response.data.status === 401 && JSON.parse(localStorage.getItem("loginUser")) !== null) {
          dispatch(commonActions.handleExpiryAlert(true));
          removeUserSession();
          localStorage.removeItem("loginUser")
        }
      })
    getAllRoles().then((res) => {
      dispatch(userActions.getAllRoles(res.data.result))
    })
    getAllTeams().then((res) => {
      dispatch(userActions.getAllDepartments(res.data.result))
    })
  }, []);

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


  const tempHeaders = [
    { label: "First Name", key: "first_name" },
    { label: "Last Name", key: "last_name" },
    { label: "Email", key: "email" },
    { label: "Phone", key: "phone" },
    { label: "State", key: "state" },
    { label: "Business Unit", key: "BU" },
  ];

  const handleTitle = (name) => {
    if (name === "isActive") {
      return "Status";
    } else if (name === "userId") {
      return "User Id ";
    } else if (name === "Is_Admin") {
      return "User Type";
    }
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const handleClearFilter = () => {
    setfilterPayload({
      name: "",
      userId: "",
      designation: "",
      isActive: "",
      createdDate: "",
      phone: "",
      roleId: "",
      team: "",
    });
    setcalenderChange(false);
    setcalendarVal([new Date()])
    setdesignationsValue([]);
  };

  function toCamel(o) {
    var newO, origKey, newKey, value;
    function camelize(str) {
      return str
        .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
          return index === 0 ? word.toLowerCase() : word.toUpperCase();
        })
        .replace(/\s+/g, "");
    }
    if (o instanceof Array) {
      return o.map(function (value) {
        if (typeof value === "object") {
          value = toCamel(value);
        }
        return value;
      });
    } else {
      newO = {};
      for (origKey in o) {
        if (o.hasOwnProperty(origKey)) {
          newKey = (
            origKey.charAt(0).toLowerCase() + origKey.slice(1) || origKey
          )
            .toString()
            .replace(/\s(.)/g, function ($1) {
              return $1.toUpperCase();
            })
            .replace(/\s/g, "")
            .replace(/^(.)/, function ($1) {
              return $1.toLowerCase();
            });
          if (newKey === "") {
          }
          value = o[origKey];
          if (
            value instanceof Array ||
            (value !== null && value.constructor === Object)
          ) {
            value = toCamel(value);
          }

          newO[newKey] = value;
        }
      }
    }

    return newO;
  }

  const handleUploadSheet = (e) => {
    dispatch(commonActions.showApiLoader(true));
    var errorData = false;
    const fileTemp = {
      firstName: "",
      lastName: "",
      email: "",
      state: "",
      phone: "",
      businessUnit: "",
      designation: "",
      createdBy: "",
      role: "",
      team: ""
    };

    function compareKeys(a, b) {
      var aKeys = Object.keys(a).sort();
      var bKeys = Object.keys(b).sort();
      return JSON.stringify(aKeys) === JSON.stringify(bKeys);
    }
    e.preventDefault();
    if (e.target.files) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = xlsx.read(data, { type: "array" });
        console.log("workbook", workbook);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = xlsx.utils.sheet_to_json(worksheet);
        const convertedJson = json.map((obj) => {
          obj["createdBy"] = loginUser?.userId
          return toCamel(obj);
        });
        console.log("convertedJson", convertedJson);

        if (convertedJson.length > 0) {
          errorData = compareKeys(convertedJson[0], fileTemp);
        }

        console.log("errorData", errorData);

        if (errorData) {
          createBulkUsers(convertedJson)
            .then((res) => {
              console.log("createBulkUsers RESPONSE", res);
              dispatch(commonActions.showApiLoader(false));
              dispatch(
                commonActions.handleSnackbar({
                  show: true,
                  message: `${convertedJson.length} ${convertedJson.length > 1 ? "Users" : "User"
                    } created successfully`,
                  type: "success",
                })
              );

              setrenderUserTable((prev) => !prev);
            })
            .catch((err) => {
              if (err.response.data.status === 401 && JSON.parse(localStorage.getItem("loginUser")) !== null) {
                dispatch(commonActions.handleExpiryAlert(true));
                removeUserSession();
                localStorage.removeItem("loginUser")
              } else {
                console.log("createBulkUsers err", err);
                dispatch(commonActions.showApiLoader(false));
                dispatch(
                  commonActions.handleSnackbar({
                    show: true,
                    message: err.response.data.message,
                    type: "error",
                  })
                );
                setrenderUserTable((prev) => !prev);
              }
            });
        } else {
          dispatch(commonActions.showApiLoader(false));
          dispatch(
            commonActions.handleSnackbar({
              show: true,
              message: "Wrong File Uploaded",
              type: "error",
            })
          );
        }

        console.log("convertedJson", convertedJson);
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  };

  const handleDownTemp = () => {
    window.open(`${configs.url}/api/v1/admin/userfile`, "_self");
  };

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [designationClean, setdesignationClean] = useState(true);
  const contentRef = useRef(null);
  const handleClickOpen = () => {
    setOpen(true);
  };

  // HELP USER DIALOG FUNCTIONS PRINT AND DOWNLOAD __________________________________________________________________________________

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "white",
    backgroundColor: "white",
    boxShadow: 24,
    p: 10,
    color: "black",
  };

  const printContent = () => {
    // window.print();
    var data = document.getElementById("data").innerHTML;
    var body = document.getElementById("body").innerHTML;
    document.getElementById("body").innerHTML = data;
    window.print();
    document.getElementById("body").innerHTML = body;
  };

  const divRef = useRef(null);

  const printText = () => {
    const text = divRef.current.textContent;
    const doc = new jsPDF();
    doc.setProperties({
      title: "My document",
      subject: "This is the subject",
      author: "John Doe",
      keywords: "pdf, javascript, react",
      creator: "My React app",
      width: 210,
      height: 297,
    });

    const lines = doc.splitTextToSize(text, 250);
    doc.text(lines, 10, 10);
    doc.text(text, 10, 10);
    doc.save("text.pdf");
    doc.textAlign("center");
    window.open(doc.output("bloburl"), "_blank");
  };

  const onButtonClick = () => {
    // using Java Script method to get PDF file
    fetch("SamplePDF.pdf").then((response) => {
      response.blob().then((blob) => {
        // Creating new object of PDF file
        const fileURL = window.URL.createObjectURL(blob);
        // Setting various property values
        let alink = document.createElement("a");
        alink.href = fileURL;
        alink.download = "SamplePDF.pdf";
        alink.click();
      }).catch((err) => {
        if (err.response.data.status === 401 && JSON.parse(localStorage.getItem("loginUser")) !== null) {
          dispatch(commonActions.handleExpiryAlert(true));
          removeUserSession();
          localStorage.removeItem("loginUser")
        }
      })
    }).catch((err) => {
      if (err.response.data.status === 401 && JSON.parse(localStorage.getItem("loginUser")) !== null) {
        dispatch(commonActions.handleExpiryAlert(true));
        removeUserSession();
        localStorage.removeItem("loginUser")
      }
    })
  };

  const printDiv = () => {
    let mywindow = window.open(
      "",
      "PRINT",
      "height=650,width=900,top=100,left=150"
    );

    mywindow.document.write(`<html><head><title>sample</title>`);
    mywindow.document.write("</head><body >");
    mywindow.document.write(document.getElementById("data").innerHTML);
    mywindow.document.write("</body></html>");

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/
    mywindow.print();
    mywindow.close();

    return true;
  };

  const Print = () => {
    //console.log('print');
    let printContents = document.getElementById("printablediv").innerHTML;
    let originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
  };

  const state = {
    content:
      "Cras facilisis urna ornare ex volutpat, et convallis erat\nelementum. Ut aliquam, ipsum vitae gravida suscipit, metus dui\nbibendum est, eget rhoncus nibh metus nec massa. Maecenas\nhendrerit laoreet augue nec molestie. Cum sociis natoque\npenatibus et magnis dis parturient montes, nascetur ridiculus\nmus.\nPraesent commodo cursus magna, vel scelerisque nisl consectetur\net.Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.",
  };
  const downloadTXT = (content) => {
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(state.content)
    );
    element.setAttribute("download", "download.txt");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const [allpermissions, setallpermissions] = useState([]);

  // useEffect(() => {
  //   getAllPermissions()
  //     .then((res) => {
  //       console.log("getAllPermissions RESPONSE", res);
  //       setallpermissions(res?.data?.result);
  //     })
  //     .catch((err) => console.log("getAllPermissions ERROR".err));
  // }, []);

  const [handlePermission, sethandlePermission] = useState({});

  const currentPermissionsSelector = useSelector(
    (state) => state.userData.loggedUserPermissions
  );

  useEffect(() => {
    allpermissions?.map((permission) => {
      sethandlePermission((prev) => ({
        ...prev,
        [`${permission.permissionType}`]: false,
      }));
    });
    currentPermissionsSelector?.map((permission) => {
      sethandlePermission((prev) => ({
        ...prev,
        [`${permission.permissionType}`]: true,
      }));
    });
  }, [allpermissions, currentPermissionsSelector]);



  if (loginUser?.permissions?.includes("usr005")) {
    return (
      <div>
        <div>
          <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
          >
            <BootstrapDialogTitle
              id="customized-dialog-title"
              onClose={handleClose}
            >
              Create Users - Guide
            </BootstrapDialogTitle>
            <div ref={divRef}>
              <DialogContent dividers>
                <Typography gutterBottom>
                  <p id="data">
                    Cras facilisis urna ornare ex volutpat, et convallis
                    eratelementum. Ut aliquam, ipsum vitae gravida suscipit, metus
                    duibibendum est, eget rhoncus nibh metus nec massa.
                    Maecenashendrerit laoreet augue nec molestie. Cum sociis
                    natoquepenatibus et magnis dis parturient montes, nascetur
                    ridiculusmus.
                  </p>
                </Typography>
                <Typography gutterBottom>
                  Praesent commodo cursus magna, vel scelerisque nisl consectetur
                  et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus
                  dolor auctor.
                </Typography>
              </DialogContent>
            </div>
            <DialogActions>
              <ButtonGroup
                ref={contentRef}
                className="print-content"
                color="primary"
                aria-label="outlined primary button group"
                style={{ marginRight: "20px" }}
              >
                <Button onClick={downloadTXT}>Download</Button>
                <Button onClick={printDiv}>Print</Button>
              </ButtonGroup>
            </DialogActions>
          </BootstrapDialog>
        </div>
        {/* // end */}

        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
              }}
            >
              {/* <PeopleIcon style={{ fontSize: "2.2rem", position: "relative", top: "10px", color: "#3f51b5",}} /> */}
              <img
                src={ALLUSERSIMG}
                style={{ height: "40px", position: "relative", top: "5px" }}
                alt="ALL_USERS"
              />
              <h2
                style={{
                  color: "#3f51b5",
                  textAlign: "center",
                  fontFamily: "calibri",
                  marginLeft: "10px",
                }}
              >
                <i>All Users</i>
              </h2>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gridGap: "20px", alignItems: "center" }}>
              <ButtonGroup
                color="primary"
                aria-label="outlined primary button group"
                style={{
                  marginRight: "20px",
                  display: loginUser.permissions.includes("usr001") ? "block" : "none",
                }}
              >
                <input
                  style={{ display: "none" }}
                  id="contained-button-file"
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleUploadSheet}
                  onClick={(event) => {
                    event.target.value = null;
                  }}
                />
                <label htmlFor="contained-button-file">
                  <Button variant="outlined" color="primary" component="span">
                    Upload
                  </Button>
                </label>
                <Button onClick={handleDownTemp}>
                  Download Template
                </Button>
              </ButtonGroup>
              <div>


                <button
                  className="createUserBtn"
                  onClick={() => {
                    NAVIGATE("/create-user");
                  }}
                  style={{
                    display: loginUser.permissions.includes("usr001") ? "block" : "none",
                  }}
                >
                  <PersonAddIcon
                    style={{ fontSize: "1.5em", position: "relative", top: "2px" }}
                  />
                  <span
                    style={{ position: "relative", top: "-3px", left: "0.5rem" }}
                  >
                    Create New User
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div
            style={{
              border: "1px solid #bcbcbc",
              padding: "15px 10px",
              borderRadius: "10px",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gridGap: "10px",
                // justifyContent: "flex-start",
              }}
            >
              <h5
              //  style={{ position: "relative", top: "25px" }}
              >Filters:</h5>
              <div style={{ display: "flex", gridGap: "10px", alignItems: "center" }}>
                {Object.keys(filters).map((item) => {
                  console.log("items", item)
                  if (item === "createdDate") {
                    return (
                      <DateRangePicker
                        value={calendarVal}
                        onChange={handleDatechange}
                        placeholder="Select date range"
                        cleanable
                      />
                    );
                  } else if (item === "userId" || item === "name") {
                    return (
                      <span>
                        <input
                          style={{
                            width: "120px",
                            // marginLeft: "10px",
                            // position: "relative",
                            // top: "10px",
                            height: "36px",
                            border: "1px solid #CCCC",
                            borderRadius: "6px",
                            padding: "10px"
                          }}
                          placeholder={`${item === "userId"
                            ? "User Id"
                            : item
                              .replace(/([A-Z])/g, " $1")
                              .charAt(0)
                              .toUpperCase() +
                            item.replace(/([A-Z])/g, " $1").slice(1)
                            }`}
                          label={`${item === "userId"
                            ? "User Id"
                            : item
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
                      </span>
                    );
                  } else if (item === "designation") {
                    return (
                      <div style={{ width: "200px" }}>
                        <CheckPicker
                          data={designations.map((item) => ({
                            label: item.designation,
                            value: item.designation,
                          }))}
                          placeholder="Designation"
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
                            setdesignationsValue(val);
                          }}
                          value={designationsValue}
                        />
                      </div>
                    );
                  } else if (item === "roleId") {
                    return (
                      <div style={{ width: "200px" }}>
                        <CheckPicker
                          data={allRoles.map((item) => ({
                            label: item.roleName.replace(/_/g, " ").replace(/(\b\w)/g, match => match.toUpperCase()),
                            value: item.role_id,
                          }))}
                          placeholder="Role"
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
                            setSelectedRoles(val);
                          }}
                          value={selectedRoles}
                        />
                      </div>
                    );
                  } else if (item === "team") {
                    return (
                      <div style={{ width: "200px" }}>
                        <CheckPicker
                          data={allTeams.map((team) => ({
                            label: team.teamName,
                            value: team.teamId,
                          }))}
                          placeholder="Team"
                          style={{ width: 224 }}
                          onChange={(val) => {
                            console.log(val, "vall")
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
                            setSelectedTeams(val);
                          }}
                          value={selectedTeams}
                        />
                      </div>
                    );
                  }
                  return (
                    <Dropdown
                      style={{ border: "1px solid #CCC", background: "none", borderRadius: "6px" }}
                      title={handleTitle(item)}
                    // style={{ margin: "15px 0 0 20px" }}
                    >
                      {renderDropdownitems(item, filters[item])}
                    </Dropdown>
                  );
                })}
              </div>

              <div
                style={{
                  marginLeft: "50px",
                  display: "flex",
                  alignItems: "center"
                  // justifyContent: "flex-end",
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

                <Tooltip title="Help">
                  <HelpIcon
                    onClick={handleOpen}
                    style={{
                      // marginTop: "20px",
                      marginLeft: "5px",
                      cursor: "pointer",
                    }}
                  />
                </Tooltip>
              </div>
            </div>
          </div>
        </div>

        <ClonosUsersTable
          renderTable={renderUserTable}
          filters={filterPayload}
          FilteredUsers={filteredusers}
          clearFilter={() => handleClearFilter()}
        />
      </div>
    );
  }
  {
    return !lsLocalLoading ? <h1 style={{ textAlign: "center" }}>Loading...</h1> :
      <Container component="main" maxWidth="sm">
        <UnAuthorizedModal />
      </Container>
  }
};

export default ClonosAllUsers;
