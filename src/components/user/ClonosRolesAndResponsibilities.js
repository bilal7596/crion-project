import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Grid,
} from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Typography from "@material-ui/core/Typography";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Select from "@material-ui/core/Select";
import DoneIcon from "@material-ui/icons/Done";
import HelpIcon from "@material-ui/icons/Help";
import Tooltip from "@material-ui/core/Tooltip";
import { useRef } from "react";
import jsPDF from "jspdf";
import ClearIcon from "@material-ui/icons/Clear";
import PropTypes from "prop-types";
import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import DialogTitle from "@material-ui/core/DialogTitle";
import { styled } from "@material-ui/core/styles";
import { CheckPicker, SelectPicker } from "rsuite";
import {
  assignRole,
  filterPermissions,
  filterRoles,
  getAllPermissions,
  getAllRoles,
  getAllUserPermissions,
  getAllUsers,
  getAssignedRoles,
  getUserPermissions,
  postAssignPermission,
} from "../../Api/User/UserApi";
import TablePagination from "@material-ui/core/TablePagination";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { getToken, getUser, removeUserSession } from "../../utils/clonosCommon";
import { useDispatch, useSelector } from "react-redux";
import { commonActions } from "../../Store/Reducers/CommonReducer";
import AssignRoleDialog from "./AssignRoleDialog";
import { FaUserLock } from "react-icons/fa";
import { DoneAllOutlined } from "@material-ui/icons";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Styles from "../../ModuleStyles/RolesAndPermissions/permissions.module.css"
const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  root: {
    width: "85vw",
    overflowX: "auto",
  },
  container: {
    maxHeight: 440,
  },
}));

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

const permissionsTree = ["User", "Asset", "Documents", "Engineering Data", "Roles and Permissions", "Export to 3D system", "Approvals"]

const ClonosRolesAndResponsibilities = () => {
  const classes = useStyles();
  const DISPATCH = useDispatch();
  const [users, setusers] = React.useState([]);
  const [selectedUsers, setselectedUsers] = useState([]);
  const [selectedPeramUser, setSelectedPeramUser] = useState("")
  const [selectedPermUsers, setselectedPermUsers] = useState([]);
  const [allroles, setallroles] = useState([]);
  const [assignedRoles, setassignedRoles] = useState([]);
  const [selectedrole, setselectedrole] = useState("");
  const [selectedPermissions, setselectedPermissions] = useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [permpage, setpermPage] = React.useState(0);
  const [rowsPerPagePerm, setRowsPerPagePerm] = React.useState(5);
  const [renderTable, setrenderTable] = useState(false);
  const [selectedUserPermissions, setSelectedUserPermissions] = useState([])
  const [filterPayload, setfilterPayload] = useState({
    username: "",
    role: [],
  });
  const [filterPermissionPayload, setfilterPermissionPayload] = useState({
    username: "",
    // permissions: [],
  });
  const [allpermissions, setallpermissions] = useState([]);
  const [allUserPermissions, setallUserPermissions] = useState([]);
  const [assignRoleDialog, setassignRoleDialog] = useState({
    show: false,
    selectedrole: {},
  });
  const contentRef = useRef(null);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const loggedUser = getUser();


  // Token Toolkit 
  const { tokenToolkitState } = useSelector(store => store.userData)
  console.log('tokenToolkitState:', tokenToolkitState)

  // HELP USER DIALOG FUNCTIONS PRINT AND DOWNLOAD __________________________________________________________________________________

  const printContent = () => {
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
    fetch("SamplePDF.pdf")
      .then((response) => {
        response
          .blob()
          .then((blob) => {
            // Creating new object of PDF file
            const fileURL = window.URL.createObjectURL(blob);
            // Setting various property values
            let alink = document.createElement("a");
            alink.href = fileURL;
            alink.download = "SamplePDF.pdf";
            alink.click();
          })
          .catch((err) => {
            if (
              err.response.data.status === 401 &&
              JSON.parse(localStorage.getItem("loginUser")) !== null
            ) {
              DISPATCH(commonActions.handleExpiryAlert(true));
              removeUserSession();
              localStorage.removeItem("loginUser");
            }
          });
      })
      .catch((err) => {
        if (
          err.response.data.status === 401 &&
          JSON.parse(localStorage.getItem("loginUser")) !== null
        ) {
          DISPATCH(commonActions.handleExpiryAlert(true));
          removeUserSession();
          localStorage.removeItem("loginUser");
        }
      });
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
      "To assign roles to existing users, click on the Assign Roles button.\n Select the username of the user you want to assign roles to and choose from the 8 available roles to assign.\n Press the Assign button to finalize the role assignment.\n Keep in mind that only users with the Assign Roles privilege can assign roles.",
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

  const handleAssignRole = () => {
    setassignRoleDialog((prev) => ({
      ...prev,
      show: true,
      selectedRole: selectedrole,
    }));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handlePermChangePage = (event, newPage) => {
    setpermPage(newPage);
  };

  const handlePermChangeRowsPerPage = (event) => {
    setRowsPerPagePerm(parseInt(event.target.value, 10));
    setpermPage(0);
  };

  const handleCloseAsssignDialog = () => {
    setassignRoleDialog((prev) => ({ ...prev, show: false }));
    setselectedUsers([]);
    setselectedrole("");
    setrenderTable((prev) => !prev);
  };


  // FOR PERMISSIONS TREE

  const assignSinglePermission = (permission, userPermissions, user) => {
    const loggedUser = getUser();
    const data = {
      userId: [selectedPeramUser],
      createdBy: loggedUser.userId,
      updatedBy: loggedUser.userId,
      permissionsArray: Array.isArray(userPermissions) ? [...userPermissions, permission.permissionId] : [userPermissions, permission.permissionId],
    };
    console.log(data, "darata")

    postAssignPermission(data)
      .then((res) => {
        console.log("postAssignPermission RESPONSE", res);
        DISPATCH(
          commonActions.handleSnackbar({
            show: true,
            message: "Permissions Assigned Successfully",
            type: "success",
          })
        );

        getUserPermissions({ userId: user, token: getToken() }).then((res) => {
          console.log(res, "ressssssssss")
          setSelectedUserPermissions(res?.data?.result?.permissionsArray)
        })
      }).catch((err) => {
        if (
          err.response.data.status === 401 &&
          JSON.parse(localStorage.getItem("loginUser")) !== null
        ) {
          DISPATCH(commonActions.handleExpiryAlert(true));
          removeUserSession();
          localStorage.removeItem("loginUser");
        }
      });
  }

  const removeSinglePermission = (permission, usersPermissions, user) => {
    console.log(permission, usersPermissions, "hehheeh")
    const loggedUser = getUser();
    const data = {
      userId: [selectedPeramUser],
      createdBy: loggedUser.userId,
      updatedBy: loggedUser.userId,
      permissionsArray: Array.isArray(usersPermissions) ? usersPermissions?.filter((perm) => {
        return permission.permissionId !== perm
      }) : [],
    };
    console.log(usersPermissions, data, "dataer")

    postAssignPermission(data)
      .then((res) => {
        console.log("postAssignPermission RESPONSE", res);
        DISPATCH(
          commonActions.handleSnackbar({
            show: true,
            message: "Permissions removed Successfully",
            type: "success",
          })
        );

        getUserPermissions({ userId: user, token: getToken() }).then((res) => {
          console.log(res, "ressssssssss")
          setSelectedUserPermissions(res?.data?.result?.permissionsArray)
        })
      }).catch((err) => {
        if (
          err.response.data.status === 401 &&
          JSON.parse(localStorage.getItem("loginUser")) !== null
        ) {
          DISPATCH(commonActions.handleExpiryAlert(true));
          removeUserSession();
          localStorage.removeItem("loginUser");
        }
      });
  }

  useEffect(() => {
    if (selectedPermUsers?.length === 1) {
      // setselectedPermissions
      console.log("selectedPermUsers", selectedPermUsers);
      getUserPermissions({ userId: selectedPermUsers[0] })
        .then((response) => {
          console.log("getUserPermissions RESPONSE", response);
          setselectedPermissions(response?.data?.result?.permissionsArray);
        })
        .catch((err) => {
          if (
            err.response.data.status === 401 &&
            JSON.parse(localStorage.getItem("loginUser")) !== null
          ) {
            DISPATCH(commonActions.handleExpiryAlert(true));
            removeUserSession();
            localStorage.removeItem("loginUser");
          }
        });
    } else {
      setselectedPermissions([]);
    }
    console.log(selectedPermUsers, "kmskdslka;s");
  }, [selectedPermUsers]);

  const handleApplyFilters = (filters) => {
    return Object.keys(filters).map((name) => {
      if (filters[name] !== "") {
        if (name === "isActive") {
          return (
            <span style={{ marginLeft: "20px" }}>
              <span style={{ fontWeight: "bold" }}>Account Status:</span>
              <span style={{ marginLeft: "10px" }}>
                {filters[name] === 1
                  ? "Active"
                  : `${filters[name] === 0 ? "Inactive" : "All"}`}
              </span>
            </span>
          );
        }
        return (
          <span style={{ marginLeft: "20px" }}>
            <span style={{ fontWeight: "bold", textTransform: "capitalize" }}>
              {name}:
            </span>
            <span style={{ marginLeft: "10px" }}>{filters[name]}</span>
          </span>
        );
      } else {
        return "-";
      }
    });
  };

  const handleApplyPermissionFilters = (filters) => {
    return Object.keys(filters).map((name) => {
      if (filters[name] !== "") {
        return (
          <span style={{ marginLeft: "20px" }}>
            <span style={{ fontWeight: "bold", textTransform: "capitalize" }}>
              {name}:
            </span>
            <span style={{ marginLeft: "10px" }}>{filters[name]}</span>
          </span>
        );
      } else {
        return "-";
      }
    });
  };

  const handleAssignPermission = () => {
    const loggedUser = getUser();
    const data = {
      userId: selectedPermUsers,
      createdBy: loggedUser.userId,
      updatedBy: loggedUser.userId,
      permissionsArray: selectedPermissions,
    };

    postAssignPermission(data)
      .then((res) => {
        console.log("postAssignPermission RESPONSE", res);
        DISPATCH(
          commonActions.handleSnackbar({
            show: true,
            message: "Permissions Assigned Successfully",
            type: "success",
          })
        );
        setrenderTable((prev) => !prev);
        setselectedPermUsers([]);
        setselectedPermissions([]);
      })
      .catch((err) => {
        if (
          err.response.data.status === 401 &&
          JSON.parse(localStorage.getItem("loginUser")) !== null
        ) {
          DISPATCH(commonActions.handleExpiryAlert(true));
          removeUserSession();
          localStorage.removeItem("loginUser");
        } else {
          console.log("postAssignPermission ERROR", err);
          DISPATCH(
            commonActions.handleSnackbar({
              show: true,
              message: `${err.response.data.message}`,
              type: "error",
            })
          );
          setrenderTable((prev) => !prev);
        }
      });

    console.log("handleAssignPermission data", data);
  };

  useEffect(() => {
    getAllUsers()
      .then((res) => {
        console.log("getAllUsers RESPONSE", res);
        setusers(res?.data?.result);
      })
      .catch((err) => {
        if (
          err.response.data.status === 401 &&
          JSON.parse(localStorage.getItem("loginUser")) !== null
        ) {
          DISPATCH(commonActions.handleExpiryAlert(true));
          removeUserSession();
          localStorage.removeItem("loginUser");
        }
      });
    getAllRoles()
      .then((res) => {
        console.log("getAllRoles RESPONSE", res);
        setallroles(res?.data?.result);
      })
      .catch((err) => {
        if (
          err.response.data.status === 401 &&
          JSON.parse(localStorage.getItem("loginUser")) !== null
        ) {
          DISPATCH(commonActions.handleExpiryAlert(true));
          removeUserSession();
          localStorage.removeItem("loginUser");
        }
      });
    getAssignedRoles()
      .then((res) => {
        console.log("assignedRoles RESPONSE", res);
        setassignedRoles(res?.data?.result);
      })
      .catch((err) => {
        if (
          err.response.data.status === 401 &&
          JSON.parse(localStorage.getItem("loginUser")) !== null
        ) {
          DISPATCH(commonActions.handleExpiryAlert(true));
          removeUserSession();
          localStorage.removeItem("loginUser");
        }
      });
    getAllPermissions()
      .then((res) => {
        console.log("getAllPermissions RESPONSE", res);
        setallpermissions(res?.data?.result);
      })
      .catch((err) => {
        if (
          err.response.data.status === 401 &&
          JSON.parse(localStorage.getItem("loginUser")) !== null
        ) {
          DISPATCH(commonActions.handleExpiryAlert(true));
          removeUserSession();
          localStorage.removeItem("loginUser");
        }
      });
    getAllUserPermissions()
      .then((res) => {
        console.log("getAllUserPermissions RESPONSE", res);
        setallUserPermissions(res?.data?.result);
      })
      .catch((err) => {
        if (
          err.response.data.status === 401 &&
          JSON.parse(localStorage.getItem("loginUser")) !== null
        ) {
          DISPATCH(commonActions.handleExpiryAlert(true));
          removeUserSession();
          localStorage.removeItem("loginUser");
        }
      });
  }, [renderTable]);

  useEffect(() => {
    let permissionData = {};
    Object.keys(filterPermissionPayload).forEach((item) => {
      if (
        filterPermissionPayload[item] !== "" &&
        filterPermissionPayload[item] !== "all"
      ) {
        if (item === "permissions") {
          if (filterPermissionPayload.permissions.length > 0) {
            permissionData[item] = filterPermissionPayload[item];
          }
        } else {
          permissionData[item] = filterPermissionPayload[item];
        }
      }
    });

    console.log("permissionData", permissionData);

    let roleData = {};
    Object.keys(filterPayload).forEach((item) => {
      if (filterPayload[item] !== "" && filterPayload[item] !== "all") {
        if (item === "role") {
          if (filterPayload.role.length > 0) {
            roleData[item] = filterPayload[item];
          }
        } else {
          roleData[item] = filterPayload[item];
        }
      }
    });

    console.log("roleData", roleData);
    filterPermissions(permissionData)
      .then((res) => {
        console.log("filterPermissions RESPONSE", res);
        setallUserPermissions(res?.data?.roleArr);
      })
      .catch((err) => {
        if (
          err.response.data.status === 401 &&
          JSON.parse(localStorage.getItem("loginUser")) !== null
        ) {
          DISPATCH(commonActions.handleExpiryAlert(true));
          removeUserSession();
          localStorage.removeItem("loginUser");
        }
      });

    filterRoles(roleData)
      .then((res) => {
        console.log("filterRoles RESPONSE", res);
        setassignedRoles(res?.data?.roleArr);
      })
      .catch((err) => {
        if (
          err.response.data.status === 401 &&
          JSON.parse(localStorage.getItem("loginUser")) !== null
        ) {
          DISPATCH(commonActions.handleExpiryAlert(true));
          removeUserSession();
          localStorage.removeItem("loginUser");
        }
      });
  }, [filterPayload, filterPermissionPayload]);

  // useEffect(() => {
  //   alert("hi after get data")
  //   DISPATCH(commonActions.handleExpiryAlert(true));
  // }, [tokenToolkitState])

  console.log(selectedPermissions, "+++++++++++++++++++++");
  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 0px",
          marginBottom: "20px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gridGap: "10px" }}>
          <div
            style={{
              fontSize: "45px",
              color: "#3F51B5",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* <img style={{width:"50px"}} src={rolesPermission}/> */}
            <FaUserLock fontSize={"36px"} />
          </div>
          <h2
            style={{
              color: "#3F51B5",
              fontSize: "36px",
              fontFamily: "calibri",
            }}
          >
            <i>Roles - Permissions</i>
          </h2>
        </div>
        <div>
          <Tooltip title="Help">
            <HelpIcon
              onClick={handleOpen}
              style={{
                marginTop: "20px",
                marginLeft: "5px",
                cursor: "pointer",
              }}
            />
          </Tooltip>
        </div>
      </div>
      {loggedUser?.permissions?.includes("rol006") ||
        loggedUser?.permissions?.includes("rol004") ? (
        <div
          style={{
            boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
            padding: "1rem 2rem",
          }}
        >
          <Grid container style={{ padding: "20px" }}>
            <Grid item lg={1}>
              <p
                style={{
                  // marginTop: "20px",
                  color: "#3f51b5",
                  fontFamily: "calibri",
                  fontSize: "1.5em",
                }}
              >
                <strong>ROLES:</strong>
              </p>
            </Grid>
            {loggedUser?.permissions?.includes("rol006") ? (
              <Grid item lg={3}>
                <CheckPicker
                  data={users?.map((item) => ({
                    label: item.name,
                    value: item.userId,
                  }))}
                  placeholder="Users"
                  onChange={(val) => setselectedUsers(val)}
                  style={{
                    width: "300px",
                    border: "1px solid gray",
                    borderRadius: "5px",
                  }}
                  value={selectedUsers}
                />
              </Grid>
            ) : (
              <></>
            )}
            {loggedUser?.permissions?.includes("rol006") ? (
              <Grid item lg={3}>
                <SelectPicker
                  style={{
                    width: "300px",
                    border: "1px solid gray",
                    borderRadius: "5px",
                  }}
                  placeholder="Roles"
                  data={allroles?.map((item) => {
                    let roleName = item.roleName.replace(/_/g, " ");
                    return {
                      label: roleName
                        .match(
                          /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g
                        )
                        .map(
                          (x) =>
                            x.charAt(0).toUpperCase() + x.slice(1).toLowerCase()
                        )
                        .join(" "),
                      value: item.role_id,
                      data: item,
                    };
                  })}
                  // style={{ width: 224 }}
                  // setselectedrole(val); setselectedRoleDialog()
                  onSelect={(val, item) => {
                    console.log("item", item);
                    setselectedrole(item?.data);
                  }}
                  value={selectedrole.role_id}
                />
              </Grid>
            ) : (
              <></>
            )}
            {loggedUser?.permissions?.includes("rol006") ? (
              <Grid item lg={1}>
                <Button
                  style={{
                    // marginTop: "15px",
                    marginLeft: "10px",
                    width: "100px",
                  }}
                  color="primary"
                  variant="contained"
                  onClick={() => handleAssignRole()}
                  disabled={
                    selectedUsers.length > 0 && selectedrole.role_id
                      ? false
                      : true
                  }
                >
                  Assign
                </Button>
              </Grid>
            ) : (
              <></>
            )}
            {loggedUser?.permissions?.includes("rol004") ? (
              <Grid item lg={4}>
                <Grid
                  container
                // style={{ marginTop: "20px" }}
                >
                  <Grid
                    item
                    lg={2}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <p>Search By:</p>
                  </Grid>
                  <Grid item lg={4}>
                    <input
                      style={{
                        marginLeft: "10px",
                        width: "110px",
                        height: "37px",
                        border: "1px solid gray",
                        borderRadius: "5px",
                        padding: "0 10px",
                      }}
                      type={"text"}
                      placeholder="User Name"
                      value={filterPayload.username}
                      onChange={(e) =>
                        setfilterPayload((prev) => ({
                          ...prev,
                          username: e.target.value,
                        }))
                      }
                    />
                  </Grid>
                  <Grid item lg={4} className="permission-filter-section ">
                    {/* <input
                      style={{ marginLeft: "10px", width: "130px" }}
                      type={"text"}
                      placeholder="Role Name"
                      value={filterPayload.roleName}
                      onChange={(e) =>
                        setfilterPayload((prev) => ({
                          ...prev,
                          role: e.target.value,
                        }))
                      }
                    /> */}
                    <CheckPicker
                      data={allroles.map((item) => {
                        let roleName = item.roleName.replace(/_/g, " ");
                        return {
                          label: roleName.toUpperCase(),
                          value: item.roleName,
                        };
                      })}
                      placeholder="roles"
                      onChange={(val) =>
                        setfilterPayload((prev) => ({
                          ...prev,
                          role: val,
                        }))
                      }
                      style={{
                        width: "200px",
                        border: "1px solid gray",
                        borderRadius: "5px",
                      }}
                      value={filterPayload?.role}
                    />
                  </Grid>
                  <Grid item lg={2}>
                    <Button
                      onClick={() =>
                        setfilterPayload({ username: "", role: [] })
                      }
                      variant="contained"
                      color="secondary"
                      style={{ height: "35px" }}
                    >
                      Clear
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            ) : (
              <></>
            )}
          </Grid>
          {loggedUser?.permissions?.includes("rol004") ? (
            <Grid container style={{ margin: "20px 0" }}>
              <Grid item lg={12}>
                <Paper className={classes.root}>
                  <TableContainer className={classes.container}>
                    <Table
                      className={classes.table}
                      size="small"
                      stickyHeader
                      aria-label="sticky table"
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell>S.No</TableCell>
                          <TableCell>User Name</TableCell>
                          <TableCell>Role Name</TableCell>
                          <TableCell>Assigned By</TableCell>
                          <TableCell>Assigned Date</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {assignedRoles
                          ?.slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((role, index) => {
                            let pascalRoleName = role?.roleName
                              .match(
                                /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g
                              )
                              .map(
                                (x) =>
                                  x.charAt(0).toUpperCase() +
                                  x.slice(1).toLowerCase()
                              )
                              .join(" ");
                            return (
                              <TableRow>
                                <TableCell component="th" scope="row">
                                  {page * rowsPerPage + index + 1}
                                </TableCell>
                                <TableCell>{role.userName}</TableCell>
                                <TableCell>{pascalRoleName}</TableCell>
                                <TableCell>{role.assignedByName}</TableCell>
                                <TableCell>
                                  {new Date(
                                    `${role.createdDate}`
                                  ).toLocaleDateString()}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={assignedRoles?.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </Paper>
              </Grid>
            </Grid>
          ) : (
            <></>
          )}
          {loggedUser?.permissions?.includes("rol004") ? (
            <div style={{ padding: "20px" }}>
              <p style={{ marginBottom: "20px" }}>
                Applied Filters: {handleApplyFilters(filterPayload)}
              </p>
            </div>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <></>
      )}
      {loggedUser?.permissions?.includes("per006") ||
        loggedUser?.permissions?.includes("per004") ? (
        <div
          style={{
            boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
            padding: "1rem 2rem",
            marginTop: "20px",
          }}
        >
          <Grid container style={{ padding: "20px" }}>
            <Grid item lg={1}>
              <p
                style={{
                  // marginTop: "20px",
                  color: "#3f51b5",
                  fontFamily: "calibri",
                  fontSize: "1.5em",
                }}
              >
                <strong>PERMISSIONS:</strong>
              </p>
            </Grid>
            {loggedUser?.permissions?.includes("per006") ? (
              <Grid item lg={3}>
                <div>
                  <CheckPicker
                    data={users?.map((item) => ({
                      label: item.name,
                      value: item.userId,
                    }))}
                    placeholder="Users"
                    onChange={(val) => setselectedPermUsers(val)}
                    style={{
                      width: "300px",
                      border: "1px solid gray",
                      borderRadius: "5px",
                      // marginLeft: "20px",
                    }}
                    value={selectedPermUsers}
                  />
                </div>
              </Grid>
            ) : (
              <></>
            )}
            {loggedUser?.permissions?.includes("per006") ? (
              <Grid item lg={3}>
                <div
                  style={{
                    // marginLeft: "20px",
                  }}
                >
                  <CheckPicker
                    data={allpermissions?.map((item) => {
                      let permissionName = item.permissionType.replace(
                        /_/g,
                        " "
                      );
                      return {
                        label: permissionName.toUpperCase(),
                        value: item.permissionId,
                      };
                    })}
                    placeholder="Permissions"
                    onChange={(val) => setselectedPermissions(val)}
                    style={{
                      width: "300px",
                      border: "1px solid gray",
                      borderRadius: "5px",
                    }}
                    value={selectedPermissions}
                  />
                </div>
              </Grid>
            ) : (
              <></>
            )}
            {loggedUser?.permissions?.includes("per006") ? (
              <Grid item lg={1}>
                <Button
                  style={{
                    // marginTop: "15px",
                    // marginLeft: "10px",
                    width: "100px",
                  }}
                  color="primary"
                  variant="contained"
                  disabled={
                    selectedPermUsers?.length > 0 &&
                      selectedPermissions?.length > 0
                      ? false
                      : true
                  }
                  onClick={() => handleAssignPermission()}
                >
                  Assign
                </Button>
              </Grid>
            ) : (
              <></>
            )}
            {loggedUser?.permissions?.includes("per004") ? (
              <Grid item lg={4}>
                <Grid container >
                  <Grid item lg={2} style={{ display: "flex", alignItems: "center" }}>
                    <p >Search By:</p>
                  </Grid>
                  <Grid item lg={4}>
                    <input
                      style={{
                        marginLeft: "10px",
                        width: "110px",
                        height: "37px",
                        border: "1px solid gray",
                        borderRadius: "5px",
                        padding: "0 10px",
                      }}
                      type={"text"}
                      placeholder="User Name"
                      value={filterPermissionPayload.username}
                      onChange={(e) =>
                        setfilterPermissionPayload((prev) => ({
                          ...prev,
                          username: e.target.value,
                        }))
                      }
                    />
                  </Grid>
                  {/* <Grid item lg={4} className="permission-filter-section">
                    <CheckPicker
                      data={allpermissions.map((item) => {
                        let permissionName = item.permissionType.replace(
                          /_/g,
                          " "
                        );
                        return {
                          label: permissionName.toUpperCase(),
                          value: permissionName,
                        };
                      })}
                      placeholder="Permissions"
                      onChange={(val) =>
                        setfilterPermissionPayload((prev) => ({
                          ...prev,
                          permissions: val,
                        }))
                      }
                      style={{
                        width: "250px",
                        border: "1px solid gray",
                        borderRadius: "5px",
                      }}
                      value={filterPermissionPayload?.permissions}
                    />
                  </Grid> */}
                  <Grid item lg={6}>
                    <Button
                      onClick={() =>
                        setfilterPermissionPayload({
                          username: "",
                          // permissions: [],
                        })
                      }
                      variant="contained"
                      color="secondary"
                      style={{ height: "37px" }}
                    >
                      Clear
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            ) : (
              <></>
            )}
          </Grid>
          {loggedUser?.permissions?.includes("per004") ? (
            <Grid container style={{ marginTop: "20px" }}>
              <Grid item lg={12}>
                <Paper className={classes.root}>
                  <TableContainer className={classes.container}>
                    <Table
                      className={classes.table}
                      size="small"
                      stickyHeader
                      aria-label="sticky table two"
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell style={{ fontWeight: "bold" }}>
                            S.No
                          </TableCell>
                          <TableCell
                            style={{ minWidth: 120, fontWeight: "bold" }}
                          >
                            User Name
                          </TableCell>
                          {allpermissions?.map((permission) => {
                            let permissionText =
                              permission.permissionType.replace(/_/g, " ");
                            let headText =
                              permissionText.charAt(0).toUpperCase() +
                              permissionText.slice(1);

                            if (
                              [
                                "doc001",
                                "doc002",
                                "doc003",
                                "doc004",
                                "per002",
                                "per006",
                              ].includes(permission.permissionId)
                            ) {
                              return (
                                <TableCell
                                  key={permission.permissionId}
                                  style={{
                                    minWidth: 160,
                                    fontWeight: "bold",
                                  }}
                                >
                                  {headText}
                                </TableCell>
                              );
                            } else if (
                              ["ast005", "usr005"].includes(
                                permission.permissionId
                              )
                            ) {
                              return (
                                <TableCell
                                  key={permission.permissionId}
                                  style={{
                                    minWidth: 180,
                                    fontWeight: "bold",
                                  }}
                                >
                                  {headText}
                                </TableCell>
                              );
                            } else if (permission.permissionId === "doc005") {
                              return (
                                <TableCell
                                  key={permission.permissionId}
                                  style={{
                                    minWidth: 200,
                                    fontWeight: "bold",
                                  }}
                                >
                                  {headText}
                                </TableCell>
                              );
                            } else if (permission.permissionId === "rap005") {
                              return (
                                <TableCell
                                  key={permission.permissionId}
                                  style={{
                                    minWidth: 270,
                                    fontWeight: "bold",
                                  }}
                                >
                                  {headText}
                                </TableCell>
                              );
                            }
                            return (
                              <TableCell
                                key={permission.permissionId}
                                style={{ minWidth: 130, fontWeight: "bold" }}
                              >
                                {headText}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {allUserPermissions
                          ?.slice(
                            permpage * rowsPerPagePerm,
                            permpage * rowsPerPagePerm + rowsPerPagePerm
                          )
                          .map((allUserPer, index) => {
                            return (
                              <TableRow>
                                <TableCell component="th" scope="row">
                                  {permpage * rowsPerPagePerm + index + 1}
                                </TableCell>
                                <TableCell>{allUserPer.userName}</TableCell>
                                {allpermissions.map((allPer, i) => {
                                  return (
                                    <TableCell>
                                      {allUserPer.permissionsArray.includes(
                                        allPer.permissionId
                                      ) ? (
                                        <DoneIcon style={{ color: "green" }} />
                                      ) : (
                                        <ClearIcon style={{ color: "red" }} />
                                      )}
                                    </TableCell>
                                  );
                                })}
                              </TableRow>
                            );
                          })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={allUserPermissions?.length}
                    rowsPerPage={rowsPerPagePerm}
                    page={permpage}
                    onPageChange={handlePermChangePage}
                    onRowsPerPageChange={handlePermChangeRowsPerPage}
                  />
                </Paper>
              </Grid>
            </Grid>
          ) : (
            <></>
          )}
          {loggedUser?.permissions?.includes("per004") ? (
            <div style={{ padding: "20px" }}>
              <p style={{ marginBottom: "20px" }}>
                Applied Filters:{" "}
                {handleApplyPermissionFilters(filterPermissionPayload)}
              </p>
            </div>
          ) : (
            <></>
          )}
        </div>

        // <div style={{ display: "flex",marginTop:"30px",justifyContent:"space-between",boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",padding:"1em",background:"#FFF" }}>
        //   <div style={{width:"20%"}}>
        //     <h4 style={{marginBottom:"20px"}}>Users</h4>
        //     <SelectPicker
        //       data={users?.map((item) => ({
        //         label: item.name,
        //         value: item.userId,
        //       }))}
        //       placeholder="Users"
        //       onChange={(val) => {
        //         console.log(val)
        //         setSelectedPeramUser(val);
        //         getUserPermissions({userId:val,token :getToken()}).then((res) => {
        //           console.log(res,"ressssssssss")
        //           setSelectedUserPermissions(res?.data?.result?.permissionsArray)
        //         })
        //       }}
        //       style={{
        //         width: "300px",
        //         border: "1px solid gray",
        //         borderRadius: "5px",
        //         // marginLeft: "20px",
        //       }}
        //       value={selectedPeramUser}
        //     />
        //   </div>
        //   <div style={{width:"70%"}}>
        //     {
        //       selectedPeramUser ? <div style={{width:"50%"}}>
        //         <h4 style={{marginBottom:"20px"}}>Permissions</h4>
        //       {
        //         permissionsTree.map((module) => {
        //           return <Accordion>
        //           <AccordionSummary
        //             expandIcon={<ExpandMoreIcon />}
        //             aria-controls="panel1a-content"
        //             id="panel1a-header"
        //           >
        //             <Typography className={classes.heading}>
        //               {module}
        //             </Typography>
        //           </AccordionSummary>
        //           <AccordionDetails>
        //             <div style={{width:"100%"}}>
        //               {
        //                 // allUserPermissions?.map((userPermission) => {
        //                 //   console.log(userPermission.userId , selectedPeramUser,"checking...")
        //                 //   // if(userPermission.userId === selectedPeramUser){
        //                 //   // console.log("with user")
        //                   allpermissions.map((permission) => {
        //                     if(module === "User" && permission.permissionType.includes("user")){
        //                       return <div className={Styles.permissionBox} >
        //                         <p>{permission.description}</p>
        //                         <div>
        //                         <div onClick={() => assignSinglePermission(permission,selectedUserPermissions,selectedPeramUser)}  style={{color:selectedUserPermissions?.includes(permission.permissionId) ? "green" : "red"}}>
        //                           <DoneAllOutlined />
        //                         </div>
        //                         <div onClick={() => removeSinglePermission(permission,selectedUserPermissions,selectedPeramUser)} style={{color:selectedUserPermissions?.includes(permission.permissionId) ? "red" : "green"}}>
        //                           <CloseIcon />
        //                         </div>
        //                         </div>
        //                       </div>
        //                     } 
        //                     if(module === "Asset" && permission.permissionType.includes("asset")){
        //                       return <div className={Styles.permissionBox}>
        //                         <p>{permission.description}</p>
        //                         <div>
        //                         <div  onClick={() => assignSinglePermission(permission,selectedUserPermissions,selectedPeramUser)} style={{color:selectedUserPermissions?.includes(permission.permissionId) ? "green" : "red"}}>
        //                           <DoneAllOutlined/>
        //                         </div>
        //                         <div onClick={() => removeSinglePermission(permission,selectedUserPermissions,selectedPeramUser)} style={{color:selectedUserPermissions?.includes(permission.permissionId) ? "red" : "green"}}>
        //                           <CloseIcon/>
        //                         </div>
        //                         </div>
        //                       </div>
        //                     } 
        //                     if(module === "Documents" && permission.permissionType.includes("document")){
        //                       return <div className={Styles.permissionBox}>
        //                         <p>{permission.description}</p>
        //                         <div>
        //                         <div onClick={() => assignSinglePermission(permission,selectedUserPermissions,selectedPeramUser)} style={{color:selectedUserPermissions?.includes(permission.permissionId) ? "green" : "red"}}>
        //                           <DoneAllOutlined/>
        //                         </div>
        //                         <div onClick={() => removeSinglePermission(permission,selectedUserPermissions,selectedPeramUser)} style={{color:selectedUserPermissions?.includes(permission.permissionId) ? "red" : "green"}}>
        //                           <CloseIcon/>
        //                         </div>
        //                         </div>
        //                       </div>
        //                     } 
        //                     if(module === "Engineering Data" && permission.permissionType.includes("eng")){
        //                       return <div className={Styles.permissionBox}>
        //                         <p>{permission.description}</p>
        //                         <div>
        //                         <div onClick={() => assignSinglePermission(permission,selectedUserPermissions,selectedPeramUser)} style={{color:selectedUserPermissions?.includes(permission.permissionId) ? "green" : "red"}}>
        //                           <DoneAllOutlined/>
        //                         </div>
        //                         <div onClick={() => removeSinglePermission(permission,selectedUserPermissions,selectedPeramUser)} style={{color:selectedUserPermissions?.includes(permission.permissionId) ? "red" : "green"}}>
        //                           <CloseIcon/>
        //                         </div>
        //                         </div>
        //                       </div>
        //                     } 
        //                     if(module === "Roles and Permissions" && (permission.permissionType.includes("role") || permission.permissionType.includes("perm"))){
        //                       return <div className={Styles.permissionBox}>
        //                         <p style={{fontSize:"16px"}}>{permission.description}</p>
        //                         <div>
        //                         <div onClick={() => assignSinglePermission(permission,selectedUserPermissions,selectedPeramUser)} style={{color:selectedUserPermissions?.includes(permission.permissionId) ? "green" : "red"}}>
        //                           <DoneAllOutlined/>
        //                         </div>
        //                         <div onClick={() => removeSinglePermission(permission,selectedUserPermissions,selectedPeramUser)} style={{color:selectedUserPermissions?.includes(permission.permissionId) ? "red" : "green"}}>
        //                           <CloseIcon/>
        //                         </div>
        //                         </div>
        //                       </div>
        //                     } 
        //                     if(module === "Export to 3D system" && (permission.permissionType.includes("export"))){
        //                       return <div className={Styles.permissionBox}>
        //                         <p >{permission.description}</p>
        //                         <div >
        //                         <div onClick={() => assignSinglePermission(permission,selectedUserPermissions,selectedPeramUser)} style={{color:selectedUserPermissions?.includes(permission.permissionId) ? "green" : "red"}}>
        //                           <DoneAllOutlined/>
        //                         </div>
        //                         <div onClick={() => removeSinglePermission(permission,selectedUserPermissions,selectedPeramUser)} style={{color:selectedUserPermissions?.includes(permission.permissionId) ? "red" : "green"}}>
        //                           <CloseIcon/>
        //                         </div>
        //                         </div>
        //                       </div>
        //                     } 
        //                     if(module === "Approvals" && (permission.permissionType.includes("Approval"))){
        //                       return <div className={Styles.permissionBox}>
        //                         <p >{permission.description}</p>
        //                         <div>
        //                         <div onClick={() => assignSinglePermission(permission,selectedUserPermissions,selectedPeramUser)} style={{color:selectedUserPermissions?.includes(permission.permissionId) ? "green" : "red"}}>
        //                           <DoneAllOutlined/>
        //                         </div>
        //                         <div onClick={() => removeSinglePermission(permission,selectedUserPermissions,selectedPeramUser)} style={{color:selectedUserPermissions?.includes(permission.permissionId) ? "red" : "green"}}>
        //                           <CloseIcon/>
        //                         </div>
        //                         </div>
        //                       </div>
        //                     } 
        //                   // })
        //                 // }   else {
        //                 //   console.log('entered without user')
        //                 // }

        //                 })

        //               }
        //             </div>
        //           </AccordionDetails>
        //         </Accordion>
        //         })
        //       }
        //     </div> : <div style={{display:"flex",justifyContent:"center",alignItems:"center",padding:"1em",color:"red"}}>
        //       <h1>Please Select User to see Permissions</h1>
        //     </div>
        //     }
        //   </div>
        // </div>
      ) : (
        <></>
      )}
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
            Roles and Permissions - Guide
          </BootstrapDialogTitle>
          <div ref={divRef}>
            <DialogContent dividers>
              <Typography gutterBottom>
                <p id="data">
                  To assign roles to existing users, click on the Assign Roles
                  button. Select the username of the user you want to assign
                  roles to and choose from the 8 available roles to assign.
                  Press the Assign button to finalize the role assignment. Keep
                  in mind that only users with the Assign Roles privilege can
                  assign roles.
                </p>
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
      <AssignRoleDialog
        openDialog={assignRoleDialog.show}
        closeDialog={() => handleCloseAsssignDialog()}
        selectedRole={selectedrole}
        assignData={{
          userId: selectedUsers,
          roleId: selectedrole.role_id,
          assignedBy: loggedUser?.userId,
          createdBy: loggedUser?.userId,
          updatedBy: loggedUser?.userId,
        }}
      />
    </>
  );
};

export default ClonosRolesAndResponsibilities;
