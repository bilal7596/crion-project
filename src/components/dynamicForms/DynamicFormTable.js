import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { useDispatch, useSelector } from "react-redux";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { documentActions } from "../../Store/Reducers/ClonosDocumentReducer";

import { attributes } from "./attributesData";
import {
  uid,
  deepCopy,
  insertAttrValue,
  getNestedArrayLength,
} from "./commonFunctions";

import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { TextField } from "@material-ui/core";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  inputText: {
    padding: "5px 20px",
    width: "100%",
  },
  inputDate: {
    padding: "5px 20px",
    width: "100%",
  },
});

export default function DynamicFormTable() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [listMapAttrId, setlistMapAttrId] = useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleListMapAttrClick = (id, event) => {
    setlistMapAttrId(id);
    setAnchorEl(event.currentTarget);
  };

  const handleListMapAttrClose = () => {
    setlistMapAttrId("");
    setAnchorEl(null);
  };

  const formAttributes = useSelector(
    (state) => state.documentData.dynamicFormAttrs
  );

  const clonedFormAttributes = deepCopy(formAttributes);

  const handleAddAttrs = (attribute, row, nestedlength) => {
    let newAttr = {
      id: uid(),
      fieldName: "",
      fieldValue: ["array", "object"].includes(attribute.attrType) ? [] : "",
      fieldType: attribute.attrType,
      attrNameErr: false,
    };
    const clonedAttrs = deepCopy(formAttributes);

    const attrInserted = insertAttrValue(clonedAttrs, row, newAttr);
    dispatch(documentActions.setDynamicFormAttr(attrInserted));
  };
  const addNewOptionValue = (row) => {
    const clonedAttrs = deepCopy(formAttributes);
    const newOptionField = {
      optionId: uid(),
      optionValue: "",
    };
    for (let i = 0; i < clonedAttrs.length; i++) {
      if (clonedAttrs[i].id === row.id) {
        clonedAttrs[i].fieldValue = [
          ...clonedAttrs[i].fieldValue,
          newOptionField,
        ];
      }
    }

    dispatch(documentActions.setDynamicFormAttr(clonedAttrs));
  };

  const addNewHeader = (row) => {
    const clonedAttrs = deepCopy(formAttributes);
    const newOptionField = {
      headerId: uid(),
      name: "",
    };
    for (let i = 0; i < clonedAttrs.length; i++) {
      if (clonedAttrs[i].id === row.id) {
        clonedAttrs[i].fieldValue.headers = [
          ...clonedAttrs[i].fieldValue.headers,
          newOptionField,
        ];
      }
    }

    dispatch(documentActions.setDynamicFormAttr(clonedAttrs));
  };

  const handleOptionValueChange = (event, row, optionId) => {
    const clonedAttrs = deepCopy(formAttributes);

    for (let i = 0; i < clonedAttrs.length; i++) {
      if (clonedAttrs[i].id === row.id) {
        const optionValChanged = clonedAttrs[i].fieldValue?.map((option) => {
          if (optionId === option.optionId) {
            option.optionValue = event.target.value;
          }
          return option;
        });
        clonedAttrs[i].fieldValue = optionValChanged;
      }
    }

    dispatch(documentActions.setDynamicFormAttr(clonedAttrs));
  };

  const handleTableHeaderChange = (event, row, headerId) => {
    const clonedAttrs = deepCopy(formAttributes);

    for (let i = 0; i < clonedAttrs.length; i++) {
      if (clonedAttrs[i].id === row.id) {
        const optionValChanged = clonedAttrs[i].fieldValue?.headers?.map(
          (option) => {
            if (headerId === option.headerId) {
              option.name = event.target.value;
            }
            return option;
          }
        );
        clonedAttrs[i].fieldValue.headers = optionValChanged;
      }
    }

    dispatch(documentActions.setDynamicFormAttr(clonedAttrs));
  };

  const deleteTableHeader = (row, optionId) => {
    const clonedAttrs = deepCopy(formAttributes);

    for (let i = 0; i < clonedAttrs.length; i++) {
      if (clonedAttrs[i].id === row.id) {
        const filteredOptions = clonedAttrs[i].fieldValue?.headers?.filter(
          (option) => {
            return optionId !== option.headerId;
          }
        );
        clonedAttrs[i].fieldValue.headers = filteredOptions;
      }
    }

    dispatch(documentActions.setDynamicFormAttr(clonedAttrs));
  };

  const deleteOption = (row, headerId) => {
    const clonedAttrs = deepCopy(formAttributes);

    for (let i = 0; i < clonedAttrs.length; i++) {
      if (clonedAttrs[i].id === row.id) {
        const filteredOptions = clonedAttrs[i].fieldValue?.filter((option) => {
          return headerId !== option.headerId;
        });
        clonedAttrs[i].fieldValue = filteredOptions;
      }
    }

    dispatch(documentActions.setDynamicFormAttr(clonedAttrs));
  };

  const renderAttrValueInput = (row, nestedlength, rowIndex) => {
    switch (row.fieldType) {
      case "text":
        return (
          <input
            type={row.fieldType}
            className={classes.inputText}
            placeholder="Enter Value"
            onChange={(e) => attributeValueChange(e, row)}
            maxLength="8"
          />
        );
      case "file":
        return (
          <input
            type={row.fieldType}
            className={classes.inputText}
            placeholder="Enter Value"
            onChange={(e) => attributeValueChange(e, row)}
            maxLength="8"
          />
        );
      case "number":
        return (
          <input
            type={row.fieldType}
            className={classes.inputText}
            placeholder="Enter Value"
            onChange={(e) => attributeValueChange(e, row)}
            maxLength="8"
            value={row.fieldValue}
          />
        );

      case "date":
        return (
          <input
            type={row.fieldType}
            className={classes.inputDate}
            onChange={(e) => attributeValueChange(e, row)}
          />
        );
      case "table":
        return (
          <>
            {row.fieldValue?.headers?.map((head, i) => {
              return (
                <div style={{}} key={head.headerId}>
                  <TextField
                    id={head.headerId}
                    label={`option ${i + 1}`}
                    value={head.optionValue}
                    onChange={(e) =>
                      handleTableHeaderChange(e, row, head.headerId)
                    }
                  />
                  <Tooltip title="Add New Option">
                    <IconButton
                      aria-label="add-new-dropdown-option"
                      onClick={() => deleteTableHeader(row, head.headerId)}
                    >
                      <DeleteIcon
                        style={{ position: "relative", top: "15px" }}
                      />
                    </IconButton>
                  </Tooltip>
                </div>
              );
            })}
            <Tooltip title="Add New Option">
              <IconButton
                aria-label="add-new-dropdown-option"
                onClick={() => addNewHeader(row)}
              >
                <AddCircleIcon
                  style={{ position: "relative", top: "10px" }}
                  color="primary"
                />
              </IconButton>
            </Tooltip>
          </>
        );
      case "radio":
        return (
          <>
            {row.fieldValue?.map((option, i) => {
              return (
                <div style={{}} key={option.optionId}>
                  <TextField
                    id={option.optionId}
                    label={`option ${i + 1}`}
                    value={option.optionValue}
                    onChange={(e) =>
                      handleOptionValueChange(e, row, option.optionId)
                    }
                  />
                  <Tooltip title="Add New Option">
                    <IconButton
                      aria-label="add-new-dropdown-option"
                      onClick={() => deleteOption(row, option.optionId)}
                    >
                      <DeleteIcon
                        style={{ position: "relative", top: "15px" }}
                      />
                    </IconButton>
                  </Tooltip>
                </div>
              );
            })}
            <Tooltip title="Add New Option">
              <IconButton
                aria-label="add-new-dropdown-option"
                onClick={() => addNewOptionValue(row)}
              >
                <AddCircleIcon
                  style={{ position: "relative", top: "10px" }}
                  color="primary"
                />
              </IconButton>
            </Tooltip>
          </>
        );
      case "checkbox":
        return (
          <>
            {row.fieldValue?.map((option, i) => {
              return (
                <div style={{}} key={option.optionId}>
                  <TextField
                    id={option.optionId}
                    label={`option ${i + 1}`}
                    value={option.optionValue}
                    onChange={(e) =>
                      handleOptionValueChange(e, row, option.optionId)
                    }
                  />
                  <Tooltip title="Add New Option">
                    <IconButton
                      aria-label="add-new-dropdown-option"
                      onClick={() => deleteOption(row, option.optionId)}
                    >
                      <DeleteIcon
                        style={{ position: "relative", top: "15px" }}
                      />
                    </IconButton>
                  </Tooltip>
                </div>
              );
            })}
            <Tooltip title="Add New Option">
              <IconButton
                aria-label="add-new-dropdown-option"
                onClick={() => addNewOptionValue(row)}
              >
                <AddCircleIcon
                  style={{ position: "relative", top: "10px" }}
                  color="primary"
                />
              </IconButton>
            </Tooltip>
          </>
        );
      case "dropdown":
        return (
          <>
            {row.fieldValue?.map((option, i) => {
              return (
                <div style={{}} key={option.optionId}>
                  <TextField
                    id={option.optionId}
                    label={`option ${i + 1}`}
                    value={option.optionValue}
                    onChange={(e) =>
                      handleOptionValueChange(e, row, option.optionId)
                    }
                  />
                  <Tooltip title="Add New Option">
                    <IconButton
                      aria-label="add-new-dropdown-option"
                      onClick={() => deleteOption(row, option.optionId)}
                    >
                      <DeleteIcon
                        style={{ position: "relative", top: "15px" }}
                      />
                    </IconButton>
                  </Tooltip>
                </div>
              );
            })}
            <Tooltip title="Add New Option">
              <IconButton
                aria-label="add-new-dropdown-option"
                onClick={() => addNewOptionValue(row)}
              >
                <AddCircleIcon
                  style={{ position: "relative", top: "10px" }}
                  color="primary"
                />
              </IconButton>
            </Tooltip>
          </>
        );

      case "array":
        return (
          <div>
            <Button
              aria-controls={`${row.id}-menu`}
              aria-haspopup="true"
              onClick={(e) => handleListMapAttrClick(row.id, e)}
              style={{ width: "100%", border: "1px solid #000" }}
            >
              Add New Attribute
            </Button>
            <Menu
              id={`${row.id}-menu`}
              anchorEl={anchorEl}
              keepMounted
              open={listMapAttrId === row.id}
              onClose={() => handleListMapAttrClose(row.id)}
              style={{ width: "100%" }}
            >
              {attributes?.map((data) => {
                if (
                  nestedlength > 2 &&
                  ["array", "object"].includes(data.attrType)
                ) {
                  return;
                }
                if (["dropdown", "radio"].includes(data.attrType)) {
                  return;
                }
                return (
                  <MenuItem
                    onClick={() => handleAddAttrs(data, row, nestedlength)}
                    key={data.attrName}
                  >
                    {data.attrName}
                  </MenuItem>
                );
              })}
            </Menu>
          </div>
        );

      case "object":
        return (
          <div>
            <Button
              aria-controls={`${row.id}-menu`}
              aria-haspopup="true"
              onClick={(e) => handleListMapAttrClick(row.id, e)}
              style={{ width: "100%", border: "1px solid #000" }}
            >
              Add New Attribute
            </Button>
            <Menu
              id={`${row.id}-menu`}
              anchorEl={anchorEl}
              keepMounted
              open={listMapAttrId === row.id}
              onClose={() => handleListMapAttrClose(row.id)}
            >
              {attributes?.map((data) => {
                if (
                  nestedlength > 2 &&
                  ["array", "object"].includes(data.attrType)
                ) {
                  return;
                }
                if (["dropdown"].includes(data.attrType)) {
                  return;
                }
                return (
                  <MenuItem
                    onClick={() => handleAddAttrs(data, row, nestedlength)}
                    key={data.attrName}
                  >
                    {data.attrName}
                  </MenuItem>
                );
              })}
            </Menu>
          </div>
        );

      default:
        break;
    }
  };

  const handleDeleteAttr = (id, rows) => {
    // look to see if object exists
    const index = rows.findIndex((x) => x.id === id);
    if (index > -1) {
      rows.splice(index, 1); // remove the object
    } else {
      // loop over the indexes of the array until we find one with the key
      rows.some((x) => {
        if (x.fieldValue) {
          handleDeleteAttr(id, x.fieldValue);
        } else {
          return false;
        }
      });
    }

    dispatch(documentActions.setDynamicFormAttr(rows));
  };

  const attributeNameChange = (event, attr, attrsArr) => {
    for (let i = 0; i < attrsArr.length; i++) {
      if (attrsArr[i].id === attr.id) {
        attrsArr[i].fieldName = event.target.value;
        if (!event.target.value) {
          attrsArr[i].attrNameErr = true;
        } else {
          attrsArr[i].attrNameErr = false;
        }
      }
      if (Array.isArray(attrsArr[i].fieldValue)) {
        attributeNameChange(event, attr, attrsArr[i].fieldValue);
      }
    }
    console.log("setDynamicFormAttr attrsArr", attrsArr);
    dispatch(documentActions.setDynamicFormAttr(attrsArr));
  };

  const attributeValueChange = (event, attr) => {
    const clonedAttrs = formAttributes?.map((item) => ({ ...item }));

    const valueChangedAttrs = clonedAttrs?.map((elem) => {
      if (elem.id === attr.id) {
        if (event.target.type === "number") {
          var regex = new RegExp("(\\.\\d{" + 7 + "})\\d+", "g");
          elem.fieldValue = event.target.value.replace(regex, "$1");
          console.log("elem.fieldValue", elem.fieldValue);
          return elem;
        } else {
          elem.fieldValue = event.target.value;
          return elem;
        }
      }
      return elem;
    });
    dispatch(documentActions.setDynamicFormAttr(valueChangedAttrs));
  };

  const handleAddNestedRows = (nestedAttrs, nestedlength, rowIndex) => {
    return (
      <TableRow className={classes.nestedRow}>
        <TableCell colSpan="5">
          <Table>
            <TableBody>
              {nestedAttrs.map((row, index) => {
                return (
                  <>
                    <TableRow key={row.keyId}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <input
                          className="attrName"
                          type="text"
                          placeholder={
                            index === 0
                              ? "Attribute Name 1"
                              : `Attribute Name ${index + 1}`
                          }
                          required
                          defaultValue={row.fieldName}
                          onChange={(e) =>
                            attributeNameChange(e, row, clonedFormAttributes)
                          }
                          maxLength="100"
                        />
                        {row.attrNameErr && (
                          <p style={{ color: "red" }}>
                            Attribute Name required
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        {renderAttrValueInput(row, nestedlength, index)}
                      </TableCell>
                      <TableCell
                        // width="15%"
                        // align="right"
                        style={{ textTransform: "uppercase" }}
                      >
                        {row.fieldType}
                      </TableCell>
                      <TableCell
                        // width="20%"
                        align="right"
                        style={{ textTransform: "uppercase" }}
                      >
                        {/* <Button
                          variant="outlined"
                          color="default"
                          className={classes.button}
                          endIcon={<DeleteIcon />}
                          onClick={() =>
                            handleDeleteAttr(index, row, newNestedRows)
                            null
                          }
                        >
                          Remove
                        </Button> */}
                        <Tooltip title="Delete All Attributes">
                          <IconButton
                            aria-label="delete"
                            onClick={() =>
                              handleDeleteAttr(row.id, clonedFormAttributes)
                            }
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>

                    {Array.isArray(row.fieldValue) &&
                    ["array", "object"].includes(row.fieldType)
                      ? handleAddNestedRows(
                          row.fieldValue,
                          nestedlength,
                          rowIndex
                        )
                      : null}
                  </>
                );
              })}
            </TableBody>
          </Table>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Attribute Name</TableCell>
            <TableCell>Default Value</TableCell>
            <TableCell>Attribute Type</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {formAttributes?.map((row, index) => {
            let nestedlength;
            if (["array", "object"].includes(row.fieldType)) {
              nestedlength = getNestedArrayLength(row.fieldValue);
            }

            return (
              <>
                <TableRow key={row.id}>
                  <TableCell>
                    {/* {["array", "object"].includes(row.fieldType) && (
                      <span style={{ color: "red" }}>{nestedlength + 1}</span>
                    )} */}
                    <input
                      className={classes.inputText}
                      placeholder={`Attribute ${index + 1}`}
                      onChange={(e) =>
                        attributeNameChange(e, row, clonedFormAttributes)
                      }
                      maxLength="100"
                    />
                    {row.attrNameErr && (
                      <p style={{ color: "red" }}>Attribute Name required</p>
                    )}
                  </TableCell>
                  <TableCell>
                    {renderAttrValueInput(row, nestedlength, index)}
                  </TableCell>
                  <TableCell>{row?.attrName?.toUpperCase()}</TableCell>
                  <TableCell>
                    <Tooltip title="Delete All Attributes">
                      <IconButton
                        aria-label="delete"
                        onClick={() =>
                          handleDeleteAttr(row.id, clonedFormAttributes)
                        }
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
                {Array.isArray(row.fieldValue) &&
                ["array", "object"].includes(row.fieldType)
                  ? handleAddNestedRows(row.fieldValue, nestedlength, index)
                  : null}
              </>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
