import React, { useEffect, useState } from "react";
import { Button } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import { Dropdown } from "rsuite";
import { attributes } from "./attributesData";
import { useDispatch, useSelector } from "react-redux";
import { documentActions } from "../../Store/Reducers/ClonosDocumentReducer";

import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFont,
  faCalendarAlt,
  faSortNumericDown,
  faListUl,
  faCheckSquare,
  faTable,
  faMap,
  faItalic,
  faCircle,
  faTextHeight,
  faImage,
} from "@fortawesome/free-solid-svg-icons";

import ConfirmationDialog from "./ConfirmationDialog";
import DynamicFormTable from "./DynamicFormTable";
import { deepCopy, insertErr, uid } from "./commonFunctions";
import { createDynamicForm } from "../../Api/DynamicForm/dynamicFormApi";
import { commonActions } from "../../Store/Reducers/CommonReducer";
import { getAllAssets, getAssetDropdown } from "../../Api/Asset/assetApi";
import { addDoc } from "../../Api/Documents/DocumentApi";
import { useContext } from "react";
import { getUser } from "../../utils/clonosCommon";
import {dynamicFormStateManagementActions} from "../../Store/Reducers/ClonosDynamicFormReducer"


console.log('documentActions:', documentActions)

const DynamicForm = () => {
  const user = getUser();
  const formAttributes = useSelector(
    (state) => state.documentData.dynamicFormAttrs
  );
  const formName = useSelector((state) => state.documentData.dynamicFormName);
  const [openDeleteAllDialog, setopenDeleteAllDialog] = useState(false);
  const [shwNameErr, setshwNameErr] = useState(false);
  const [shwdocNameErr, setshwdocNameErr] = useState(false);

  // Define an icon mapping for each attribute type
  const iconMap = {
    text: faFont,
    date: faCalendarAlt,
    number: faSortNumericDown,
    dropdown: faListUl,
    radio: faCircle,
    checkbox: faCheckSquare,
    table: faTable,
    object: faMap,
    "text-1": faTextHeight,
    file: faImage,
  };
  const itemStyle = { display: "flex", alignItems: "center" };
  const iconStyle = { marginRight: "8px" };
  const dispatch = useDispatch();
  const [allAssets, setallAssets] = useState([]);
  const [selectedAsset, setselectedAsset] = useState("");
  const [docName, setdocName] = useState("");

  const handleAddAttrs = (attribute) => {
    console.log("attribute:", attribute);
    console.log("formAttributes:", formAttributes);
    const clone = formAttributes.map((item) => ({ ...item }));
    console.log("clone:", clone);

    function handleFieldValue(attrType) {
      if (["array", "object"].includes(attrType)) {
        return [];
      } else if (["dropdown", "radio"].includes(attrType)) {
        return [
          {
            optionId: uid(),
            optionValue: "",
          },
        ];
      } else if (["checkbox"].includes(attrType)) {
        return [
          {
            optionId: uid(),
            optionValue: "",
            isChecked: false,
          },
        ];
      } else if (attrType === "table") {
        return {
          rowLength: "1",
          columnLength: "1",
          headers: [
            {
              headerId: uid(),
              name: "",
            },
          ],
          tableData: [],
        };
      } else {
        return "";
      }
    }

    clone.push({
      id: uid(),
      fieldName: "",
      fieldValue: handleFieldValue(attribute.attrType),
      fieldType: attribute.attrType,
      attrName: attribute.attrName,
      attrNameErr: false,
      choosedValue: "",
    });
    dispatch(documentActions.setDynamicFormAttr(clone));
  };

  const saveDynamicForm = () => {
    const clonedAttrs = deepCopy(formAttributes);
    const errInserted = insertErr(clonedAttrs, "attrNameErr");
    console.log("clonedAttrs:", clonedAttrs);
    console.log("errInserted:", errInserted);
    console.log("errInserted.attributes:", errInserted.attributes);
    dispatch(documentActions.setDynamicFormAttr(errInserted.attributes));


    if (!formName) {
      setshwNameErr(true);
      return;
    } else if (!formAttributes.length || errInserted.error) {
      console.log("saveDynamicForm formAttributes", formAttributes);
      return;
    } else if (selectedAsset && !docName) {
      setshwdocNameErr(true);
    } else {
      const data = {
        formName: formName,
        formFields: formAttributes,
        assetId: selectedAsset,
      };
      console.log("saveDynamicForm data", data);
      dispatch(commonActions.showApiLoader(true));
      createDynamicForm(data)
        .then((res) => {
          console.log("createDynamicForm RESPONSE", res);
          dispatch(commonActions.showApiLoader(false));
          dispatch(
            commonActions.handleSnackbar({
              show: true,
              message: `Form Created Successfully`,
              type: "success",
            })
          );
          if (selectedAsset) {
            const data = {
              objectId: selectedAsset,
              assetId: selectedAsset,
              name: docName,
              linkedType: "asset",
              formid: res?.data?.formId,
            };
            addDoc(data)
              .then((response) => {
                console.log("addDoc API RESPONSE", response);
                setdocName("");
                dispatch(
                  commonActions.handleSnackbar({
                    show: true,
                    message: `Document created successfully`,
                    type: "success",
                  })
                );
                dispatch(documentActions.setDynamicFormAttr([]));
                dispatch(documentActions.setDynamicFormName(""));
                setselectedAsset("");
                setdocName("");

              })
              .catch((error) => {
                console.log("addDoc API ERROR", error);
                setdocName("");
                dispatch(
                  commonActions.handleSnackbar({
                    show: true,
                    message: `${error.response.data.error}`,
                    type: "error",
                  })
                );
              });
          }
        })
        .catch((err) => {
          console.log("createDynamicForm ERROR", err);
          dispatch(commonActions.showApiLoader(false));
          dispatch(
            commonActions.handleSnackbar({
              show: true,
              message: err.response.data.error,
              type: "error",
            })
          );
        });
    }
  };

  useEffect(() => {
    getAssetDropdown()
      .then((res) => {
        console.log("getAllAssets DYNAMIC FORM RESPONSE", res);
        setallAssets(res.data?.result);
      })
      .catch((err) => console.log("getAllAssets DYNAMIC FORM ERROR", err));

    return () => {};
  }, []);
  useEffect(() => {
    console.log(selectedAsset);
  }, [selectedAsset]);

  console.log("documentActions:", documentActions);
  return (
    <>
      <div>
        <h2
          style={{
            color: "#3F51B5",
            textAlign: "center",
            fontFamily: "calibri",
          }}
        >
          <i>Create Dynamic Form</i>
        </h2>
      </div>

      <p style={{ marginBottom: "10px" }}>
        <strong>DYNAMIC FORM - Under Development</strong>
      </p>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div>
          <FormControl variant="outlined" style={{ width: 200 }}>
            <InputLabel id="Assets-simple-select-outlined-label">
              Assets
            </InputLabel>
            <Select
              labelId="Assets-simple-select-outlined-label"
              id="Assets-simple-select-outlined"
              label="Assets"
              value={selectedAsset}
              onChange={(e) => setselectedAsset(e.target.value)}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {allAssets?.map((asset) => {
                return (
                  <MenuItem
                    value={asset.assetId}
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <>
                      <h5
                        style={{
                          color: "#212121",
                          fontSize: "16px",
                          fontWeight: "normal",
                          width: "100%",
                        }}
                      >
                        {asset.assetName}
                      </h5>
                      <p
                        style={{
                          color: "#757575",
                          fontSize: "14px",
                          borderBottom: "0.5px solid #EEEEEE",
                          width: "100%",
                          paddingBottom: "5px",
                        }}
                      >
                        {asset.assetCategory}
                      </p>
                    </>
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          {selectedAsset && (
            <TextField
              error={shwdocNameErr}
              style={{ marginLeft: 20 }}
              id="AssetDoc-name"
              label="Document Name"
              value={docName}
              onChange={(e) => {
                setdocName(e.target.value);
                setshwdocNameErr(false);
              }}
              variant="outlined"
              helperText={shwdocNameErr && "Please enter document name"}
            />
          )}
        </div>
        
        <div>
          <TextField
            id="outlined-basic"
            label="Dynamic Form Name"
            variant="outlined"
            onChange={(e) => {
              dispatch(documentActions.setDynamicFormName(e.target.value));
              setshwNameErr(false);
            }}
          />
          {shwNameErr && <p style={{ color: "red" }}>Form Name is required</p>}
        </div>
    
        <div>
          <Tooltip title="Delete All Attributes">
            <IconButton
              aria-label="delete"
              disabled={!formAttributes?.length}
              onClick={() => setopenDeleteAllDialog(true)}
            >
              <DeleteIcon
                style={{ color: formAttributes?.length ? "red" : "gray" }}
              />
            </IconButton>
          </Tooltip>
          <Dropdown
            title="Add New Attribute"
            placement="bottomEnd"
            size="lg"
            menuStyle={{ width: "150px" }}
          >
            {attributes?.map((data) => (
              <Dropdown.Item
                onClick={() => handleAddAttrs(data)}
                style={itemStyle}
              >
                <FontAwesomeIcon
                  icon={iconMap[data.attrType]}
                  style={iconStyle}
                />
                {data.attrName}
              </Dropdown.Item>
            ))}
          </Dropdown>
        </div>
      </div>

      {formAttributes.length ? (
        <div style={{ marginTop: "20px" }}>
          <DynamicFormTable />
        </div>
      ) : (
        <h6 style={{ color: "red", textAlign: "center", marginTop: "20px" }}>
          Please add some attributes to save the template.
        </h6>
      )}

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <Button variant="contained" color="primary" onClick={saveDynamicForm}>
          Save
        </Button>
      </div>

      <ConfirmationDialog
        Open={openDeleteAllDialog}
        HandleClose={() => setopenDeleteAllDialog(false)}
        Title="Delete All Attributes"
        BodyText="Are you sure you want to delete all created attributes ?"
      />
    </>
  );
};

export default DynamicForm;
