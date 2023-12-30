import React, { useState, useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import PersonOutlinedIcon from "@material-ui/icons/PersonOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { createUser, getAllRoles, getAllTeams } from "../../Api/User/UserApi";
import { useNavigate } from "react-router-dom";
import defaultPic from "../../assets/images/default-pic.jpg";
import { Formik } from "formik";
import * as yup from "yup";
import Select from "@material-ui/core/Select";
import PhoneInput from "react-phone-input-2";
import MenuItem from "@material-ui/core/MenuItem";
import {
  getCountryDetails,
  getLocations,
  getDesignations,
} from "../../Api/User/UserApi";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import { commonActions } from "../../Store/Reducers/CommonReducer";
import { useDispatch } from "react-redux";
import { postAuditLog } from "../../Api/User/UserApi";
import LinearProgress from "@material-ui/core/LinearProgress";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { getAllPermissions } from "../../Api/User/UserApi";
import { useSelector } from "react-redux";
import { useContext } from "react";
import { getToken, getUser, handleSegregateURL, loginJumpLoadingStopper, removeUserSession } from "../../utils/clonosCommon";
import { userActions } from "../../Store/Reducers/ClonosUserReducer";
import useToggler from "../../CustomHooks/TogglerHook";
import { UnAuthorizedModal } from "../CommonComponents/UnAuthorizedPage/UnAuthorizedModal";

const useStyles = makeStyles((theme) => ({
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxShadow: "0px 0px 5px #bcbcbc",
    padding: "1rem 2rem",
    backgroundColor: "#fff",
    borderTop: "5px solid #007bfd",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: "#007bfd",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    // backgroundColor: "#007bfd",
    // color: "#fff",
    // "&:hover": {
    //   backgroundColor: "#007bfd",
    //   color: "#fff",
    // },
  },
  cancel: {
    margin: theme.spacing(3, 0, 2),
    // backgroundColor: "red",
    // color: "#fff",
    // "&:hover": {
    //   backgroundColor: "red",
    //   color: "#fff",
    // },
  },
  input: {
    display: "none",
  },
  uploadBtns: {
    // backgroundColor: "#007bfd",
    color: "#fff",
  },
  image: {
    width: "100%",
    height: "100%",
  },
}));

export default function ClonosCreateUser() {
  const user = getUser()
  const classes = useStyles();
  const NAVIGATE = useNavigate();
  const dispatch = useDispatch();
  const [countyCodevalue, setcountyCodevalue] = useState();
  const [countryDetails, setcountryDetails] = useState({});
  const [locations, setlocations] = useState([]);
  const [designations, setdesignations] = useState([]);
  const [stateAndCity, setstateAndCity] = useState("");
  const [stateAndCityValue, setstateAndCityValue] = useState("");
  const allRoles = useSelector(state => state.userData.allRoles);
  const allDepartments = useSelector(state => state.userData.allDepartments)

  const [lsLocalLoading, setIsLocalLoading] = useToggler() // Custom Hook which returns boolean value (initial value : "false")

  useEffect(() => {
    console.log("countyCodevalue", countyCodevalue);
  }, [countyCodevalue]);

  const [newUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    businessUnit: "",
    phone: "",
    state: "",
    designation: "",
    roleId: "",
    avatar: "",
    sign: "",
    adminType: "",
    createdBy: "",
    updatedBy: "",
    department: ""
  });
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  const FILE_SIZE = 1000024;

  const createUserSchema = yup.object().shape({
    first_name: yup.string().required("First name is required"),
    last_name: yup.string().required("Last name is required"),
    email: yup
      .string()
      .email("Enter valid mail ID")
      .required("Email is required"),
    businessUnit: yup.string().required("Business unit is required"),
    phone: yup
      .string()
      .min(12, "Phone number must be 10 numbers")
      .max(12, "Phone number must be 10 numbers")
      .required("Mobile Number is required")
      .matches(phoneRegExp, "Phone number is not valid"),
    state: yup.string().required("State is required"),
    designation: yup.string().required("Designation is required"),
    roleId: yup.string().required("Role is required"),
    department: yup.string().required("Department is required"),
    avatar: yup
      .mixed()
      .required("Please upload image")
      .test(
        "fileSize",
        "File size is too large",
        (value) => !value || (value && value.size <= FILE_SIZE)
      ),
    sign: yup
      .mixed()
      .required("Please upload image")
      .test(
        "fileSize",
        "File size is too large",
        (value) => !value || (value && value.size <= FILE_SIZE)
      ),
    adminType: yup.string().required("User type is required"),
  });

  const [userUpImg, setuserUpImg] = useState({
    tempDisPic: "",
    tempSignPic: "",
  });

  const [emailExistErr, setemailExistErr] = useState(false);
  const [progress, setprogress] = useState({
    show: false,
    percent: 0,
  });

  const [signprogress, setsignprogress] = useState({
    show: false,
    percent: 0,
  });

  const blockInvalidCharInNum = (e) =>
    ["e", "E", "-", "+", "."].includes(e.key) && e.preventDefault();

  const handleCreateUser = (values, { resetForm }) => {
    values["createdBy"] = user?.userId
    console.log("handleCreateUser values", values);
    // dispatch(commonActions.showApiLoader(true));
    let formData = new FormData();
    let error = false;

    Object.keys(values).map((user) => {
      if (user) {
        if (user === "adminType") {
          formData.append(`Is_Admin`, values[user]);
        } else {
          formData.append(`${user}`, values[user]);
        }
      }
      console.log(values, "fromdsad")
    });
    console.log("before", formData)
    createUser(formData).then((res) => {
      console.log("inside then")
      console.log("createUser RESPONSE", res);
      setemailExistErr(false);
      resetForm();
      setuserUpImg({
        tempDisPic: "",
        tempSignPic: "",
      });
      dispatch(
        commonActions.handleSnackbar({
          show: true,
          message: res.data.message,
          type: "success",
        })
      )
      dispatch(commonActions.showApiLoader(false));
      postAuditLog({ action: "Create USer", message: res.data.message });



    })
      .catch((err) => {
        console.log("inside catch")
        if (err.response.data.status === 401 && JSON.parse(localStorage.getItem("loginUser")) !== null) {
          dispatch(commonActions.handleExpiryAlert(true));
          removeUserSession();
          localStorage.removeItem("loginUser")
        } else {
          dispatch(commonActions.showApiLoader(false));
          console.log("createUser ERROR", err.response);
          if (err.response) {
            console.log(err.response.data);

            const error = err.response.data.error;

            if (error === "Validation error: Email already exists") {
              setemailExistErr(true);
              postAuditLog({ action: "Create USer", message: error });
            }
          }
        }
      });
  };

  useEffect(() => {
    getCountryDetails()
      .then((res) => {
        console.log("getCountryDetails res", res);
        setcountryDetails(res?.data);
      })
      .catch((err) => {
        if (err.response.data.status === 401 && JSON.parse(localStorage.getItem("loginUser")) !== null) {
          dispatch(commonActions.handleExpiryAlert(true));
          removeUserSession();
          localStorage.removeItem("loginUser")
        }
      })

    getLocations()
      .then((res) => {
        console.log("getLocations res", res);
        setlocations(res?.data.result);
      })
      .catch((err) => {
        if (err.response.data.status === 401 && JSON.parse(localStorage.getItem("loginUser")) !== null) {
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
        if (err.response.data.status === 401 && JSON.parse(localStorage.getItem("loginUser")) !== null) {
          dispatch(commonActions.handleExpiryAlert(true));
          removeUserSession();
          localStorage.removeItem("loginUser")
        }
      })

    getAllRoles()
      .then((res) => {
        console.log("getRoles res", res.data);
        dispatch(userActions.getAllRoles(res.data.result))
      })
      .catch((err) => {
        if (err.response.data.status === 401 && JSON.parse(localStorage.getItem("loginUser")) !== null) {
          dispatch(commonActions.handleExpiryAlert(true));
          removeUserSession();
          localStorage.removeItem("loginUser")
        }
      })
    getAllTeams()
      .then((res) => {
        console.log("getRoles res", res.data);
        dispatch(userActions.getAllDepartments(res.data.result))
      })
      .catch((err) => {
        if (err.response.data.status === 401 && JSON.parse(localStorage.getItem("loginUser")) !== null) {
          dispatch(commonActions.handleExpiryAlert(true));
          removeUserSession();
          localStorage.removeItem("loginUser")
        }
      })


    return () => { };
  }, []);
  console.log(allRoles, "allRoles")
  const currentPermissionsSelector = useSelector(
    (state) => state.userData.loggedUserPermissions
  );
  const [allpermissions, setallpermissions] = useState([]);


  //   useEffect(() => {
  //   getAllPermissions()
  //   .then((res) => {
  //     console.log("getAllPermissions RESPONSE", res);
  //     setallpermissions(res?.data?.result);
  //   })
  //   .catch((err) => console.log("getAllPermissions ERROR".err));
  // }, []);



  const [handlePermission, sethandlePermission] = useState({});

  useEffect(() => {
    allpermissions?.map((permission) => {
      sethandlePermission((prev,) => ({ ...prev, [`${permission.permissionType}`]: false }));
    });
    currentPermissionsSelector?.map((permission) => {
      sethandlePermission((prev) => ({ ...prev, [`${permission.permissionType}`]: true }));
    });

  }, [allpermissions, currentPermissionsSelector]);



  // temp code

  useEffect(() => {
    let interval = loginJumpLoadingStopper({ setterFunction: setIsLocalLoading, timeout: 5000 })
    return () => {
      clearInterval(interval)
    }
  }, [])


  console.log('lsLocalLoading:', lsLocalLoading)



  if (user?.permissions?.includes("usr001")) {
    return (
      <>
        <Container component="main" maxWidth="sm">
          <CssBaseline />
          <h2 style={{ color: "#3F51B5", textAlign: "center", fontFamily: "calibri" }}>
            <i>Create New User</i>
          </h2>
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <PersonOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Register
            </Typography>
            <Formik
              initialValues={{ ...newUser }}
              validationSchema={createUserSchema}
              onSubmit={handleCreateUser}
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
                  <Grid container spacing={2} style={{ marginTop: "1rem" }}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        variant="outlined"
                        fullWidth
                        id="fName"
                        label="First Name"
                        name="first_name"
                        value={values.first_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {<span style={{ color: "red" }}>{errors.first_name}</span>}
                      <br />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        variant="outlined"
                        fullWidth
                        id="lName"
                        label="Last Name"
                        name="last_name"
                        type="text"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.last_name}
                      />
                      <span style={{ color: "red" }}>{errors.last_name}</span>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        variant="outlined"
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        type="email"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.email}
                      />
                      <span style={{ color: "red" }}>{errors.email}</span>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        autoComplete="bUnit"
                        name="businessUnit"
                        variant="outlined"
                        fullWidth
                        id="businessUnit"
                        label="Business Unit"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.businessUnit}
                      />
                      <span style={{ color: "red" }}>{errors.businessUnit}</span>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <PhoneInput
                        country={`${countryDetails?.country_code?.toLowerCase()}`}
                        onChange={(e) => {
                          setFieldValue("phone", e);
                        }}
                        onBlur={handleBlur}
                        value={values.phone}
                        name="phone"
                        id="phone"
                        style={{ width: "100px !important" }}
                      />

                      <span style={{ color: "red" }}>{errors.phone}</span>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      {/* <FormControl variant="outlined" fullWidth>
                      <InputLabel id="state">City and State</InputLabel>
                      <Select
                        labelId="state"
                        id="state"
                        value={values.state}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        name="state"
                        fullWidth
                        label="City and State"
                        
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
                    </FormControl> */}
                      {/* setFieldValue("state", `${newValue.name_of_city},${newValue.state}`) */}
                      <Autocomplete
                        id="state"
                        value={stateAndCityValue}
                        onChange={(event, newValue) => {
                          console.log("newValue", newValue);
                          setstateAndCityValue(newValue);
                          setFieldValue("state", newValue);
                        }}
                        inputValue={stateAndCity}
                        onInputChange={(event, newInputValue) => {
                          console.log("newInputValue", newInputValue);
                          setstateAndCity(newInputValue);
                        }}
                        // onBlur={handleBlur}
                        name="state"
                        options={locations?.map(
                          (loc) => `${loc.name_of_city},${loc.state}`
                        )}
                        getOptionLabel={(loc) => loc}

                        fullWidth
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="City and State"
                            variant="outlined"
                          />
                        )}
                      />
                      {/* <TextField
                      variant="outlined"
                      fullWidth
                      id="state"
                      label="State"
                      name="state"
                      autoComplete="state"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.state}
                    /> */}
                      <span style={{ color: "red" }}>{errors.state}</span>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl variant="outlined" fullWidth>
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
                      <span style={{ color: "red" }}>{errors.designation}</span>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl variant="outlined" fullWidth>
                        <InputLabel id="roleId-label">
                          Role
                        </InputLabel>
                        <Select
                          labelId="roleId-label"
                          id="roleId"
                          value={values.roleId}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          label="Role"
                          name="roleId"
                        >
                          {allRoles?.map((role) => {
                            return (
                              <MenuItem value={`${role.role_id}`}>
                                {`${role?.roleName?.replace(/_/g, " ").replace(/(\b\w)/g, match => match.toUpperCase())}`}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                      <span style={{ color: "red" }}>{errors.roleId}</span>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl variant="outlined" fullWidth>
                        <InputLabel id="roleId-label">
                          Team
                        </InputLabel>
                        <Select
                          labelId="department-label"
                          id="department"
                          value={values.department}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          label="Department"
                          name="department"
                        >
                          {allDepartments?.map((department) => {
                            return (
                              <MenuItem value={`${department.teamId}`}>
                                {`${department?.teamName?.replace(/_/g, " ").replace(/(\b\w)/g, match => match.toUpperCase())}`}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                      <span style={{ color: "red" }}>{errors.department}</span>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl
                        variant="outlined"
                        // className={classes.formControl}
                        fullWidth
                      >
                        <InputLabel id="adminType-label">User Type</InputLabel>
                        <Select
                          labelId="adminType-label"
                          id="adminType"
                          value={values.adminType}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          label="User Type"
                          name="adminType"
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          <MenuItem value={0}>User</MenuItem>
                          <MenuItem value={1}>Admin</MenuItem>
                        </Select>
                      </FormControl>
                      <span style={{ color: "red" }}>{errors.adminType}</span>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <input
                        accept="image/*"
                        className={classes.input}
                        id="upImg"
                        multiple
                        type="file"
                        onChange={(e) => {
                          setprogress((prev) => ({ ...prev, show: true }));
                          setFieldValue("avatar", e.target.files[0]);
                          setuserUpImg((prev) => ({
                            ...prev,
                            tempDisPic: URL.createObjectURL(e.target.files[0]),
                          }));
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
                        onBlur={handleBlur}
                        name="avatar"
                      //   onChange={(e) => {
                      //     setnewUser((prev) => {
                      //       return { ...prev, avatar: e.target.files[0] };
                      //     });
                      //     setuserUpImg((prev) => ({
                      //       ...prev,
                      //       tempDisPic: URL.createObjectURL(e.target.files[0]),
                      //     }));
                      //     setshwErr((prev) => ({ ...prev, avatar: false }));
                      //   }}
                      />
                      <label htmlFor="upImg">
                        <Button
                          variant="contained"
                          className={classes.uploadBtns}
                          component="span"
                          color="primary"
                          fullWidth
                        >
                          Upload Image
                        </Button>
                      </label>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <input
                        accept="image/*"
                        className={classes.input}
                        id="upSig"
                        multiple
                        type="file"
                        onChange={(e) => {
                          setsignprogress((prev) => ({ ...prev, show: true }));
                          setuserUpImg((prev) => ({
                            ...prev,
                            tempSignPic: URL.createObjectURL(e.target.files[0]),
                          }));
                          setFieldValue("sign", e.target.files[0]);
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
                        onBlur={handleBlur}
                        name="sign"
                      //   onChange={(e) => {
                      //     setuserUpImg((prev) => ({
                      //       ...prev,
                      //       tempSignPic: URL.createObjectURL(e.target.files[0]),
                      //     }));
                      //   }}
                      />
                      <label htmlFor="upSig">
                        <Button
                          variant="contained"
                          className={classes.uploadBtns}
                          color="primary"
                          component="span"
                          fullWidth
                        >
                          Upload Signature
                        </Button>
                      </label>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <div
                        style={{
                          width: "235px",
                          height: "200px",
                          border: "1px solid gray",
                        }}
                      >
                        <img
                          className={classes.image}
                          src={
                            userUpImg?.tempDisPic
                              ? userUpImg.tempDisPic
                              : defaultPic
                          }
                          alt="Profile Image"
                        />

                        <div>
                          <span style={{ fontSize: "10px", color: "gray" }}>
                            1) Please upload passport size photo
                          </span>
                          <br />
                          <span style={{ fontSize: "10px", color: "gray" }}>
                            2) Image should not exceed above 2Mb
                          </span>
                        </div>
                        <span style={{ color: "red" }}>{errors.avatar}</span>
                      </div>
                      {progress.show && (
                        <div style={{ marginTop: "80px" }}>
                          <LinearProgress
                            variant="determinate"
                            value={progress.percent}
                          />
                          <span>Uploading ...</span>
                        </div>
                      )}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <div
                        style={{
                          width: "235px",
                          height: "200px",
                          border: "1px solid gray",
                        }}
                      >
                        <img
                          className={classes.image}
                          src={
                            userUpImg?.tempSignPic
                              ? userUpImg.tempSignPic
                              : defaultPic
                          }
                          alt="Signature"
                        />
                        <div>
                          <span style={{ fontSize: "10px", color: "gray" }}>
                            1) Image should not exceed above 2Mb
                          </span>
                        </div>
                        <span style={{ color: "red" }}>{errors.sign}</span>
                      </div>
                      {signprogress.show && (
                        <div style={{ marginTop: "80px" }}>
                          <LinearProgress
                            variant="determinate"
                            value={signprogress.percent}
                          />
                          <span>Uploading ...</span>
                        </div>
                      )}
                    </Grid>

                    {/* <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox value="allowExtraEmails" color="primary" />
                      }
                      label="Enable to force user to change password at first login"
                      style={{ marginTop: "3rem" }}
                    />
                  </Grid> */}

                    <Grid style={{ marginTop: "10px" }} item xs={6} sm={6} lg={6}>
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                      >
                        Submit
                      </Button>
                    </Grid>
                    <Grid style={{ marginTop: "10px" }} item xs={6} sm={6} lg={6}>
                      <Button
                        type="button"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.cancel}
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
        </Container>
      </>
    );
  }
  {
    return !lsLocalLoading ? <h1 style={{ textAlign: "center" }}>Loading...</h1> :
      <Container component="main" maxWidth="sm">
        <UnAuthorizedModal />
      </Container>
  }
}
