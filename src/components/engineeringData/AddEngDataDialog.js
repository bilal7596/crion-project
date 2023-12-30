import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Grid, TextField } from "@material-ui/core";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import DeleteIcon from "@material-ui/icons/Delete";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import { createNewEngFields } from "../../Api/EngineeringData/engineeringData";
import { useDispatch, useSelector } from "react-redux";
import { commonActions } from "../../Store/Reducers/CommonReducer";
import { getUser, removeUserSession } from "../../utils/clonosCommon";
import { useContext } from "react";

export default function AddEngDataDialog(props) {
  const user = getUser();
  const dispatch = useDispatch();
  const assetData = useSelector((state) => state.assetData.assetDetailEngData);
  const [addedEngData, setaddedEngData] = useState([
    {
      assetId: props.SelectedAsset?.assetId || assetData?.assetId,
      fieldName: "",
      fieldValue: "",
      fieldType: "text",
      createdBy: "",
    },
  ]);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleAddIcon = () => {
    setaddedEngData((prev) => [
      ...prev,
      {
        assetId: assetData.assetId,
        fieldName: "",
        fieldValue: "",
        fieldType: "text",
        createdBy: "",
      },
    ]);
  };
  const handleFieldNameChange = (e, index) => {
    const cloned = addedEngData?.map((a) => ({ ...a }));
    cloned[index].fieldName = e.target.value;
    setaddedEngData(cloned);
  };
  const handleFieldValueChange = (e, index) => {
    const cloned = addedEngData?.map((a) => ({ ...a }));
    cloned[index].fieldValue = e.target.value;
    setaddedEngData(cloned);
  };
  const handleDeleteField = (field, index) => {
    const filtered = addedEngData?.filter((obj, i) => {
      return index !== i;
    });

    setaddedEngData(filtered);
  };

  const HandleAddNewFields = () => {
    console.log("HandleAddNewFields addedEngData", addedEngData);
    console.log("assetData", assetData);
    addedEngData[0].createdBy = user?.userId;
    createNewEngFields(addedEngData)
      .then((res) => {
        console.log("createNewEngFields RESPONSE", res);
        dispatch(commonActions.showApiLoader(false));
        dispatch(
          commonActions.handleSnackbar({
            show: true,
            message: res.data.message,
            type: "success",
          })
        );

        props.HandleClose();
        setaddedEngData([{
          assetId: assetData.assetId,
          fieldName: "",
          fieldValue: "",
          fieldType: "text",
        }])
      })
      .catch((err) => {
        if(err.response.data.status=== 401 && JSON.parse(localStorage.getItem("loginUser")) !== null){
          dispatch(commonActions.handleExpiryAlert(true));
          removeUserSession();
          localStorage.removeItem("loginUser")
        } else {
          console.log("createNewEngFields ERROR", err);
          dispatch(commonActions.showApiLoader(false));
          dispatch(
            commonActions.handleSnackbar({
              show: true,
              message: err.data.message,
              type: "error",
            })
          );
          props.HandleClose();  
        }
      });
  };

  useEffect(() => {
    console.log(addedEngData);
  }, [addedEngData]);

  return (
    <div>
      <Dialog
        open={props.Open}
        onClose={props.HandleClose}
        fullScreen={fullScreen}
        aria-labelledby="responsive-dialog-title"
        minWidth={"sm"}
        maxWidth={"sm"}
      >
        <DialogTitle id="alert-dialog-title">
          {"Create Engineering Data"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {addedEngData?.map((data, index) => {
              return (
                <Grid container>
                  <Grid item lg={4} style={{ marginRight: "20px" }}>
                    <TextField
                      label="Field Name"
                      value={data.fieldName}
                      name={data.fieldName}
                      onChange={(e) => handleFieldNameChange(e, index)}
                    />
                  </Grid>
                  <Grid item lg={4} style={{ marginRight: "20px" }}>
                    <TextField
                      label="Field Value"
                      value={data.fieldValue}
                      name={data.fieldValue}
                      onChange={(e) => handleFieldValueChange(e, index)}
                    />
                  </Grid>
                  <Grid item lg={2}>
                    <Tooltip title="Delete Field">
                      <IconButton
                        aria-label="delete"
                        onClick={() => handleDeleteField(data, index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                </Grid>
              );
            })}
            <Tooltip title="Add Field">
              <IconButton aria-label="add" onClick={() => handleAddIcon()}>
                <AddCircleOutlineIcon style={{ color: "#3f51b5" }} />
              </IconButton>
            </Tooltip>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.HandleClose} color="primary" autoFocus>
            Close
          </Button>
          <Button onClick={HandleAddNewFields} color="primary" autoFocus>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
