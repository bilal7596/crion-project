import { makeStyles } from "@material-ui/core";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { TextField } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import { Grid } from "@material-ui/core";
import { editUser } from "../../Api/User/UserApi";
import { useLocation, useNavigate } from "react-router-dom";
import { getLongDesc } from "../../Api/Asset/assetApi";
import DeleteIcon from "@material-ui/icons/Delete";
import { Formik } from "formik";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import * as yup from "yup";
import Tooltip from "@material-ui/core/Tooltip";
import { commonActions } from "../../Store/Reducers/CommonReducer";
import { useDispatch } from "react-redux";
import { postAuditLog } from "../../Api/User/UserApi";
import { editAsset, getAssetTypes } from "../../Api/Asset/assetApi";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import NoIMG from "../../assets/images/noImg.jpg";
import LinearProgress from "@material-ui/core/LinearProgress";
import { useContext } from "react";
import { getUser, removeUserSession } from "../../utils/clonosCommon";

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
    width: "100%",
    // height: "150px",
    boxShadow: "0px 0px 3px gray",
  },
  file: {
    display: "none",
  },
  icon: {
    position: "absolute",
    right: "-1rem",
    top: "2.9rem",
    backgroundColor: "#bcbcbc",
  },
}));

const ClonosEditAsset = () => {
  // const assetDetailsSelector = useSelector(
  //   (state) => state.assetData.assetDetail
  // );
  const USER_DETAILS = getUser();
  const LOCATION = useLocation();
  const user = JSON.parse(localStorage.getItem("loginUser"))
  const [assetDetailsSelector, setassetDetailsSelector] = useState(
    LOCATION?.state
  );
  const classes = useStyles();
  const NAVIGATE = useNavigate();
  const dispatch = useDispatch();

  const [additionalFields, setadditionalFields] = useState({});
  const [progress, setprogress] = useState({
    show: false,
    percent: 0,
  });
  const [_3dprogress, set_3dprogress] = useState({
    show: false,
    percent: 0,
  });


  const [editAssetDetails] = useState({
    assetName: assetDetailsSelector?.assetName
      ? assetDetailsSelector?.assetName
      : "",
    productName: assetDetailsSelector?.productName
      ? assetDetailsSelector?.productName
      : "",
    tagId: assetDetailsSelector?.tagId ? assetDetailsSelector?.tagId : "",
    type: assetDetailsSelector?.type ? assetDetailsSelector?.type : "",
    // height: assetDetailsSelector?.height ? assetDetailsSelector?.height : "",
    // length: assetDetailsSelector?.length ? assetDetailsSelector?.length : "",
    // breadth: assetDetailsSelector?.breadth ? assetDetailsSelector?.breadth : "",
    shortDescription: assetDetailsSelector?.shortDescription
      ? assetDetailsSelector?.shortDescription
      : "",
    assetImage: assetDetailsSelector?.assetImage
      ? assetDetailsSelector?.assetImage
      : "",
    assetLayoutImage: assetDetailsSelector?.assetLayoutImage
      ? assetDetailsSelector?.assetLayoutImage
      : "",
    asset3dModel: assetDetailsSelector?.asset3dModel
      ? assetDetailsSelector?.asset3dModel
      : "",
      xLocation:  assetDetailsSelector?.xLocation
      ? assetDetailsSelector?.xLocation
      : "",
      yLocation: assetDetailsSelector?.yLocation
      ? assetDetailsSelector?.yLocation
      : "",
      zLocation: assetDetailsSelector?.zLocation
      ? assetDetailsSelector?.zLocation
      : "",
  });

  const [editassetUpImg, seteditassetUpImg] = useState({
    assetImage: assetDetailsSelector?.assetImage
      ? assetDetailsSelector?.assetImage
      : "",
    tempAssetImagePic: assetDetailsSelector?.assetImage
      ? assetDetailsSelector?.assetImage
      : "",
    assetLayoutImage: assetDetailsSelector?.assetImage
      ? assetDetailsSelector?.assetLayoutImage
      : "",
    tempassetLayoutImage: assetDetailsSelector?.assetImage
      ? assetDetailsSelector?.assetLayoutImage
      : "",
  });

  // const [newUser] = useState({
  //   assetName: "",
  //   productName: "",
  //   tagId: "",
  //   type: "",
  //   height: "",
  //   length: "",
  //   breadth: "",
  //   shortDescription: "",
  //   assetImage: "",
  // });
  const [assetTypes, setassetTypes] = useState([]);
  const FILE_SIZE = 2000000;

  console.log("assetDetailsSelector", assetDetailsSelector);

  // const handleEditUserChange = (field, value) => {
  //   seteditAssetDetails((prev) => ({ ...prev, [field]: value }));
  // };

  // const handleUpdate = () => {
  //   console.log("editAssetDetails", editAssetDetails);

  //   let formData = new FormData();

  //   Object.keys(editAssetDetails).map((user) => {
  //     formData.append(`${user}`, editAssetDetails[user]);
  //   });

  //   formData.append("avatar", editassetUpImg.displaypic);
  //   formData.append("sign", editassetUpImg.signature);

  //   console.log("editassetUpImg", editassetUpImg);

  //   for (var pair of formData.entries()) {
  //     console.log(pair[0] + ", " + pair[1]);
  //   }

  //   editAsset(formData)
  //     .then((res) => {
  //       console.log("editUser RESPONSE", res);
  //       NAVIGATE("/AllUsers");
  //     })
  //     .catch((err) => console.log("editUser ERROR", err));
  // };

  const createAssetSchema = yup.object().shape({
    assetName: yup.string().required("Asset name is required"),
    productName: yup.string().required("Product name is required"),
    tagId: yup.string().required("Tag ID is required"),
    type: yup.string().required("Type is required"),
    // height: yup.string().required("Height is required"),
    // length: yup.string().required("Width is required!"),
    // breadth: yup.string().required("Breadth is required!"),
    // shortDescription: yup.string().required("Short Description is required"),

    assetImage: yup
      .mixed()
      .required("Please upload image")
      .test(
        "fileSize",
        "File size is too large",
        (value) => !value || (value && value.size <= FILE_SIZE)
      ),
  });
  const handleUpdateAsset = (values, { resetForm }) => {
    dispatch(commonActions.showApiLoader(true));
    values["updatedBy"] = USER_DETAILS?.userId
    console.log("handleUpdateAsset values", values);

    let formData = new FormData();
    formData.append(`assetId`, assetDetailsSelector.assetId);
    Object.keys(values).map((user) => {
      formData.append(`${user}`, values[user]);
    });
    formData.append(`fields`, JSON.stringify(additionalFields?.fields));

    editAsset(formData)
      .then((res) => {
        console.log("createUser RESPONSE", res);
        resetForm();
        seteditassetUpImg((prev) => ({ ...prev, tempAssetImagePic: "" }));
        postAuditLog({ action: "Edit Asset", message: res.data.message });
        dispatch(commonActions.showApiLoader(false));
        dispatch(
          commonActions.handleSnackbar({
            show: true,
            message: "Assed updated successfully",
            type: "success",
          })
        );

        NAVIGATE("/all-assets");
      })
      .catch((err) => {
        if(err.response.data.status=== 401 && JSON.parse(localStorage.getItem("loginUser")) !== null){
          dispatch(commonActions.handleExpiryAlert(true));
          removeUserSession();
          localStorage.removeItem("loginUser")
        } else {
          console.log("createUser ERROR", err.response);
          dispatch(commonActions.showApiLoader(false));
          if (err.response) {
            console.log(err.response.data);
  
            const error = err.response.data.error;
            postAuditLog({ action: "Create USer", message: error });
          }
        }
      });
  };
  const handleAddIcon = () => {
    setadditionalFields((prev) => ({
      ...prev,
      fields:
        additionalFields?.fields.length > 0
          ? [
            ...additionalFields?.fields,
            { fieldName: "", fieldValue: "", type: "text" },
          ]
          : [{ fieldName: "", fieldValue: "", type: "text" }],
    }));
  };
  const handleFieldNameChange = (e, index) => {
    const cloned = additionalFields?.fields?.map((a) => ({ ...a }));
    cloned[index].fieldName = e.target.value;
    setadditionalFields((prev) => ({ ...prev, fields: cloned }));
  };
  const handleFieldValueChange = (e, index) => {
    const cloned = additionalFields?.fields?.map((a) => ({ ...a }));
    cloned[index].fieldValue = e.target.value;
    setadditionalFields((prev) => ({ ...prev, fields: cloned }));
  };
  const handleDeleteField = (field, index) => {
    const filtered = additionalFields?.fields?.filter((obj, i) => {
      return index !== i;
    });

    setadditionalFields((prev) => ({ ...prev, fields: filtered }));
  };
  useEffect(() => {
    getAssetTypes()
      .then((res) => {
        console.log("getAssetTypes RESPONSE", res);
        setassetTypes(res.data.result);
      })
      .catch((err) => {
        if(err.response.data.status=== 401 && JSON.parse(localStorage.getItem("loginUser")) !== null){
          dispatch(commonActions.handleExpiryAlert(true));
          removeUserSession();
          localStorage.removeItem("loginUser")
        }
      })

    getLongDesc(assetDetailsSelector?.assetId)
      .then((res) => {
        console.log("VIEW ASSET getLongDesc RESPONSE", res);
        setadditionalFields(res.data);
      })
      .catch((err) => {
        if(err.response.data.status=== 401 && JSON.parse(localStorage.getItem("loginUser")) !== null){
          dispatch(commonActions.handleExpiryAlert(true));
          removeUserSession();
          localStorage.removeItem("loginUser")
        }
      })

    return () => { };
  }, []);

  return (
    <>
      <h1 style={{ textAlign: "center", color: "#3F51B5" }}>Edit Asset</h1>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div className="editUserBox">
          <Formik
            initialValues={{ ...editAssetDetails }}
            validationSchema={createAssetSchema}
            onSubmit={handleUpdateAsset}
          // validator={() => ({})}
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
                  {Object.keys(editAssetDetails).map((detail) => {
                    // console.log("detail",detail);
                    if (["assetImage", "asset3dModel", "assetLayoutImage","assetLayoutImage", "xLocation", "yLocation", "zLocation"].includes(detail)) {
                      return null;
                    }
                    if (detail === "type") {
                      return (
                        <FormControl variant="outlined" fullWidth>
                          <InputLabel id="type-label">Type</InputLabel>
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
                      );
                    }
                    return (
                      <>
                        <TextField
                          variant="outlined"
                          fullWidth
                          id={detail}
                          label={detail}
                          name={detail}
                          className={classes.input}
                          // defaultValue={editAssetDetails[detail]}
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
                  {/* {additionalFields && additionalFields?.fields?.length > 0 && ( */}
                  {/* <Grid container>
                    <Grid item xs={12} style={{ margin: "20px 0" }}>
                      <p><strong>Add Engineering Data</strong></p>
                      <Tooltip title="Add New Field" aria-label="add">
                        <Fab
                          color="primary"
                          className={classes.fab}
                          onClick={handleAddIcon}
                        >
                          <AddIcon />
                        </Fab>
                      </Tooltip>
                    </Grid>
                    {additionalFields?.fields?.map((desc, index) => {
                      return (
                        <>
                          <Grid item xs={4} lg={5}>
                            <TextField
                              id={desc.id}
                              label="Field Name"
                              value={desc.fieldName}
                              onChange={(e) => handleFieldNameChange(e, index)}
                            />
                          </Grid>
                          <Grid item xs={4} lg={5}>
                            <TextField
                              id={desc.id}
                              label="Field Value"
                              value={desc.fieldValue}
                              onChange={(e) => handleFieldValueChange(e, index)}
                              style={{ marginLeft: "10px" }}
                            />
                          </Grid>
                          <Grid item xs={4} lg={2}>
                            <IconButton
                              aria-label="delete"
                              onClick={() => handleDeleteField(desc, index)}
                              style={{ marginTop: "15px" }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Grid>
                        </>
                      );
                    })}
                  </Grid> */}
                  {/* )} */}

                  <Grid item xs={6} lg={6} style={{ position: "relative" , padding:"0rem 1rem 1rem 0rem"}}>
                    <p style={{ margin: "20px 0" }}>
                      <strong>Asset Image: </strong>
                    </p>
                    <input
                      accept="image/png"
                      className={classes.file}
                      id="asset-button-file"
                      type="file"
                      onChange={(e) => {
                        setprogress((prev) => ({ ...prev, show: true }));
                        setFieldValue("assetImage", e.target.files[0]);
                        seteditassetUpImg((prev) => {
                          return {
                            ...prev,
                            assetImage: e.target.files[0],
                            tempAssetImagePic: URL.createObjectURL(
                              e.target.files[0]
                            ),
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
                    // value={values[`assetImage`]}
                    />
                    <label htmlFor="asset-button-file">
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
                      src={editassetUpImg.tempAssetImagePic || NoIMG}
                      alt="profile Image"
                    />
                    <span style={{ color: "red" }}>{errors[`assetImage`]}</span>
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

                  <Grid item xs={6} lg={6} style={{ position: "relative" , padding:"0rem 0rem 1rem 1rem"}}>
                    <p style={{ margin: "20px 0" }}>
                      <strong>Asset Layout Image: </strong>
                    </p>
                    <input
                      accept="image/png"
                      className={classes.file}
                      id="asset-assetLayoutImage-file"
                      type="file"
                      onChange={(e) => {
                        set_3dprogress((prev) => ({ ...prev, show: true }));
                        setFieldValue("assetLayoutImage", e.target.files[0]);
                        seteditassetUpImg((prev) => {
                          return {
                            ...prev,
                            assetLayoutImage: e.target.files[0],
                            tempassetLayoutImage: URL.createObjectURL(
                              e.target.files[0]
                            ),
                          };
                        });
                        const reader = new FileReader();
                        reader.addEventListener("progress", (event) => {
                          const percent = Math.round(
                            (event.loaded / event.total) * 100
                          );
                          console.log("percent", percent);
                          set_3dprogress((prev) => ({
                            ...prev,
                            percent: percent,
                          }));
                          if (percent === 100) {
                            setTimeout(
                              () =>
                                set_3dprogress((prev) => ({
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
                    // value={values[`assetImage`]}
                    />
                    <label htmlFor="asset-assetLayoutImage-file">
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
                      src={editassetUpImg.tempassetLayoutImage || NoIMG}
                      alt="profile Image"
                    />
                    <span style={{ color: "red" }}>{errors[`assetImage`]}</span>
                    {_3dprogress?.show && (
                      <div style={{ marginTop: "50px" }}>
                        <LinearProgress
                          variant="determinate"
                          value={_3dprogress?.percent}
                        />
                        <span>Uploading ...</span>
                      </div>
                    )}
                  </Grid>

                  <Grid item lg={6} style={{ marginTop: "20px", padding:"0rem 1rem 1rem 0rem"}}>
                    <input
                      accept="/*"
                      className={classes.input}
                      style={{ display: "none" }}
                      id="asset3dModel"
                      type="file"
                      onChange={(e) => {
                        // set_3dSystemProgress((prev) => ({
                        //   ...prev,
                        //   file: {
                        //     show: true,
                        //     tempURL: URL.createObjectURL(e.target.files[0]),
                        //     fileName: e.target.files[0].name,
                        //   },
                        // }));
                        console.log(
                          "e.target.files[0] asset3dModel",
                          e.target.files[0]
                        );
                        setFieldValue("asset3dModel", e.target.files[0]);

                        const reader = new FileReader();
                        reader.addEventListener("progress", (event) => {
                          const percent = Math.round(
                            (event.loaded / event.total) * 100
                          );
                          console.log("percent", percent);
                          // set_3dSystemProgress((prev) => ({
                          //   ...prev,
                          //   file: {
                          //     ..._3dSystemProgress?._3dSystemProgress?.file,
                          //     show: true,
                          //   },
                          // }));
                          // if (percent === 100) {
                          //   setTimeout(
                          //     () =>
                          //       set_3dSystemProgress((prev) => ({
                          //         ...prev,
                          //         file: {
                          //           ..._3dSystemProgress?._3dSystemProgress
                          //             ?.file,
                          //           show: false,
                          //         },
                          //       })),
                          //     1000
                          //   );
                          // }
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
                    {/* {_3dSystemProgress?.file?.show && (
                        <div style={{ marginTop: "50px" }}>
                          <LinearProgress
                            variant="determinate"
                            value={_3dSystemProgress?.file?.percent}
                          />
                          <span>Uploading ...</span>
                        </div>
                      )} */}
                    <div>
                      <span style={{ fontSize: "10px", color: "gray" }}>
                        {/* {_3dSystemProgress?.file?.fileName} */}
                      </span>
                    </div>
                   <Grid style={{padding:"1rem 0rem 0rem 0rem"}}>
                    <Grid container style={{display:"flex", gridGap:"10px", border: "1px solid #ccc" , borderRadius: "5px", justifyContent: "space-around", position: "relative"}}>
                    
<Grid item lg={3}>
<>
      <TextField
        variant="outlined"
        fullWidth
        id="xLocation"
        label="X"
        name="xLocation"
        className={classes.input}
        // defaultValue={editAssetDetails[detail]}
        value={values.xLocation}
        InputLabelProps={{
          classes: {
            root: classes.labelRoot,
          },
        }}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      <span style={{ color: "red" }}>
        {errors.xLocation}
      </span>
    </>
</Grid>
<Grid item lg={3}>
<>
      <TextField
        variant="outlined"
        fullWidth
        id="yLocation"
        label="Y"
        name="yLocation"
        className={classes.input}
        // defaultValue={editAssetDetails[detail]}
        value={values.yLocation}
        InputLabelProps={{
          classes: {
            root: classes.labelRoot,
          },
        }}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      <span style={{ color: "red" }}>
        {errors.yLocation}
      </span>
    </>
</Grid>
<Grid item lg={3}>
<>
      <TextField
        variant="outlined"
        fullWidth
        id="zLocation"
        label="Z"
        name="zLocation"
        className={classes.input}
        // defaultValue={editAssetDetails[detail]}
        value={values.zLocation}
        InputLabelProps={{
          classes: {
            root: classes.labelRoot,
          },
        }}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      <span style={{ color: "red" }}>
        {errors.zLocation}
      </span>
    </>
    <p style={{position:"absolute", top:"-10px", left:"20px", backgroundColor:"#fff", padding:"0px 5px"}}>Location</p>
</Grid>
</Grid>
</Grid>
                  </Grid>
                  <Grid item lg={12}></Grid>                  

                  <Grid item xs={6} sm={6} lg={6} style={{ marginTop: "2rem" }}>
                    <input type={"submit"} className={classes.button} />
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

export default ClonosEditAsset;
