import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import WarningIcon from "@material-ui/icons/Warning";
import ErrorIcon from "@material-ui/icons/Error";
import WbIncandescentIcon from "@material-ui/icons/WbIncandescent";
import { Link } from "react-router-dom";
import Styles from "../../ModuleStyles/Dialogs/ClonosErrorAndWarning.module.css";

// ["error", "warning", "suggestion"];

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    borderRadius: 10,
    height: 200,
    width: 400,
  },
}));

export default function ClonosErrorAndWarningDialog({
  status,
  title,
  header,
  navigator,
  wantToNavigate,
}) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (status) setOpen(true);
  }, [status]);


  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        // onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <div className={Styles.heading}>
              <h2
                // id="transition-modal-title"
                style={{
                  color:
                    header == "warning"
                      ? "#F0A901"
                      : header == "suggestion"
                      ? "#3F51B5"
                      : "red",
                }}
              >
                {header == "warning" ? (
                  <WarningIcon fontSize="large" />
                ) : header == "error" ? (
                  <ErrorIcon fontSize="large" />
                ) : (
                  <WbIncandescentIcon fontSize="large" />
                )}
              </h2>
            </div>
            <div className={Styles.content}>
              <h4 id="transition-modal-description" style={{ color: "gray" }}>
                {title}
              </h4>
            </div>
            <div className={Styles.navigation}>
              {wantToNavigate && (
                <Link className="std_btn" to={`/${navigator}`}>
                  Create
                </Link>
              )}
              <Link className="std_btn" to={-1}>
                Back
              </Link>
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
