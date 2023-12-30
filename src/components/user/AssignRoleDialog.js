import React, { useContext, useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Checkbox, FormControlLabel } from "@material-ui/core";
import { Grid } from "rsuite";
import { assignRole, getAllPermissions } from "../../Api/User/UserApi";
import { useDispatch } from "react-redux";
import { commonActions } from "../../Store/Reducers/CommonReducer";
import { getUser, removeUserSession } from "../../utils/clonosCommon";
export default function AssignRoleDialog({
  openDialog,
  closeDialog,
  selectedRole,
  assignData,
}) {
  const user = getUser()
  const [allPermissions, setallPermissions] = useState([]);
  const [checkedPermissions, setcheckedPermissions] = useState([]);
  const DISPATCH = useDispatch();

  const handleCheckPermissions = (selectedRole) => {
    const clonedPermissions = allPermissions?.map((item) => ({ ...item }));
    const selectedPermissions = selectedRole?.permissionsArray;

    console.log("selectedPermissions", selectedPermissions);
    console.log("clonedPermissions", clonedPermissions);

    const result = [];

    clonedPermissions?.forEach((item1) => {
      const item2 = selectedPermissions?.find(
        (item2) => item1.permissionId === item2
      );
      if (item2) {
        result.push({ ...item1, checked: true });
      } else {
        result.push({ ...item1, checked: false });
      }
    });

    setcheckedPermissions(result);
  };

  // useEffect(() => {
  //   getAllPermissions()
  //     .then((res) => {
  //       console.log("AssignRoleDialog -> getAllUserPermissions RESPOSNE", res);
  //       setallPermissions(res?.data?.result);
  //     })
  //     .catch((err) =>
  //       console.log("AssignRoleDialog -> getAllUserPermissions ERROR", err)
  //     );
  // }, []);

  useEffect(() => {
    handleCheckPermissions(selectedRole);
  }, [selectedRole]);

  const handlePermissionChange = (event, permissionId) => {
    const clonedPermissions = checkedPermissions?.map((item) => ({ ...item }));

    const result = clonedPermissions?.map((item) => {
      if (item.permissionId === permissionId) {
        item.checked = event.target.checked;
      }
      return item;
    });
    setcheckedPermissions(result);
  };

  const handleAssignRole = () => {
    


    let result = []

    checkedPermissions?.forEach((item) => {
        if(item.checked) {
            result.push(item.permissionId)
        }
    })

    const data = {
      ...assignData,
      permissionsArray: result,
    };

    console.log("handleAssignRole assignData", assignData);

    assignRole(data)
      .then((res) => {
        console.log("assignRole RESPONSE", res);
        DISPATCH(
          commonActions.handleSnackbar({
            show: true,
            message: "Role Assigned Successfully",
            type: "success",
          })
        );

        closeDialog();
      })
      .catch((err) => {
        if(err.response.data.status=== 401 && JSON.parse(localStorage.getItem("loginUser")) !== null){
          DISPATCH(commonActions.handleExpiryAlert(true));
          removeUserSession();
          localStorage.removeItem("loginUser")
        } else {
          console.log("assignRole ERROR", err);
          DISPATCH(
            commonActions.handleSnackbar({
              show: true,
              message: `${err.response.data.message}`,
              type: "error",
            })
          );
          closeDialog();
        }
      });
  };

  return (
    <div>
      <Dialog
        open={openDialog}
        onClose={closeDialog}
        aria-labelledby="assign-role-dialog-title"
        aria-describedby="assign-role-dialog-description"
      >
        <DialogTitle id="assign-role">Assign Role</DialogTitle>
        <DialogContent>
          <DialogContentText id="assign-role-dialog-description">
            By default these are the permissions will be assign for this role.
            You can modify and save the permissions.
          </DialogContentText>
          <div>
            <Grid container>
              {checkedPermissions?.map((item) => {
                return (
                  <Grid item lg={3} key={item.permissionId}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={item.checked}
                          onChange={(e) =>
                            handlePermissionChange(e, item.permissionId)
                          }
                          name={item.permissionType}
                          color="primary"
                        />
                      }
                      label={item.description}
                    />
                  </Grid>
                );
              })}
            </Grid>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleAssignRole()} color="primary" autoFocus>
            Assign
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
