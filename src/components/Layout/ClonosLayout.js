import React, { useContext, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import CloseIcon from "@material-ui/icons/Close";
import CallMadeIcon from "@material-ui/icons/CallMade";
import PersonIcon from "@material-ui/icons/Person";
import AppBar from "@material-ui/core/AppBar";
import { SelectPicker, InputPicker } from "rsuite";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import PersonAddOutlinedIcon from "@material-ui/icons/PersonAddOutlined";
import PeopleOutlineOutlinedIcon from "@material-ui/icons/PeopleOutlineOutlined";
import WebAssetIcon from "@material-ui/icons/WebAsset";
import { getUser, removeUserSession, getToken } from "../../utils/clonosCommon";
import { useLocation, useNavigate } from "react-router-dom";
import LOGO from "../../assets/images/logo.png";
import Tooltip from "@material-ui/core/Tooltip";
import HomeIcon from "@material-ui/icons/Home";
import { logoutAccount, postUserFilters } from "../../Api/User/UserApi";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import { Button } from "@material-ui/core";
import Badge from "@material-ui/core/Badge";
import NotificationsIcon from "@material-ui/icons/Notifications";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import DescriptionIcon from "@material-ui/icons/Description";
import BuildIcon from "@material-ui/icons/Build";
import NoteAddIcon from "@material-ui/icons/NoteAdd";
import AssessmentIcon from "@material-ui/icons/Assessment";
import AccessibilityIcon from "@material-ui/icons/Accessibility";
import { useDispatch, useSelector } from "react-redux";
import { getAllPermissions } from "../../Api/User/UserApi";
import { SiTodoist } from "react-icons/si"
import {
  getAllAssets,
  getAssetFilters,
  postAssetFilters,
} from "../../Api/Asset/assetApi";
import SpinnerIcon from "@rsuite/icons/legacy/Spinner";
import { assetActions } from "../../Store/Reducers/ClonosAssetReducer";
import { getAllAssoDocs } from "../../Api/Documents/DocumentApi";
import { documentActions } from "../../Store/Reducers/ClonosDocumentReducer";
import ListAltIcon from "@material-ui/icons/ListAlt";
import { commonActions } from "../../Store/Reducers/CommonReducer";
import Close from "@material-ui/icons/Close";
import {
  filterNotificationsByDaterange,
  getFilteredNotifications,
  getUnReadNotifications,
  updateMultipleNotifications,
  updateSingleNotification,
} from "../../Api/Notification/Notification";
import NotificationsActiveIcon from "@material-ui/icons/NotificationsActive";
import { DateRangePicker } from "rsuite";
import "rsuite/dist/rsuite.css";
import ArrowLeftIcon from "@material-ui/icons/ArrowLeft";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import { DataGrid } from "@material-ui/data-grid";
import "./daterange.css";
import { getEngineeringDataOfAsset } from "../../Api/EngineeringData/engineeringData";
import { CloseOutlined } from "@material-ui/icons";
import SimpleDialog from "../Dialogs/ClonosBulkCreationDialog";
import DeviceHubIcon from '@material-ui/icons/DeviceHub';
import { MdOutlineNotificationImportant } from 'react-icons/md';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import LaunchIcon from '@material-ui/icons/Launch';
import { notificationActions } from "../../Store/Reducers/ClonosNotificationsReducer";
import { CreateUserIcon } from "../../assets/UIUX/icons/CreateUserIcon";
import { AllUserIcon } from "../../assets/UIUX/icons/AllUsersIcon";
import { CreateAsset } from "../../assets/UIUX/icons/CreateAsset";
import { AllAssetIcon } from "../../assets/UIUX/icons/AllAssetIcon";
import { RolesAndPermissionsIcon } from "../../assets/UIUX/icons/RolesAndPermissionsIcon";
import { EngineeringDataIcon } from "../../assets/UIUX/icons/EngineeringDataIcon";
import { AllDocumentIcon } from "../../assets/UIUX/icons/AllDocumentIcon";
import { MdDynamicForm } from "react-icons/md"
import { CgReorder } from "react-icons/cg"
import { FaListAlt } from "react-icons/fa"
import CreateDocument from "../ClonosDocuments/CreateDocument";
import { MdDashboardCustomize } from "react-icons/md"
import AddAlertIcon from '@material-ui/icons/AddAlert';
import ChecklistIcon from "../../assets/UIUX/icons/Side_Bar_Icons/ChecklistIcon";
import CreateChecklistIcon from "../../assets/UIUX/icons/Side_Bar_Icons/ChecklistIcon";
import AllChecklistIcon from "../../assets/UIUX/icons/Side_Bar_Icons/AllCheckilstIcon";
import { TaskLibraryIcon } from "../../assets/UIUX/icons/TaskLibraryIcon";
const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: "none",
  },
  toolbarTwo: {
    display: "flex",
    justifyContent: "space-between",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(5) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(7.5) + 1,
    },
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    height: "64px"
  },
  content: {
    flexGrow: 1,
    padding: 0,
  },
}));

export default function ClonosLayout({ children }) {
  const classes = useStyles();
  const loginUserDetails = getUser();
  const currentPermissionsSelector = useSelector(
    (state) => state.userData.loggedUserPermissions
  );
  const refreshApp = useSelector((state) => state.commonData.refreshApp);
  const state = useSelector((state) => state.userData.userDetails);
  const [userDetails, setUserDetails] = useState(null);

  // const [allAssets, loading, featAssets] = useAssets();
  const [allAssets, setallAssets] = useState([]);

  const [allpermissions, setallpermissions] = useState([]);

  useEffect(() => {
    // getAllPermissions()
    //   .then((res) => {
    //     console.log("getAllPermissions RESPONSE", res);
    //     setallpermissions(res?.data?.result);
    //   })
    //   .catch((err) => console.log("getAllPermissions ERROR".err));

    if (getToken()) {
      getAllAssets()
        .then((res) => {
          setallAssets(res?.data?.rows);
        })
        .catch((err) => {
          if (err.response.data.status === 401 && JSON.parse(localStorage.getItem("loginUser")) !== null) {
            dispatch(commonActions.handleExpiryAlert(true));
            removeUserSession();
            localStorage.removeItem("loginUser")
          }
        })

      setUserDetails(JSON.parse(localStorage.getItem("loginUser")));
    }
  }, []);

  const [handlePermission, sethandlePermission] = useState({});

  const [showDateFilter, setShowDateFilter] = useState(false);
  const anchorRef = React.useRef(null);
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [openMenu, setopenMenu] = useState(false);
  const LOCATION = useLocation();
  const NAVIGATE = useNavigate();
  const dispatch = useDispatch();
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const [searchValue, setsearchValue] = React.useState(null);
  const [searchAsset, setSearchAsset] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const count = useSelector(state => state.notificationsData.unReadNotificationsCount)
  const [calendarVal, setcalendarVal] = useState([new Date()]);
  const [calenderChange, setcalenderChange] = useState(false);
  const [filterPayload, setfilterPayload] = useState({
    createdDate: "",
  });

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
    setcalendarVal([new Date()]);
    settypevalue([]);
  };
  const [typevalue, settypevalue] = useState([]);
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleProfile = () => {
    NAVIGATE("/my-profile");
    setopenMenu(false);
  };

  const DRAWER_CONTENTS = [
    {
      name: "Create New User",
      icon: <CreateUserIcon color={LOCATION.pathname === "/create-user" ? "#FFFF" : "gray"} />,
      route: "create-user",
    },
    {
      name: "All Users",
      icon: <AllUserIcon color={LOCATION.pathname === "/all-users" ? "#FFFF" : "gray"} />,
      route: "all-users",
    },
    {
      name: "Create New Asset",
      icon: <CreateAsset color={LOCATION.pathname === "/create-asset" ? "#FFFF" : "gray"} />,
      route: "create-asset",
    },
    {
      name: "All Assets",
      icon: <AllAssetIcon color={LOCATION.pathname === "/all-assets" ? "#FFFF" : "gray"} />,
      route: "all-assets",
    },
    {
      name: "Roles & Permissions",
      icon: <RolesAndPermissionsIcon color={LOCATION.pathname === "/roles-and-permissions" ? "#FFFF" : "gray"} />,
      route: "roles-and-permissions",
    },
    {
      name: "Create Document",
      icon: <NoteAddIcon color={LOCATION.pathname === "/create-document" ? "#FFFF" : "gray"} />,
      route: "create-document",
    },
    {
      name: "All Documents",
      icon: <AllDocumentIcon color={LOCATION.pathname === "/documents" ? "#FFFF" : "gray"} />,
      route: "documents",
    },
    // {
    //   name: "Create Notification",
    //   icon: <MdDynamicForm fontSize="25px" />,
    //   route: "dynamic-form",
    // },
    {
      name: "Create Notification",
      icon: <AddAlertIcon />,
      route: "create-notification",
    },
    {
      name: "Notifications",
      icon: <MdOutlineNotificationImportant fontSize="25px" />,
      route: "notifications-list"
    },
    // {
    //   name: "All Forms",
    //   icon: <ListAltIcon />,
    //   route: "all-dynamic-forms",
    // },
    // {
    //   name: "Hierrarchy Setup",
    //   icon: <DeviceHubIcon />,
    //   route: "hierarchy-setup",
    // },
    // {
    //   name: "Approval System",
    //   icon: <PlaylistAddCheckIcon />,
    //   route: "approval-system",
    // },
    {
      name: "Work Order",
      icon: <SiTodoist fontSize="25px" />,
      route: "work-order",
    },
    {
      name: "Work Order List",
      icon: <FaListAlt fontSize="25px" />,
      route: "work-order-list",
    },
    // {
    //   name: "View Templates",
    //   icon: <DescriptionOutlinedIcon />,
    // },
    // {
    //   name: "Generate Templates",
    //   icon: <PostAddOutlinedIcon />,
    // },
    // {
    //   name: "View Documents",
    //   icon: <AssignmentOutlinedIcon />,
    // },
    // {
    //   name: "Scheduler",
    //   icon: <ScheduleIcon />,
    // },
    {
      name: "Customize",
      icon: <MdDashboardCustomize fontSize="25px" />,
      route: "customize"
    },
    {
      name: "Checklist",
      icon: <CreateChecklistIcon fontSize={"25"} />,
      route: "checklist-listing"
    },
    {
      name: "Task Library",
      icon: <TaskLibraryIcon fontSize={"25"} />,
      route: "tasks-library"
    },
    // {
    //   name: "All Checklist",
    //   icon: <AllChecklistIcon fontSize={"25"} />,
    //   route: "checklist-listing"
    // },
  ];
  const handleRefresh = () => {
    dispatch(commonActions.setRefresh(!refreshApp));
  };

  const handleToggle = () => {
    setopenMenu((prevOpen) => !prevOpen);
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setopenMenu(false);
    }
  }

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setopenMenu(false);
  };
  const handleLogout = () => {
    let data = {
      email: loginUserDetails?.email,
    };
    logoutAccount(data).then((res) => {
    }).catch((err) => {
      if (err.response.data.status === 401 && JSON.parse(localStorage.getItem("loginUser")) !== null) {
        dispatch(commonActions.handleExpiryAlert(true));
        removeUserSession();
        localStorage.removeItem("loginUser")
      }
    })
    removeUserSession();
    localStorage.removeItem("loginUser")
    window.location.reload();
  };
  useEffect(() => {
    if (getToken()) {
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
    }
  }, [allpermissions, currentPermissionsSelector]);

  useEffect(() => {
    if (getToken()) {
      const searchData = {
        assetName: searchValue,
      };
      postAssetFilters(searchData)
        .then((res) => {
          setallAssets(res?.data?.assets);
        })
        .catch((err) => {
          if (err.response.data.status === 401 && JSON.parse(localStorage.getItem("loginUser")) !== null) {
            dispatch(commonActions.handleExpiryAlert(true));
            removeUserSession();
            localStorage.removeItem("loginUser")
          }
        })
      getAllAssoDocs(searchAsset?.assetId)
        .then((res) => {
          dispatch(documentActions.setAllSearchDocuments(res?.data?.rows));
        })
        .catch((err) => {
          if (err?.response?.data?.status === 401 && JSON.parse(localStorage.getItem("loginUser")) !== null) {
            dispatch(commonActions.handleExpiryAlert(true));
            removeUserSession();
            localStorage.removeItem("loginUser")
          }
        })

      dispatch(assetActions.setSearchAssetValue(searchAsset));
    }

    return () => { };
  }, [searchValue, searchAsset]);

  useEffect(() => {
    if (getToken()) {
      getUnReadNotifications(loginUserDetails?.userId)
        .then((res) => {
          setNotifications(res?.data?.unreadNotifications);
          setNotificationsCount(res?.data?.unreadNotifications.length);
          dispatch(notificationActions.setUnReadNotificationsCount(res?.data?.unreadNotifications.length))
        })
        .catch((err) => {
          if (err.response.data.status === 401 && JSON.parse(localStorage.getItem("loginUser")) !== null) {
            dispatch(commonActions.handleExpiryAlert(true));
            removeUserSession();
            localStorage.removeItem("loginUser")
          }
        })
    }
  }, []);
  // *********************** FOR RIGHT DRAWER ****************
  const [drawerSide, setDrawerSide] = React.useState({
    right: false,
  });
  const toggleDrawer = (anchor, open) => (event) => {
    // if (
    //   event &&
    //   event.type === 'keydown' &&
    //   ((event).key === 'Tab' ||
    //     (event).key === 'Shift')
    // ) {
    //   return;
    // }
    if (drawerSide.right) {
      setShowDateFilter(!showDateFilter);
    }
    setDrawerSide({ right: open });
  };

  //PAGINATION _____________________________________________
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(0);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const visibleNotifications = notifications?.slice(startIndex, endIndex);

  const totalPages = Math.ceil(notifications?.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  useEffect(() => {
    const windowHeight = window.innerHeight;
    const contentHeight = windowHeight - 177;
    const itemsPerPage = Math.floor(contentHeight / 101.74);
    setItemsPerPage(itemsPerPage);
  }, [drawerSide, window.innerHeight]);

  // Bulk Creation Dailog __________________________________________________

  const [showBulkDailog, setShowBulkDailog] = React.useState(false);
  const [bulkCreatedData, setBulkCreatedData] = useState([])
  const [bulkCreationType, setBulkCreationType] = useState("")
  const handleBulkDailog = () => {
    setShowBulkDailog(false)
  }
  const handleReadNotification = (id, assetId, userId, type, changeIn) => {
    if (visibleNotifications.length === 1 && currentPage != 1) {
      setCurrentPage(currentPage - 1);
    }
    setDrawerSide("right", false)
    updateSingleNotification({
      notificationId: id,
      action: "read",
      userId: loginUserDetails?.userId,
    }).then(() => {
      getUnReadNotifications(loginUserDetails?.userId)
        .then((res) => {
          setNotifications(res?.data?.unreadNotifications);
          setNotificationsCount(res?.data?.unreadNotifications.length);
          dispatch(
            commonActions.handleSnackbar({
              show: false,
              message: `You have ${notificationsCount} Notifications`,
              type: "success",
              verticalPosition: "top",
              toastType: "notification",
            })
          );
        }).catch((err) => {
          if (err.response.data.status === 401 && JSON.parse(localStorage.getItem("loginUser")) !== null) {
            dispatch(commonActions.handleExpiryAlert(true));
            removeUserSession();
            localStorage.removeItem("loginUser")
          }
        })
        .then((res) => {
          setDrawerSide({ right: false });

          if (type === "New asset added" || type === "Asset updated") {
            postAssetFilters({ assetId }).then((res) => {
              NAVIGATE("/view-asset", { state: res?.data?.assets[0] });
            }).catch((err) => {
              if (err.response.data.status === 401 && JSON.parse(localStorage.getItem("loginUser")) !== null) {
                dispatch(commonActions.handleExpiryAlert(true));
                removeUserSession();
                localStorage.removeItem("loginUser")
              }
            })
          } else if (type === "Asset deleted") {
            NAVIGATE("/all-assets");
          } else if (type === "Engineering data deleted") {
            NAVIGATE("/engineeringData");
          } else if (type === "User updated" || type === "User added") {
            postUserFilters({ userId: userId }).then((res) => {
              NAVIGATE("/view-user", { state: res?.data?.users[0] });
            }).catch((err) => {
              if (err.response.data.status === 401 && JSON.parse(localStorage.getItem("loginUser")) !== null) {
                dispatch(commonActions.handleExpiryAlert(true));
                removeUserSession();
                localStorage.removeItem("loginUser")
              }
            })
          } else if (type === "Engineering Data updated") {
            getEngineeringDataOfAsset(assetId).then((res) => {
              NAVIGATE("/engineering-data", { state: res?.data?.result });
            }).catch((err) => {
              if (err.response.data.status === 401 && JSON.parse(localStorage.getItem("loginUser")) !== null) {
                dispatch(commonActions.handleExpiryAlert(true));
                removeUserSession();
                localStorage.removeItem("loginUser")
              }
            })
          } else if (type === "New assets added") {
            const bulkAssets = changeIn?.assetId;
            setShowBulkDailog(true);
            setBulkCreationType(type);
            setBulkCreatedData(bulkAssets);
          } else if (type === "New users added") {
            const bulkUsers = changeIn?.userId;
            setShowBulkDailog(true);
            setBulkCreationType(type)
            setBulkCreatedData(bulkUsers);
          }
        });
    });
  };

  const handleMarkAll = () => {
    const idList = notifications?.map((notification) => {
      return notification._id;
    });
    updateMultipleNotifications({
      notificationIds: idList,
      userId: loginUserDetails?.userId,
      action: "read"
    }).then(() => {
      getUnReadNotifications(loginUserDetails?.userId).then(
        (res) => {
          setNotifications(res?.data?.unreadNotifications);
          setNotificationsCount(res?.data?.unreadNotifications.length);
          dispatch(
            commonActions.handleSnackbar({
              show: false,
              message: `You have ${notificationsCount} Notifications`,
              type: "success",
              verticalPosition: "top",
              toastType: "notification",
            })
          );
        }
      ).catch((err) => {
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

    setDrawerSide("right", false);
  };

  const handleSkipAll = () => {
    const idList = notifications?.map((notification) => {
      return notification._id;
    });
    updateMultipleNotifications({
      notificationIds: idList,
      userId: loginUserDetails?.userId,
      action: "skip"
    }).then(() => {
      getUnReadNotifications(loginUserDetails?.userId).then(
        (res) => {
          setNotifications(res?.data?.unreadNotifications);
          dispatch(
            commonActions.handleSnackbar({
              show: false,
              message: `You have ${notificationsCount} Notifications`,
              type: "success",
              verticalPosition: "top",
              toastType: "notification",
            })
          );
          setNotificationsCount(res?.data?.unreadNotifications.length);
        }
      ).catch((err) => {
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

    setDrawerSide("right", false);
  };

  useEffect(() => {
    if (getToken()) {
      getUnReadNotifications(loginUserDetails?.userId)
        .then((res) => {
          const data = res?.data?.result;
          setNotifications(res?.data?.unreadNotifications);
          setNotificationsCount(res?.data?.unreadNotifications.length);
        })
        .catch((err) => {
          if (err.response.data.status === 401 && JSON.parse(localStorage.getItem("loginUser")) !== null) {
            dispatch(commonActions.handleExpiryAlert(true));
            removeUserSession();
            localStorage.removeItem("loginUser")
          }
        })
    }
  }, [drawerSide]);

  const disabledDate = (date) => {
    const currentDate = new Date();
    return date > currentDate;
  };
  // DATE RANGE FILTER______________________________________
  const handleDatechange = (value) => {
    if (value) {
      setCurrentPage(1);
      const data = {
        startDate: value[0],
        endDate: value[1],
      };
      let prev_date = new Date(value[0]);
      let next_date = new Date(value[1]);
      prev_date.setHours(prev_date.getHours() + 5);
      prev_date.setMinutes(prev_date.getMinutes() + 29);
      next_date.setHours(next_date.getHours() + 5);
      next_date.setMinutes(next_date.getMinutes() + 29);
      data.startDate = prev_date;
      data.endDate = next_date;
      setcalendarVal([data.startDate, data.endDate])
      getFilteredNotifications(loginUserDetails?.userId, { startDate: data.startDate, endDate: data.endDate, unreadNotifications: true }).then((res) => {
        setNotifications(res?.data.notifications);
      }).catch((err) => {
        if (err.response.data.status === 401 && JSON.parse(localStorage.getItem("loginUser")) !== null) {
          dispatch(commonActions.handleExpiryAlert(true));
          removeUserSession();
          localStorage.removeItem("loginUser")
        }
      })
    }

  };

  useEffect(() => {
    if (notificationsCount && loginUserDetails.permissions.includes("ntf004")) {
      dispatch(
        commonActions.handleSnackbar({
          show: notificationsCount ? true : false,
          message: `You have ${notificationsCount} Notifications`,
          type: "success",
          verticalPosition: "top",
          toastType: "notification",
        })
      );
    }
  }, [notificationsCount]);


  return (
    <>
      {getToken() ? (
        <div className={classes.root}>
          <CssBaseline />
          <AppBar
            position="fixed"
            className={clsx(classes.appBar, {
              [classes.appBarShift]: open,
            })}
          >
            <Toolbar className={classes.toolbarTwo}>
              <div style={{ display: "flex", alignItems: "center" }}>

                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={handleDrawerOpen}
                  edge="start"
                  className={clsx(classes.menuButton, {
                    [classes.hide]: open,
                  })}
                >
                  <MenuIcon />
                </IconButton>

                {LOCATION.pathname === "/landing-page" && (
                  <span className="custom-picker">
                    <InputPicker
                      value={searchValue}
                      onChange={setsearchValue}
                      data={allAssets?.map((item) => ({
                        label: `${item?.assetName?.replace(/_/g, " ")} Tag ID: ${item.tagId
                          }`,
                        value: item.assetName,
                        asset: item,
                      }))}
                      onClean={() => {
                        setSearchAsset(null);
                        setsearchValue("");
                      }}
                      block
                      placeholder="Search Asset"
                      size="lg"
                      style={{ width: "200px", color: "#000 !important" }}
                      onSelect={(value, item) => {
                        setSearchAsset(item.asset);
                        setsearchValue(value);
                      }}
                    />
                  </span>
                  // <InputPicker
                  //   data={allAssets.map((item) => ({ label: `${item.assetName.replace(/_/g, " ")} ID: ${item.assetId}`, value: item.assetName }))}
                  //   style={{ width: 224 }}
                  //   labelKey="assetName"
                  //   valueKey="assetId"
                  //   onSearch={featAssets}
                  //   renderMenu={(menu) => {
                  //     if (loading) {
                  //       return (
                  //         <p
                  //           style={{
                  //             padding: 10,
                  //             color: "#999",
                  //             textAlign: "center",
                  //           }}
                  //         >
                  //           <SpinnerIcon spin /> Loading...
                  //         </p>
                  //       );
                  //     }
                  //     return menu;
                  //   }}
                  // />
                )}
              </div>
              <div className={classes.grow} />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                {LOCATION.pathname !== "/landing-page" && (
                  <Tooltip title="Home Page">
                    <IconButton
                      aria-label="Home Page"
                      onClick={() => NAVIGATE("/landing-page")}
                    >
                      <HomeIcon style={{ color: "#fff" }} />
                    </IconButton>
                  </Tooltip>
                )}
                <Button
                  onClick={handleRefresh}
                  style={{
                    margin: "0.5rem 1rem 0",
                    backgroundColor: "#fff",
                    color: "#3f51b5",
                    height: "30px",
                  }}
                  variant="contained"
                  color="primary"
                  size="medium"
                >
                  UI 3.1 | Dev 1.0.3
                </Button>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  {loginUserDetails?.permissions?.includes("ntf004") ? (
                    <IconButton
                      aria-label="show 17 new notifications"
                      color="inherit"
                      // onClick={() => NAVIGATE("/dummy")}
                      onClick={toggleDrawer("right", true)}
                    >
                      <Badge
                        badgeContent={
                          notificationsCount > 999 ? "999+" : notificationsCount
                        }
                        color="secondary"
                      >
                        <NotificationsIcon style={{ color: "#fff" }} />
                      </Badge>
                    </IconButton>
                  ) : (
                    <Tooltip title="Notifications Disabled">
                      <IconButton
                        aria-label="show 17 new notifications"
                        color="inherit"
                      >
                        <NotificationsIcon style={{ color: "#CCC" }} />
                      </IconButton>
                    </Tooltip>
                  )}
                  <SwipeableDrawer
                    anchor={"right"}
                    open={drawerSide["right"]}
                    onClose={toggleDrawer("right", false)}
                    onOpen={toggleDrawer("right", true)}
                  >
                    <div
                      style={{
                        width: "500px",
                        height: "100vh",
                        position: "relative",
                        background: "#3f51b5",
                      }}
                    >
                      <div
                        style={{
                          width: "500px",
                          position: "fixed",
                          zIndex: "100",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "10px",
                            alignItems: "center",
                            borderBottom: "1px solid black",
                            background: "#3F51B5",
                            color: "#FFF",
                          }}
                        >
                          <h3 style={{ fontWeight: "400", fontSize: "22px" }}>
                            Notifications
                          </h3>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gridGap: "20px",
                            }}
                          >
                            <Tooltip title="Go to Notifications">
                              <IconButton
                                aria-label="mark all as read"
                                onClick={() => {
                                  setDrawerSide({ right: false })
                                  NAVIGATE("/notifications")
                                }}
                                style={{
                                  color: "black",
                                  background: "#CCC",
                                  borderRadius: "50%",
                                }}
                              >
                                <LaunchIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Mark all as read">
                              <IconButton
                                aria-label="mark all as read"
                                onClick={handleMarkAll}
                                style={{
                                  color: "black",
                                  background: "#CCC",
                                  borderRadius: "50%",
                                }}
                              >
                                <DoneAllIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Skip All">
                              <IconButton
                                aria-label="skip all"
                                onClick={handleSkipAll}
                                style={{
                                  color: "black",
                                  background: "#CCC",
                                  borderRadius: "50%",
                                }}
                              >
                                <CloseOutlined
                                  fontSize="medium"
                                  color="secondary"
                                />
                              </IconButton>
                            </Tooltip>
                          </div>
                        </div>
                        {true && (
                          <div
                            className="dateRangeBox"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              padding: "0px 22px 10px 5px",
                              background: "#3F51B5",
                              zIndex: 10000,
                              position: "relative",
                            }}
                          >
                            <DateRangePicker
                              value={calendarVal}
                              onChange={handleDatechange}
                              onClean={() => {
                                setcalendarVal([null, null]);
                                getFilteredNotifications(loginUserDetails?.userId, { unreadNotifications: true }).then((res) => {
                                  setNotifications(res?.data.notifications);
                                }).catch((err) => {
                                  if (err.response.data.status === 401 && JSON.parse(localStorage.getItem("loginUser")) !== null) {
                                    dispatch(commonActions.handleExpiryAlert(true));
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
                        )}
                      </div>
                      <div
                        style={{
                          padding: "0px 10px 10px 10px",
                          // height: "85vh",
                          // overflowY: "scroll",
                          background: "#3F51B5",
                          color: "#FFF",
                          marginTop: "135px",
                        }}
                      >
                        {visibleNotifications?.length > 0 ? (
                          visibleNotifications?.map((notification) => {
                            let createdDate = new Date(
                              notification.createdDate
                            );
                            createdDate.setHours(createdDate.getHours() + 5);
                            createdDate.setMinutes(createdDate.getMinutes() + 35)
                            const isoDateStringWithHours =
                              createdDate.toISOString();
                            let [date, time] =
                              isoDateStringWithHours.split("T");
                            let [year, month, day] = date.split("-");
                            let hhmmss = time.split(".")[0];
                            let [hh, mm, ss] = hhmmss.split(":");
                            return (
                              <div
                                style={{
                                  display: "flex",
                                  background: "#FFF",
                                  padding: "10px",
                                  gridGap: "30px",
                                  cursor: "pointer",
                                  marginBottom: "10px",
                                  borderRadius: "6px",
                                  color: "#000",
                                  position: "relative",
                                }}
                                key={notification?._id}
                                onClick={() =>
                                  handleReadNotification(
                                    notification._id,
                                    notification.changeIn.assetId,
                                    notification.changeIn.userId,
                                    notification.title,
                                    notification.changeIn
                                  )
                                }
                              >
                                <div>
                                  <div
                                  // style={{
                                  //   border: "1px solid #CCC",
                                  //   borderRadius: "3px",
                                  // }}
                                  >
                                    <NotificationsActiveIcon fontSize="large" />
                                  </div>
                                </div>{" "}
                                <div>
                                  <p
                                    style={{
                                      // width: "400px",
                                      fontSize: "16px",
                                      fontWeight: "bold",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                    }}
                                  >
                                    {notification.title.toUpperCase()}
                                  </p>
                                  <p
                                    style={{
                                      whiteSpace: "nowrap",
                                      width: "390px",
                                      fontSize: "16px",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                    }}
                                  >
                                    {notification?.title?.includes(
                                      "asset added"
                                    )
                                      ? `${notification?.userName
                                      } has created a new asset : ${notification?.changeIn?.assetName ||
                                      "ASSET"
                                      }`
                                      : notification.title === "Asset updated"
                                        ? `${notification.userName} has updated an asset:  ${notification.changeIn.assetName}`
                                        : notification?.title?.includes(
                                          "asset deleted"
                                        )
                                          ? `${notification?.userName} has deleted an asset : ${notification?.changeIn?.assetName}`
                                          : notification?.title ===
                                            "Engineering data deleted"
                                            ? `${notification?.userName} has deleted a field of   ${notification?.changeIn?.assetName}`
                                            : notification?.title ===
                                              "Engineering Data added"
                                              ? `${notification?.userName} has added a new field to : ${notification?.changeIn?.assetName}`
                                              : notification?.title ===
                                                "Engineering Data updated"
                                                ? `${notification?.userName} has updated field : ${notification?.changeIn.fieldName[0]}
                                    `
                                                : notification?.title === "Role assigned"
                                                  ? `${notification.userName} has assigned a new role to ${notification.changeIn.userName}`
                                                  : notification.title ===
                                                    "User status updated"
                                                    ? `${notification.userName} has updated status of ${notification.changeIn.userName}`
                                                    : notification.title === "User updated"
                                                      ? `${notification.userName} has updated ${notification.changeIn.userName}`
                                                      : notification?.title ===
                                                        "Permissions assigned"
                                                        ? `${notification.userName} has assigned permissions to ${notification.changeIn.userName}`
                                                        : notification?.title ===
                                                          "New assets added"
                                                          ? `${notification.userName} has created ${notification?.changeIn?.assetId?.length} assets`
                                                          : notification?.title ===
                                                            "New users added"
                                                            ? `${notification.userName} has created ${notification?.changeIn?.userId?.length} users`
                                                            : notification?.title ===
                                                              "Document deleted"
                                                              ? `${notification.userName} has deleted a document : ${notification?.changeIn?.docName[0]} `
                                                              : notification?.title ===
                                                                "New user created"
                                                                ? `${notification.userName} has created a user : ${notification?.changeIn?.userName} `
                                                                : ""}
                                  </p>
                                  <p>
                                    Date :{" "}
                                    {`${day}-${month}-${year}  ${hh}:${mm}:${ss}`}
                                  </p>
                                  {/* <div > */}
                                  <Tooltip title="Not-Intrested">
                                    <IconButton
                                      style={{
                                        position: "absolute",
                                        right: "10px",
                                        top: "10px",
                                        padding: 0,
                                      }}
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        updateSingleNotification({
                                          notificationId: notification?._id,
                                          action: "skip",
                                          userId:
                                            loginUserDetails?.userId,
                                        }).then(() => {
                                          getUnReadNotifications(loginUserDetails?.userId).then((res) => {
                                            setNotifications(res?.data?.unreadNotifications);
                                            setNotificationsCount(
                                              res?.data?.unreadNotifications.length
                                            );
                                            dispatch(
                                              commonActions.handleSnackbar({
                                                show: false,
                                                message: ``,
                                                type: "",
                                                verticalPosition: "top",
                                                toastType: "notification",
                                              })
                                            );
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
                                      }}
                                    >
                                      <CloseOutlined
                                        fontSize="small"
                                        color="secondary"
                                      />
                                    </IconButton>
                                  </Tooltip>
                                  {/* </div> */}
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <p
                            style={{
                              padding: "20px",
                              fontSize: "16px",
                              textAlign: "center",
                            }}
                          >
                            You are yet to recieve notifications
                          </p>
                        )}
                      </div>
                    </div>
                    {notifications?.length > 0 && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          width: "500px",
                          justifyContent: "space-between",
                          position: "fixed",
                          bottom: "0",
                          right: "0",
                          padding: "0px 10px",
                          zIndex: "999",
                          background: "#FFFF",
                          color: "#3F51B5",
                        }}
                      >
                        <Button
                          disabled={currentPage === 1}
                          onClick={() => handlePageChange(currentPage - 1)}
                        >
                          <ArrowLeftIcon fontSize="large" />
                        </Button>
                        <div>
                          {`${startIndex + 1} - ${currentPage === totalPages
                            ? notifications?.length
                            : endIndex
                            } of ${notifications?.length}`}
                        </div>
                        <Button
                          disabled={currentPage === totalPages}
                          onClick={() => handlePageChange(currentPage + 1)}
                        >
                          <ArrowRightIcon fontSize="large" />
                        </Button>
                      </div>
                    )}
                  </SwipeableDrawer>
                  {
                    showBulkDailog && <SimpleDialog open={showBulkDailog} close={handleBulkDailog} ids={bulkCreatedData} type={bulkCreationType} />
                  }
                  <div>
                    <div
                      style={{
                        marginLeft: "2rem",
                        display: "flex",
                        justifyContent: "space-between",
                        cursor: "pointer",
                      }}
                      ref={anchorRef}
                      aria-controls={openMenu ? "menu-list-grow" : undefined}
                      aria-haspopup="true"
                      onClick={handleToggle}
                    >
                      <span
                        style={{
                          color: "#fff",
                          marginLeft: "0.7rem",
                          position: "relative",
                          top: "0.5rem",
                          fontWeight: "bold",
                          fontSize: "0.9em",
                        }}
                      >
                        {loginUserDetails?.email}
                      </span>
                      <ArrowDropDownIcon
                        style={{
                          color: "#fff",
                          position: "relative",
                          top: "0.3rem",
                        }}
                      />
                    </div>
                    <p
                      style={{
                        marginLeft: "2.8rem",
                        fontWeight: "bold",
                        fontSize: "0.9em",
                        marginTop: "5px",
                      }}
                    >
                      Designation: {loginUserDetails?.role}
                    </p>
                  </div>
                  <Popper
                    open={openMenu}
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
                            placement === "bottom"
                              ? "center top"
                              : "center bottom",
                        }}
                      >
                        <Paper>
                          <ClickAwayListener onClickAway={handleClose}>
                            <MenuList
                              autoFocusItem={open}
                              id="menu-list-grow"
                              onKeyDown={handleListKeyDown}
                            >
                              <MenuItem onClick={() => handleProfile()}>
                                Profile
                              </MenuItem>
                              <MenuItem onClick={handleClose}>
                                My account
                              </MenuItem>
                              <MenuItem
                                onClick={() => {
                                  // removeUserSession();
                                  // NAVIGATE("/");
                                  handleLogout();
                                }}
                              >
                                Logout
                              </MenuItem>
                            </MenuList>
                          </ClickAwayListener>
                        </Paper>
                      </Grow>
                    )}
                  </Popper>
                </div>
              </div>
            </Toolbar>
          </AppBar>
          <Drawer
            variant="permanent"
            className={clsx(classes.drawer, {
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open,
            })}
            classes={{
              paper: clsx({
                [classes.drawerOpen]: open,
                [classes.drawerClose]: !open,
              }),
            }}
          >
            <div className={classes.toolbar}>
              <img
                style={{ width: "25px", height: "25px" }}
                src={LOGO}
                alt="logo"
              />
              <h5>CLONOS</h5>
              <IconButton onClick={handleDrawerClose}>
                {theme.direction === "rtl" ? (
                  <ChevronRightIcon />
                ) : (
                  <ChevronLeftIcon />
                )}
              </IconButton>
            </div>
            <Divider />

            <List>
              {DRAWER_CONTENTS.map((content, index) => {
                if (
                  (loginUserDetails.permissions.includes("usr005") &&
                    content.route === "all-users") ||
                  (loginUserDetails.permissions.includes("ast005") &&
                    content.route === "all-assets") ||
                  (loginUserDetails.permissions.includes("ast001") &&
                    content.route === "create-asset") ||
                  (loginUserDetails.permissions.includes("usr001") &&
                    content.route === "create-user") ||
                  ((loginUserDetails?.role_id === "086" || loginUserDetails?.role_id === "001" || loginUserDetails?.role_id === "002") &&
                    content.route === "create-document" || content.route === "documents") ||
                  (loginUserDetails.permissions.includes("rap005") &&
                    content.route === "roles-and-permissions") ||
                  (loginUserDetails.permissions.includes("wko001") && content.route === "work-order") ||
                  (loginUserDetails.permissions.includes("wko005") && content.route === "work-order-list" )||
                  (content.route === "create-notification" && (loginUserDetails?.role_id === "086" || loginUserDetails?.role_id === "001" || loginUserDetails?.role_id === "002")) ||
                  (loginUserDetails.permissions.includes("ntf005") && content.route === "notifications-list") ||
                  content.route === "customize" ||
                  (loginUserDetails.permissions.includes("ckl001") && content.route === "create-checklist") ||
                  (loginUserDetails.permissions.includes("ckl005") && content.route === "checklist-listing") || content.route === "tasks-library"
                ) {
                  return (
                    <>
                      {index !== 0 && <Divider />}
                      <ListItem
                        style={{ padding: "0.4rem 1rem", transition: "0.3s", background: LOCATION.pathname === `/${content.route}` ? "#3f51b5" : "#FFF" }}
                        className="sidebar-link"
                        onClick={() => NAVIGATE(`/${content.route}`)}
                        button
                        key={content.name}
                      >
                        <Tooltip title={content?.name}>
                          <ListItemIcon style={{ color: LOCATION.pathname === `/${content.route}` ? "#FFFF" : "gray" }}>{content.icon}</ListItemIcon>
                        </Tooltip>
                        <ListItemText style={{ color: LOCATION.pathname === `/${content.route}` ? "#FFFF" : "gray" }} primary={content.name} />
                      </ListItem>
                    </>
                  );
                } else {
                  return null;
                }
              })}
            </List>
            {<Divider />}
          </Drawer>
          <main className={classes.content}>
            <div className="main_toolbar" />
            {children}
          </main>
        </div>
      ) : (
        children
      )}
    </>
  );
}
