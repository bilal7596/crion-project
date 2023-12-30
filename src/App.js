import "./App.css";
import ClonosRoutes from "./Routes";
import ClonosLayout from "./components/Layout/ClonosLayout";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { userActions } from "./Store/Reducers/ClonosUserReducer";
import 'typeface-roboto'
import { handleGetRemainingWidthAndHeightOfBody, updateLayout } from "./utils/clonosCommon";
import { getToken, handleDecryptData, handleMakePromiseFullfilled, handleSegregateURL, handleSessionForUnity } from "./utils/clonosCommon";

function App() {
  const currentPermissionsSelector = useSelector(
    (state) => state.userData.loggedUserPermissions
  );

  const refreshApp = useSelector(
    (state) => state.commonData.refreshApp
  );
  // const { tokenToolkitState } = useSelector(store => store.userData)
  const dispatch = useDispatch();

  useEffect(() => {
    updateLayout({ dispatch })
    const updatedPermissions = currentPermissionsSelector?.map((permission) => {
      return {
        [`${permission.permissionType}`]: true
      }
    });

    dispatch(userActions.setAssignedPermissions(updatedPermissions))
  }, [currentPermissionsSelector]);




  let URL = handleSegregateURL()
  if (!getToken() && URL?.unity) {  // Here we are doing login jump and setting the login session for running the app.
    handleMakePromiseFullfilled({ dispatch })
  }



  return (
    <>
        {
          URL?.unity ? <ClonosRoutes Refresh={refreshApp} />
            :
            <ClonosLayout>
              <ClonosRoutes Refresh={refreshApp} />
            </ClonosLayout>
        }
    </>
  );
}

export default App;
