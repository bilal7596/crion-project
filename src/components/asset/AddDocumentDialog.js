import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { useDispatch, useSelector } from "react-redux";
import { addDoc, uploadAssociateDocs } from "../../Api/Documents/DocumentApi";
import { getAllDynamicForms } from "../../Api/DynamicForm/dynamicFormApi";
import { commonActions } from "../../Store/Reducers/CommonReducer";
import { getUser, removeUserSession } from "../../utils/clonosCommon";
import { useContext } from "react";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: "90%",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  button: {
    backgroundColor: "#007bfd",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#007bfd",
      color: "#fff",
    },
  },
  input: {
    display: "none",
  },
}));

export default function AddDocumentDialog(props) {
  const classes = useStyles();
  const USER_DETAILS = getUser();
  const [docType, setdocType] = React.useState("");
  const [docName, setdocName] = React.useState("");
  const [selectedTemp, setselectedTemp] = React.useState("");
  const [selectedFile, setselectedFile] = React.useState(null);
    // const selector = useSelector((state) => state.formData.allForms);
  const [allDynamicForms, setallDynamicForms] = useState([]);
  const handlesetDocTypeChange = (event) => {
    setdocType(event.target.value);
    // console.log("selector", selector);
  };
  const dispatch = useDispatch();

  const handleChangeTemplateSelect = (event) => {
    setselectedTemp(event.target.value);
  };

  const handleFileChange = (e) => {
    // console.log("handleFileChange", e.target.files[0]);
    setselectedFile(e.target.files[0]);

    dispatch(commonActions.showApiLoader(true));
    if (e.target.files.length > 5) {
      dispatch(commonActions.showApiLoader(false));
      dispatch(
        commonActions.handleSnackbar({
          show: true,
          message: `Maximum 5 files can be upload at once`,
          type: "error",
        })
      );
      return;
    } else {
      let formData = new FormData();
      const USER_DETAILS = getUser();
      // console.log("USER_DETAILS", USER_DETAILS);
      // console.log("e.target.files", e.target.files);
      for (let i = 0; i < e.target.files.length; i++) {
        // if (
        //   e.target.files[i].type === "application/pdf" ||
        //   e.target.files[i].type ===
        //     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        //   e.target.files[i].type === "text/csv"
        // ) {
        //   formData.append(`file${i}`, e.target.files[i]);
        // }
        formData.append(`file${i}`, e.target.files[i]);
      }
      formData.append("assetId", props.AssetData.assetId);
      formData.append("userId", USER_DETAILS.userId);
      formData.append("noOfFiles", e.target.files.length);
      
      uploadAssociateDocs(formData)
        .then((res) => {
          // console.log("uploadAssociateDocs RESPONSE", res);
          //   setrenderTable((prev) => !prev);
          setselectedFile("");
          setselectedTemp("");
          setdocName("");
          setdocType("");
          dispatch(commonActions.showApiLoader(false));
          dispatch(
            commonActions.handleSnackbar({
              show: true,
              message: res.data.message,
              type: "success",
            })
          );

          props.HandleClose();
        })
        .catch((err) => {
          if(err.response.data.status=== 401 && JSON.parse(localStorage.getItem("loginUser")) !== null){
            dispatch(commonActions.handleExpiryAlert(true));
            removeUserSession();
            localStorage.removeItem("loginUser")
          } else {
            // console.log("uploadAssociateDocs ERROR", err);
            //   setrenderTable((prev) => !prev);
            setselectedFile("");
            setselectedTemp("");
            setdocName("");
            setdocType("");
            props.HandleClose();
            dispatch(commonActions.showApiLoader(false));
            dispatch(
              commonActions.handleSnackbar({
                show: true,
                message: `${err.response.data.error}`,
                type: "error",
              })
            );
          }
        });
    }
  };

  const handleDocNameChange = (e) => setdocName(e.target.value);

    const CreateDoc = () => {
      // console.log(
      //   "CreateDoc docType uuid selectedTemp",
      //   docType,
      //   props.AssetData.assetId,
      //   selectedTemp
      // );
      let selectedTemplate = allDynamicForms.filter(
        (temp) => temp.formId === selectedTemp
      );

      // console.log("selectedTemplate",selectedTemplate);
      const data = {
        objectId: props.AssetData.assetId,
        name: docName,
        linkedType: "asset",
        formid : selectedTemplate[0].formId
      }

      // console.log("data",data);
      addDoc(data)
        .then((res) => {
          // console.log("addDoc API RESPONSE", res);
          
          setselectedTemp("");
          setdocName("");
          setdocType("");

          dispatch(
            commonActions.handleSnackbar({
              show: true,
              message: `Document created successfully`,
              type: "success",
            })
          );


          props.HandleClose()
        })
        .catch((err) => {
          if(err.response.data.status=== 401 && JSON.parse(localStorage.getItem("loginUser")) !== null){
            dispatch(commonActions.handleExpiryAlert(true));
            removeUserSession();
            localStorage.removeItem("loginUser")
          } else {
            setselectedTemp("");
            setdocName("");
            setdocType("");
            dispatch(
              commonActions.handleSnackbar({
                show: true,
                message: `${err.response.data.error}`,
                type: "error",
              })
            );
            props.HandleClose()
          }
        });
    };
  useEffect(() => {
    getAllDynamicForms()
      .then((res) => {
        // console.log("getAllDynamicForms RESPONSE", res);
        setallDynamicForms(res.data);
        
      })
      .catch((err) => {
        if(err.response.data.status=== 401 && JSON.parse(localStorage.getItem("loginUser")) !== null){
          dispatch(commonActions.handleExpiryAlert(true));
          removeUserSession();
          localStorage.removeItem("loginUser")
        }
      })
  }, []);
  return (
    <div>
      <Dialog
        open={props.OpenModal}
        onClose={props.HandleClose}
        aria-labelledby="form-dialog-title"
        fullWidth={true}
        maxWidth={"sm"}
      >
        <DialogTitle id="form-dialog-title">Create Document</DialogTitle>
        <DialogContent>
          {docType === "template" && (
            <TextField
              id="doc-name"
              label="Name"
              variant="outlined"
              style={{ width: "90%", margin: "1rem 0 1rem 0.5rem" }}
              onChange={handleDocNameChange}
              value={docName}
            />
          )}
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="demo-simple-select-outlined-label">
              Document Type
            </InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={docType}
              onChange={handlesetDocTypeChange}
              label="Document Type"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={"template"}>Dynamic Form</MenuItem>
              <MenuItem value={"template"}>Checklist Form</MenuItem>
              <MenuItem value={"document"}>Upload</MenuItem>
            </Select>
          </FormControl>
          {docType === "template" && (
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="select-temp-outlined-label">
                Select Form
              </InputLabel>
              <Select
                labelId="select-temp"
                id="select-temp"
                value={selectedTemp}
                onChange={handleChangeTemplateSelect}
                label="Document Type"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {allDynamicForms.map((template) => (
                  <MenuItem value={template.formId}>
                    {template.formName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          {docType === "document" && (
            <div style={{ textAlign: "center", margin: "1rem 0" }}>
              <input
                // accept="image/*"
                className={classes.input}
                id="contained-button-file"
                type="file"
                onChange={handleFileChange}
              />
              <label htmlFor="contained-button-file">
                <Button variant="contained" color="primary" component="span">
                  Upload
                </Button>
              </label>
              {selectedFile !== null && (
                <p style={{ color: "gray" }}>
                  Selected File : {selectedFile.name}
                </p>
              )}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={props.HandleClose} color="secondary">
            Cancel
          </Button>
          <Button color="primary" onClick={CreateDoc}>Create</Button>
          
        </DialogActions>
      </Dialog>
    </div>
  );
}
