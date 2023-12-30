import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import clsx from "clsx";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import PeopleOutlineOutlinedIcon from "@material-ui/icons/PeopleOutlineOutlined";
import PostAddOutlinedIcon from "@material-ui/icons/PostAddOutlined";
import DescriptionOutlinedIcon from "@material-ui/icons/DescriptionOutlined";
import LOGO from "../../assets/images/logo.png";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import NotificationsIcon from "@material-ui/icons/Notifications";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import PersonAddOutlinedIcon from "@material-ui/icons/PersonAddOutlined";
import AssignmentOutlinedIcon from "@material-ui/icons/AssignmentOutlined";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import ScheduleIcon from "@material-ui/icons/Schedule";
import { useNavigate } from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";
import HomeIcon from "@material-ui/icons/Home";
import { getUser, removeUserSession, getToken } from "../../utils/clonosCommon";
import { useDispatch } from "react-redux";
// import { formActions } from "../../Store/Reducers/FormReducer";
import WebAssetIcon from "@material-ui/icons/WebAsset";
import { getAllForms } from "../../Api/Form/Form";
import { Button } from "@material-ui/core";
import { logoutAccount } from "../../Api/User/UserApi";
const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  paper: {
    marginRight: theme.spacing(2),
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    backgroundColor: "#fff",
  },
  itemText: {
    color: "#747b88",
  },
  listIcon: {
    color: "#caceda",
  },
  listItem: {
    "&:hover": {
      "& $itemText": {
        color: "#1988fe",
      },
      "& $listIcon": {
        color: "#1988fe",
      },
    },
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    boxShadow: "0px 0px 10px #bcbcbc",
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    // backgroundColor: "#f4f5f7",
    padding: theme.spacing(3),
  },
  logo: {
    width: "30px",
    marginRight: "0.7rem",
  },
  search: {
    marginLeft: "1rem",
    // marginTop: "rem"
  },
  inputRoot: {
    marginLeft: "0.5rem",
    fontSize: "0.9em",
  },
  grow: {
    flexGrow: 1,
  },
}));

export default function ClonosLayout({ children }) {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [refresh, setrefresh] = React.useState(null);

  const NAVIGATE = useNavigate();
  const loginUserDetails = getUser();

  const dispatch = useDispatch();

  const handleRefresh = () => window.location.reload(false);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
    console.log("handleToggle CLICKED");
    console.log("loginUserDetails", loginUserDetails);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    }
  }

  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  const DRAWER_CONTENTS = [
    {
      name: "Create New User",
      icon: <PersonAddOutlinedIcon />,
    },
    {
      name: "All Users",
      icon: <PeopleOutlineOutlinedIcon />,
    },
    {
      name: "Create New Asset",
      icon: <WebAssetIcon />,
    },
    {
      name: "All Assets",
      icon: <PersonAddOutlinedIcon />,
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
  ];

  const handleNavigation = (navName) => {
    if (navName === "All Users") {
      NAVIGATE("/all-users");
    } else if (navName === "Generate Templates") {
      NAVIGATE("/CreateTemplate");
      //   dispatch(formActions.getformFields([]));
    } else if (navName === "Create New User") {
      NAVIGATE("/create-user");
    } else if (navName === "View Documents") {
      NAVIGATE("/Documents");
    } else if (navName === "View Templates") {
      NAVIGATE("/AllForms");
    } else if (navName === "Scheduler") {
      NAVIGATE("/Scheduler");
    } else if (navName === "Create New Asset") {
      NAVIGATE("/create-asset");
    } else if (navName === "All Assets") {
      NAVIGATE("/all-assets");
    }
  };

  const handleLogout = () => {
    console.log("loginUserDetails", loginUserDetails);
    let data = {
      email: loginUserDetails?.email,
    };
    logoutAccount(data).then((res) => {
      console.log("logoutAccount data", res);
    });
    removeUserSession();
    window.location.reload();
  };

  useEffect(() => {
    // getAllForms().then((res) => dispatch(formActions.getAllForms(res.data)));
  }, []);

  return (
    <>
      {getToken() ? (
        <div className={classes.root}>
          <CssBaseline />
          <AppBar
            // position="fixed"
            // className={classes.appBar}
            position="fixed"
            className={clsx(classes.appBar, {
              [classes.appBarShift]: open,
            })}
          >
            <Toolbar className={classes.toolbarTwo}>
              <div className={classes.grow} />
              <Tooltip title="Home Page">
                <IconButton
                  aria-label="Home Page"
                  onClick={() => NAVIGATE("/landing-page")}
                >
                  <HomeIcon color="primary" />
                </IconButton>
              </Tooltip>
              <Button
                onClick={handleRefresh}
                style={{ margin: "0 1rem" }}
                variant="contained"
                color="primary"
                size="medium"
              >
                Refresh
              </Button>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <IconButton
                  aria-label="show 17 new notifications"
                  color="inherit"
                >
                  <Badge badgeContent={1} color="secondary">
                    <NotificationsIcon style={{ color: "#c3c6cc" }} />
                  </Badge>
                </IconButton>

                <div
                  style={{
                    marginLeft: "2rem",
                    display: "flex",
                    justifyContent: "space-between",
                    cursor: "pointer",
                  }}
                  ref={anchorRef}
                  aria-controls={open ? "menu-list-grow" : undefined}
                  aria-haspopup="true"
                  onClick={handleToggle}
                >
                  <span
                    style={{
                      color: "#bcbcbc",
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
                      color: "gray",
                      position: "relative",
                      top: "0.2rem",
                    }}
                  />
                </div>
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
                            <MenuItem onClick={handleClose}>Profile</MenuItem>
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
            </Toolbar>
          </AppBar>
          <Drawer
            // className={classes.drawer}
            // variant="permanent"
            // classes={{
            //   paper: classes.drawerPaper,
            // }}
            // anchor="left"
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
            <div
              style={{
                padding: "1rem",
                display: "flex",
                alignItems: "center",
                color: "#3F51B5",
                fontSize: "1.1em",
                fontWeight: "bold",
              }}
            >
              <img className={classes.logo} src={LOGO} alt="logo" />
              <span>Admin Dashboard</span>
            </div>
            <List>
              {DRAWER_CONTENTS.map((content, index) => (
                <>
                  <Divider />
                  <ListItem
                    button
                    key={content.name}
                    className={classes.listItem}
                    style={{ padding: "0.8rem 1rem" }}
                    onClick={() => handleNavigation(content.name)}
                  >
                    <ListItemIcon
                      className={classes.listIcon}
                      style={{ marginRight: "-1.4rem" }}
                    >
                      {content.icon}
                    </ListItemIcon>
                    <ListItemText
                      disableTypography
                      primary={
                        <Typography
                          type="body2"
                          style={{ fontSize: "1em", marginTop: "0.3rem" }}
                          className={classes.itemText}
                        >
                          {content.name}
                        </Typography>
                      }
                    />
                  </ListItem>
                </>
              ))}
              <Divider />
            </List>
          </Drawer>
          <main className={classes.content}>
            <div className={classes.toolbar} />
            {children}
          </main>
        </div>
      ) : (
        children
      )}
    </>
  );
}
