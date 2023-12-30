import React, { useState, useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import DeleteIcon from "@material-ui/icons/Delete";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { createAsset, getAssetTypes } from "../../Api/Asset/assetApi";
import { useNavigate } from "react-router-dom";
import defaultPic from "../../assets/images/default-pic.jpg";
import Tooltip from "@material-ui/core/Tooltip";
import { Formik } from "formik";
import * as yup from "yup";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import { commonActions } from "../../Store/Reducers/CommonReducer";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, postAuditLog } from "../../Api/User/UserApi";
import LinearProgress from "@material-ui/core/LinearProgress";
import { getAllPermissions } from "../../Api/User/UserApi";
import { useContext } from "react";
import { getUser, removeUserSession } from "../../utils/clonosCommon";

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
  },
  cancel: {
    margin: theme.spacing(3, 0, 2),
  },
  input: {
    display: "none",
  },
  uploadBtns: {
    width: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  fab: {
    margin: theme.spacing(1),
    fontSize: "1em",
  },
}));

export default function ClonosCreateUser() {
  const classes = useStyles();
  const USER_DETAILS = getUser();
  const NAVIGATE = useNavigate();
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("loginUser"))
  const [openNewAttrMenu, setopenNewAttrMenu] = React.useState(false);
  const showLoader = useSelector((state) => state.commonData.showLoader);
  const anchorRef = React.useRef(null);
  const [progress, setprogress] = useState({
    show: false,
    percent: 0,
  });

  const [_3dSystemProgress, set_3dSystemProgress] = useState({
    image: {
      show: false,
      percent: 0,
      tempURL: "",
      fileName: "",
    },
    file: { show: false, percent: 0, tempURL: "", fileName: "" },
  });

  const [newUser] = useState({
    assetName: "",
    assetId: "",
    assetCategory: "",
    productName: "",
    tagId: "",
    type: "",
    shortDescription: "",
    assetImage: "",
    assetLayoutImage: "",
    asset3dModel: "",
  });
  const [assetTypes, setassetTypes] = useState([]);
  const [longDesc, setlongDesc] = useState([]);
  const FILE_SIZE = 2000000;

  const createAssetSchema = yup.object().shape({
    assetName: yup.string().required("Asset name is required"),
    assetId: yup.string(),
    assetCategory: yup.string().required("Asset Category is required"),
    productName: yup.string().required("Product name is required"),
    tagId: yup.string().required("Tag ID is required"),
    type: yup.string().required("Type is required"),
    shortDescription: yup.string(),
    assetImage: yup
      .mixed()
      .required("Please upload image")
      .test(
        "fileSize",
        "File size is too large",
        (value) => !value || (value && value.size <= FILE_SIZE)
      ),
    assetLayoutImage: yup.mixed(),
    asset3dModel: yup.mixed(),
  });

  const [assetUpImg, setassetUpImg] = useState("");

  const handleCreateAsset = (values, { resetForm }) => {
    dispatch(commonActions.showApiLoader(true));
    values["createdBy"] = USER_DETAILS?.userId
    console.log("handleCreateAsset values", values);
    console.log("longDesc", longDesc);

    let formData = new FormData();

    Object.keys(values).map((user) => {
      formData.append(`${user}`, values[user]);
    });

    createAsset(formData)
      .then((res) => {
        console.log("createUser RESPONSE", res);
        resetForm();
        setassetUpImg("");
        setlongDesc([]);
        postAuditLog({ action: "Create Asset", message: res.data.message });
        dispatch(commonActions.showApiLoader(false));
        dispatch(
          commonActions.handleSnackbar({
            show: true,
            message: "Asset Created Successfully",
            type: "success",
          })
        );

      })
      .catch((err) => {
        if(err.response.data.status=== 401 && JSON.parse(localStorage.getItem("loginUser")) !== null){
          dispatch(commonActions.handleExpiryAlert(true));
          removeUserSession();
          localStorage.removeItem("loginUser")
        } else {
          dispatch(commonActions.showApiLoader(false));
          console.log("createUser ERROR", err.response);
          if (err.response) {
            console.log(err.response.data);
  
            dispatch(
              commonActions.handleSnackbar({
                show: true,
                message: `${err.response.data.message}`,
                type: "error",
              })
            );
  
            const error = err.response.data.error;
            postAuditLog({ action: "Create USer", message: error });
            // if (error === "Validation error: Email already exists") {
            //   setemailExistErr(true);
  
            // }
          }
        }
      });
  };

  useEffect(() => {
    getAssetTypes()
      .then((res) => {
        console.log("getAssetTypes res", res);

        setassetTypes(res.data.result);
      })
      .catch((err) => {
        if(err.response.data.status=== 401 && JSON.parse(localStorage.getItem("loginUser")) !== null){
          dispatch(commonActions.handleExpiryAlert(true));
          removeUserSession();
          localStorage.removeItem("loginUser")
        }
      })

    return () => {};
  }, []);

  const handleAddIcon = () => {
    setlongDesc((prev) => [
      ...prev,
      { fieldName: "", fieldValue: "", type: "text" },
    ]);
  };

  const handleDeleteField = (field, index) => {
    const filtered = longDesc.filter((obj, i) => {
      return index !== i;
    });

    setlongDesc(filtered);
  };

  const handleFieldNameChange = (e, index) => {
    const cloned = longDesc.map((a) => ({ ...a }));
    cloned[index].fieldName = e.target.value;
    setlongDesc(cloned);
  };
  const handleFieldValueChange = (e, index) => {
    const cloned = longDesc.map((a) => ({ ...a }));
    cloned[index].fieldValue = e.target.value;
    setlongDesc(cloned);
  };

  const currentPermissionsSelector = useSelector(
    (state) => state.userData.loggedUserPermissions
  );
  const [allpermissions, setallpermissions] = useState([]);

  // useEffect(() => {
  //   getAllPermissions()
  //     .then((res) => {
  //       console.log("getAllPermissions RESPONSE", res);
  //       setallpermissions(res?.data?.result);
  //     })
  //     .catch((err) => console.log("getAllPermissions ERROR".err));
  // }, []);

  const [handlePermission, sethandlePermission] = useState({});

  useEffect(() => {
    allpermissions?.map((permission) => {
      sethandlePermission((prev) => ({
        ...prev,
        [`${permission.permissionType}`]: false,
      }));
    });
    currentPermissionsSelector?.map((permission) => {
      sethandlePermission((prev) => ({
        ...prev,
        [`${permission.permissionType}`]: true,
      }));
    });
  }, [allpermissions, currentPermissionsSelector]);

  if (USER_DETAILS.permissions.includes("ast001")) {
    return (
      <>
        <Container component="main" maxWidth="sm">
          <CssBaseline />
          <h2 style={{ color: "#3F51B5", textAlign: "center",fontFamily:"calibri" }}>
            <i>Create New Asset</i>
          </h2>
          <div className={classes.paper}>
            {/* <Avatar className={classes.avatar}>
            <PersonOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Register
          </Typography> */}
            <Formik
              initialValues={{ ...newUser }}
              validationSchema={createAssetSchema}
              onSubmit={handleCreateAsset}
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
                        id="assetname"
                        label="Asset Name"
                        name="assetName"
                        value={values.assetName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {<span style={{ color: "red" }}>{errors.assetName}</span>}
                      <br />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        variant="outlined"
                        fullWidth
                        id="assetId"
                        label="Asset Id"
                        name="assetId"
                        value={values.assetId}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={true}
                      />
                      {<span style={{ color: "red" }}>{errors.assetId}</span>}
                      <br />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        variant="outlined"
                        fullWidth
                        id="assetCategory"
                        label="Asset Category"
                        name="assetCategory"
                        value={values.assetCategory}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {
                        <span style={{ color: "red" }}>
                          {errors.assetCategory}
                        </span>
                      }
                      <br />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        variant="outlined"
                        fullWidth
                        id="prodName"
                        label="Product Name"
                        name="productName"
                        type="text"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.productName}
                      />
                      <span style={{ color: "red" }}>{errors.productName}</span>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        variant="outlined"
                        fullWidth
                        id="tagId"
                        label="Tag ID"
                        name="tagId"
                        type="text"
                        formControl
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.tagId}
                      />
                      <span style={{ color: "red" }}>{errors.tagId}</span>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl variant="outlined" fullWidth>
                        <InputLabel id="designation-label">Type</InputLabel>
                        <Select
                          labelId="type-label"
                          id="type"
                          value={values.type}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          label="Type"
                          name="type"
                        >
                          {assetTypes?.map((des) => {
                            return (
                              <MenuItem value={`${des.name}`}>
                                {`${des.name}`}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                      <span style={{ color: "red" }}>{errors.type}</span>
                    </Grid>

                    <Grid item xs={12} sm={6} lg={6}>
                      <TextField
                        id="shortDescription"
                        label="Short Description"
                        name="shortDescription"
                        fullWidth
                        multiline
                        minRows={12}
                        maxRows={12}
                        variant="outlined"
                        value={values.shortDescription}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <span style={{ color: "red" }}>
                        {errors.shortDescription}
                      </span>
                    </Grid>
                    <Grid item lg={6}>
                      <input
                        accept="image/*"
                        className={classes.input}
                        id="assetImage"
                        type="file"
                        onChange={(e) => {
                          setprogress((prev) => ({ ...prev, show: true }));
                          console.log("e.target.files[0]", e);
                          setFieldValue("assetImage", e.target.files[0]);
                          setassetUpImg(URL.createObjectURL(e.target.files[0]));

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
                        name="assetImage"
                      />
                      <label htmlFor="assetImage">
                        <Button
                          variant="contained"
                          className={classes.uploadBtns}
                          component="span"
                          fullWidth
                          color="primary"
                        >
                          Upload Asset Image
                        </Button>
                      </label>
                      <div
                        style={{
                          height: "207px",
                          border: "1px solid gray",
                          marginTop: "20px",
                        }}
                      >
                        <img
                          className={classes.image}
                          src={assetUpImg ? assetUpImg : defaultPic}
                          alt="Profile Image"
                        />

                        <div>
                          <span style={{ fontSize: "10px", color: "gray" }}>
                            1) Image should not exceed above 5Mb
                          </span>
                        </div>
                        <span style={{ color: "red" }}>
                          {errors.assetImage}
                        </span>
                      </div>
                      {progress.show && (
                        <div style={{ marginTop: "50px" }}>
                          <LinearProgress
                            variant="determinate"
                            value={progress.percent}
                          />
                          <span>Uploading ...</span>
                        </div>
                      )}
                     
                    </Grid>
                    <Grid item lg={6}>
                      <input
                        accept="image/*"
                        className={classes.input}
                        id="assetLayoutImage"
                        type="file"
                        onChange={(e) => {
                          const fileName = e.target.files[0].name
                          console.log(
                            "fileName",
                            fileName
                          );
                          set_3dSystemProgress((prev) => ({
                            ...prev,
                            image: {
                              tempURL: URL.createObjectURL(e.target.files[0]),
                              show: true,
                              fileName: fileName,
                            },
                          }));
                          console.log("e.target.files[0] ", e.target.files[0]);
                          setFieldValue("assetLayoutImage", e.target.files[0]);
                          
                          // set_3dSystemProgress((prev) => ({
                          //   ...prev,
                          //   image: {
                          //     ..._3dSystemProgress?._3dSystemProgress?.image,
                          //     tempURL: URL.createObjectURL(e.target.files[0]),
                          //   },
                          // }));

                          const reader = new FileReader();
                          reader.addEventListener("progress", (event) => {
                            const percent = Math.round(
                              (event.loaded / event.total) * 100
                            );
                            console.log("percent", percent);
                            set_3dSystemProgress((prev) => ({
                              ...prev,
                              image: {
                                ..._3dSystemProgress?._3dSystemProgress?.image,
                                percent: percent,
                              },
                            }));
                            if (percent === 100) {
                              setTimeout(
                                () =>
                                  set_3dSystemProgress((prev) => ({
                                    ...prev,
                                    image: {
                                      ..._3dSystemProgress?._3dSystemProgress
                                        ?.image,
                                      show: false,
                                    },
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
                        name="assetLayoutImage"
                      />
                      <label htmlFor="assetLayoutImage">
                        <Button
                          variant="contained"
                          className={classes.uploadBtns}
                          component="span"
                          fullWidth
                          color="primary"
                        >
                          Upload Layout Image
                        </Button>
                      </label>
                      {/* <div
                        style={{
                          height: "207px",
                          border: "1px solid gray",
                          marginTop: "20px",
                        }}
                      >
                        <img
                          className={classes.image}
                          src={_3dSystemProgress?.image?.tempURL || defaultPic}
                          alt="Profile Image"
                        />
                      </div> */}
                      {_3dSystemProgress?.image?.show && (
                        <div style={{ marginTop: "50px" }}>
                          <LinearProgress
                            variant="determinate"
                            value={_3dSystemProgress?.image?.percent}
                          />
                          <span>Uploading ...</span>
                        </div>
                      )}
                      <div>
                        <span style={{ fontSize: "100px", color: "gray" }}>
                          {_3dSystemProgress?.image?.fileName}
                        </span>
                      </div>
                    </Grid>
                    <Grid item lg={6}>
                      <input
                        accept="/*"
                        className={classes.input}
                        id="asset3dModel"
                        type="file"
                        onChange={(e) => {
                          set_3dSystemProgress((prev) => ({
                            ...prev,
                            file: {
                              show: true,
                              tempURL: URL.createObjectURL(e.target.files[0]),
                              fileName: e.target.files[0].name,
                            },
                          }));
                          console.log(
                            "e.target.files[0] asset3dModel",
                            e.target.files[0]
                          );
                          setFieldValue("asset3dModel", e.target.files[0]);
                          // set_3dSystemProgress((prev) => ({
                          //   ...prev,
                          //   file: {
                          //     ..._3dSystemProgress?._3dSystemProgress?.image,
                          //     tempURL: URL.createObjectURL(e.target.files[0]),
                          //   },
                          // }));

                          const reader = new FileReader();
                          reader.addEventListener("progress", (event) => {
                            const percent = Math.round(
                              (event.loaded / event.total) * 100
                            );
                            console.log("percent", percent);
                            set_3dSystemProgress((prev) => ({
                              ...prev,
                              file: {
                                ..._3dSystemProgress?._3dSystemProgress?.file,
                                show: true,
                              },
                            }));
                            if (percent === 100) {
                              setTimeout(
                                () =>
                                  set_3dSystemProgress((prev) => ({
                                    ...prev,
                                    file: {
                                      ..._3dSystemProgress?._3dSystemProgress
                                        ?.file,
                                      show: false,
                                    },
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
                        name="asset3dModel"
                      />
                      <label htmlFor="asset3dModel">
                        <Button
                          variant="contained"
                          className={classes.uploadBtns}
                          component="span"
                          fullWidth
                          color="primary"
                        >
                          Upload 3d Model
                        </Button>
                      </label>
                      {/* <div
                        style={{
                          height: "207px",
                          border: "1px solid gray",
                          marginTop: "20px",
                        }}
                      >
                        <img
                          className={classes.image}
                          src={_3dSystemProgress?.file?.tempURL || defaultPic}
                          alt="Profile Image"
                        />
                      </div> */}
                      {_3dSystemProgress?.file?.show && (
                        <div style={{ marginTop: "50px" }}>
                          <LinearProgress
                            variant="determinate"
                            value={_3dSystemProgress?.file?.percent}
                          />
                          <span>Uploading ...</span>
                        </div>
                      )}
                      <div>
                        <span style={{ fontSize: "10px", color: "gray" }}>
                          {_3dSystemProgress?.file?.fileName}
                        </span>
                      </div>
                    </Grid>
                    <Grid item xs={6} sm={6} lg={6}>
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
                    <Grid item xs={6} sm={6} lg={6}>
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
    return (
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        <h1 style={{ color: "#3F51B5", textAlign: "center" }}>Unauthorized</h1>
        <h4 style={{ color: "#3F51B5", textAlign: "center" }}>
          Create New Asset - No permission to view this page
        </h4>
      </Container>
    );
  }
}
