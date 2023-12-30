import { Button, Grid, LinearProgress, TextField } from "@material-ui/core";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getAllDynamicForms,
  saveFormData,
} from "../../Api/DynamicForm/dynamicFormApi";
import { commonActions } from "../../Store/Reducers/CommonReducer";

import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";

import FormGroup from "@material-ui/core/FormGroup";
import Checkbox from "@material-ui/core/Checkbox";
import { Menu } from "@material-ui/core";

import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Input from "@material-ui/core/Input";
import Tooltip from "@material-ui/core/Tooltip";
import EditIcon from "@material-ui/icons/EditOutlined";
import DoneIcon from "@material-ui/icons/DoneAllTwoTone";
import RevertIcon from "@material-ui/icons/NotInterestedOutlined";
import DeleteIcon from "@material-ui/icons/Delete";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { deepCopy, uid } from "./commonFunctions";
import { getUser } from "../../utils/clonosCommon";
import debounce from "lodash.debounce";
import { documentActions } from "../../Store/Reducers/ClonosDocumentReducer";
import { faPersonWalkingDashedLineArrowRight } from "@fortawesome/free-solid-svg-icons";
import defaultImageForImgAttribute from "../../assets/images/No_image_available.png";
import ClonosErrorAndWarningDialog from "../Dialogs/ClonosErrorAndWarningDialog";

const AddFormData = () => {
  const location = useLocation();
  const user = getUser();
  const NAVIGATE = useNavigate();
  const dispatch = useDispatch();
  const [form, setform] = useState([]);
  const [showAction, setShowAction] = useState(false);
  const formAttributes = useSelector(
    (state) => state.documentData.addFormAttrs
  );
  console.log("formAttributes:", formAttributes);
  console.log("formData:", form);

  // These state will be tage record of the image upload
  const [imageProgress, setImageProgress] = useState({});
  console.log("imageProgress:", imageProgress);

  // Current I don't know about this state
  const [previewImgOfSelectedImages, setPreviewImgOfSelectedImages] = useState(
    {}
  );

  // console.log("userUpImg:", userUpImg);
  // For store the value of the input tag in which our image sourse will be store
  const [fieldValues, setFieldValues] = useState({});
  let clonedFormAttributes = deepCopy(formAttributes);

  const [errorAndWarningState, setErrorAndWarningState] = useState(false);

  useEffect(() => {
    getAllDynamicForms()
      .then((res) => {
        console.log("res:", res);
        console.log("getAllDynamicForms RESPONSE", res.data, location);
        // const getFormById = res?.data?.filter((form) => {
        //   return (
        //     (location?.state?.formid || location?.state?.formId) === form.formId
        //   );
        // });
        const getFormById = res?.data?.filter(
          (form) => location?.state?.formid === form.formId
        );
        console.log("getFormById:", getFormById);
        // if(!getFormById.length) NAVIGATE("/dynamic-form")
        if (!getFormById.length) {
          setErrorAndWarningState(true);
        } else {
          setErrorAndWarningState(false);
        }
        console.log("getFormById:", getFormById);
        console.log("LOCATION", location);
        setform(getFormById[0]?.formFields || location.state.row.formFields);
        dispatch(
          documentActions.setAddFormAttrs(
            getFormById[0]?.formFields || location.state.row.formFields
          )
        );
      })
      .catch((err) => {
        console.log("getAllDynamicForms ERROR", err);
      });
  }, []);

  useEffect(() => {
    return () => {
      debouncedHandleChangeValue.cancel();
    };
  }, []);

  console.log("errorAndWarningState:", errorAndWarningState);

  //   const handleChangeValue = (field, e, index, attrsArr) => {
  //     // for (let i = 0; i < attrsArr.length; i++) {
  //     //   if (field.id === attrsArr[i].id) {
  //     //     attrsArr[i].fieldValue = e.target.value;
  //     //   }
  //     //   if (Array.isArray(attrsArr[i].fieldValue)) {
  //     //     handleChangeValue(field, e, index,attrsArr[i].fieldValue);
  //     //   }
  //     // }
  // console.log(field,attrsArr,"hiiiiiiiiii")

  //     const updatedAttrsArr = attrsArr.map((attr) => {
  //       if (attr.id === field.id) {
  //         return { ...attr, fieldValue: e.target.value };
  //       }
  //       // if (Array.isArray(attr.fieldValue)) {
  //       //   console.log("inside array")
  //       //   return {
  //       //     ...attr,
  //       //     fieldValue: handleChangeValue(field, e, index, attr.fieldValue),
  //       //   };
  //       // }
  //       // console.log("outside array")
  //       if(Array.isArray(attr.fieldValue) && attr.attrName === "Map"){
  //         console.log("inside")
  //         const tempArr = attr.fieldValue.map((item) => {
  //           if(item.id === field.id){
  //             return {...item,fieldValue:e.target.value}
  //           }
  //           return item
  //         })
  //         return {...attr,fieldValue: tempArr}
  //       }
  //       return attr;
  //     });
  //     console.log(updatedAttrsArr,"updatedAttrr??????????????")
  //     // return updatedAttrsArr;
  //     dispatch(documentActions.setAddFormAttrs(updatedAttrsArr));
  //   };

  const helperFunction = (field, e, index, attrsArr) => {
    console.log("e:", e);
    console.log("field:", field);
    console.log("index:", index);
    console.log("attrsArr:", attrsArr);
    const updateFieldValue = (arr) => {
      // alert("update field value");
      return arr.map((item) => {
        if (item.id === field.id) {
          return { ...item, fieldValue: e.target.value };
        }
        if (Array.isArray(item.fieldValue)) {
          return { ...item, fieldValue: updateFieldValue(item.fieldValue) };
        }
        return item;
      });
    };
    const updatedAttrsArr = attrsArr.map((attr) => {
      // alert("inside the updated attrsArr");
      console.log("attrsArr:", attrsArr);
      console.log("fieldValues:", fieldValues);

      console.log("attr.id === field.id:", attr.id, field.id);

      if (attr.id === field.id) {
        console.log("attr:", attr);
        return { ...attr, fieldValue: e.target.value };
      }
      if (Array.isArray(attr.fieldValue)) {
        return { ...attr, fieldValue: updateFieldValue(attr.fieldValue) };
      }
      return attr;
    });
    console.log(updatedAttrsArr, "jasndjk");
    dispatch(documentActions.setAddFormAttrs(updatedAttrsArr));
  };

  const debouncedHandleChangeValue = debounce(helperFunction, 500);

  const handleChangeValue = (field, e, index, attrsArr) => {
    debouncedHandleChangeValue(field, e, index, attrsArr);
    console.log("e.target.value:", e.target.value);
    return e.target.value;
  };

  const handleDropdownValChange = (e, field, index) => {
    console.log("hello");
    let newTempArr = deepCopy(formAttributes);

    newTempArr[index].choosedValue = e.target.value;
    setform(newTempArr);
    dispatch(documentActions.setAddFormAttrs(newTempArr));
  };

  const handleCheckChange = (e, field, index, optionIndex) => {
    let newTempArr = deepCopy(formAttributes);
    newTempArr[index].fieldValue[optionIndex].isChecked = e.target.checked;
    setform(newTempArr);
    dispatch(documentActions.setAddFormAttrs(newTempArr));
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const [fontSize, setFontSize] = useState(16);
  const [selectedFieldType, setSelectedFieldType] = useState("text-1");

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFontSizeChange = (size, elem, field, index, attrsArr) => {
    setFontSize(size); // set font size
    handleClose();
    const updatedAttrsArr = attrsArr.map((attr) => {
      console.log(attr, field, "@@@@@@@@@@@@@@@@");
      if (attr.id === field.id) {
        console.log("entered");
        return {
          ...attr,
          fieldValue:
            elem === "h4" ? (
              <h4>{field.fieldName}</h4>
            ) : elem === "h5" ? (
              <h5>{field.fieldName}</h5>
            ) : (
              <p>{field.fieldName}</p>
            ),
        };
      }
      // if (Array.isArray(attr.fieldValue)) {
      //   console.log("inside array")
      //   return {
      //     ...attr,
      //     fieldValue: handleChangeValue(field, e, index, attr.fieldValue),
      //   };
      // }
      // console.log("outside array")
      return attr;
    });
    console.log(updatedAttrsArr, "updatedAttrr??????????????");
    // return updatedAttrsArr;
    dispatch(documentActions.setAddFormAttrs(updatedAttrsArr));
  };

  const handleFieldTypeChange = (fieldType) => {
    setSelectedFieldType(fieldType); // set selected field type
  };
  const handleFieldType = (field, index) => {
    console.log(field, field.fieldType, "..............??");
    // let inputVal = "";
    // formAttributes.map((att) => {
    //   if(Array.isArray(att.fieldValue)){
    //     att.fieldValue.map((item) => {
    //       if(item.id === field.id){
    //         inputVal = item.fieldValue
    //       }
    //     })
    //   } else {
    //     if(att.id === field.id){
    //       inputVal = att.fieldValue
    //     }
    //   }
    //   console.log(inputVal,"vla")
    // })
    if (field.fieldType === "text") {
      return (
        <TextField
          style={{ width: "100%" }}
          variant="outlined"
          onChange={(e) => {
            handleChangeValue(field, e, index, clonedFormAttributes);
            // dispatch(documentActions.setAddFormAttrs(updatedAttrsArr));
          }}
        ></TextField>
      );
    } else if (field.fieldType === "date") {
      return (
        <input
          style={{ width: "100%", margin: "1rem 0", padding: "0.5rem 0" }}
          type={"date"}
          onChange={(e) =>
            handleChangeValue(field, e, index, clonedFormAttributes)
          }
        />
      );
    } else if (field.fieldType === "number") {
      return (
        <input
          style={{ width: "100%", margin: "1rem 0", padding: "0.5rem 0" }}
          type={"number"}
          onChange={(e) =>
            handleChangeValue(field, e, index, clonedFormAttributes)
          }
        />
      );
    } else if (field.fieldType === "text-1") {
      return (
        <>
          <Button onClick={handleClick}>Font Size</Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem
              onClick={() =>
                handleFontSizeChange(
                  16,
                  "p",
                  field,
                  index,
                  clonedFormAttributes
                )
              }
            >
              Normal
            </MenuItem>
            <MenuItem
              onClick={() =>
                handleFontSizeChange(
                  18,
                  "h4",
                  field,
                  index,
                  clonedFormAttributes
                )
              }
            >
              H4
            </MenuItem>
            <MenuItem
              onClick={() =>
                handleFontSizeChange(
                  20,
                  "h5",
                  field,
                  index,
                  clonedFormAttributes
                )
              }
            >
              H5
            </MenuItem>
          </Menu>
          {/* <strong style={{ fontSize: `${fontSize}px` }}>{props.fieldName}</strong> */}
        </>
      );
    } else if (field.fieldType === "checkbox") {
      return (
        <FormControl component="fieldset">
          <FormLabel component="legend">{field.fieldName}</FormLabel>
          <FormGroup>
            {field?.fieldValue?.map((option, optionIndex) => {
              return (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={option.isChecked}
                      onChange={(e) =>
                        handleCheckChange(e, field, index, optionIndex)
                      }
                      name={option.optionValue}
                    />
                  }
                  label={option.optionValue}
                />
              );
            })}
          </FormGroup>
        </FormControl>
      );
    } else if (field.fieldType === "radio") {
      return (
        <FormControl component="fieldset">
          <FormLabel component="legend">{field.fieldName}</FormLabel>
          <RadioGroup
            aria-label={field.fieldName}
            name={field.fieldName}
            value={field.choosedValue}
            onChange={(e) => handleDropdownValChange(e, field, index)}
          >
            {field?.fieldValue?.map((option) => {
              return (
                <FormControlLabel
                  value={option.optionValue}
                  control={<Radio />}
                  label={option.optionValue.toUpperCase()}
                />
              );
            })}
          </RadioGroup>
        </FormControl>
      );
    } else if (field.fieldType === "dropdown") {
      return (
        <FormControl variant="outlined" fullWidth>
          <InputLabel id={`${field.id}-${field.fieldName}`}>
            {field.fieldName}
          </InputLabel>
          <Select
            labelId={`${field.id}-${field.fieldName}`}
            id={field.id}
            value={field.choosedValue}
            onChange={(e) => handleDropdownValChange(e, field, index)}
            label={field.fieldName}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {field?.fieldValue?.map((option) => {
              return (
                <MenuItem key={option.optionId} value={option.optionValue}>
                  {option.optionValue}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      );
    } else if (field.fieldType === "file") {
      return (
        <div
          style={{
            display: "flex",
            width: "100%",
            gap: "20px",
            flexDirection: "column-reverse",
            alignItems: "center",
          }}
        >
          {/* File input field */}
          <input
            accept="image/*"
            id={`${field.id}`}
            style={{ visibility: "hidden" }}
            multiple
            type="file"
            onChange={(e) => {
              handleChangeValue(field, e, index, clonedFormAttributes);

              // Update image progress state
              setImageProgress({
                ...imageProgress,
                [field.id]: { percent: 0, show: true },
              });

              // Set user uploaded image URL
              setPreviewImgOfSelectedImages((prev) => ({
                ...prev,
                [field.id]: URL.createObjectURL(e.target.files[0]),
              }));

              // Set field values using setFieldValues function
              setFieldValues((prev) => ({
                ...prev,
                [field.id]: e.target.files[0],
              }));
              console.log("fieldValues:", fieldValues);

              // Read the selected file as binary string
              const reader = new FileReader();

              // Progress event listener for updating upload progress
              reader.addEventListener("progress", (event) => {
                const percent = Math.round((event.loaded / event.total) * 100);

                // Update image progress state with the current progress
                setImageProgress((prev) => ({
                  ...prev,
                  [field.id]: { ...prev[field.id], percent },
                }));

                // Reset image progress state after the upload is complete
                if (percent === 100) {
                  setTimeout(
                    () =>
                      setImageProgress({
                        ...imageProgress,
                        [field.id]: { percent: 0, show: false },
                      }),
                    1000
                  );
                }
              });

              reader.addEventListener("load", (event) =>
                console.log("event.target.result", event)
              );

              // Read the selected file as binary string
              reader.readAsBinaryString(e.target.files[0]);
            }}
            name="image"
          />

          {/* Label for the file input */}
          <label htmlFor={`${field.id}`} style={{ width: "100%" }}>
            {/* Button for triggering file input */}
            <Button
              variant="contained"
              color="primary"
              component="span"
              fullWidth
            >
              Upload {field.fieldName}
            </Button>
          </label>

          {/* Container for displaying uploaded image */}
          <div
            style={{
              width: "200px",
              height: "120px",
              flex: "1",
              boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
              padding: "2px",
              borderRadius: "5px",
            }}
          >
            {/* Uploaded image */}
            <img
              style={{ objectFit: "contain", height: "100%", width: "100%" }}
              src={
                previewImgOfSelectedImages[field.id]
                  ? previewImgOfSelectedImages[field.id]
                  : defaultImageForImgAttribute
              }
              alt="Profile Image"
            />

            {/* Instructions for uploading image */}
            <div>
              <span style={{ fontSize: "10px", color: "gray" }}>
                1) Please upload passport size photo
              </span>
              <br />
              <span style={{ fontSize: "10px", color: "gray" }}>
                2) Image should not exceed above 2Mb
              </span>
            </div>

            {/* Upload progress */}
            {imageProgress[field.id]?.show && (
              <div>
                <LinearProgress
                  variant="determinate"
                  value={imageProgress[field.id].percent}
                />
                <span style={{ fontSize: "10px" }}>Uploading ...</span>
              </div>
            )}
          </div>
        </div>
      );
    }
  };

  const HandleRenderTable = ({ field, index }) => {
    const [selectedTableRow, setselectedTableRow] = useState("");
    const [tempTableFormfields, settempTableFormfields] = useState([]);

    const addNewRowTable = () => {
      setShowAction(true);
      let newTempArr = deepCopy(formAttributes);
      let newRow = {
        rowId: uid(),
      };
      newTempArr[index].fieldValue.headers?.forEach((head) => {
        newRow[`${head.headerId}`] = "";
      });
      newTempArr[index].fieldValue.tableData = [
        ...newTempArr[index].fieldValue.tableData,
        newRow,
      ];
      setform(newTempArr);
      dispatch(documentActions.setAddFormAttrs(newTempArr));
      console.log("newRow", newRow);
    };

    const onEditingDone = (rowId, data, i) => {
      let newTempArr = form?.map((a) => ({ ...a }));
      newTempArr[index].fieldValue = tempTableFormfields;
      setselectedTableRow("");
      setform(newTempArr);
      dispatch(documentActions.setAddFormAttrs(newTempArr));
    };

    const onRevert = () => {
      setselectedTableRow("");
    };

    const onToggleEditMode = (id) => {
      setselectedTableRow(id);
    };

    const onChangeData = (e, headId, i) => {
      let newTableDataFields = deepCopy(tempTableFormfields);

      newTableDataFields.tableData[i][headId] = e.target.value;
      settempTableFormfields(newTableDataFields);
    };

    useEffect(() => {
      let newTempArr = deepCopy(formAttributes);
      console.log("HandleRenderTable newTempArr", newTempArr);
      const tableDataFields = newTempArr[index]?.fieldValue;
      settempTableFormfields(tableDataFields);
    }, [formAttributes]);
    console.log(field, ">>>>>>>>>>>>>>>>_____-------");

    return (
      <>
        <Table
          size="small"
          aria-label="purchases"
          style={{ boxShadow: "0px 0px 5px #bcbcbc" }}
        >
          <TableHead style={{ backgroundColor: "#3f51b5" }}>
            <TableRow>
              {/* <TableCell></TableCell> */}
              <TableCell style={{ color: "#fff" }}>S.No</TableCell>
              {showAction ? (
                <TableCell style={{ color: "#fff" }}>Action</TableCell>
              ) : (
                <></>
              )}
              {field.fieldValue?.headers?.map((head) => {
                return (
                  <TableCell style={{ color: "#fff" }} key={head.headId}>
                    {head.name}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {tempTableFormfields?.tableData?.map((data, i) => {
              console.log("selectedTableRow", selectedTableRow);
              return (
                <TableRow key={i}>
                  <TableCell>{i + 1}</TableCell>
                  {selectedTableRow === data.rowId ? (
                    <TableCell style={{ color: "#fff" }}>
                      <IconButton
                        aria-label="done"
                        onClick={() => onEditingDone(data.rowId, data, i)}
                      >
                        <DoneIcon />
                      </IconButton>
                      <IconButton
                        aria-label="revert"
                        onClick={() => onRevert(data.rowId)}
                      >
                        <RevertIcon />
                      </IconButton>
                    </TableCell>
                  ) : showAction ? (
                    <TableCell>
                      <IconButton
                        aria-label="delete"
                        onClick={() => onToggleEditMode(data.rowId, data)}
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  ) : (
                    <></>
                  )}
                  {tempTableFormfields?.headers?.map((head, headIndex) => {
                    return (
                      <TableCell>
                        {selectedTableRow === data.rowId ? (
                          <Input
                            value={data[head.headerId]}
                            name={data[head.headerId]}
                            onChange={(e) =>
                              onChangeData(e, `${head.headerId}`, i)
                            }
                          />
                        ) : (
                          data[head.headerId]
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <Tooltip title="Add New Row">
          <IconButton aria-label="Add New Row" onClick={addNewRowTable}>
            <AddCircleOutlineIcon />
          </IconButton>
        </Tooltip>
      </>
    );
  };
  const handleSaveData = () => {
    console.log("entered save data");
    const loggedUserId = getUser();

    const formFields = formAttributes?.map((field) => {
      // console.log(field,"field..............")
      return {
        ...field,
        submittedBy: loggedUserId.userId,
      };
    });

    // here we are creating data for backend
    let lcData = {};
    formFields.map((ele) => {
      if (lcData[ele.id] == undefined) lcData[ele.id] = ele;
    });

    let formData = new FormData();
    const USER_DETAILS = getUser();

    function convertToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }

    async function convertFieldValuesToBase64(fieldValues) {
      var base64FieldValues = {};

      for (var key in fieldValues) {
        if (fieldValues.hasOwnProperty(key)) {
          var fileData = fieldValues[key];
          var file = new File([fileData], fileData.name, {
            type: fileData.type,
            lastModified: fileData.lastModified,
          });
          var base64Data = await convertToBase64(file);
          base64FieldValues[key] = base64Data;
        }
      }

      return base64FieldValues;
    }

    convertFieldValuesToBase64(fieldValues)
      .then((base64FieldValues) => {
        console.log("base64FieldValues:", base64FieldValues);
        let temp = [];
        let formFieldsArray = formFields.map((ele) => {
          return { [ele.id]: ele };
        });
        for (let key in base64FieldValues) {
          temp.push({ [key]: base64FieldValues[key] });
        }
        console.log("formFieldsArray:", formFieldsArray);
        console.log("temp:", temp);

        var jsonString = JSON.stringify(temp);
        console.log("jsonString:", jsonString);
        formData.append("imageData", jsonString);
        formData.append("formId", location?.state?.formid);
        formData.append("assetId", location?.state?.assetId);
        formData.append("userId", USER_DETAILS.userId);
        formData.append("formFields", JSON.stringify(formFieldsArray));
        console.log("lcData:", lcData);
        console.log("formFields:", formFields);

        console.log("fieldValues:", fieldValues);
        // return;
        saveFormData(formData)
          .then((res) => {
            console.log("res:", res);
            // console.log("saveFormData data", data);
            dispatch(
              commonActions.handleSnackbar({
                show: true,
                message: `Data added successfully`,
                type: "success",
              })
            );
            NAVIGATE(-1);
          })
          .catch((err) => {
            console.log("saveFormData ERROR", err);
            dispatch(
              commonActions.handleSnackbar({
                show: true,
                message: `${err.response.data.message}`,
                type: "error",
              })
            );
          });
      })
      .catch((error) => {
        console.error("Error converting field values to Base64:", error);
      });
  };

  const HandleRenderMap = ({ fieldVals, index }) => {
    console.log("HandleRenderMap fieldVals", fieldVals);
    return (
      <>
        <Grid
          style={{ border: "1px solid #bcbcbc", padding: "1rem" }}
          container
        >
          {fieldVals?.map((field, i) => {
            return (
              <>
                <Grid item style={{ marginBottom: "20px" }} xs={6}>
                  {field.fieldName}
                </Grid>
                <Grid item style={{ marginBottom: "20px" }} xs={6}>
                  {handleFieldType(field, index)}
                </Grid>
                {field.fieldType === "object" && (
                  <HandleRenderMap fieldVals={field.fieldValue} index={i} />
                )}
              </>
            );
          })}
        </Grid>
      </>
    );
  };
  console.log("rendered", formAttributes);
  console.log("location.state:", location.state);
  return (
    <>
      <div className="addFormWrapper">
        <h2
          style={{
            textAlign: "center",
            fontFamily: "calibri",
            color: "#3f51b5",
          }}
        >
          Add Data
        </h2>
        <div className="addFormBox">
          <h5 style={{ textAlign: "center" }}>
            Document Name: {location.state?.name}
          </h5>

          {formAttributes?.length &&
            formAttributes?.map((field, index) => {
              // console.log('formAttributes:', formAttributes)
              // console.log("fieldType", field.fieldType);
              return (
                <>
                  <Grid
                    container
                    key={field.id}
                    style={{
                      margin: "20px 0",
                    }}
                  >
                    {/* ----------------------------------------------------------------------------------------------------------------------------------------------- */}

                    <Grid item xs={12} md={6} lg={6}>
                      <strong
                        style={{
                          fontSize:
                            field.fieldType === "text-1"
                              ? `${fontSize}px`
                              : "inherit",
                        }}
                      >
                        {field.fieldName}
                      </strong>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6}>
                      {handleFieldType(field, index)}
                    </Grid>
                  </Grid>
                  {field.fieldType === "table" && (
                    <HandleRenderTable field={field} index={index} />
                  )}
                  {field.fieldType === "object" && (
                    <HandleRenderMap
                      fieldVals={field.fieldValue}
                      index={index}
                    />
                  )}
                </>
              );
            })}
        </div>
        <div style={{ textAlign: "center", margin: "2rem 0 0" }}>
          <Button variant="contained" color="primary" onClick={handleSaveData}>
            Save
          </Button>
        </div>
        <ClonosErrorAndWarningDialog
          status={errorAndWarningState}
          header="suggestion"
          title="You don't have dynamic forms"
          navigator="dynamic-form"
          wantToNavigate={false}
        />
      </div>
    </>
  );
};

export default AddFormData;

const data = [
  {
    id: 1,
    attrName: "map",
    fieldValue: [
      {
        id: 11,
        fieldValue: "",
      },
      {
        id: 12,
        fieldValue: "",
      },
    ],
  },
];
