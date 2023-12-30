import { makeStyles } from "@material-ui/core";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { TextField } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import { Grid } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { editUser, getAllTeams, getAllRoles } from "../../Api/User/UserApi";
import * as yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import InputLabel from "@material-ui/core/InputLabel";
import { Formik } from "formik";
import { commonActions } from "../../Store/Reducers/CommonReducer";
import { useDispatch } from "react-redux";
import { postAuditLog } from "../../Api/User/UserApi";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { getLocations, getDesignations } from "../../Api/User/UserApi";
import defaultPic from "../../assets/images/default-pic.jpg";
import LinearProgress from "@material-ui/core/LinearProgress";
import { getUser, removeUserSession } from "../../utils/clonosCommon";
import { useContext } from "react";
import { userActions } from "../../Store/Reducers/ClonosUserReducer";

const useStyles = makeStyles((theme) => ({
  input: {
    margin: "1rem 0",
  },
  labelRoot: {
    textTransform: "capitalize",
  },
  button: {
    backgroundColor: "#3f51b5",
    color: "#fff",
    padding: "0.5rem 2rem",
    fontWeight: "600",
    border: "none",
    cursor: "pointer",
    width: "90%",
  },
  cancel: {
    // backgroundColor: "red",
    // color: "#fff",
    // "&:hover": {
    //   backgroundColor: "red",
    //   color: "#fff",
    // },
  },
  image: {
    width: "180px",
    height: "150px",
    boxShadow: "0px 0px 3px gray",
  },
  file: {
    display: "none",
  },
  icon: {
    position: "absolute",
    right: "0.5rem",
    top: "-1rem",
    backgroundColor: "#bcbcbc",
  },
}));

const ClonosEditUser = () => {
  // const userDetailsSelector = useSelector((state) => state.userData.userDetail);
  const LOCATION = useLocation();
  const user = getUser()
  const [userDetailsSelector, setuserDetailsSelector] = useState(
    LOCATION?.state
  );
  const classes = useStyles();
  const NAVIGATE = useNavigate();
  const dispatch = useDispatch();
  const allRoles = useSelector(state => state.userData.allRoles);
  const allTeams = useSelector(state => state.userData.allDepartments)
  const [locations, setlocations] = useState([]);
  const [designations, setdesignations] = useState([]);
  console.log(userDetailsSelector, "**********");
  const [editUserDetails] = useState({
    email: userDetailsSelector.email ? userDetailsSelector.email : "",
    first_name: userDetailsSelector.first_name
      ? userDetailsSelector.first_name
      : "",
    last_name: userDetailsSelector.last_name
      ? userDetailsSelector.last_name
      : "",
    phone: userDetailsSelector.phone ? userDetailsSelector.phone : "",
    state: userDetailsSelector.state ? userDetailsSelector.state : "",
    designation: userDetailsSelector.designation
      ? userDetailsSelector.designation
      : "",
     role: userDetailsSelector.roleName
     ? userDetailsSelector.roleName
     : "",
     team: userDetailsSelector.team
     ? userDetailsSelector.team
     : "",
    businessUnit: userDetailsSelector.businessUnit
      ? userDetailsSelector.businessUnit
      : "",
    Is_Admin: userDetailsSelector.Is_Admin ? userDetailsSelector.Is_Admin : 0,
    // avatar: userDetailsSelector.avatar ? userDetailsSelector.avatar : "",
    displaypic: userDetailsSelector.displaypic
      ? userDetailsSelector.displaypic
      : "",
    signature: userDetailsSelector.signature
      ? userDetailsSelector.signature
      : "",
  });
  const [progress, setprogress] = useState({
    show: false,
    percent: 0,
  });

  const [signprogress, setsignprogress] = useState({
    show: false,
    percent: 0,
  });
  console.log("editUserDetails: ", editUserDetails);

  const [editUserUpImg, seteditUserUpImg] = useState({
    displaypic: userDetailsSelector.displaypic
      ? userDetailsSelector.displaypic
      : "",
    signature: userDetailsSelector.signature
      ? userDetailsSelector.signature
      : "",
    tempDisPic: userDetailsSelector.displaypic
      ? userDetailsSelector.displaypic
      : "",
    tempSignPic: userDetailsSelector.signature
      ? userDetailsSelector.signature
      : "",
  });

  const createUserSchema = yup.object().shape({
    email: yup.string().required("Email is required"),
    first_name: yup.string().required("First name is required"),
    last_name: yup.string().required("Last name is required"),
    phone: yup
      .string()
      .min(12, "Phone number must be 10 numbers")
      .max(12, "Phone number must be 10 numbers")
      .required("Phone number is required"),
    state: yup.string().required("State is required"),
    designation: yup.string().required("Designation is required!"),
    businessUnit: yup.string().required("Business Unit is required!"),
    Is_Admin: yup.string().required("User type is required!"),
    displaypic: yup.mixed().required("Please upload image"),

    // signature: yup.mixed().required("Please upload image"),
  });

  console.log("userDetailsSelector", userDetailsSelector);

  const handleUpdateUser = (values, { resetForm }) => {
    console.log(values,"valeeee")
    dispatch(commonActions.showApiLoader(true));
    values["updatedBy"] = user?.userId
    console.log("editUserDetails", values);

    let formData = new FormData();

    Object.keys(values).map((user) => {
      if (user == "displaypic" || user == "signature") return;
      formData.append(`${user}`, `${values[user]}`);
    });

    formData.append("avatar", values.displaypic);
    if(values.signature) {
      formData.append("sign", values.signature);
    }
    

    // console.log("editUserUpImg", editUserUpImg);

    for (var pair of formData.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }

    editUser(formData)
      .then((res) => {
        console.log("editUser RESPONSE", res);
        resetForm();
        postAuditLog({ action: "Edit User", message: res.data.message });
        dispatch(commonActions.showApiLoader(false));
        dispatch(
          commonActions.handleSnackbar({
            show: true,
            message: "User updated successfully",
            type: "success",
          })
        );

        NAVIGATE("/all-users");
      })
      .catch((err) => {
        if(err.response.data.status=== 401 && JSON.parse(localStorage.getItem("loginUser")) !== null){
          dispatch(commonActions.handleExpiryAlert(true));
          removeUserSession();
          localStorage.removeItem("loginUser")
        } else {
          dispatch(commonActions.showApiLoader(false));
          console.log("editUser ERROR", err);
          if (err.response) {
            console.log(err.response.data);
  
            const error = err.response.data.error;
            postAuditLog({ action: "Create USer", message: error });
          }
        }
      });
  };
console.log(editUserDetails,"resposda")
  useEffect(() => {
    getLocations()
      .then((res) => {
        console.log("getLocations res", res);
        setlocations(res?.data.result);
      })
      .catch((err) => {
        if(err.response.data.status=== 401 && JSON.parse(localStorage.getItem("loginUser")) !== null){
          dispatch(commonActions.handleExpiryAlert(true));
          removeUserSession();
          localStorage.removeItem("loginUser")
        }
      })

    getDesignations()
      .then((res) => {
        console.log("getDesignations res", res);
        setdesignations(res?.data.result);
      })
      .catch((err) => {
        if(err.response.data.status=== 401 && JSON.parse(localStorage.getItem("loginUser")) !== null){
          dispatch(commonActions.handleExpiryAlert(true));
          removeUserSession();
          localStorage.removeItem("loginUser")
        }
      })
    getAllRoles().then((res) => {
      dispatch(userActions.getAllRoles(res.data.result))
    })
    getAllTeams().then((res) => {
      dispatch(userActions.getAllDepartments(res.data.result))
    })  
    return () => {};
  }, []);

  return (
    <>
      <h1 style={{ textAlign: "center", color: "#3F51B5" }}>Edit User</h1>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div className="editUserBox">
          <Formik
            initialValues={{ ...editUserDetails }}
            validationSchema={createUserSchema}
            onSubmit={handleUpdateUser}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldValue,
            }) => (
              <form onSubmit={handleSubmit}>
                <Grid container>
                  {Object.keys(editUserDetails).map((detail) => {
                    console.log("detail",detail);
                    if (detail == "Is_Admin") {
                      // console.log("detail*****",editUserDetails[detail]);
                      return (
                        <FormControl
                          variant="outlined"
                          fullWidth
                          className={classes.input}
                        >
                          <InputLabel id="Is_Admin-label">Is_Admin</InputLabel>
                          <Select
                            labelId="Is_Admin-label"
                            id="Is_Admin"
                            value={values.Is_Admin}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label="Is_Admin"
                            name="Is_Admin"
                            defaultValue={editUserDetails[detail]}
                          >
                            <MenuItem value={""}>
                              <em>None</em>
                            </MenuItem>
                            <MenuItem value={0}>User</MenuItem>
                            <MenuItem value={1}>Admin</MenuItem>
                          </Select>
                          <span style={{ color: "red" }}>
                            {errors[`${detail}`]}
                          </span>
                        </FormControl>
                      );
                    }
                    if (detail == "displaypic" || detail == "signature") {
                      // console.log("detail*****",editUserDetails[detail]);
                      return null;
                    }
                    if (detail === "designation") {
                      return (
                        <FormControl
                          variant="outlined"
                          className={classes.input}
                          fullWidth
                        >
                          <InputLabel id="designation-label">
                            Designation
                          </InputLabel>
                          <Select
                            labelId="designation-label"
                            id="designation"
                            value={values.designation}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label="Designation"
                            name="designation"
                          >
                            {designations?.map((des) => {
                              return (
                                <MenuItem value={`${des.designation}`}>
                                  {`${des.designation}`}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                      );
                    } 
                    if (detail === "role") {
                      return (
                        <FormControl
                          variant="outlined"
                          className={classes.input}
                          fullWidth
                        >
                          <InputLabel id="role-label">
                            Role
                          </InputLabel>
                          <Select
                            labelId="role-label"
                            id="role"
                            value={values.role}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label="Role"
                            name="role"
                          >
                            {allRoles?.map((role) => {
                              return (
                                <MenuItem value={`${role.roleName}`}>
                                  {`${role?.roleName?.replace(/_/g, " ").replace(/(\b\w)/g, match => match.toUpperCase())}`}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                      );
                    }
                    if (detail === "team") {
                      return (
                        <FormControl
                          variant="outlined"
                          className={classes.input}
                          fullWidth
                        >
                          <InputLabel id="team-label">
                            Team
                          </InputLabel>
                          <Select
                            labelId="team-label"
                            id="team"
                            value={values.team}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label="Team"
                            name="team"
                          >
                            {allTeams?.map((team) => {
                              return (
                                <MenuItem value={`${team.teamId}`}>
                                  {`${team.teamName}`}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                      );
                    }
                    if (detail === "state") {
                      return (
                        <FormControl
                          variant="outlined"
                          fullWidth
                          className={classes.input}
                        >
                          <InputLabel id="state-label">State</InputLabel>
                          <Select
                            labelId="state-label"
                            id="state"
                            value={values.state}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label="State"
                            name="state"
                            defaultValue={editUserDetails[detail]}
                          >
                            {locations?.map((loc) => {
                              return (
                                <MenuItem
                                  value={`${loc.name_of_city},${loc.state}`}
                                >
                                  {`${loc.name_of_city},${loc.state}`}
                                </MenuItem>
                              );
                            })}
                          </Select>
                          <span style={{ color: "red" }}>
                            {errors[`${detail}`]}
                          </span>
                        </FormControl>
                      );
                    }
                    return (
                      <>
                        <TextField
                          variant="outlined"
                          fullWidth
                          // required
                          id={detail}
                          label={detail}
                          name={detail}
                          className={classes.input}
                          // defaultValue={editAssetDetails[detail]}
                          disabled={detail === "email" ? true : false}
                          value={values[`${detail}`]}
                          InputLabelProps={{
                            classes: {
                              root: classes.labelRoot,
                            },
                          }}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <span style={{ color: "red" }}>
                          {errors[`${detail}`]}
                        </span>
                      </>
                    );
                  })}

                  <Grid
                    item
                    xs={12}
                    lg={12}
                    style={{ position: "relative", maxWidth: "50%" }}
                  >
                    <input
                      accept="image/png"
                      className={classes.file}
                      id="displayPic-button-file"
                      type="file"
                      onChange={(e) => {
                        setprogress((prev) => ({ ...prev, show: true }));
                        setFieldValue("displaypic", e.target.files[0]);
                        seteditUserUpImg((prev) => {
                          return {
                            ...prev,
                            displaypic: e.target.files[0],
                            tempDisPic: URL.createObjectURL(e.target.files[0]),
                          };
                        });
                        const reader = new FileReader();
                        reader.addEventListener("progress", (event) => {
                          const percent = Math.round(
                            (event.loaded / event.total) * 100
                          );
                          console.log("percent", percent);
                          setprogress((prev) => ({
                            ...prev,
                            percent: percent,
                          }));
                          if (percent === 100) {
                            setTimeout(
                              () =>
                                setprogress((prev) => ({
                                  ...prev,
                                  show: false,
                                })),
                              1000
                            );
                          }
                        });

                        reader.addEventListener("load", (event) =>
                          console.log("event.target.result", event)
                        );

                        reader.readAsBinaryString(e.target.files[0]);
                      }}
                    />
                    <label htmlFor="displayPic-button-file">
                      <IconButton
                        color="primary"
                        aria-label="upload picture"
                        component="span"
                        className={classes.icon}
                      >
                        <PhotoCamera />
                      </IconButton>
                    </label>

                    <img
                      className={classes.image}
                      src={
                        editUserUpImg.tempDisPic
                          ? editUserUpImg.tempDisPic
                          : defaultPic
                      }
                      alt="profile Image"
                    />
                    <span style={{ color: "red" }}>{errors[`displaypic`]}</span>
                    {progress.show && (
                      <div style={{ marginTop: "10px" }}>
                        <LinearProgress
                          variant="determinate"
                          value={progress.percent}
                        />
                        <span>Uploading ...</span>
                      </div>
                    )}
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    lg={6}
                    style={{ position: "relative", maxWidth: "50%" }}
                  >
                    <input
                      accept="image/png"
                      className={classes.file}
                      id="signPic-button-file"
                      type="file"
                      onChange={(e) => {
                        setsignprogress((prev) => ({ ...prev, show: true }));
                        setFieldValue("signature", e.target.files[0]);
                        seteditUserUpImg((prev) => {
                          return {
                            ...prev,
                            signature: e.target.files[0],
                            tempSignPic: URL.createObjectURL(e.target.files[0]),
                          };
                        });
                        const reader = new FileReader();
                        reader.addEventListener("progress", (event) => {
                          const percent = Math.round(
                            (event.loaded / event.total) * 100
                          );
                          console.log("percent", percent);
                          setsignprogress((prev) => ({
                            ...prev,
                            percent: percent,
                          }));
                          if (percent === 100) {
                            setTimeout(
                              () =>
                                setsignprogress((prev) => ({
                                  ...prev,
                                  show: false,
                                })),
                              1000
                            );
                          }
                        });

                        reader.addEventListener("load", (event) =>
                          console.log("event.target.result", event)
                        );

                        reader.readAsBinaryString(e.target.files[0]);
                      }}
                    />
                    <label htmlFor="signPic-button-file">
                      <IconButton
                        color="primary"
                        aria-label="upload picture"
                        component="span"
                        className={classes.icon}
                      >
                        <PhotoCamera />
                      </IconButton>
                    </label>

                    <img
                      className={classes.image}
                      src={
                        editUserUpImg.tempSignPic
                          ? editUserUpImg.tempSignPic
                          : defaultPic
                      }
                      alt="Sign Image"
                    />
                    <span style={{ color: "red" }}>{errors[`signature`]}</span>
                    {signprogress.show && (
                      <div style={{ marginTop: "10px" }}>
                        <LinearProgress
                          variant="determinate"
                          value={signprogress.percent}
                        />
                        <span>Uploading ...</span>
                      </div>
                    )}
                  </Grid>

                  <Grid item xs={6} sm={6} lg={6} style={{ marginTop: "2rem" }}>
                    <input
                      type={"submit"}
                      onSubmit={handleSubmit}
                      className={classes.button}
                    />
                  </Grid>
                  <Grid item xs={6} sm={6} lg={6} style={{ marginTop: "2rem" }}>
                    <Button
                      type="button"
                      fullWidth
                      variant="contained"
                      className={classes.cancel}
                      color="primary"
                      onClick={() => NAVIGATE(-1)}
                    >
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default ClonosEditUser;
