import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ClonosConfirmationDialog(props) {
 
  useEffect(() => {
    console.log("opened",props.Open)
  },[props.Open])

  return (
    <div>
      <Dialog
        open={props.Open}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => props.CloseDialog()}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">{props.Title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {props.Content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
          onClick={() => props.CloseDialog()}
           color="primary">
            No
          </Button>
          <Button variant='contained' 
          onClick={() => props.ProceedDialog()} 
          color="secondary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
