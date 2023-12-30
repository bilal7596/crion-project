import * as React from "react";
import { useState, useEffect } from "react";
import { Switch, Space } from "antd";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import Popper from "@material-ui/core/Popper";
import * as xlsx from "xlsx";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import { CSVLink } from "react-csv";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { DataGrid } from "@material-ui/data-grid";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import VisibilityIcon from "@material-ui/icons/Visibility";
import EditIcon from "@material-ui/icons/Edit";
import Tooltip from "@material-ui/core/Tooltip";
import { getAllUsers, deleteUser } from "../../Api/User/UserApi";
import ClonosConfirmationDialog from "../Dialogs/ClonosConfirmationDialog";
import ClonosUserDetailsDialog from "../Dialogs/ClonosUserDetailsDialogs";
import AccountActionDialog from "../Dialogs/ClonosSwitchAccount";
import { userActions } from "../../Store/Reducers/ClonosUserReducer";
import { makeStyles } from "@material-ui/styles";
import { Box } from "@material-ui/core";
import { useSelector } from "react-redux";
import { getAllPermissions } from "../../Api/User/UserApi";
import { getUser, removeUserSession } from "../../utils/clonosCommon";
import { commonActions } from "../../Store/Reducers/CommonReducer";

//user/admin color indication:
const useStyles = makeStyles({
  root: {
    "& .admin": {
      backgroundColor: "#ADD8E6",
      color: "#000",
      "&:hover": {
        backgroundColor: "#ADD8E6",
        cursor: "default",
      },
    },
    "& .user": {
      backgroundColor: "#fff",
      color: "#000",
      "&:hover": {
        backgroundColor: "#fff",
        cursor: "default",
      },
    },
  },
});

export default function ClonosUsersTable(props) {
  const classes = useStyles();
  const [users, setusers] = useState([]);
  const [selectedRowID, setselectedRowID] = useState({});
  const [selectedUser, setselectedUser] = useState({});
  const [selectionModel, setSelectionModel] = React.useState([]);
  const [deleteUserBool, setdeleteUserBool] = useState(false);
  const [SelectedSwitUser, setSelectedSwitUser] = useState({});
  const [open, setOpen] = useState(false);
  const [Opensplitbtn, setOpensplitbtn] = useState(false);
  const [switchValue, setswitchValue] = useState("");
  const USER_DETAILS = getUser();
  const handleClick = () => {
    console.info(`You clicked ${[]}`);
  };

  const handleToggle = () => {
    setOpensplitbtn((prevOpen) => !prevOpen);
  };

  const closeModal = () => {
    setOpen(false);
    setdeleteUserBool((prev) => !prev);
  };

  // let accSwitch = () => {
  //   return user.isActive === 1 ? "Inactive" : "Active";
  // };

  const dispatch = useDispatch();

  const NAVIGATE = useNavigate();
  useEffect(() => {
    setusers(props.FilteredUsers);
  }, [props.FilteredUsers]);

  const handleViewUser = (user) => {
    console.log("selectedUser", user);
    // dispatch(userActions.getUserData(user));
    // setOpenUserDetailsDialog(true);
    NAVIGATE("/view-user", { state: user });
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

  const columns = [
    {
      field: "id",
      headerName: "S.No",
      width: 96,
      renderCell: (index) => {
        return index.api.getRowIndex(index.row.id) + 1;
      },
    },
    {
      field: "name",
      headerName: "Name",
      width: 150,
    },
    {
      field: "email",
      headerName: "Email",
      width: 250,
      renderCell: (val) => {
        return (
          <span
            onClick={() =>
              USER_DETAILS.permissions.includes("usr004")
                ? handleViewUser(val.row)
                : null
            }
            className="user-email"
          >
            {val.row.email},
          </span>
        );
      },
    },
    {
      field: "phone",
      headerName: "Phone",
      width: 150,
    },
    {
      field: "state",
      headerName: "State",
      width: 150,
    },
    {
      field: "businessUnit",
      headerName: "Business Unit",
      width: 200,
    },
    {
      field: "designation",
      headerName: "Designation",
      width: 180,
    },
    {
      field: "roleName",
      headerName: "Role",
      width: 180,
      renderCell:(value) => {
        let str = value.row.roleName
        let convertedStr = str?.replace(/_/g, " ").replace(/(\b\w)/g, match => match.toUpperCase());
        return convertedStr
      }
    },
    {
      field: "team",
      headerName: "Department",
      width: 180,
    },
    {
      field: "Is_Admin",
      headerName: "User Type",
      width: 145,
      renderCell: (value) => {
        // console.log("value",value);
        return value.row.Is_Admin === 0 ? "User" : "Admin";
      },
    },
    {
      field: "createdDate",
      headerName: "Created Date",
      width: 165,
      renderCell: (value) => {
        console.log(value,"val")
        return new Date(`${value.row.createdDate}`).toLocaleDateString();
      },
    },
    {
      field: "isActive",
      headerName: "Status",
      width: 120,
      editble: true,
      renderCell: (value) => {
        let user = value.row;
        // return <MuiSwitch user={value.row} />;
        return (
          <Space direction="vertical">
            <Switch
              style={{ color: "green" }}
              checkedChildren="Active"
              unCheckedChildren="Inactive"
              defaultChecked={user.isActive === 1 ? true : false}
              checked={user.isActive}
              disabled={user.Is_Admin === 0 ? false : true}
              onClick={(bool, event) => {
                setOpen(true);
                setswitchValue(bool);
                setSelectedSwitUser(user);
              }}
            />
          </Space>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      sortable: false,
      renderCell: (value) => {
        return (
          <Tooltip title="View">
            <IconButton
              aria-label="view"
              onClick={() => handleViewUser(value.row)}
              style={{
                display: USER_DETAILS.permissions.includes("user004") ? "block" : "none",
              }}
            >
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
        );
      },
    },
  ];

  const [openDelDialog, setopenDelDialog] = React.useState(false);

  const handleopenDelDialog = () => {
    console.log("selectedRowID", selectedRowID);
    setopenDelDialog(true);
  };

  const handleCloseDelDialog = () => {
    setopenDelDialog(false);
  };

  const [openUserDetailsDialog, setOpenUserDetailsDialog] =
    React.useState(false);

  const handleUserDialogClose = () => {
    setOpenUserDetailsDialog(false);
  };

  const handleDeleteUser = () => {
    deleteUser(selectedRowID)
      .then((res) => {
        console.log("deleteUser RESPONSE", res);
        setdeleteUserBool((prev) => !prev);
        setopenDelDialog(false);
      })
      .catch((err) => {
        if(err.response.data.status=== 401 && JSON.parse(localStorage.getItem("loginUser")) !== null){
          dispatch(commonActions.handleExpiryAlert(true));
          removeUserSession();
          localStorage.removeItem("loginUser")
        } else {
          console.log("deleteUser ERROR", err);
          setopenDelDialog(false);
          setdeleteUserBool((prev) => !prev);
        }
      });
  };

  const handleEditUser = () => {
    console.log("selectedUser", selectedUser);
    // dispatch(userActions.getUserData(selectedUser));

    NAVIGATE("/edit-user", { state: selectedUser });
  };

  //Adding this use-Effect to fix DATA grid render bug
  useEffect(() => {
    getAllUsers()
      .then((res) => {
        console.log("getAllUsers RESPONSE", res);
        setusers(res.data.result);
        setdeleteUserBool((prev) => !prev);
      })
      .catch((err) => console.log("getAllUsers ERROR", err));

    return () => {
      setusers([]);
    };
  }, [props.renderTable]);

  useEffect(() => {
    getAllUsers()
      .then((res) => {
        console.log("Normal getAllUsers RESPONSE", res);
        setusers(res.data.result);
        props.clearFilter();
      })
      .catch((err) => {
        if(err.response.data.status=== 401 && JSON.parse(localStorage.getItem("loginUser")) !== null){
          dispatch(commonActions.handleExpiryAlert(true));
          removeUserSession();
          localStorage.removeItem("loginUser")
        }
      })
    return () => {
      setusers([]);
    };
  }, [deleteUserBool]);

  const handleApplyFilters = (filters) => {
    console.log("filters", filters);
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
  const tempHeaders = [
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "State", key: "state" },
    { label: "Phone", key: "phone" },
    { label: "Designation", key: "designation" },
    { label: "Business Unit", key: "businessUnit" },
    { label: "User Type", key: "Is_Admin" },
  ];
  const downloadExcel = (data) => {
    console.log("downloadExcel", data);
    const filteredArray = data.map((item) => {
      return {
        name: item.name,
        email: item.email,
        state: item.state,
        phone: item.phone,
        designation: item.designation,
        businessUnit: item.businessUnit,
        Is_Admin: item.Is_Admin === 1 ? "Admin" : "User",
        role:item.roleName,
        department:item.department
      };
    });
    const worksheet = xlsx.utils.json_to_sheet(filteredArray);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    //let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
    //XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
    xlsx.writeFile(workbook, "UsersData.xlsx");
  };
  function SplitButton() {
    // const options = ['To CSV', 'To PDF', 'Rebase and merge'];
    let csvdata = [];
    let arrayHeaders = [];
    for (let i = 0; i < tempHeaders.length; i++) {
      arrayHeaders.push(tempHeaders[i].label);
    }
    csvdata.push(arrayHeaders);
    for (let i = 0; i < users.length; i++) {
      let sample = [
        users[i].name,
        users[i].email,
        users[i].state,
        users[i].phone,
        users[i].designation,
        users[i].businessUnit,
        users[i].Is_Admin === 1 ? "Admin" : "User",
      ];
      csvdata.push(sample);
    }

    const options = [
      <CSVLink filename={"UsersData.csv"} data={csvdata}>
        To CSV
      </CSVLink>,
      <a
        style={{ backgroundColor: "#fff" }}
        onClick={() => downloadExcel(users)}
      >
        To Excel
      </a>,
    ];
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);
    const [selectedIndex, setSelectedIndex] = React.useState(1);

    const handleClick = () => {
      console.info(`You clicked ${options[selectedIndex]}`);
    };

    const handleMenuItemClick = (event, index) => {
      setSelectedIndex(index);
      setOpen(false);
    };

    const handleToggle = () => {
      setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
      if (anchorRef.current && anchorRef.current.contains(event.target)) {
        return;
      }

      setOpen(false);
    };

    return (
      <div
        style={{
          padding: "15px",
        }}
      >
        <Grid container direction="column">
          <Grid item xs={12}>
            <ButtonGroup
              variant="contained"
              color="primary"
              ref={anchorRef}
              aria-label="split button"
            >
              <Button onClick={handleClick}>{"Export Table"}</Button>
              <Button
                color="primary"
                size="small"
                aria-controls={open ? "split-button-menu" : undefined}
                aria-expanded={open ? "true" : undefined}
                aria-label="select merge strategy"
                aria-haspopup="menu"
                onClick={handleToggle}
              >
                <ArrowDropDownIcon />
              </Button>
            </ButtonGroup>
            <Popper
              open={open}
              anchorEl={anchorRef.current}
              role={undefined}
              transition
              disablePortal
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin:
                      placement === "bottom" ? "center top" : "center bottom",
                  }}
                >
                  <Paper>F
                    <ClickAwayListener onClickAway={handleClose}>
                      <MenuList id="split-button-menu">
                        {options.map((option, index) => (
                          <MenuItem
                            key={option}
                            disabled={index === 2}
                            selected={index === selectedIndex}
                            onClick={(event) =>
                              handleMenuItemClick(event, index)
                            }
                            style={{ backgroundColor: "#fff" }}
                          >
                            {option}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </Grid>
        </Grid>
      </div>
    );
  }

  return (
    <div
      style={{
        // height: "100%",
        width: "100%",
        // backgroundColor: "#fff",
        // boxShadow: "0px 0px 5px #bcbcbc",
        marginTop: "2rem 0rem",
      }}
    >
      {Object.keys(selectedRowID).length > 0 && (
        <div
          style={{
            backgroundColor: "#3f51b4",
            padding: "0rem 1rem",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <h4 style={{ color: "#fff" }}>Row selected</h4>
          <div>
            <Tooltip title="Edit">
              <IconButton
                aria-label="edit"
                onClick={handleEditUser}
                style={{
                  display: USER_DETAILS.permissions.includes("usr002") ? "block" : "none",
                }}
              >
                <EditIcon style={{ color: "#fff" }} />
              </IconButton>
            </Tooltip>

            {/* <Tooltip title="Delete">
              <IconButton aria-label="delete" onClick={handleopenDelDialog}>
                <DeleteIcon style={{ color: "#fff" }} />
              </IconButton>
            </Tooltip> */}
          </div>
        </div>
      )}

      <Box
        className={classes.root}
        style={{
          // height: 700,
          width: "100%",
        }}
      >
        {/* <div className="clonos_user_table">
        <DataGrid
          rows={users}
          columns={columns}
          pageSize={5}
          checkboxSelection={USER_DETAILS.permissions.includes("usr002") ? true : false}
          // checkboxSelection
          //user/admin color indication:
          getRowId={(row) => row.id}
          getRowClassName={(params) => {
            if (params.row.Is_Admin === 0) {
              return "user";
            }
            return "admin";
          }}
          disableSelectionOnClick
          selectionModel={selectionModel}
          autoHeight
          onSelectionModelChange={(selection) => {
            if (selection.length > 1) {
              const selectionSet = new Set(selectionModel);
              const result = selection.filter((s) => !selectionSet.has(s));
              const selectedObj = users.filter((obj) => obj.id === result[0]);
              setSelectionModel(result);
              console.log("result", result);
              console.log("selectedObj", selectedObj);
              setselectedUser(selectedObj[0]);

              setselectedRowID(() => {
                if (result.length > 0) {
                  return { id: result[0] };
                } else {
                  return {};
                }
              });
            } else {
              const selectedObj = users.filter(
                (obj) => obj.id === selection[0]
              );
              setselectedUser(selectedObj[0]);
              setSelectionModel(selection);
              console.log("selection", selection);
              setselectedRowID(() => {
                if (selection.length > 0) {
                  return { id: selection[0] };
                } else {
                  return {};
                }
              });
            }
          }}
        />
        </div> */}
        <DataGrid
          rows={users}
          columns={columns}
          pageSize={5}
          checkboxSelection={handlePermission.user_Edit ? true : false}
          // checkboxSelection
          //user/admin color indication:
          getRowId={(row) => row.id}
          getRowClassName={(params) => {
            if (params.row.Is_Admin === 0) {
              return "user";
            }
            return "admin";
          }}
          disableSelectionOnClick
          selectionModel={selectionModel}
          autoHeight
          onSelectionModelChange={(selection) => {
            if (selection.length > 1) {
              const selectionSet = new Set(selectionModel);
              const result = selection.filter((s) => !selectionSet.has(s));
              const selectedObj = users.filter((obj) => obj.id === result[0]);
              setSelectionModel(result);
              console.log("result", result);
              console.log("selectedObj", selectedObj);
              setselectedUser(selectedObj[0]);

              setselectedRowID(() => {
                if (result.length > 0) {
                  return { id: result[0] };
                } else {
                  return {};
                }
              });
            } else {
              const selectedObj = users.filter(
                (obj) => obj.id === selection[0]
              );
              setselectedUser(selectedObj[0]);
              setSelectionModel(selection);
              console.log("selection", selection);
              setselectedRowID(() => {
                if (selection.length > 0) {
                  return { id: selection[0] };
                } else {
                  return {};
                }
              });
            }
          }}
        />
        <div
          style={{
            padding: "15px",
          }}
        ></div>
        <div style={{ marginTop: "20px" }}>
          <SplitButton />
          {/* </div>
        <div style={{ padding: "20px" }}>
          <p style={{ marginBottom: "20px" }}>
            Applied Filters: {handleApplyFilters(props.filters)}
          </p> */}
          <p
            style={{
              // textAlign: "left",
              backgroundColor: "#ADD8E6",
              fontWeight: "bold",
              width: "20px",
              height: "20px",
              display: "inline-block",
            }}
          ></p>
          <span style={{ position: "relative", top: "-5px", left: "5px" }}>
            Admin
          </span>
        </div>
      </Box>

      {/* <ClonosConfirmationDialog
        Open={openDelDialog}
        Title="Delete User"
        Content="Are you sure, You want to delete this user ?"
        CloseDialog={() => handleCloseDelDialog()}
        ProceedDialog={() => handleDeleteUser()}
      /> */}
      <ClonosUserDetailsDialog
        HandleOpen={openUserDetailsDialog}
        HandleClose={() => handleUserDialogClose()}
        UserDetails={selectedUser}
      />
      <AccountActionDialog
        HandleClose={() => closeModal()}
        Show={open}
        Action={switchValue ? "Activate" : "Deactivate"}
        value={switchValue}
        rowValue={SelectedSwitUser}
      />
    </div>
  );
}
