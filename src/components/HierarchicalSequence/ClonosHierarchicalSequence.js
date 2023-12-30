import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Container,
  Grid,
  Popper,
} from "@material-ui/core";
import React, { useCallback, useContext, useEffect, useState } from "react";
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
import { CheckPicker, DateRangePicker, SelectPicker } from "rsuite";
import { VscTypeHierarchy } from "react-icons/vsc";
import {
  assignRole,
  filterPermissions,
  filterRoles,
  getAllPermissions,
  getAllRoles,
  getAllUserPermissions,
  getAllUsers,
  getAssignedRoles,
  getRoleById,
  getUserPermissions,
  postAssignPermission,
  postUserFilters,
} from "../../Api/User/UserApi";
import TablePagination from "@material-ui/core/TablePagination";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { getUser, removeUserSession } from "../../utils/clonosCommon";
import { useDispatch, useSelector } from "react-redux";
import { commonActions } from "../../Store/Reducers/CommonReducer";
import { FaUserLock } from "react-icons/fa";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {
  assignSupervisor,
  getAllHierarchies,
  getFilterdHierarchies,
  getUserApprovalList,
  getUsersList,
} from "../../Api/HierarchySetup/hierarchySetup";
import ArrowRightAltOutlinedIcon from "@material-ui/icons/ArrowRightAltOutlined";
import ForwardOutlinedIcon from "@material-ui/icons/ForwardOutlined";
import { FcRight } from "react-icons/fc";
import { SupervisorPopOver } from "./SupervisorPopover";
import { useNavigate } from "react-router-dom";
const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  root: {
    width: "100%",
    overflowX: "auto",
  },
  container: {
    maxHeight: 440,
  },
  poper: {
    background: "#FFFFF",
    borderRadius: "6px",
    boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
    width: "350px",
    textAlign: "center",
  },
  table: {
    padding: "5px",
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

export const ClonosHierarchicalSequence = () => {
  const classes = useStyles();
  const DISPATCH = useDispatch();
  const [users, setusers] = React.useState([]);
  const NAVIGATE = useNavigate();
  const [loggedUserDetails, setLoggeduserDetails] = useState([]);
  const [userInputVal,setUserInputVal] = useState("");
  const [supervisorInputVal,setSupervisorInputVal] = useState("");
  const [csAndOmUsers, setCsAndOmUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedUserName, setSelectedUserName] = useState("");
  const [selectedSupervisorNames, setSelectedSupervisorNames] = useState([]);
  const [selectedSuperVisors, setSelectedSuperVisors] = useState([]);
  const [superVisors, setSuperVisors] = useState([]);
  const [isAssigned, setIsAssigned] = useState(false);
  const [selectedUserRole, setSelectedUserRole] = useState("");
  const [selectedPermUsers, setselectedPermUsers] = useState([]);
  const [hierarchyList, setHierarchyList] = useState([]);
  const [defaultSupervisors, setDefaultSupervisors] = useState([]);
  const [assignErroMessage, setAssignErrorMessage] = useState("");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [calendarVal, setcalendarVal] = useState([null, null]);
  const [filterPayload, setfilterPayload] = useState({
    inferiorUserName: "",
    superiorUserName: "",
    startDate: "",
    endDate: "",
  });
  const [allpermissions, setallpermissions] = useState([]);
  
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const loggedUser = getUser();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };
  const openPoper = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;

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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // useEffect(() => {
  //   if (selectedPermUsers?.length === 1) {
  //     // setselectedPermissions
  //     console.log("selectedPermUsers", selectedPermUsers);
  //     getUserPermissions(selectedPermUsers[0])
  //       .then((response) => {
  //         console.log("getUserPermissions RESPONSE", response);
  //         setselectedPermissions(response?.data?.result?.permissionsArray);
  //       })
  //       .catch((error) => {
  //         console.log("getUserPermissions ERROR", error);
  //       });
  //   } else {
  //     setselectedPermissions([]);
  //   }
  // }, [selectedPermUsers]);

  useEffect(() => {
    getUsersList()
      .then((res) => {
        console.log("getAllUsers RESPONSEm,dsnjsdf", res);
        setusers(res?.data?.result);
        const response = res.data.result;
        let data = [];
        response.map((user) => {
          if (
            user.roleName == "om_User" ||
            user.roleName == "construction_User"
          ) {
            data.push(user);
          }
        });
        setCsAndOmUsers(data);
      })
      .catch((err) => {
        if(err.response.data.status=== 401 && JSON.parse(localStorage.getItem("loginUser")) !== null){
          DISPATCH(commonActions.handleExpiryAlert(true));
          removeUserSession();
          localStorage.removeItem("loginUser")
        }
      })
    getFilterdHierarchies().then((res) => {
      console.log("hierarchy list", res);
      setHierarchyList(res.data.result);
    }).catch((err) => {
      if(err.response.data.status=== 401 && JSON.parse(localStorage.getItem("loginUser")) !== null){
        DISPATCH(commonActions.handleExpiryAlert(true));
        removeUserSession();
        localStorage.removeItem("loginUser")
      }
    })
    // getAllRoles()
    //   .then((res) => {
    //     console.log("getAllRoles RESPONSE", res);
    //     setallroles(res?.data?.result);
    //   })
    //   .catch((err) => console.log("getAllRoles ERROR".err));
    // getAssignedRoles()
    //   .then((res) => {
    //     console.log("assignedRoles RESPONSE", res);
    //     setassignedRoles(res?.data?.result);
    //   })
    //   .catch((err) => console.log("assignedRoles ERROR".err));
    // getAllPermissions()
    //   .then((res) => {
    //     console.log("getAllPermissions RESPONSE", res);
    //     setallpermissions(res?.data?.result);
    //   })
    //   .catch((err) => console.log("getAllPermissions ERROR".err));
    // getAllUserPermissions()
    //   .then((res) => {
    //     console.log("getAllUserPermissions RESPONSE", res);
    //     setallUserPermissions(res?.data?.result);
    //   })
    //   .catch((err) => console.log("getAllUserPermissions ERROR".err));
  }, []);

  useEffect(() => {
    const data = [];
    users.map((user) => {
      if (user.roleName == "om_User" || user.roleName == "construction_User") {
        data.push(user);
      }
    });
    setCsAndOmUsers(data);
  }, []);

  const handleSupervisor = (data) => {
    setSuperVisors([]);
    setSelectedUser(data.userId);
    setSelectedUserRole(data.roleName);
    setSelectedUserName(data.name);
    getUserApprovalList(data?.userId)
      .then((res) => res.data)
      .then((data) => {
        data?.result.map((user) => {
          postUserFilters({ userId: user?.userId }).then((res) => {
            setSuperVisors((prev) => [...prev, res?.data?.users[0]]);
          }).catch((err) => {
            if(err.response.data.status=== 401 && JSON.parse(localStorage.getItem("loginUser")) !== null){
              DISPATCH(commonActions.handleExpiryAlert(true));
              removeUserSession();
              localStorage.removeItem("loginUser")
            }
          })
        })
      }).catch((err) => {
        if(err.response.data.status=== 401 && JSON.parse(localStorage.getItem("loginUser")) !== null){
          DISPATCH(commonActions.handleExpiryAlert(true));
          removeUserSession();
          localStorage.removeItem("loginUser")
        }
      })
  };

  const handleAssign = () => {
    selectedSuperVisors.map((user) => {
      postUserFilters({ userId: user }).then((res) => {
        if (!selectedSupervisorNames.includes(res?.data?.users[0].name)) {
          setSelectedSupervisorNames((prev) => [
            ...prev,
            res?.data?.users[0].name,
          ]);
        }
      }).catch((err) => {
        if(err.response.data.status=== 401 && JSON.parse(localStorage.getItem("loginUser")) !== null){
          DISPATCH(commonActions.handleExpiryAlert(true));
          removeUserSession();
          localStorage.removeItem("loginUser")
        }
      })
    });
    assignSupervisor({
      userId: selectedUser,
      superiorUserId: selectedSuperVisors,
      createdBy: loggedUser.userId,
    })
      .then((res) => {
        let timerId = null;
        if (res.data.status == 201) {
          if(timerId){
            clearTimeout(timerId)
          } else {
            setIsAssigned(true);
            timerId = setTimeout(() => {
              setIsAssigned(false);
              setSelectedUser("");
          setSelectedSuperVisors([]);
          setSelectedUserName("");
          setSelectedSupervisorNames([]);
            }, 5000);
          }
          
        }
      })
      .catch((err) => {
        if(err.response.data.status=== 401 && JSON.parse(localStorage.getItem("loginUser")) !== null){
          DISPATCH(commonActions.handleExpiryAlert(true));
          removeUserSession();
          localStorage.removeItem("loginUser")
        } else {
          setIsAssigned(true);
          setAssignErrorMessage(err.response.data.message);
          setTimeout(() => {
            setIsAssigned(false);
            setAssignErrorMessage("");
            setSelectedUser("");
          setSelectedSuperVisors([]);
          setSelectedUserName("");
          setSelectedSupervisorNames([]);
          }, 5000);
        }
        
      });
  };

  const handleDatechange = (value) => {
    if (value) {
      // setCurrentPage(1);
      const data = {
        startDate: value[0],
        endDate: value[1],
      };
      let prev_date = value[0].setHours(0, 0, 0, 0);
      let next_date = value[1].setHours(23, 59, 59, 0);
      prev_date = new Date(prev_date);
      next_date = new Date(next_date);
      data.startDate = prev_date;
      data.endDate = next_date;
      getFilterdHierarchies({
        startDate: data.startDate,
        endDate: data.endDate,
      }).then((res) => {
        setHierarchyList(res?.data.result);
        setcalendarVal([data.startDate, data.endDate]);
      }).catch((err) => {
        if(err.response.data.status=== 401 && JSON.parse(localStorage.getItem("loginUser")) !== null){
          DISPATCH(commonActions.handleExpiryAlert(true));
          removeUserSession();
          localStorage.removeItem("loginUser")
        }
      })
    }
  };


  const debounce = (func) => {
    let timer;
    return function (...args) {
      const context = this;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        func.apply(context, args);
      }, 500);
    };
  };

  const filtersHelper = (value, type) => {
    if (type === "User Name or Email") {
      // setUserInputVal(value)
      if (value.includes("@")) {
        getFilterdHierarchies({ inferiorUserEmail: value }).then((res) => {
          setHierarchyList(res.data.result);
        }).catch((err) => {
          if(err.response.data.status=== 401 && JSON.parse(localStorage.getItem("loginUser")) !== null){
            DISPATCH(commonActions.handleExpiryAlert(true));
            removeUserSession();
            localStorage.removeItem("loginUser")
          }
        })
      } else {
        getFilterdHierarchies({ inferiorUserName: value }).then((res) => {
          setHierarchyList(res.data.result);
        }).catch((err) => {
          if(err.response.data.status=== 401 && JSON.parse(localStorage.getItem("loginUser")) !== null){
            DISPATCH(commonActions.handleExpiryAlert(true));
            removeUserSession();
            localStorage.removeItem("loginUser")
          }
        })
      }
    } else if (type === "Supervisor Name") {
      // setSupervisorInputVal(value)
      getFilterdHierarchies({ superiorUserName: value }).then((res) => {
        setHierarchyList(res.data.result);
      }).catch((err) => {
        if(err.response.data.status=== 401 && JSON.parse(localStorage.getItem("loginUser")) !== null){
          DISPATCH(commonActions.handleExpiryAlert(true));
          removeUserSession();
          localStorage.removeItem("loginUser")
        }
      })
    }
  };
  const handleSearch = useCallback(debounce(filtersHelper), []);
  useEffect(() => {
    postUserFilters({ userId: loggedUser.userId }).then((res) => {
      setLoggeduserDetails(res.data.users[0]);
    }).catch((err) => {
      if(err.response.data.status=== 401 && JSON.parse(localStorage.getItem("loginUser")) !== null){
        DISPATCH(commonActions.handleExpiryAlert(true));
        removeUserSession();
        localStorage.removeItem("loginUser")
      }
    })
  }, []);

  const handleUserEmail = (id) => {
    let user = null;
    postUserFilters({ userId: id })
      .then((res) => {
        user = res.data.users[0];
      })
      .then((res) => {
        getAssignedRoles(id).then((res) => {
          getRoleById({roleId:[res.data.result.role_id]}).then((res) => {
            user.roleName = res.data.result[0].roleName
            NAVIGATE("/view-user", { state: user });
          }).catch((err) => {
            if(err.response.data.status=== 401 && JSON.parse(localStorage.getItem("loginUser")) !== null){
              DISPATCH(commonActions.handleExpiryAlert(true));
              removeUserSession();
              localStorage.removeItem("loginUser")
            }
          })
        }).catch((err) => {
          if(err.response.data.status=== 401 && JSON.parse(localStorage.getItem("loginUser")) !== null){
            DISPATCH(commonActions.handleExpiryAlert(true));
            removeUserSession();
            localStorage.removeItem("loginUser")
          }
        })
      }).catch((err) => {
        if(err.response.data.status=== 401 && JSON.parse(localStorage.getItem("loginUser")) !== null){
          DISPATCH(commonActions.handleExpiryAlert(true));
          removeUserSession();
          localStorage.removeItem("loginUser")
        }
      })
  };

  const handleClearFilters = () => {
    setUserInputVal("");
    setSupervisorInputVal("");
    setcalendarVal([null,null])
    getFilterdHierarchies().then((res) => {
      setHierarchyList(res.data.result);
    }).catch((err) => {
      if(err.response.data.status=== 401 && JSON.parse(localStorage.getItem("loginUser")) !== null){
        DISPATCH(commonActions.handleExpiryAlert(true));
        removeUserSession();
        localStorage.removeItem("loginUser")
      }
    })
  }

  useEffect(() => {
    const data = [];
    if (selectedUser) {
      hierarchyList.map((user) => {
        if (selectedUser === user.inferiorUserId) {
          user.superiorUsers.map((sup) => {
            data.push(sup.userId);
          });
        }
      });
      setDefaultSupervisors(data);
      setSelectedSuperVisors(data);
    }
  }, [selectedUser]);

  useEffect(() => {
  },[])

  return (
    <>
      {(loggedUser.permissions.includes("uap006") ||
      loggedUser.permissions.includes("uap004")) && <div
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
            <VscTypeHierarchy fontSize={"36px"}/>
          </div>
          <h1 style={{ color: "#3F51B5", fontSize: "36px",fontFamily:"calibri" }}>
            <i>Hierarchy Setup</i>
          </h1>
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
      </div>}
      {loggedUser.permissions.includes("uap006") ||
      loggedUser.permissions.includes("uap004") ? (
        <div style={{ boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px", padding: "2rem 2rem" }}>
          <Grid
            container
            // style={{ marginBottom: "30px" }}
          >
            {loggedUser.permissions.includes("uap006") ? (
              <Grid item>
                <h4
                  style={{
                    color: "#3F51B5",
                    fontWeight: "normal",
                    marginBottom: "15px",
                  }}
                >
                  Select users
                </h4>
                <SelectPicker
                  style={{
                    width: "300px",
                    border: "1px solid gray",
                    borderRadius: "5px",
                  }}
                  placeholder="Users"
                  data={csAndOmUsers?.map((item) => {
                    return {
                      label: item.name + " - " + item.email,
                      value: item.userId,
                      data: item,
                    };
                  })}
                  // style={{ width: 224 }}
                  // setselectedrole(val); setselectedRoleDialog()
                  onSelect={(val, item) => {
                    handleSupervisor(item?.data);
                  }}
                  onClean={() => {
                    setSelectedUser("");
                    setSuperVisors([]);
                    // setCsAndOmUsers([])
                    setIsAssigned(false);
                    // setSelectedSuperVisors([]);
                    setSelectedSupervisorNames([]);
                  }}
                  value={selectedUser}
                />
                {selectedUser && (
                  <h4
                    style={{
                      fontSize: "16px",
                      color: "black",
                      padding: "10px",
                    }}
                  >
                    You have selected{" "}
                    {selectedUserRole.split("_")[0].toUpperCase() +
                      " " +
                      selectedUserRole.split("_")[1] || "user"}
                  </h4>
                )}
              </Grid>
            ) : (
              <></>
            )}
            <Grid
              lg={0}
              style={{
                fontSize: "50px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "0px 10px",
              }}
            >
              <FcRight />
            </Grid>
            {loggedUser.permissions.includes("uap006") ? (
              <Grid item lg={3}>
                <h4
                  style={{
                    color: "#3F51B5",
                    fontWeight: "normal",
                    marginBottom: "15px",
                  }}
                >
                  Select Supervisors
                </h4>
                <CheckPicker
                  data={superVisors?.map((item) => ({
                    label: item.name + " - " + item.email,
                    value: item.userId,
                    data: item,
                  }))}
                  placeholder="Supervisors"
                  onChange={(val) => setSelectedSuperVisors(val)}
                  style={{
                    width: "300px",
                    border: "1px solid gray",
                    borderRadius: "5px",
                  }}
                  value={selectedSuperVisors}
                />
              </Grid>
            ) : (
              <></>
            )}
            {loggedUser.permissions.includes("uap006") ? (
              <Grid
                item
                // lg={4}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "136px",
                }}
              >
                <Button
                  style={{
                    marginLeft: "10px",
                    width: "100px",
                  }}
                  color="primary"
                  variant="contained"
                  onClick={() => handleAssign()}
                  disabled={
                    selectedUser && selectedSuperVisors.length > 0
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
          </Grid>
          <div
            style={{
              display: "flex",
              height: "50px",
              justifyContent: "center",
              marginBottom: "50px",
            }}
          >
            {selectedUserRole === "om_User" && !assignErroMessage && (
              <h4
                style={{
                  background: "#4BB543",
                  color: "#FFF",
                  padding: "5px 10px",
                  // border: "1px solid #4BB543",
                  visibility: isAssigned ? "visible" : "hidden",
                  // borderRadius: "12px",
                  fontSize: "16px",
                  fontWeight: "normal",
                }}
              >
                {selectedSupervisorNames.length > 2
                  ? selectedSupervisorNames[0] +
                    "," +
                    selectedSupervisorNames[1] + " and " +  `${selectedSupervisorNames.length - 2} ` + `${selectedSupervisorNames.length -2 === 1 ? "other" : "others"}` + 
                    " have been assigned as OM Supervisor to " +
                    selectedUserName
                  : selectedSupervisorNames.length === 2 ? selectedSupervisorNames[0] +
                  "," +
                  selectedSupervisorNames[1] + 
                  " has been assigned as OM Supervisor to " +
                  selectedUserName : selectedSupervisorNames.length == 1
                  ? selectedSupervisorNames[0] +
                    " has been assigned as OM Supervisor to " +
                    selectedUserName
                  : ""}
              </h4>
            )}
            {selectedUserRole === "construction_User" && !assignErroMessage && (
              <h4
                style={{
                  background: "#4BB543",
                  color: "#FFF",
                  padding: "5px 10px",
                  // border: "1px solid #4BB543",
                  visibility: isAssigned ? "visible" : "hidden",
                  // borderRadius: "12px",
                  fontSize: "16px",
                  fontWeight: "normal",
                }}
              >
                {selectedSupervisorNames.length > 2
                  ? selectedSupervisorNames[0] +
                    "," +
                    selectedSupervisorNames[1] + " and " +  `${selectedSupervisorNames.length - 2} ` + `${selectedSupervisorNames.length -2 === 1 ? "other" : "others"}`+
                    " have been assigned as Constructor Supervisor to " +
                    selectedUserName
                  : selectedSupervisorNames.length === 2
                  ? selectedSupervisorNames[0] +
                    "," +
                    selectedSupervisorNames[1] +
                    " has been assigned as Constructor Supervisor to " +
                    selectedUserName :  selectedSupervisorNames.length == 1
                  ? selectedSupervisorNames[0] +
                    " has been assigned as Constructor Supervisor to " +
                    selectedUserName
                  : "Error"}
              </h4>
            )}
            {assignErroMessage && isAssigned && (
              <h4
                style={{
                  background: "red",
                  color: "#FFF",
                  padding: "5px 10px",
                  // border: "1px solid #4BB543",
                  visibility: isAssigned ? "visible" : "hidden",
                  // borderRadius: "12px",
                  fontSize: "16px",
                  fontWeight: "normal",
                }}
              >
                {assignErroMessage}
              </h4>
            )}
          </div>
          <Grid container style={{ marginBottom: "30px", gridGap: "32px" }}>
            {loggedUser.permissions.includes("uap004") ? (
              <>
                <Grid
                  item
                  // lg={1}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gridGap: "10px",
                  }}
                >
                  <p>Search By:</p>
                  <input
                    style={{
                      border: "1px solid #CCC",
                      borderRadius: "6px",
                      padding: "6px",
                    }}
                    type={"text"}
                    placeholder="User Name or Email"
                    value={userInputVal}
                    onChange={
                      (e) => {
                        setUserInputVal(e.target.value)
                        handleSearch(e.target.value, e.target.placeholder)
                      }
                      // setfilterPayload((prev) => ({
                      //   ...prev,
                      //   inferiorUserName: e.target.value,
                      // }))
                      // getFilterdHierarchies({startDate:"",endDate:"",inferiorUserName:e.target.value,superiorUserName:""}).then((res) => {
                      //   setHierarchyList(res?.data.result);
                      //   console.log("data", res.data.result);
                      // })
                    }
                  />
                </Grid>
                <Grid
                  item
                  // lg={3}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gridGap: "10px",
                  }}
                >
                  <p>Search By:</p>
                  <input
                    style={{
                      border: "1px solid #CCC",
                      borderRadius: "6px",
                      padding: "6px",
                    }}
                    type={"text"}
                    placeholder="Supervisor Name"
                    value={supervisorInputVal}
                    onChange={(e) =>
                      // setfilterPayload((prev) => ({
                      //   ...prev,
                      //   superiorUserName: e.target.value,
                      // }))
                      {
                        setSupervisorInputVal(e.target.value)
                        handleSearch(e.target.value, e.target.placeholder)
                      }
                    }
                  />
                </Grid>
                {/* <Grid
                  item
                  // lg={3}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gridGap: "10px",
                  }}
                >
                  <p>Search By:</p>
                  <input
                      style={{
                        border:"1px solid #CCC",
                        borderRadius:"6px",
                        padding:"6px"
                      }}
                    type={"text"}
                    placeholder="User Email"
                    // value={filterPayload.superiorUserName}
                    onChange={(e) =>
                      // setfilterPayload((prev) => ({
                      //   ...prev,
                      //   superiorUserName: e.target.value,
                      // }))
                      handleSearch(e.target.value,e.target.placeholder)
                    }
                  />
                </Grid> */}
                {/* <Grid
                  item
                  // lg={3}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gridGap: "10px",
                  }}
                >
                  <p>Search By:</p>
                  <input
                      style={{
                        border:"1px solid #CCC",
                        borderRadius:"6px",
                        padding:"6px"
                      }}
                    type={"text"}
                    placeholder="Supervisor Email"
                    // value={filterPayload.superiorUserName}
                    onChange={(e) =>
                      // setfilterPayload((prev) => ({
                      //   ...prev,
                      //   superiorUserName: e.target.value,
                      // }))
                      handleSearch(e.target.value,e.target.placeholder)
                    }
                  />
                </Grid> */}
                {/* <Grid>
                  <p>Search By</p>
                  <input placeholder="Email"/>
                </Grid> */}
                <Grid
                // lg={2}
                >
                  <div
                    className="hierarchyDaterange"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gridGap: "10px",
                    }}
                  >
                    <p>Date :</p>
                    <DateRangePicker
                      value={calendarVal}
                      onChange={handleDatechange}
                      onClean={() => {
                        setcalendarVal([null,null]);
                        getFilterdHierarchies().then((res) => {
                          setHierarchyList(res.data.result);
                        }).catch((err) => {
                          if(err.response.data.status=== 401 && JSON.parse(localStorage.getItem("loginUser")) !== null){
                            DISPATCH(commonActions.handleExpiryAlert(true));
                            removeUserSession();
                            localStorage.removeItem("loginUser")
                          }
                        })
                      }}
                      format="dd-MM-yyyy "
                      placeholder="dd-mm-yyyy"
                      cleanable
                    />
                  </div>
                </Grid>
                <Grid
                  item
                  // lg={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginLeft: "10px",
                  }}
                >
                  <Button
                    onClick={handleClearFilters}
                    variant="contained"
                    color="secondary"
                    style={{ height: "35px", padding: "0px 22px" }}
                  >
                    Clear
                  </Button>
                </Grid>
              </>
            ) : (
              <></>
            )}
          </Grid>
          {loggedUser.permissions.includes("uap004") ? (
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
                        <TableRow className="hierarchyRow">
                          <TableCell style={{width:'10%'}}>S.No</TableCell>
                          <TableCell  style={{width:'20%'}}>User Name</TableCell>
                          <TableCell style={{width:"25%"}}>User Email</TableCell>
                          <TableCell  style={{width:'15%'}}>Supervisors Name</TableCell>
                          <TableCell  style={{width:'15%'}}>Assigned By</TableCell>
                          <TableCell  style={{width:'15%'}}>Assigned Date</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody style={{position:"relative"}}>
                        {hierarchyList.length > 0 ? (
                          hierarchyList
                            ?.slice(
                              page * rowsPerPage,
                              page * rowsPerPage + rowsPerPage
                            )
                            .map((item, index) => {
                              const date = item.createdDate.split("T")[0];
                              const [year, month, dt] = date.split("-");
                              console.log(item)
                              return (
                                <TableRow
                                  style={{ padding: "" }}
                                  className="hierarchyRow"
                                >
                                  <TableCell  style={{width:'10%'}}  scope="row">
                                    {hierarchyList.length &&
                                      page * rowsPerPage + index + 1}
                                  </TableCell>
                                  <TableCell  style={{width:'20%'}}>
                                    {item?.inferiorUserName}
                                  </TableCell>
                                  <TableCell
                                    style={{width:"25%"}}
                                    className="user-email"
                                    onClick={() =>
                                      handleUserEmail(item.inferiorUserId)
                                    }
                                  >
                                    {item?.inferiorUserEmail}
                                  </TableCell>
                                  <SupervisorPopOver
                                    classes={classes.poper}
                                    data={item}
                                    id={id}
                                    open={openPoper}
                                    anchorEl={anchorEl}
                                    handleSupervisorEmail = {handleUserEmail}
                                    handleClose={() => setAnchorEl(null)}
                                  />
                                  <TableCell  style={{width:'10%'}}>
                                    {loggedUserDetails.name}
                                  </TableCell>
                                  <TableCell  style={{width:'10%'}}>
                                    {dt + "-" + month + "-" + year}
                                  </TableCell>
                                </TableRow>
                              );
                            })
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={6}
                              align="center"
                              style={{
                                padding: "10px",
                                fontSize: "16px",
                                fontWeight: "600",
                              }}
                            >
                              No Results!
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={hierarchyList?.length}
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
        </div>
      ) : (
        
          <></>       
      )}
      {!loggedUser.permissions.includes("uap006") &&
      !loggedUser.permissions.includes("uap004") && <Container component="main" maxWidth="sm">
      <h1 style={{ color: "#3F51B5", textAlign: "center" }}>Unauthorized</h1>
      <h4 style={{ color: "#3F51B5", textAlign: "center" }}>
        No permission to view this page. Please contact admin.
      </h4>
    </Container>}
    </>
    
  );
};
