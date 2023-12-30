// import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import Grid from "@material-ui/core/Grid";
// import NOIMG from "../../assets/images/noImg.jpg";
// import { getEngineeringDataOfAsset } from "../../Api/EngineeringData/engineeringData";
// import Button from "@material-ui/core/Button";
// import ArrowBackIcon from "@material-ui/icons/ArrowBack";
// import { useLocation, useNavigate } from "react-router-dom";
// import Fab from "@material-ui/core/Fab";
// import Tooltip from "@material-ui/core/Tooltip";
// import { makeStyles } from "@material-ui/core/styles";
// import AddIcon from "@material-ui/icons/Add";
// import TextField from "@material-ui/core/TextField";
// import IconButton from "@material-ui/core/IconButton";
// import DeleteIcon from "@material-ui/icons/Delete";
// import * as yup from "yup";
// import { useDispatch } from "react-redux";
// import { commonActions } from "../../Store/Reducers/CommonReducer";
// import { editAsset, getAssetTypes } from "../../Api/Asset/assetApi";
// import { postAuditLog } from "../../Api/User/UserApi";
// import { Formik } from "formik";
// import LinearProgress from "@material-ui/core/LinearProgress";
// import { getAllPermissions } from "../../Api/User/UserApi";
// import EditIcon from "@material-ui/icons/Edit";

// import Table from "@material-ui/core/Table";
// import TableBody from "@material-ui/core/TableBody";
// import TableCell from "@material-ui/core/TableCell";
// import TableContainer from "@material-ui/core/TableContainer";
// import TableHead from "@material-ui/core/TableHead";
// import TableRow from "@material-ui/core/TableRow";
// import Paper from "@material-ui/core/Paper";
// import { createNewEngFields } from "../../Api/EngineeringData/engineeringData";

// const useStyles = makeStyles((theme) => ({
//   paper: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     boxShadow: "0px 0px 5px #bcbcbc",
//     padding: "1rem 2rem",
//     backgroundColor: "#fff",
//     borderTop: "5px solid #007bfd",
//   },
//   avatar: {
//     margin: theme.spacing(1),
//     backgroundColor: "#007bfd",
//   },
//   form: {
//     width: "100%", // Fix IE 11 issue.
//     marginTop: theme.spacing(3),
//   },
//   submit: {
//     margin: theme.spacing(3, -1, 2),
//     // backgroundColor: "#007bfd",
//     // color: "#fff",
//     // "&:hover": {
//     //   backgroundColor: "#007bfd",
//     //   color: "#fff",
//     // },
//   },
//   cancel: {
//     margin: theme.spacing(3, 1, 2),
//     // backgroundColor: "red",
//     // color: "#fff",
//     // "&:hover": {
//     //   backgroundColor: "red",
//     //   color: "#fff",
//     // },
//   },
//   input: {
//     display: "none",
//   },
//   uploadBtns: {
//     // backgroundColor: "#007bfd",
//     // color: "#fff",
//     width: "100%",
//   },
//   image: {
//     width: "100%",
//     height: "100%",
//   },
//   fab: {
//     // margin: theme.spacing(1),
//     height: "40px",
//     width: "40px",
//   },
//   button: {
//     backgroundColor: "#3f51b5",
//     color: "#fff",
//     padding: "0.5rem 2rem",
//     fontWeight: "600",
//     border: "none",
//     cursor: "pointer",
//     width: "90%",
//   },
// }));

// const EngineeringData = () => {
//   const LOCATION = useLocation();
//   const [additionalFields, setadditionalFields] = useState([]);
//   const [addadditionalFields, setaddadditionalFields] = useState([]);
//   const [longDesc, setlongDesc] = useState([]);
//   const classes = useStyles();
//   const [assetDetails, setassetDetails] = useState(LOCATION?.state);
//   const [assetDetailsSelector, setassetDetailsSelector] = useState(
//     LOCATION?.state
//   );
//   const [showTextFields, setShowTextFields] = useState(false);

//   const handleAddButtonClick = () => {
//     setShowTextFields(true);
//   };
//   const dispatch = useDispatch();
//   const NAVIGATE = useNavigate();
//   const [progress, setprogress] = useState({
//     show: false,
//     percent: 0,
//   });
//   useEffect(() => {
//     getEngineeringDataOfAsset(LOCATION?.state?.assetId)
//       .then((res) => {
//         setadditionalFields(res.data.result.engineeringData)
//       })
//       .catch((err) => console.log("VIEW ASSET getEngineeringDataOfAsset ERROR", err));
//   }, []);

//   const [editAssetDetails] = useState({
//     assetName: assetDetailsSelector?.assetName
//       ? assetDetailsSelector?.assetName
//       : "",
//     productName: assetDetailsSelector?.productName
//       ? assetDetailsSelector?.productName
//       : "",
//     tagId: assetDetailsSelector?.tagId ? assetDetailsSelector?.tagId : "",
//     type: assetDetailsSelector?.type ? assetDetailsSelector?.type : "",
//     // height: assetDetailsSelector?.height ? assetDetailsSelector?.height : "",
//     // length: assetDetailsSelector?.length ? assetDetailsSelector?.length : "",
//     // breadth: assetDetailsSelector?.breadth ? assetDetailsSelector?.breadth : "",
//     shortDescription: assetDetailsSelector?.shortDescription
//       ? assetDetailsSelector?.shortDescription
//       : "",
//     // assetImage: yup
//     //   .mixed()
//     //   .required("Please upload image")
//     //   .test(
//     //     "fileSize",
//     //     "File size is too large",
//     //     (value) => !value || (value && value.size <= FILE_SIZE)
//     //   ),
//   });

//   const [editassetUpImg, seteditassetUpImg] = useState({
//     assetImage: assetDetailsSelector?.assetImage
//       ? assetDetailsSelector?.assetImage
//       : "",
//     tempAssetImagePic: assetDetailsSelector?.assetImage
//       ? assetDetailsSelector?.assetImage
//       : "",
//   });

//   // const [newUser] = useState({
//   //   assetName: "",
//   //   productName: "",
//   //   tagId: "",
//   //   type: "",
//   //   height: "",
//   //   length: "",
//   //   breadth: "",
//   //   shortDescription: "",
//   //   assetImage: "",
//   // });
//   const [assetTypes, setassetTypes] = useState([]);
//   // const FILE_SIZE = 1000000;

//   console.log("assetDetailsSelector", assetDetailsSelector);

//   // const handleEditUserChange = (field, value) => {
//   //   seteditAssetDetails((prev) => ({ ...prev, [field]: value }));
//   // };

//   // const handleUpdate = () => {
//   //   console.log("editAssetDetails", editAssetDetails);

//   //   let formData = new FormData();

//   //   Object.keys(editAssetDetails).map((user) => {
//   //     formData.append(`${user}`, editAssetDetails[user]);
//   //   });

//   //   formData.append("avatar", editassetUpImg.displaypic);
//   //   formData.append("sign", editassetUpImg.signature);

//   //   console.log("editassetUpImg", editassetUpImg);

//   //   for (var pair of formData.entries()) {
//   //     console.log(pair[0] + ", " + pair[1]);
//   //   }

//   //   editAsset(formData)
//   //     .then((res) => {
//   //       console.log("editUser RESPONSE", res);
//   //       NAVIGATE("/AllUsers");
//   //     })
//   //     .catch((err) => console.log("editUser ERROR", err));
//   // };

//   const createAssetSchema = yup.object().shape({
//     assetName: yup.string().required("Asset name is required"),
//     productName: yup.string().required("Product name is required"),
//     tagId: yup.string().required("Tag ID is required"),
//     type: yup.string().required("Type is required"),
//     // height: yup.string().required("Height is required"),
//     // length: yup.string().required("Width is required!"),
//     // breadth: yup.string().required("Breadth is required!"),
//     // shortDescription: yup.string().required("Short Description is required"),

//     // assetImage: yup
//     //   .mixed()
//     //   .required("Please upload image")
//     //   .test(
//     //     "fileSize",
//     //     "File size is too large",
//     //     (value) => !value || (value && value.size <= FILE_SIZE)
//     //   ),
//   });
//   const handleUpdateAsset = (values, { resetForm }) => {
//     dispatch(commonActions.showApiLoader(true));
//     console.log("handleUpdateAsset values", values);
//     var engineerData = [];

//     if (addadditionalFields?.length > 0) {
//       engineerData = [...engineerData, ...addadditionalFields];
//     }
//     if (additionalFields?.length > 0) {
//       engineerData = [...engineerData, ...additionalFields];
//     }

//     createNewEngFields(engineerData).then((res) => {
//           console.log("createNewEngFields RESPONSE", res);
//           resetForm();
//           dispatch(commonActions.showApiLoader(false));
//           dispatch(
//             commonActions.handleSnackbar({
//               show: true,
//               message: "Engineering Data Updated Successfully",
//               type: "success",
//             })
//           );
//         })
//         .catch((err) => {
//           console.log("createNewEngFields ERROR", err.response);
//           dispatch(commonActions.showApiLoader(false));
//           if (err.response) {
//             console.log(err.response.data);
  
//             const error = err.response.data.message;
//             dispatch(
//               commonActions.handleSnackbar({
//                 show: true,
//                 message: error,
//                 type: "error",
//               })
//             );
//           }
//         });

//     // let formData = new FormData();
//     // formData.append(`assetId`, assetDetailsSelector.assetId);
//     // Object.keys(values).map((user) => {
//     //   formData.append(`${user}`, values[user]);
//     // });
//     // formData.append(`fields`, JSON.stringify(engineerData));

//     // editAsset(formData)
//     //   .then((res) => {
//     //     console.log("createUser RESPONSE", res);
//     //     resetForm();
//     //     seteditassetUpImg((prev) => ({ ...prev, tempAssetImagePic: "" }));
//     //     postAuditLog({ action: "Edit Asset", message: res.data.message });
//     //     dispatch(commonActions.showApiLoader(false));
//     //     dispatch(
//     //       commonActions.handleSnackbar({
//     //         show: true,
//     //         message: "Engineering Data Updated Successfully",
//     //         type: "success",
//     //       })
//     //     );
//     //     NAVIGATE("/all-assets");
//     //   })
//     //   .catch((err) => {
//     //     console.log("createUser ERROR", err.response);
//     //     dispatch(commonActions.showApiLoader(false));
//     //     if (err.response) {
//     //       console.log(err.response.data);

//     //       const error = err.response.data.error;
//     //       postAuditLog({ action: "Create USer", message: error });
//     //     }
//     //   });
//   };
//   const handleAddIcon = () => {
//     setaddadditionalFields((prev) => ([
//       ...prev,
//       {assetId:LOCATION?.state.assetId, fieldName: "", fieldValue: "", fieldType: "text" }
//     ]));
//   };
//   const handleFieldNameChange = (e, index) => {
//     const cloned = additionalFields?.map((a) => ({ ...a }));
//     cloned[index].fieldName = e.target.value;
//     setadditionalFields(cloned);
//   };
//   const handleAddFieldNameChange = (e, index) => {
//     const cloned = addadditionalFields?.map((a) => ({ ...a }));
//     cloned[index].fieldName = e.target.value;
//     setaddadditionalFields(cloned);
//   };
//   const handleFieldValueChange = (e, index) => {
//     const cloned = additionalFields?.map((a) => ({ ...a }));
//     cloned[index].fieldValue = e.target.value;
//     setadditionalFields(cloned);
//   };
//   const handleAddFieldValueChange = (e, index) => {
//     const cloned = addadditionalFields?.map((a) => ({ ...a }));
//     cloned[index].fieldValue = e.target.value;
//     setaddadditionalFields(cloned);
//   };
//   const handleDeleteField = (field, index) => {
//     const filtered = additionalFields?.filter((obj, i) => {
//       return index !== i;
//     });

//     setadditionalFields(filtered);
//   };

//   const handleAddDeleteField = (field, index) => {
//     const filtered = addadditionalFields?.filter((obj, i) => {
//       return index !== i;
//     });

//     setaddadditionalFields(filtered);
//   };
//   useEffect(() => {
//     getAssetTypes()
//       .then((res) => {
//         console.log("getAssetTypes RESPONSE", res);
//         setassetTypes(res.data.result);
//       })
//       .catch((err) => console.log("getAssetTypes ERROR", err));

//       getEngineeringDataOfAsset(assetDetailsSelector?.assetId)
//       .then((res) => {
//         console.log("VIEW ASSET getEngineeringDataOfAsset RESPONSE", res);
//         setadditionalFields(res.data.result.engineeringData);
//       })
//       .catch((err) => console.log("VIEW ASSET getEngineeringDataOfAsset ERROR", err));

//     return () => {};
//   }, []);

//   const [allpermissions, setallpermissions] = useState([]);

//   useEffect(() => {
//     getAllPermissions()
//       .then((res) => {
//         console.log("getAllPermissions RESPONSE", res);
//         setallpermissions(res?.data?.result);
//       })
//       .catch((err) => console.log("getAllPermissions ERROR".err));
//   }, []);

//   const [handlePermission, sethandlePermission] = useState({});

//   const currentPermissionsSelector = useSelector(
//     (state) => state.userData.loggedUserPermissions
//   );

//   useEffect(() => {
//     allpermissions?.map((permission) => {
//       sethandlePermission((prev) => ({
//         ...prev,
//         [`${permission.permissionType}`]: false,
//       }));
//     });
//     currentPermissionsSelector?.map((permission) => {
//       sethandlePermission((prev) => ({
//         ...prev,
//         [`${permission.permissionType}`]: true,
//       }));
//     });
//   }, [allpermissions, currentPermissionsSelector]);

//   return (
//     <>
//       <>
//         {/* <h1 style={{ textAlign: "center", color: "#707d91" }}>Edit Asset</h1> */}
//         <div style={{ display: "flex", justifyContent: "center" }}>
//           <div>
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//               }}
//             >
//               <div style={{ display: "flex", justifyContent: "space-evenly" }}>
//                 <h2
//                   style={{
//                     color: "#3f51b5",
//                     fontFamily: "calibri",
//                   }}
//                 >
//                   Engineering Data:
//                 </h2>
//                 <p
//                   style={{
//                     color: "#3f51b5",
//                     fontFamily: "calibri",
//                     fontSize: "1.5em",
//                     margin: "12px 0 0 20px",
//                   }}
//                 >
//                   <strong>{assetDetails?.assetName}</strong>
//                 </p>
//               </div>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 endIcon={<ArrowBackIcon>send</ArrowBackIcon>}
//                 onClick={() => NAVIGATE(-1)}
//               >
//                 Back
//               </Button>
//             </div>
//             <div className="assetBox">
//               <Grid container style={{ marginTop: "20px" }}>
//                 <Grid item lg={4}>
//                   <p>
//                     <strong>Product Type:</strong>
//                   </p>
//                 </Grid>
//                 <Grid item lg={4}>
//                   <p>{assetDetails?.type}</p>
//                 </Grid>
//               </Grid>
//               {additionalFields && additionalFields?.length > 0 && (
//                 <Grid container style={{ marginTop: "20px" }}>
//                   <Grid item lg={4}>
//                     <p>
//                       <strong>Engineering Data:</strong>
//                     </p>
//                   </Grid>

//                   <Grid item lg={8}>
//                     {/* {additionalFields?.fields?.map((field, index) => {
//                       return (
//                         <Grid container>
//                           <Grid item lg={4}>
//                             <p>
//                               <strong>
//                                 {index + 1}
//                                 {")"} {field.fieldName}:
//                               </strong>
//                             </p>
//                           </Grid>
//                           <Grid item lg={4}>
//                             <p> {field.fieldValue}</p>
//                           </Grid>
//                         </Grid>
//                       );
//                     })} */}
//                     <Paper className={classes.root}>
//                       <TableContainer className={classes.container}>
//                         <Table
//                           className={classes.table}
//                           size="small"
//                           stickyHeader
//                           aria-label="sticky table"
//                         >
//                           <TableHead>
//                             <TableRow>
//                               <TableCell>S.No</TableCell>
//                               <TableCell>Name</TableCell>
//                               <TableCell>Value</TableCell>
//                             </TableRow>
//                           </TableHead>
//                           <TableBody>
//                             {additionalFields?.map((row, index) => (
//                               <TableRow key={row.name}>
//                                 <TableCell component="th" scope="row">
//                                   {index + 1}
//                                 </TableCell>
//                                 <TableCell component="th" scope="row">
//                                   {row.fieldName}
//                                 </TableCell>
//                                 <TableCell>{row.fieldValue}</TableCell>
//                               </TableRow>
//                             ))}
//                           </TableBody>
//                         </Table>
//                       </TableContainer>
//                     </Paper>
//                   </Grid>
//                 </Grid>
//               )}

//               <Grid
//                 container
//                 style={{
//                   maxHeight: "300px",
//                   overflowY: "auto",
//                   overflowX: "hidden",
//                 }}
//               >
//                 {longDesc.map((desc, index) => {
//                   return (
//                     <>
//                       {/* <Grid item xs={1}>
//                   <p style={{ marginTop: "20px" }}>{index + 1}</p>
//                 </Grid>
//                 <Grid item xs={1}>
//                   <IconButton
//                     aria-label="delete"
//                     onClick={() => handleDeleteField(desc, index)}
//                     style={{ marginTop: "7px" }}
//                   >
//                     <DeleteIcon />
//                   </IconButton>
//                 </Grid>
//                 <Grid item xs={6} sm={6} lg={6}>
//                   <Button
//                     type="submit"
//                     fullWidth
//                     variant="contained"
//                     color="primary"
//                     className={classes.submit}
//                   >
//                     Submit
//                   </Button>
//                 </Grid>
//                 <Grid item xs={6} sm={6} lg={6}>
//                   <Button
//                     type="button"
//                     fullWidth
//                     variant="contained"
//                     color="primary"
//                     className={classes.cancel}
//                     onClick={() => NAVIGATE(-1)}
//                   >
//                     Cancel
//                   </Button>
//                 </Grid> */}
//                     </>
//                   );
//                 })}
//               </Grid>
//               <Formik
//                 initialValues={{ ...editAssetDetails }}
//                 validationSchema={createAssetSchema}
//                 onSubmit={handleUpdateAsset}
//               >
//                 {({
//                   values,
//                   errors,
//                   touched,
//                   handleChange,
//                   handleBlur,
//                   handleSubmit,
//                   setFieldValue,
//                 }) => (
//                   <form onSubmit={handleSubmit}>
//                     <Grid container>
//                       <Grid container style={{ marginTop: "20px" }}>
//                         <Grid item xs={12} style={{ margin: "20px 0" }}>
//                           <p
//                             style={{
//                               display: handlePermission.engineering_Data_Edit
//                                 ? "block"
//                                 : "none",
//                             }}
//                           >
//                             <strong>Edit Engineering Data:</strong>
//                           </p>
//                           <Tooltip title="Edit Field" aria-label="add">
//                             <Fab
//                               color="primary"
//                               className={classes.fab}
//                               onClick={handleAddButtonClick}
//                               style={{
//                                 display: handlePermission.engineering_Data_Edit
//                                   ? "block"
//                                   : "none",

//                                 fontSize: "0.5em",
//                               }}
//                             >
//                               <EditIcon />
//                             </Fab>
//                           </Tooltip>
//                         </Grid>
//                         {additionalFields?.map((desc, index) => {
//                           return (
//                             <>
//                               {showTextFields ? (
//                                 <>
//                                   <Grid
//                                     item
//                                     xs={4}
//                                     lg={5}
//                                     style={{
//                                       display:
//                                         handlePermission.engineering_Data_Edit
//                                           ? "block"
//                                           : "none",
//                                     }}
//                                   >
//                                     <TextField
//                                       id={desc.id}
//                                       label="Field Name"
//                                       value={desc.fieldName}
//                                       onChange={(e) =>
//                                         handleFieldNameChange(e, index)
//                                       }
//                                     />
//                                   </Grid>
//                                   <Grid
//                                     item
//                                     xs={4}
//                                     lg={5}
//                                     style={{
//                                       display:
//                                         handlePermission.engineering_Data_Edit
//                                           ? "block"
//                                           : "none",
//                                     }}
//                                   >
//                                     <TextField
//                                       id={desc.id}
//                                       label="Field Value"
//                                       value={desc.fieldValue}
//                                       onChange={(e) =>
//                                         handleFieldValueChange(e, index)
//                                       }
//                                       style={{ marginLeft: "10px" }}
//                                     />
//                                   </Grid>
//                                   <Grid item xs={4} lg={2}>
//                                     <IconButton
//                                       aria-label="delete"
//                                       onClick={() =>
//                                         handleDeleteField(desc, index)
//                                       }
//                                       style={{
//                                         marginTop: "15px",
//                                         display:
//                                           handlePermission.engineering_Data_Delete
//                                             ? "block"
//                                             : "none",
//                                       }}
//                                     >
//                                       <DeleteIcon />
//                                     </IconButton>
//                                   </Grid>
//                                 </>
//                               ) : null}
//                             </>
//                           );
//                         })}
//                       </Grid>

//                       <Grid container style={{ marginTop: "20px" }}>
//                         <Grid item xs={12} style={{ margin: "20px 0" }}>
//                           <p
//                             style={{
//                               display: handlePermission.engineering_Data_Create
//                                 ? "block"
//                                 : "none",
//                             }}
//                           >
//                             <strong>Add Engineering Data:</strong>
//                           </p>
//                           <Tooltip title="Add New Field" aria-label="add">
//                             <Fab
//                               color="primary"
//                               className={classes.fab}
//                               onClick={handleAddIcon}
//                               style={{
//                                 display:
//                                   handlePermission.engineering_Data_Create
//                                     ? "block"
//                                     : "none",
//                                 fontSize: "0.5em",
//                               }}
//                             >
//                               <AddIcon />
//                             </Fab>
//                           </Tooltip>
//                         </Grid>
//                         {addadditionalFields?.map((desc, index) => {
//                           return (
//                             <>
//                               <Grid
//                                 item
//                                 xs={4}
//                                 lg={5}
//                                 style={{
//                                   display:
//                                     handlePermission.engineering_Data_Create ||
//                                     handlePermission.engineering_Data_Delete
//                                       ? "block"
//                                       : "none",
//                                 }}
//                               >
//                                 <TextField
//                                   id={desc.id}
//                                   label="Field Name"
//                                   disabled={
//                                     !handlePermission.engineering_Data_Create &&
//                                     handlePermission.engineering_Data_Delete
//                                   }
//                                   value={desc.fieldName}
//                                   onChange={(e) =>
//                                     handleAddFieldNameChange(e, index)
//                                   }
//                                 />
//                               </Grid>
//                               <Grid
//                                 item
//                                 xs={4}
//                                 lg={5}
//                                 style={{
//                                   display:
//                                     handlePermission.engineering_Data_Create ||
//                                     handlePermission.engineering_Data_Delete
//                                       ? "block"
//                                       : "none",
//                                 }}
//                               >
//                                 <TextField
//                                   id={desc.id}
//                                   label="Field Value"
//                                   value={desc.fieldValue}
//                                   disabled={
//                                     !handlePermission.engineering_Data_Create &&
//                                     handlePermission.engineering_Data_Delete
//                                   }
//                                   onChange={(e) =>
//                                     handleAddFieldValueChange(e, index)
//                                   }
//                                   style={{ marginLeft: "10px" }}
//                                 />
//                               </Grid>
//                               <Grid item xs={4} lg={2}>
//                                 <IconButton
//                                   aria-label="delete"
//                                   onClick={() =>
//                                     handleAddDeleteField(desc, index)
//                                   }
//                                   style={{
//                                     marginTop: "15px",
//                                     display:
//                                       handlePermission.engineering_Data_Delete
//                                         ? "block"
//                                         : "none",
//                                   }}
//                                 >
//                                   <DeleteIcon />
//                                 </IconButton>
//                               </Grid>
//                             </>
//                           );
//                         })}
//                       </Grid>
//                       {/* )} */}

//                       {/* <Grid item xs={12} lg={12} style={{ position: "relative" }}>
//                   <p style={{ margin: "20px 0" }}>
//                     <strong>Asset Image: </strong>
//                   </p>
//                   <input
//                     accept="image/png"
//                     className={classes.file}
//                     id="asset-button-file"
//                     type="file"
//                     onChange={(e) => {
//                       setprogress((prev) => ({ ...prev, show: true }));
//                       setFieldValue("assetImage", e.target.files[0]);
//                       seteditassetUpImg((prev) => {
//                         return {
//                           ...prev,
//                           assetImage: e.target.files[0],
//                           tempAssetImagePic: URL.createObjectURL(
//                             e.target.files[0]
//                           ),
//                         };
//                       });
//                       const reader = new FileReader();
//                       reader.addEventListener("progress", (event) => {
//                         const percent = Math.round(
//                           (event.loaded / event.total) * 100
//                         );
//                         console.log("percent", percent);
//                         setprogress((prev) => ({
//                           ...prev,
//                           percent: percent,
//                         }));
//                         if (percent === 100) {
//                           setTimeout(
//                             () =>
//                               setprogress((prev) => ({
//                                 ...prev,
//                                 show: false,
//                               })),
//                             1000
//                           );
//                         }
//                       });

//                       reader.addEventListener("load", (event) =>
//                         console.log("event.target.result", event)
//                       );

//                       reader.readAsBinaryString(e.target.files[0]);
//                     }}
//                   />
//                   {/* <label htmlFor="asset-button-file">
//                     <IconButton
//                       color="primary"
//                       aria-label="upload picture"
//                       component="span"
//                       className={classes.icon}
//                     >
//                       <PhotoCamera />
//                     </IconButton>
//                   </label> */}

//                       {/* <img
//                     className={classes.image}
//                     src={editassetUpImg.tempAssetImagePic || NoIMG}
//                     alt="profile Image"
//                   /> */}
//                       {/* <span style={{ color: "red" }}>{errors[`assetImage`]}</span>
//                   {progress.show && (
//                     <div style={{ marginTop: "50px" }}>
//                       <LinearProgress
//                         variant="determinate"
//                         value={progress.percent}
//                       />
//                       <span>Uploading ...</span>
//                     </div>
//                   )}
//                 // </Grid> */}

//                       <Grid
//                         item
//                         xs={6}
//                         sm={6}
//                         lg={6}
//                         style={{
//                           marginTop: "2rem",
//                           display: "flex",
//                           justifyContent: "center",
//                         }}
//                       >
//                         <input
//                           type={"submit"}
//                           fullWidth
//                           variant="contained"
//                           className={classes.button}
//                           style={{ width: "150px", borderRadius: "5px" }}
//                         />
//                       </Grid>
//                       <Grid
//                         item
//                         xs={6}
//                         sm={6}
//                         lg={6}
//                         style={{
//                           marginTop: "2rem",
//                           display: "flex",
//                           justifyContent: "center",
//                         }}
//                       >
//                         <Button
//                           type="button"
//                           fullWidth
//                           variant="contained"
//                           className={classes.button}
//                           color="primary"
//                           onClick={() => NAVIGATE(-1)}
//                           style={{ width: "150px" }}
//                         >
//                           Cancel
//                         </Button>
//                       </Grid>
//                     </Grid>
//                   </form>
//                 )}
//               </Formik>
//             </div>
//           </div>
//         </div>
//       </>
//     </>
//   );
// };

// export default EngineeringData;
