import { Button, Grid, LinearProgress, TextField } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
// import {
//   getAllDynamicForms,
//   saveFormData,
// } from "../../Api/DynamicForm/dynamicFormApi";
import {
  getAllChecklistForms,
  getAllDynamicForms,
  saveFormData,
} from "../../Api/ChecklistForm/checklistFormApi";
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
// import { deepCopy, uid } from "./commonFunctions";
import { getUser } from "../../utils/clonosCommon";
import debounce from "lodash.debounce";
import { documentActions } from "../../Store/Reducers/ClonosDocumentReducer";
import { faPersonWalkingDashedLineArrowRight } from "@fortawesome/free-solid-svg-icons";
import defaultImageForImgAttribute from "../../assets/images/No_image_available.png";
import { deepCopy, uid } from "../dynamicForms/commonFunctions";
import ClonosConfirmationDialog from "../Dialogs/ClonosErrorAndWarningDialog";

const AddChecklistFormData = () => {
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
    console.log("location", location);

    getAllChecklistForms()
      .then((res) => {
        console.log("getAllDynamicForms RESPONSE", res.data, location);
        const getFormById = res?.data?.filter((form) => {
          console.log(form);
          return (
            (location?.state?.formid || location?.state?.formId) === form.formId
          );
        });
        console.log("getFormById", getFormById, location);

        // if(!getFormById.length) NAVIGATE("/checklist-form")
        if (!getFormById.length) {
          setErrorAndWarningState(true);
        } else {
          setErrorAndWarningState(false);
        }

        setform(getFormById[0]?.formFields || location.state.row.formFields);
        dispatch(
          documentActions.setAddFormAttrs(
            getFormById[0]?.formFields || location.state.row.formFields
          )
        );
      })
      .catch((err) => console.log("getAllDynamicForms ERROR", err));
  }, []);

  useEffect(() => {
    return () => {
      debouncedHandleChangeValue.cancel();
    };
  }, []);

  const helperFunction = (field, e, index, attrsArr) => {
    console.log("e:", e);
    console.log("field:", field);
    console.log("index:", index);
    console.log("attrsArr:", attrsArr);
    const updateFieldValue = (arr) => {
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
            {/* {field.formFields[0]?.fieldValue?.headers?.map((head, index) => (
            <TableRow key={head.headerId}>
              {selectedId === head?.engDataId ? (
                <>
                  <IconButton
                    aria-label="done"
                    onClick={() => onEditingDone(head.engDataId, engData)}
                  >
                    <DoneIcon />
                  </IconButton>
                  <IconButton
                    aria-label="revert"
                    onClick={() => onRevert(head.engDataId)}
                  >
                    <RevertIcon />
                  </IconButton>
                </>
              ) : (
                <IconButton
                  aria-label="delete"
                  onClick={() => onToggleEditMode(head.engDataId, engData)}
                >
                  <EditIcon />
                </IconButton>
              )}
              <TableCell component="th" scope="row">
                {index + 1}
              </TableCell>
              <TableCell component="th" scope="row">
                {selectedId === engData?.engDataId ? (
                  <Input
                    value={editedEngData?.fieldName}
                    name={editedEngData?.fieldName}
                    onChange={(e) => onChangeData(e, "fieldName")}
                    className={classes.input}
                  />
                ) : (
                  engData.fieldName
                )}
              </TableCell>
              <TableCell>
                {selectedId === engData?.engDataId ? (
                  <Input
                    value={editedEngData?.fieldValue}
                    name={editedEngData?.fieldValue}
                    onChange={(e) => onChangeData(e, "fieldValue")}
                    className={classes.input}
                  />
                ) : (
                  engData.fieldValue
                )}
              </TableCell>
              <TableCell>{engData.fieldType}</TableCell>
              <TableCell>{engData.createdDate}</TableCell>
              <TableCell>
                <Tooltip title="Delete Engineer Data">
                  <IconButton
                    aria-label="delete"
                    onClick={() => handleDeleteEngData(engData?.engDataId)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))} */}
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
    const data = {
      assetId: location.state.assetId,
      formFields: formFields,
      formId: location.state.formid,
      submittedBy: loggedUserId.userId,
    };
    console.log("fieldValues:", fieldValues);
    console.log(location, "location");
    console.log("formFields:", formFields);
    console.log("handleSaveData data", data, formFields);
    // return;
    saveFormData(data)
      .then((res) => {
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
        <ClonosConfirmationDialog
          status={errorAndWarningState}
          header="suggestion"
          title="You don't have checklist forms"
          navigator="checklist-form"
        />
      </div>
    </>
  );
};

export default AddChecklistFormData;

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
