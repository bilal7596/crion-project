import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import LOGO from "../../assets/images/logo.png";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as yup from "yup";
import {
  getUserPermissions,
  loginUser,
  postAuditLog,
} from "../../Api/User/UserApi";
import { dummyEncryptionToken, setUserSession } from "../../utils/clonosCommon";
import { commonActions } from "../../Store/Reducers/CommonReducer";
// import bcrypt from 'bcryptjs'

import clsx from "clsx";
import IconButton from "@material-ui/core/IconButton";
import Input from "@material-ui/core/Input";
import FilledInput from "@material-ui/core/FilledInput";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import CryptoJS from "crypto-js";
import { userActions } from "../../Store/Reducers/ClonosUserReducer";
import { getUnReadNotifications } from "../../Api/Notification/Notification";
import { notificationActions } from "../../Store/Reducers/ClonosNotificationsReducer";

const useStyles = makeStyles((theme) => ({
  gridOne: {
    textAlign: "center",
    padding: "25% 0",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  gridTwo: {
    padding: "3.5rem 2rem",
  },
  input: {
    width: "100%",
    margin: "0.5rem 0",
    backgroundColor: "#f2f2f2",
    border: "none",
    outline: "none",
    padding: "1rem",
    borderRadius: "20px",
    "&:focus": {
      border: "none",
      outline: "none",
      backgroundColor: "#ededed",
    },
  },
  label: {
    fontWeight: "600",
  },
  inputIcon: {
    color: "#007bfd",
    position: "absolute",
    top: "1rem",
  },
  submit: {
    width: "100%",
    backgroundColor: "#007bfd",
    border: "none",
    color: "#fff",
    padding: "1rem",
    // borderRadius: "20px",
    cursor: "pointer",
    fontWeight: "600",
    marginTop: "1rem",
  },
  forgotPass: {
    fontSize: "0.8em",
    textAlign: "center",
    color: "#a0abb8",
    textDecoration: "underline",
    cursor: "pointer",
    fontWeight: "600",
  },
  logo: {
    width: "100px",
  },
  // textField: {
  //   width: "49ch",
  // },
}));

const ClonosLogin = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const NAVIGATE = useNavigate();
  // var salt = bcrypt.genSaltSync(10);
  const [showPass, setshowPass] = useState(false);
  const handleClickShowPassword = () => {
    setshowPass((prev) => !prev);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const [loginDetails] = useState({
    email: "",
    password: "",
  });

  const loginSchema = yup.object().shape({
    email: yup
      .string()
      .email("Enter valid mail ID")
      .required("Email is required"),
    password: yup.string().required("Password is required"),
  });

  const handleLogin = (values) => {
    console.log("loginDetails values", values);

    // var encryptedPassword = CryptoJS.AES.encrypt(
    //   values.password,
    //   "clonos"
    // ).toString();

    const parsedkey = CryptoJS.enc.Utf8.parse("clonoskeyunity3D");
    const encrypted = CryptoJS.AES.encrypt(values.password, parsedkey, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    const encryptedPassword = encrypted.toString();

    const data = {
      email: values.email,
      password: encryptedPassword,
    };

    console.log("data", data);

    loginUser(data)
      .then((res) => {
        console.log("loginDetails API RESPONSE", res);
        // getUserPermissions({userId:res.data.userDetails.userId,token :res.data.token})
        //   .then((response) => {
        //     console.log("getUserPermissions RESPONSE", response);

        //   })
        // getUnReadNotifications(res?.data?.userDetails.userId,res?.data?.token).then(() => {
        //   dispatch(notificationActions.setUnReadNotificationsCount(res.data.unReadNotifications.length))
        // })
        setUserSession(
          res.data.token,
          res.data.refreshToken,
          res.data.userDetails,
          data.email,
          res?.data?.userDetails
        );
        dispatch(userActions.getUserData(res?.data?.userDetails));
        localStorage.setItem("loginUser", JSON.stringify(res?.data?.userDetails))


        // Temp code
        let lcToken = dummyEncryptionToken({ token: res?.data?.token })
        let lcRefreshToken = dummyEncryptionToken({ token: res?.data?.refreshToken })
        localStorage.setItem("lcCred", `unity-work-order-list?unity=1&token=${lcToken}&refreshToken=${lcRefreshToken}`)

        postAuditLog({ action: "Login", message: "Login Successfully" });
        getUnReadNotifications(res.data.userDetails?.userId)
          .then((res) => {
            console.log("api called", res);
            // setNotifications(res?.data?.unreadNotifications);
            // setNotificationsCount(res?.data?.unreadNotifications.length);
            dispatch(notificationActions.setUnReadNotificationsCount(res?.data?.unreadNotifications.length));
          })
          .catch((err) => {
            console.log("error", err);
          });
        NAVIGATE("/landing-page");
        // .catch((error) => {
        //   console.log("getUserPermissions ERROR", error);
        // });
      })
      .catch((err) => {
        console.log("loginDetails API ERROR", err);
        if (err.response) {
          console.log(err.response.data);
          const error = err.response.data.error;
          if (error === "No account exist for this email") {
            dispatch(
              commonActions.handleSnackbar({
                show: true,
                message: err.response.data.error,
                type: "error",
              })
            );
            postAuditLog({ action: "Login", message: err.response.data.error });
          } else if (
            error ===
            "Wrong password. Try again or click Forgot password to reset it."
          ) {
            dispatch(
              commonActions.handleSnackbar({
                show: true,
                message: err.response.data.error,
                type: "error",
              })
            );
            postAuditLog({ action: "Login", message: err.response.data.error });
          } else if (error === "Invalid Email Format.") {
            dispatch(
              commonActions.handleSnackbar({
                show: true,
                message: err.response.data.error,
                type: "error",
              })
            );
            postAuditLog({ action: "Login", message: err.response.data.error });
          }
        }
      });
  };

  return (
    <>
      <div className="loginBg">
        <div className="loginBox">
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <div className={classes.gridOne}>
                <img className={classes.logo} src={LOGO} alt="LOGO" />
                <h2
                  style={{
                    color: "#2b4e86",
                    letterSpacing: "2px",
                    fontSize: "2rem",
                  }}
                >
                  Welcome to CLONOS
                </h2>
              </div>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <div className={classes.gridTwo}>
                <h2 style={{ textAlign: "center" }}>Login</h2>
                <Formik
                  initialValues={{ ...loginDetails }}
                  validationSchema={loginSchema}
                  onSubmit={handleLogin}
                >
                  {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                  }) => (
                    <form onSubmit={handleSubmit}>
                      <div className="custom_force_style"><TextField
                        id="email-basic"
                        label="Email"
                        variant="outlined"
                        fullWidth
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        style={{ margin: "0.5rem 0" }}
                      /></div>
                      <span style={{ color: "red" }}>{errors.email}</span>
                      {/* <label className={classes.label} htmlFor="email">
                        Email
                      </label>
                      <br />
                      <input
                        id="email"
                        type={"email"}
                        placeholder={`Email`}
                        className={classes.input}
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      ></input>
                      <span style={{ color: "red" }}>{errors.email}</span>
                      <br /> */}
                      {/* <label className={classes.label} htmlFor="password">
                        Password
                      </label>
                      <br /> */}
                      {/* <input
                        id="password"
                        type={"password"}
                        placeholder={`Password`}
                        className={classes.input}
                        name="password"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.password}
                      />
                      <span style={{ color: "red" }}>{errors.password}</span>
                      <br /> */}
                      <div className="custom_force_style">
                      <FormControl
                        className={clsx(classes.margin, classes.textField)}
                        variant="outlined"
                        style={{ margin: "0.5rem 0" }}
                        fullWidth
                      >
                        <InputLabel htmlFor="outlined-adornment-password">
                          Password
                        </InputLabel>
                        <OutlinedInput
                          id="outlined-adornment-password"
                          type={showPass ? "text" : "password"}
                          value={values.password}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          name="password"
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                              >
                                {showPass ? <Visibility /> : <VisibilityOff />}
                              </IconButton>
                            </InputAdornment>
                          }
                          labelWidth={70}
                        />
                        <span style={{ color: "red" }}>{errors.password}</span>
                      </FormControl>
                      </div>
                      <button className={classes.submit} type="submit">
                        Login
                      </button>
                    </form>
                  )}
                </Formik>
                {/* <p
                  className={classes.forgotPass}
                  onClick={() => NAVIGATE("/ForgotPassword")}
                >
                  Forgot Password ?
                </p> */}
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
    </>
  );
};

export { loginUser }
export default ClonosLogin;
