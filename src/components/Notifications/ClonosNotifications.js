import {
  Button,
  Grid,
  IconButton,
  TablePagination,
  Tooltip,
} from "@material-ui/core";
import { CloseOutlined, DateRange } from "@material-ui/icons";
import { useCallback, useContext, useEffect, useState } from "react";
import { CheckPicker, DateRangePicker, SelectPicker } from "rsuite";
import {
  getFilteredNotifications,
  getSkippedNotifications,
  getUnReadNotifications,
  updateSingleNotification,
} from "../../Api/Notification/Notification";
import { getUser, removeUserSession } from "../../utils/clonosCommon";
import NotificationsActiveIcon from "@material-ui/icons/NotificationsActive";
import { useRef } from "react";
import { commonActions } from "../../Store/Reducers/CommonReducer";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { postAssetFilters } from "../../Api/Asset/assetApi";
import { postUserFilters } from "../../Api/User/UserApi";
import { getEngineeringDataOfAsset } from "../../Api/EngineeringData/engineeringData";
import DoneAllIcon from "@material-ui/icons/DoneAll";
export const ClonosNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadIds,setUnreadIds] = useState([]);
  const [skippedIds,setSkippedIds] = useState([])
  const [notificationType, setNotificationType] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [calendarVal, setcalendarVal] = useState([null, null]);
  const [inputUserName, setInputUserName] = useState("");
  const [inputTitle, setInputTitle] = useState("");
  const loggedUser = getUser();
  const selectPickerRef = useRef(null);
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const NAVIGATE = useNavigate();
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const types = [
    { label: "Read Notifications", value: "readNotifications" },
    { label: "Skipped Notifications", value: "skippedNotifications" },
    { label: "UnRead Notifications", value: "unreadNotifications" },
  ];
  const [filterPayload, setFilterPayload] = useState({
    unreadNotifications: true,
    readNotifications: true,
    skippedNotifications: true,
    startDate: "",
    endDate: "",
    userName: "",
    title: "",
  });
  const debounce = (func) => {
    console.log("insode debounce");
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
    console.log(type);
    if (type === "Username") {
      setFilterPayload({ ...filterPayload, userName: value });
    } else if (type === "Title") {
      setFilterPayload({ ...filterPayload, title: value });
    }
  };
  const handleSearch = useCallback(debounce(filtersHelper), []);

  const handleDatechange = (value) => {
    console.log(value, "value");
    if (value) {
      // setCurrentPage(1);
      const data = {
        startDate: value[0],
        endDate: value[1],
      };
      let prev_date = new Date(value[0]);
      let next_date = new Date(value[1]);
      prev_date.setHours(prev_date.getHours() + 5);
      prev_date.setMinutes(prev_date.getMinutes() + 30);
      next_date.setHours(next_date.getHours() + 5);
      next_date.setMinutes(next_date.getMinutes() + 30);
      data.startDate = prev_date;
      data.endDate = next_date;
      console.log(data);
      setcalendarVal([data.startDate, data.endDate]);
      setFilterPayload({
        ...filterPayload,
        startDate: data.startDate,
        endDate: data.endDate,
      });
      // getFilteredNotifications(loggedUser.userId, filterPayload).then((res) => {
      //   setNotifications(res?.data?.notifications);
      // });
    }
  };

  // PAGINATION____________________________________

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(0);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  console.log(notifications, "notifications ..............");
  const visibleNotifications = notifications?.slice(startIndex, endIndex);

  const totalPages = Math.ceil(notifications?.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClearFilters = () => {
    setFilterPayload({
      unreadNotifications: true,
      readNotifications: true,
      skippedNotifications: true,
      startDate: "",
      endDate: "",
      userName: "",
      title: "",
    });
    setInputTitle("");
    setInputUserName("");
    selectPickerRef.current.value = "";
  };

  // Bulk Creation Dailog __________________________________________________

  const [showBulkDailog, setShowBulkDailog] = useState(false);
  const [bulkCreatedData, setBulkCreatedData] = useState([]);
  const [bulkCreationType, setBulkCreationType] = useState("");
  const handleBulkDailog = () => {
    setShowBulkDailog(false);
  };

  const handleReadNotification = (id, assetId, userId, type, changeIn) => {
    if (visibleNotifications.length === 1 && currentPage != 1) {
      setCurrentPage(currentPage - 1);
    }
    // setDrawerSide("right",false)
    updateSingleNotification({
      notificationId: id,
      action: "read",
      userId: loggedUser?.userId,
    }).then(() => {
      getUnReadNotifications(loggedUser?.userId)
        .then((res) => {
          setNotifications(res?.data?.unreadNotifications);
          // setNotificationsCount(res?.data?.unreadNotifications.length);
          // dispatch(
          //   commonActions.handleSnackbar({
          //     show: false,
          //     message: `You have ${notifications.length} Notifications`,
          //     type: "success",
          //     verticalPosition: "top",
          //     toastType: "notification",
          //   })
          // );
        }).catch((err) => {
          if(err.response.data.status=== 401 && JSON.parse(localStorage.getItem("loginUser")) !== null){
            dispatch(commonActions.handleExpiryAlert(true));
            removeUserSession();
            localStorage.removeItem("loginUser")
          }
        })
        .then((res) => {
          // setDrawerSide({ right: false });

          if (type === "New asset added" || type === "Asset updated") {
            postAssetFilters({ assetId }).then((res) => {
              console.log("ress", res);
              NAVIGATE("/view-asset", { state: res?.data?.assets[0] });
            }).catch((err) => {
              if(err.response.data.status=== 401 && JSON.parse(localStorage.getItem("loginUser")) !== null){
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
              console.log(res.data.users[0]);
              NAVIGATE("/view-user", { state: res?.data?.users[0] });
            }).catch((err) => {
              if(err.response.data.status=== 401 && JSON.parse(localStorage.getItem("loginUser")) !== null){
                dispatch(commonActions.handleExpiryAlert(true));
                removeUserSession();
                localStorage.removeItem("loginUser")
              }
            })
          } else if (type === "Engineering Data updated") {
            getEngineeringDataOfAsset(assetId).then((res) => {
              console.log(res.data);
              NAVIGATE("/engineering-data", { state: res?.data?.result });
            }).catch((err) => {
              if(err.response.data.status=== 401 && JSON.parse(localStorage.getItem("loginUser")) !== null){
                dispatch(commonActions.handleExpiryAlert(true));
                removeUserSession();
                localStorage.removeItem("loginUser")
              }
            })
          } else if (type === "New assets added") {
            console.log(changeIn, "from bulk assets");
            const bulkAssets = changeIn?.assetId;
            setShowBulkDailog(true);
            setBulkCreationType(type);
            setBulkCreatedData(bulkAssets);
          } else if (type === "New users added") {
            console.log("clickerdddd", "<<<<<<<<<<<<<<<<<<<<<<<");
            const bulkUsers = changeIn?.userId;
            setShowBulkDailog(true);
            setBulkCreationType(type);
            setBulkCreatedData(bulkUsers);
            console.log("bulkUsers RESPONSE", bulkUsers);
          }
        });
    }).catch((err) => {
      if(err.response.data.status=== 401 && JSON.parse(localStorage.getItem("loginUser")) !== null){
        dispatch(commonActions.handleExpiryAlert(true));
        removeUserSession();
        localStorage.removeItem("loginUser")
      }
    })
  };




  useEffect(() => {
    getFilteredNotifications(loggedUser.userId, filterPayload).then((res) => {
      setNotifications(res?.data?.notifications);
    }).catch((err) => {
      if(err.response.data.status=== 401 && JSON.parse(localStorage.getItem("loginUser")) !== null){
        dispatch(commonActions.handleExpiryAlert(true));
        removeUserSession();
        localStorage.removeItem("loginUser")
      }
    })
  }, [filterPayload]);

  useEffect(() => {
    if (selectedTypes.length) {
      setFilterPayload({
        ...filterPayload,
        unreadNotifications: selectedTypes.includes("unreadNotifications"),
        readNotifications: selectedTypes.includes("readNotifications"),
        skippedNotifications: selectedTypes.includes("skippedNotifications"),
      });
    } else {
      setFilterPayload({
        ...filterPayload,
        unreadNotifications: true,
        readNotifications: true,
        skippedNotifications: true,
      });
    }
  }, [selectedTypes]);
  console.log("selectedTypes", skippedIds);
  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 30px",
          marginBottom: "30px",
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
            <NotificationsActiveIcon color="#3F51B5" fontSize="large" />
          </div>
          <h2 style={{ color: "#3F51B5", fontFamily: "calibri" }}>
            <i>Notifications</i>
          </h2>
        </div>
        {/* <div>
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
        </div> */}
      </div>
      <Grid
        container
        style={{
          width: "80%",
          margin: "auto auto 30px auto",
          display: "flex",
          alignItems: "center",
          gridGap: "20px",
        }}
      >
        <Grid>
          <CheckPicker
            label="FilterBy"
            data={types.map((type) => ({
              label: type.label,
              value: type.value,
            }))}
            style={{ width: "200px" }}
            onClean={() => {
              setFilterPayload({
                ...filterPayload,
                unreadNotifications: true,
                skippedNotifications: true,
                readNotifications: true,
              });
            }}
            ref={selectPickerRef}
            // onChange={(value) => {
            //   setNotificationType(value);
            //   if(value === "readNotifications"){
            //     setFilterPayload({...filterPayload,readNotifications:true,skippedNotifications:false,unreadNotifications:false})
            //   } else if(value === "skippedNotifications"){
            //     setFilterPayload({...filterPayload,readNotifications:false,skippedNotifications:true,unreadNotifications:false})
            //   }
            // }}
            onChange={(val) => {
              console.log(val);
              setSelectedTypes(val);
            }}
            value={selectedTypes}
          />
        </Grid>
        <Grid
          style={{ display: "flex", gridGap: "10px", alignItems: "center" }}
        >
          <p>Date : </p>
          <DateRangePicker
            value={[filterPayload.startDate, filterPayload.endDate]}
            onChange={handleDatechange}
            onClean={() => {
              setcalendarVal([null, null]);
            }}
            format="dd-MM-yyyy "
            placeholder="dd-mm-yyyy"
            cleanable
          />
        </Grid>
        <Grid
          style={{ display: "flex", gridGap: "10px", alignItems: "center" }}
        >
          <p>Search By</p>
          <input
            onChange={(e) => {
              setInputUserName(e.target.value);
              handleSearch(e.target.value, e.target.placeholder);
            }}
            placeholder="Username"
            value={inputUserName}
          />
        </Grid>
        <Grid
          style={{ display: "flex", gridGap: "10px", alignItems: "center" }}
        >
          <p>Search By</p>
          <input
            onChange={(e) => {
              setInputTitle(e.target.value);
              handleSearch(e.target.value, e.target.placeholder);
            }}
            placeholder="Title"
            value={inputTitle}
          />
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
      </Grid>
      <Grid
        container
        style={{
          width: "80%",
          margin: "auto",
          display: "flex",
          flexDirection: "column",
          gridGap: "10px",
        }}
      >
        {notifications.length ? (
          notifications
            ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((notification, index) => {
              const title = notification?.title?.includes("asset added")
                ? `${notification?.userName} has created a new asset : ${
                    notification?.changeIn?.assetName || "ASSET"
                  }`
                : notification.title === "Asset updated"
                ? `${notification.userName} has updated an asset:  ${notification.changeIn.assetName}`
                : notification?.title?.includes("asset deleted")
                ? `${notification?.userName} has deleted an asset : ${notification?.changeIn?.assetName}`
                : notification?.title === "Engineering data deleted"
                ? `${notification?.userName} has deleted a field of   ${notification?.changeIn?.assetName}`
                : notification?.title === "Engineering Data added"
                ? `${notification?.userName} has added a new field to : ${notification?.changeIn?.assetName}`
                : notification?.title === "Engineering Data updated"
                ? `${notification?.userName} has updated field : ${notification?.changeIn.fieldName[0]}
            `
                : notification?.title === "Role assigned"
                ? `${notification.userName} has assigned a new role to ${notification.changeIn.userName}`
                : notification.title === "User status updated"
                ? `${notification.userName} has updated status of ${notification.changeIn.userName}`
                : notification.title === "User updated"
                ? `${notification.userName} has updated ${notification.changeIn.userName}`
                : notification?.title === "Permissions assigned"
                ? `${notification.userName} has assigned permissions to ${notification.changeIn.userName}`
                : notification?.title === "New assets added"
                ? `${notification.userName} has created ${notification?.changeIn?.assetId?.length} assets`
                : notification?.title === "New users added"
                ? `${notification.userName} has created ${notification?.changeIn?.userId?.length} users`
                : notification?.title === "Document deleted"
                ? `${notification.userName} has deleted a document : ${notification?.changeIn?.docName[0]} `
                : notification?.title === "New user created"
                ? `${notification.userName} has created a user : ${notification?.changeIn?.userName} `
                : "";
              let createdDate = new Date(notification.createdDate);
              createdDate.setHours(createdDate.getHours() + 5);
              createdDate.setMinutes(createdDate.getMinutes() + 35);
              const isoDateStringWithHours = createdDate.toISOString();
              let [date, time] = isoDateStringWithHours.split("T");
              let [year, month, day] = date.split("-");
              let hhmmss = time.split(".")[0];
              let [hh, mm, ss] = hhmmss.split(":");
              return (
                <div
                  key={index + 1}
                  style={{
                    display: "flex",
                    gridGap: "20px",
                    padding: "10px",
                    alignItems: "center",
                    border: "1px solid #dcdcdc",
                    borderRadius: "6px",
                    width: "100%",
                    justifyContent: "space-between",
                    background:`${unreadIds.includes(notification._id) ? "#03C988" : "#dcdcdc"}`
                  }}
                >
                  <div
                    style={{
                      display: "flex",

                      alignItems: "center",
                      gridGap: "1em",
                      cursor:"pointer"
                    }}
                    onClick={() => {
                      if(unreadIds.includes(notification._id)){
                        handleReadNotification(
                          notification._id,
                          notification.changeIn.assetId,
                          notification.changeIn.userId,
                          notification.title,
                          notification.changeIn
                        )
                      }
                    }}
                  >
                    <div>
                      <NotificationsActiveIcon fontSize="large" />
                    </div>
                    <div>
                      <p style={{ fontSize: "16px", fontWeight: "600" }}>
                        {title}
                        {" on "} {day}
                        {"/"}
                        {month}
                        {"/"}
                        {year}-{hh}
                        {":"}
                        {mm}
                        {":"}
                        {ss}
                      </p>
                    </div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gridGap:"1em"}}>
                    {/* {unreadIds.includes(notification._id) ?  <Tooltip title="Mark  as read">
                      <IconButton
                        aria-label="mark  as read"
                        onClick={() =>
                          
                        } 
                        style={{
                          color: "black",
                          background: "#CCC",
                          borderRadius: "50%",
                        }}
                      >
                        <DoneAllIcon />
                      </IconButton>
                    </Tooltip> : <></>} */}
                    {unreadIds.includes(notification._id) ?<Tooltip title="Skip">
                      <IconButton
                        aria-label="skip"
                        onClick={(event) => {
                          event.stopPropagation();
                          updateSingleNotification({
                            notificationId: notification?._id,
                            action: "skip",
                            userId: loggedUser?.userId,
                          }).then(() => {
                            getUnReadNotifications(loggedUser?.userId).then(
                              (res) => {
                                setNotifications(
                                  res?.data?.unreadNotifications
                                );
                                // setNotificationsCount(
                                //   res?.data?.unreadNotifications.length
                                // );
                                dispatch(
                                  commonActions.handleSnackbar({
                                    show: false,
                                    message: ``,
                                    type: "",
                                    verticalPosition: "top",
                                    toastType: "notification",
                                  })
                                );
                              }
                            ).catch((err) => {
                              if(err.response.data.status=== 401 && JSON.parse(localStorage.getItem("loginUser")) !== null){
                                dispatch(commonActions.handleExpiryAlert(true));
                                removeUserSession();
                                localStorage.removeItem("loginUser")
                              }
                            })
                          }).catch((err) => {
                            if(err.response.data.status=== 401 && JSON.parse(localStorage.getItem("loginUser")) !== null){
                              dispatch(commonActions.handleExpiryAlert(true));
                              removeUserSession();
                              localStorage.removeItem("loginUser")
                            }
                          })
                        }}
                        style={{
                          color: "black",
                          background: "#CCC",
                          borderRadius: "50%",
                        }}
                      >
                        <CloseOutlined fontSize="medium" color="secondary" />
                      </IconButton>
                    </Tooltip>:<></>}
                  </div>
                </div>
              );
            })
        ) : (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <h3>No Notifications Found!</h3>
          </div>
        )}
      </Grid>
      <Grid style={{ width: "80%", margin: "auto", paddingTop: "20px" }}>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={notifications?.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Grid>
      <Grid style={{display:"flex",justifyContent:"flex-end",width: "80%", margin: "auto"}}>
        <Grid>
        <div style={{display:"flex",gridGap:"10px",alignItems:"center"}}>
          <div style={{height:"10px",width:"10px",background:"#03C988"}}></div>
          <h4 style={{fontSize:"14px"}}>unRead  Notifications</h4>
        </div>
        <div style={{display:"flex",gridGap:"10px",alignItems:"center"}}>
          <div style={{height:"10px",width:"10px",background:"#dcdcdc"}}></div>
          <h4 style={{fontSize:"14px"}}>  Skipped or Read Notifications </h4>
        </div>
        </Grid>
      </Grid>
    </>
  );
};
