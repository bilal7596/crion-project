import React from 'react';
import { Navigate  } from 'react-router-dom';
import { getToken } from './clonosCommon';
 
// handle the public routes
function ClonosPublicRoute({ children }) {
  return !getToken() ? children : <Navigate  to={{ pathname: '/landing-page' }} />
}
 
export default ClonosPublicRoute;