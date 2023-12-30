import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { userActions } from "./Store/Reducers/ClonosUserReducer";
import { allPermissions, getToken } from "./utils/clonosCommon";
import { getAllPermissions } from "./Api/User/UserApi";
import { useSelector, useDispatch } from "react-redux";
// import ClonosLogin from "./components/login/ClonosLogin";
import ClonosPublicRoute from "./utils/ClonosPublicRoute";
import ClonosPrivateRoute from "./utils/ClonosPrivateRoute";
import MuiAlert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
import { makeStyles } from "@material-ui/core/styles";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { commonActions } from "./Store/Reducers/CommonReducer";
import ClonosCreateUser from "./components/user/ClonosCreateUser";
import ClonosAllUsers from "./components/user/ClonosAllUsers";
import ClonosCreateAsset from "./components/asset/ClonosCreateAsset";
import ClonosAllAssets from "./components/asset/ClonosAllAssets";
import { EditAsset } from "./components/ClonosAssets/EditAsset/EditAsset";
import ClonosEditUser from "./components/user/ClonosEditUser";
import { ViewAsset } from "./components/ClonosAssets/ViewAsset/ViewAsset";
import ClonosViewUserDetail from "./components/user/ClonosViewUserDetail";
import AssociatedDocuments from "./components/asset/AssociatedDocuments";
import LandingPage from "./components/views/LandingPage";
import ProfilePage from "./components/views/ProfilePage";
import Documents from "./components/Documents/Documents";
import Engineeringdata from "./components/engineeringData/EngineeringData";
import { logoutAccount } from "./Api/User/UserApi";
import { getUser, removeUserSession } from "./utils/clonosCommon";
import ClonosRolesAndResponsibilities from "./components/user/ClonosRolesAndResponsibilities";
import DummnyPage from "./components/views/DummnyPage";
import EngineeringData from "./components/asset/EngineeringData";
import DynamicForm from "./components/dynamicForms/DynamicForm";
import UnAuthorized from "./components/views/UnAuthorized";
import AllDynamicForms from "./components/dynamicForms/AllDynamicForms";
import AddFormData from "./components/dynamicForms/AddFormData";
import DocumentData from "./components/dynamicForms/DocumentData";
import ViewAllNewCreatedAssets from "./components/asset/ViewAllNewCretedAssets";
import ViewAllNewCreatedUsers from "./components/user/ViewAllNewCreatedUsers";
import { ClonosHierarchicalSequence } from "./components/HierarchicalSequence/ClonosHierarchicalSequence";
import { ClonosApprovalSystem } from "./components/Approval_system/ClonosApprovalSystem";
import { ClonosNotifications } from "./components/Notifications/ClonosNotifications";
import SetupCanvas from "./components/dynamicForms/SetupCanvas";
import CanvasDocumentPrint from "./components/dynamicForms/CanvasDocumentPrint";
import CreateCheckListFormTemplate from "./components/ChecklistForms/CreateCheckListFormTemplate";
import AddChecklistFormData from "./components/ChecklistForms/AddChecklistFormData";
import ViewChecklistFormData from "./components/ChecklistForms/ViewChecklistFormData";
import Cookies from "js-cookie";
import { EditDocumentData } from "./components/asset/EditDocumentData";
import Comments from "./components/Comments/Comments";
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import { AssetRegistatration } from "./components/ClonosAssets/RegisterAsset/AssetRegistration";
import WorkOrder from "./components/WorkOrder/WorkOrder";
import WorkOrderList from "./components/WorkOrder/WorkOrderList";
import WorkOrderView from "./components/WorkOrder/WorkOrderView";
import { AllAssets } from "./components/ClonosAssets/AllAssets";
import WorkOrderEdit from "./components/WorkOrder/WorkOrderEdit";
import CreateDocument from "./components/ClonosDocuments/CreateDocument";
import ListDocuments from "./components/ClonosDocuments/DocumentsList";
import DocumentsList from "./components/ClonosDocuments/DocumentsList";
import { CreateNotification } from "./components/ClonosNotifications/CreateNotification";
import NotificationsList from "./components/ClonosNotifications/NotificationsList";
import Customize from "./components/Customize/Customize";
import UnityWorkOrderList from "./UnityComponents/UnityWorkOrder/UnityWorkOrderList";
import ChecklistCreatePage from "./Clonos_Modules/ChecklistAndReports/ClonosChecklist/ChecklistCreation/ChecklistCreatePage";

import Index from "./ResearchAndDevelopment";

import ChecklistTemplateCreatePage from "./Clonos_Modules/ChecklistAndReports/ClonosChecklist/ChecklistCreation/ChecklistTemplateCreatePage";
import ChecklistListing from "./Clonos_Modules/ChecklistAndReports/ClonosChecklist/ChecklistListing/ChecklistListing";
import ChecklistView from "./Clonos_Modules/ChecklistAndReports/ClonosChecklist/ChecklistView/ChecklistView";
import TasksListing from "./Clonos_Modules/TaskLibrary/TasksListing/TasksListing";
import TasksCreation from "./Clonos_Modules/TaskLibrary/TasksCreation/TasksCreation";
import CreateMaintenanceTask from "./Clonos_Modules/ScheduledMaintenance/CreateMaintenanceTask";
import ViewScheduledMaintenance from "./Clonos_Modules/ScheduledMaintenance/ViewScheduledMaintenance";
// import ClonosLogin from "./components/login/ClonosLogin";
import ClonosLogin from "./Clonos_Modules/Auth/ClonosLogin/ClonosLogin";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  snackbarStyle: {
    backgroundColor: "#eeee",
    fontSize: "18px",
    color: "#242424",
  },
  snackbarPos: {
    marginTop: "50px",
  },
  crossError: {
    fontSize: '100px',
    color: "red"
  },
  errorBox: {
    width: "70%",
    height: "70vh",
    margin: "auto",
    background: "#FFF",
    color: "red",
    borderRadius: "12px",
    textAlign: "center",
    padding: "1em",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  erroText: {
    fontSize: "20px",
    color: "#3f51b5",
    marginTop: "30px"
  }
}));

const ClonosRoutes = () => {
  const loginUserDetails = getUser();
  const { tokenToolkitState } = useSelector(store => store.userData)

  const snackbarSelector = useSelector(
    (state) => state.commonData.showSnackbar
  );
  const showLoader = useSelector((state) => state.commonData.showLoader);
  const showExpiryAlert = useSelector((state) => state.commonData.showExpiryAlert)
  const tokenExpires = Cookies?.get("tokenExpires") ? new Date(JSON.parse(Cookies?.get("tokenExpires"))) : null
  const currentTime = new Date();
  const dispatch = useDispatch();
  const navigate = useNavigate()
  console.log('showExpiryAlert:', showExpiryAlert)

  const handleCloseSnackbar = () => {
    dispatch(
      commonActions.handleSnackbar({
        show: false,
        message: "",
        type: "",
        verticalPosition: "top",
        toastType: "notification",
      })
    );
  };

  const classes = useStyles();

  // useEffect(() => {
  //   window.addEventListener("beforeunload", alertUser);
  //   window.addEventListener("unload", handleTabClosing);
  //   return () => {
  //     window.removeEventListener("beforeunload", alertUser);
  //     window.removeEventListener("unload", handleTabClosing);
  //   };
  // }, []);

  const removePlayerFromGame = () => {
    let data = {
      email: loginUserDetails?.email,
    };
    logoutAccount(data).then((res) => {
      // console.log("logoutAccount data", res);
    });
    removeUserSession();
  };
  const handleTabClosing = () => {
    removePlayerFromGame();
  };

  const alertUser = (event) => {
    // event.preventDefault()
    // console.log("LOGEGEGDGDEGDE");
    // event.returnValue = ''
  };

  useEffect(() => {
    if (getToken()) {
      const loggedUserDetails = getUser();
      getAllPermissions()
        .then((res) => {
          // console.log("allPermissions UTILS RESPONSE", res);
          const loggedPermissions = loggedUserDetails.permissions;
          const allPermissions = res?.data?.result;
          const currentPermissions = allPermissions.filter((o1) =>
            loggedPermissions.some((o2) => o1.permissionId === o2)
          );
          // console.log("currentPermissions", currentPermissions);
          dispatch(userActions.setLoggedUsersPermissions(currentPermissions));
        })
        .catch((err) => {
          console.log("permission error", err)
          // alert("enterd")
          // if(err.response.data.status=== 401 && JSON.parse(localStorage.getItem("loginUser")) !== null){
          //   dispatch(commonActions.handleExpiryAlert(true));
          //   removeUserSession();
          //   localStorage.removeItem("loginUser")
          // }
        });
    }

    // if (tokenToolkitState.length) {
    //   alert("token Hi")
    //   dispatch(commonActions.handleExpiryAlert(false));
    // }

    // alert("routes")
  }, []);

  return (
    <>
      <Routes>
        <Route
          exact
          path="/"
          element={
            <ClonosPublicRoute>
              <ClonosLogin />
            </ClonosPublicRoute>
          }
        />
        <Route
          exact
          path="/landing-page"
          element={
            <ClonosPrivateRoute>
              <LandingPage />
            </ClonosPrivateRoute>
          }
        />
        <Route
          exact
          path="/my-profile"
          element={
            <ClonosPrivateRoute>
              <ProfilePage />
            </ClonosPrivateRoute>
          }
        />
        <Route
          exact
          path="/create-user"
          element={
            <ClonosPrivateRoute>
              {/* {assignedPermissions.user_Create ? <ClonosCreateUser /> : <UnAuthorized />} */}
              <ClonosCreateUser />
            </ClonosPrivateRoute>
          }
        />
        <Route
          exact
          path="/all-users"
          element={
            <ClonosPrivateRoute>
              <ClonosAllUsers />
            </ClonosPrivateRoute>
          }
        />
        <Route
          exact
          path="/view-user"
          element={
            <ClonosPrivateRoute>
              <ClonosViewUserDetail />
            </ClonosPrivateRoute>
          }
        />
        <Route
          exact
          path="/edit-user"
          element={
            <ClonosPrivateRoute>
              <ClonosEditUser />
            </ClonosPrivateRoute>
          }
        />
        <Route
          exact
          path="/create-asset"
          element={
            <ClonosPrivateRoute>
              <AssetRegistatration />
            </ClonosPrivateRoute>
          }
        />
        <Route
          exact
          path="/all-assets"
          element={
            <ClonosPrivateRoute>
              <AllAssets />
            </ClonosPrivateRoute>
          }
        />
        <Route
          exact
          path="/view-asset"
          element={
            <ClonosPrivateRoute>
              <ViewAsset />
            </ClonosPrivateRoute>
          }
        />
        <Route
          exact
          path="/new-created-assets"
          element={
            <ClonosPrivateRoute>
              <ViewAllNewCreatedAssets />
            </ClonosPrivateRoute>
          }
        />
        <Route
          exact
          path="/new-created-users"
          element={
            <ClonosPrivateRoute>
              <ViewAllNewCreatedUsers />
            </ClonosPrivateRoute>
          }
        />
        <Route
          exact
          path="/edit-asset"
          element={
            <ClonosPrivateRoute>
              <EditAsset />
            </ClonosPrivateRoute>
          }
        />
        <Route
          exact
          path="/create-document"
          element={
            <ClonosPrivateRoute>
              <CreateDocument />
            </ClonosPrivateRoute>
          }
        />
        <Route
          exact
          path="/roles-and-permissions"
          element={
            <ClonosPrivateRoute>
              <ClonosRolesAndResponsibilities />
            </ClonosPrivateRoute>
          }
        />
        <Route
          exact
          path="/create-notification"
          element={
            <ClonosPrivateRoute>
              <CreateNotification />
            </ClonosPrivateRoute>
          }
        />
        <Route
          exact
          path="/dummy"
          element={
            <ClonosPrivateRoute>
              <DummnyPage />
            </ClonosPrivateRoute>
          }
        />
        {/* <Route
          exact
          path="/documents"
          element={
            <ClonosPrivateRoute>
              <Documents />
            </ClonosPrivateRoute>
          }
        /> */}
        <Route
          exact
          path="/documents"
          element={
            <ClonosPrivateRoute>
              <DocumentsList />
            </ClonosPrivateRoute>
          }
        />
        <Route
          exact
          path="/edit-document-data"
          element={
            <ClonosPrivateRoute>
              <EditDocumentData />
            </ClonosPrivateRoute>
          }
        />
        <Route
          exact
          path="/document-data"
          element={
            <ClonosPrivateRoute>
              <DocumentData />
            </ClonosPrivateRoute>
          }
        />
        <Route
          exact
          path="/notifications"
          element={
            <ClonosPrivateRoute>
              <ClonosNotifications />
            </ClonosPrivateRoute>
          }
        />
        <Route
          exact
          path="/work-order"
          element={
            <ClonosPrivateRoute>
              <WorkOrder />
            </ClonosPrivateRoute>
          }
        />
        <Route
          exact
          path="/work-order-list"
          element={
            <ClonosPrivateRoute>
              <WorkOrderList />
            </ClonosPrivateRoute>
          }
        />
        <Route
          exact
          path="/work-order-edit"
          element={
            <ClonosPrivateRoute>
              <WorkOrderEdit />
            </ClonosPrivateRoute>
          }
        />
        <Route
          exact
          path="/work-order-view"
          element={
            <ClonosPrivateRoute>
              <WorkOrderView />
            </ClonosPrivateRoute>
          }
        />
        <Route
          exact
          path="/work-order-edit"
          element={
            <ClonosPrivateRoute>
              <WorkOrderEdit />
            </ClonosPrivateRoute>
          }
        />
        <Route
          exact
          path="/notifications-list"
          element={
            <ClonosPrivateRoute>
              <NotificationsList />
            </ClonosPrivateRoute>
          }
        />
        <Route
          exact
          path="/customize"
          element={
            <ClonosPrivateRoute>
              <Customize />
            </ClonosPrivateRoute>
          }
        />
        <Route
          exact
          path="/unity-work-order-list"
          element={
            <ClonosPrivateRoute>
              <UnityWorkOrderList />
            </ClonosPrivateRoute>
          }
        />
        <Route
          exact
          path="/create-checklist-generaldetails"
          element={
            <ClonosPrivateRoute>
              <ChecklistCreatePage />
            </ClonosPrivateRoute>
          }
        />
        <Route
          exact
          path="/edit-checklist-generaldetails"
          element={
            <ClonosPrivateRoute>
              <ChecklistCreatePage mode={"edit"} />
            </ClonosPrivateRoute>
          }
        />
        <Route
          exact
          path="/create-checklist-template"
          element={
            <ClonosPrivateRoute>
              <ChecklistTemplateCreatePage />
            </ClonosPrivateRoute>
          }
        />
        <Route
          exact
          path="/edit-checklist-template"
          element={
            <ClonosPrivateRoute>
              <ChecklistTemplateCreatePage />
            </ClonosPrivateRoute>
          }
        />
        <Route
          exact
          path="/checklist-listing"
          element={
            <ClonosPrivateRoute>
              <ChecklistListing />
            </ClonosPrivateRoute>
          }
        />
        <Route
          exact
          path="/checklist-view"
          element={
            <ClonosPrivateRoute>
              <ChecklistView />
            </ClonosPrivateRoute>
          }
        />
        <Route
          exact
          path="/r-and-d"
          element={
            <ClonosPrivateRoute>
              <Index />
            </ClonosPrivateRoute>
          }
        />
        <Route
          exact
          path="/tasks-library"
          element={
            <ClonosPrivateRoute>
              <TasksListing />
            </ClonosPrivateRoute>
          }
        />
        <Route
          exact
          path="/create-task"
          element={
            <ClonosPrivateRoute>
              <TasksCreation />
            </ClonosPrivateRoute>
          }
        />
        <Route
          exact
          path="/edit-task"
          element={
            <ClonosPrivateRoute>
              <TasksCreation mode={"edit"}/>
            </ClonosPrivateRoute>
          }
        />
        <Route
          exact
          path="/create-maintenanceTask"
          element={
            <ClonosPrivateRoute>
              <CreateMaintenanceTask />
            </ClonosPrivateRoute>
          }
        />
        <Route
          exact
          path="/view-maintenanceTask"
          element={
            <ClonosPrivateRoute>
              <ViewScheduledMaintenance />
            </ClonosPrivateRoute>
          }
        />
      </Routes>
      <Snackbar
        anchorOrigin={{
          vertical: snackbarSelector.verticalPosition || "bottom",
          horizontal: "right",
        }}
        open={snackbarSelector.show}
        className={classes.snackbarPos}
        autoHideDuration={snackbarSelector?.closeIn || 3000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSelector.type === "success" ? "success" : "error"}
          className={snackbarSelector.toastType && classes.snackbarStyle}
        >
          {snackbarSelector.message}
        </Alert>
      </Snackbar>
      {showExpiryAlert ? <Backdrop className={classes.backdrop} open={showExpiryAlert}>
        <div className={classes.errorBox}>
          <div>
            <div style={{ textAlign: "center" }}>
              <CancelOutlinedIcon className={classes.crossError} />
            </div>
            <h1>{tokenExpires?.getTime() < currentTime.getTime() ? "Your session expired !" : "Found login from another device"}</h1>
            <div>
              <p className={classes.erroText}>Please <span style={{ color: "red", cursor: "pointer" }} onClick={() => {
                removeUserSession();
                localStorage.removeItem("loginUser")
                dispatch(commonActions.handleExpiryAlert(false));
                // window.location.reload();
                navigate("/")
              }}>Login</span> again to create new Session</p>
            </div>
          </div>
        </div>
      </Backdrop> : <></>}
      <Backdrop className={classes.backdrop} open={showLoader}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default ClonosRoutes;
