import { Navigate } from 'react-router-dom';
import { getToken, handleDecryptData, handleSegregateURL, handleSessionForUnity } from './clonosCommon';
import { useEffect } from 'react';
import { userActions } from "../Store/Reducers/ClonosUserReducer"
import { useDispatch, useSelector } from 'react-redux';

// handle the private routes
function ClonosPrivateRoute({ children }) {
  const { tokenToolkitState } = useSelector(store => store.userData)
  const dispatch = useDispatch()



  // let currentURL = window.location.href
  let URL = handleSegregateURL()
  // console.log('URL:', URL)

  // const handleMakePromiseFullfilled = async () => {
  //   try {
  //     let decryptedToken = await handleDecryptData({ encryptedData: URL["token"], key: "clonoskeyunity3D" })
  //     console.log('decryptedToken:', decryptedToken)
  //     let decryptedRefreshToken = await handleDecryptData({ encryptedData: URL["refreshToken"], key: "clonoskeyunity3D" })
  //     if (decryptedRefreshToken.length && decryptedToken.length) {
  //       dispatch(userActions.setTokenMethod({ decryptedToken, decryptedRefreshToken }))
  //       handleSessionForUnity({ "token": decryptedToken, "refreshToken": decryptedRefreshToken })
  //     }
  //   } catch (err) {
  //     console.log('err:', err)
  //   }
  // }

  // if (!getToken()) {
  //   handleMakePromiseFullfilled()
  // }


  // return getToken() && children
  return getToken() || URL?.unity ? children : <Navigate to={{ pathname: '/' }} />
}

export default ClonosPrivateRoute;