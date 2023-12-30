import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import { useSelector } from "react-redux";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import { FaCrown } from "react-icons/fa";
import { MdVerifiedUser } from "react-icons/md";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
    backgroundColor: "#007bfd",
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon style={{ color: "#fff" }} />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: "0",
    backgroundColor: "#fff",
    marginTop: "-2rem",
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
    backgroundColor: "#fff",
    padding: "1rem",
  },
}))(MuiDialogActions);

export default function ClonosUserDetailsDialog(props) {
  const userDetail = useSelector((state) => state.userData.userDetail);

  console.log("userDetail MODAL", userDetail);

  return (
    <div>
      <Dialog
        onClose={props.HandleClose()}
        aria-labelledby="customized-dialog-title"
        open={props.HandleOpen}
        fullWidth={true}
        maxWidth={"sm"}
      >
        <DialogTitle id="customized-dialog-title" onClose={props.HandleClose()}>
          <p
            style={{
              textAlign: "center",
              margin: 0,
              padding: 0,
              fontWeight: "bold",
              padding: "1rem 0",
            }}
          ></p>
        </DialogTitle>
        <DialogContent>
          <div
            style={{
              backgroundColor: "#007bfd",
              padding: "1rem 2rem",
            }}
          >
            <Grid container>
              <Grid item lg={4}>
                <Avatar
                  alt="Remy Sharp"
                  src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                  style={{ width: "150px", height: "150px" }}
                />
              </Grid>
              <Grid item lg={8} style={{ color: "#fff" }}>
                <Typography
                  style={{
                    textTransform: "uppercase",
                    marginTop: "1rem",
                    letterSpacing: "5px",
                    fontSize: "1.8em",
                  }}
                >
                  {userDetail !== {} && userDetail.name}
                </Typography>
                <Typography style={{ fontSize: "0.9em", marginLeft: "0.3rem" }}>
                  {userDetail !== {} && userDetail.email}
                </Typography>
                <p style={{ margin: "0.3rem 0 0 0.3rem" }}>
                  <MdVerifiedUser
                    style={{ color: "#6de03a", fontSize: "1.2em" }}
                  />
                  <span
                    style={{
                      position: "relative",
                      top: "-0.3rem",
                      left: "0.3rem",
                    }}
                  >
                    {userDetail !== {} && userDetail.designation}
                  </span>
                </p>
              </Grid>
            </Grid>
          </div>
          {/* <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "0 3rem",
              margin: "0 0 1rem",
            }}
          >
            <Typography>Name: </Typography>

            <Typography>{userDetail !== {} && userDetail.name}</Typography>
          </div> */}
          {/* <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "0 3rem",
              margin: "0 0 1rem",
            }}
          >
            <Typography>Email: </Typography>

            <Typography>{userDetail !== {} && userDetail.email}</Typography>
          </div> */}
          {/* <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "0 3rem",
              margin: "0 0 1rem",
            }}
          >
            <Typography>Role: </Typography>

            <Typography>
              {userDetail !== {} && userDetail.designation}
            </Typography>
          </div> */}

          <div style={{padding: "2rem 1rem"}}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "0 3rem",
                margin: "0 0 1rem",
              }}
            >
              <Typography>Business Unit: </Typography>

              <Typography>
                {userDetail !== {} && userDetail.businessUnit}
              </Typography>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "0 3rem",
                margin: "0 0 1rem",
              }}
            >
              <Typography>Mobile: </Typography>

              <Typography>{userDetail !== {} && userDetail.phone}</Typography>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "0 3rem",
                margin: "0 0 1rem",
              }}
            >
              <Typography>State: </Typography>

              <Typography>{userDetail !== {} && userDetail.state}</Typography>
            </div>
            <div style={{padding: "0 3rem"}}>
            <Typography style={{fontWeight: "bold"}}>Signature: </Typography>
              <img style={{width: "100%",height: "150px",marginTop: "0.2rem"}} src="https://www.kindpng.com/picc/m/444-4442230_c-signatures-hd-png-download.png" alt="Signature" />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            style={{
              color: "#fff",
              backgroundColor: "#007bfd",
              fontWeight: "600",
              padding: "0.5rem 2rem",
            }}
            autoFocus
            onClick={props.HandleClose()}
            color="primary"
          >
            Okay
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
