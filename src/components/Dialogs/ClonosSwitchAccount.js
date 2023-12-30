import * as React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { changeAccountStatus,postAuditLog } from '../../Api/User/UserApi';
import { removeUserSession } from '../../utils/clonosCommon';
import { commonActions } from '../../Store/Reducers/CommonReducer';
import { useDispatch } from 'react-redux';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


export default function AccountActionDialog(props) {
  const dispatch = useDispatch()
  const submit = () => {
    // if(props.Action=="Active"){
    //     props.value.isActive = 1
    // }
    // if(props.Action=="Inactive") {
    //     props.value.isActive = 0
    // }
    // props.HandleClose()
    const data = {
        email: props.rowValue.email,
        isActive: props.value ? 1 : 0
    }
    changeAccountStatus(data).then((res) => {
        console.log("changeAccountStatus RESPONSE",res);
        props.HandleClose()
        postAuditLog({action: `Change Account Status for ${props.rowValue.email}`, message: `Successfully changed account status to ${props.value ? "Active" : "Inactive"}` })
        
    }).catch((err) => {
      if(err.response.data.status=== 401 && JSON.parse(localStorage.getItem("loginUser")) !== null){
        dispatch(commonActions.handleExpiryAlert(true));
        removeUserSession();
        localStorage.removeItem("loginUser")
      }
    })
    console.log("props.value", props.value);
  }

  return (
    <div>
     
      <Dialog
        open={props.Show}
        onClose={props.HandleClose}
        TransitionComponent={Transition}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`${props.Action} account`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          {`Are you sure you want to ${props.Action} this account?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.HandleClose}>No</Button>
          <Button onClick={submit} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}