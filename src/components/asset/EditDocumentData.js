import { Navigate, useLocation, useNavigate } from "react-router-dom";
import Styles from "../../ModuleStyles/EditDocData.module.css";
import { useState } from "react";
import { useEffect } from "react";
import { Dropdown } from "rsuite";
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import EditIcon from '@material-ui/icons/Edit';
import { EditableDocumentTable } from "../dynamicForms/EditableDocumentTable";
import debounce from 'lodash.debounce';
import { editFormData } from "../../Api/DynamicForm/dynamicFormApi";
export const EditDocumentData = () => {
  const Location = useLocation();
  const Navigate = useNavigate()
  const [showTable,setShowTable] = useState(false);
  const [tableHeaders,setTableHeaders] = useState([]);
  const [tableRows,setTableRows] = useState([]);
  const [formvalues, setFormValues] = useState([]);
  const [copiedFormVals,setCopiedFormVals] = useState([])
  const [editedData,setEditedData] = useState([]);
  const [tableId,setTableId] = useState("");
  console.log(Location.state, "location");

  const getTableUpdatedData = (tableData,id) => {
    setTableId(id)
    setTableHeaders(tableData.headers);
    setTableRows(tableData.rows)
  }

  const handleUpdate  = () => {
    // console.log(getTableUpdatedData)
    
    const payload = copiedFormVals.map((val) => {
      if(val.id === tableId){
        return {...val,fieldValue :{headers:tableHeaders,tableData:tableRows,columnLength:tableHeaders.length.toString(),rowLength:tableRows.length.toString()}}
      } 
      return val
    })
    editFormData({
      updatedValues:payload,
      FormDataId:Location?.state?._id
    }).then((res) => {
      console.log(res.data)
    }).catch((err) => {
      console.log(err,"errr")
    })
  }
 
  const helperFunction = (field, e, formVals) => {
    // const updateFieldValue = (arr) => {
    //   console.log(arr,"arrr")
    //   return arr.map((item) => {
    //     if (item.id === field.id ) {
    //       return { ...item, fieldValue: e.target.value };
    //     } 
    //     if (Array.isArray(item.fieldValue)) {
    //       return { ...item, choosedValue: e.target.value };
    //     }
    //     return item;
    //   });
    // };
  
    const updatedFormValues = formVals.map((val) => {
      console.log(val.id, field.id,"compare")
      if (val.id === field.id) {
        if (Array.isArray(field.fieldValue) && (field.attrName === "Multiple Choice" )) {
          return { ...val, choosedValue: e.target.value };
        }  
        if (Array.isArray(field.fieldValue) && (field.attrName === "Dropdown")) {
          return { ...val, choosedValue: e.target.value };
        } 
        if (Array.isArray(field.fieldValue) && (field.attrName === "CheckBoxes" )) {
          let tempFieldVals = field.fieldValue.map((opt) => {
            if(opt.optionValue === e.target.value){
              opt.isChecked = opt.isChecked ? false : true;
              return opt
            }else {
              return opt
            }
          })
          
          return { ...val, fieldValue:tempFieldVals};
        } 

        return { ...val, fieldValue: e.target.value };
      }
      return val;
    });
    console.log(updatedFormValues,"jasndjk")
    setCopiedFormVals(updatedFormValues)
  }
  
  const debouncedHandleChangeValue = debounce(helperFunction, 500);
  
  const handleChangeValue = (field, e, formvalues) => {
    debouncedHandleChangeValue(field, e, formvalues);
    return e?.target?.value
  };
  const handleFielType = (field) => {
    if (field.attrName === "String") {
      return (
        <div className={Styles.stringDiv}>
          <div className={Styles.labelDiv}>
            <h4>{field.fieldName}</h4>
          </div>
          <div className={Styles.inputDiv}>
            <input defaultValue={field.fieldValue} 
            onChange={(e) => handleChangeValue(field, e,copiedFormVals)}
            />
          </div>
        </div>
      );
    } else if (field.attrName === "Date") {
      return (
        <div className={Styles.stringDiv}>
          <div className={Styles.labelDiv}>
            <h4>{field.fieldName}</h4>
          </div>
          <div className={Styles.inputDiv}>
            <input type="date" defaultValue={field.fieldValue} onChange={(e) => handleChangeValue(field, e,copiedFormVals)} />
          </div>
        </div>
      );
    } else if (field.attrName === "Dropdown") {
      return (
        <div className={Styles.stringDiv}>
          <div className={Styles.labelDiv}>
            <h4>{field.fieldName}</h4>
          </div>
          <div className={Styles.selectDiv}>
            <select onChange={(e) => handleChangeValue(field,e,copiedFormVals)}>
            {field.fieldValue.map((opt) => {
                return (
                  <option value={opt.optionValue} >
                    {opt.optionValue}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      );
    } else if (field.attrName === "Multiple Choice") {
      return (
        <div className={Styles.stringDiv}>
          <div className={Styles.labelDiv}>
            <h4>{field.fieldName}</h4>
          </div>
          <div className={Styles.radioDiv}>
            <RadioGroup
              row
              aria-label="gender"
              name="gender1"
              defaultValue={field.choosedValue}
              onChange={(e) => handleChangeValue(field, e,copiedFormVals)}
            >
              {field.fieldValue?.map((opt) => {
                return (
                  <FormControlLabel
                    value={opt.optionValue}
                    control={<Radio />}
                    label={opt.optionValue}
                  />
                );
              })}
            </RadioGroup>
          </div>
        </div>
      );
    } else if (field.attrName === "CheckBoxes") {
      return (
        <div className={Styles.stringDiv}>
          <div className={Styles.labelDiv}>
            <h4>{field.fieldName}</h4>
          </div>
          <div className={Styles.checkBoxesDiv}>
            <FormGroup row>
              {
                field.fieldValue.map((opt) => {
                    return <FormControlLabel
                    control={
                      <Checkbox
                        checked={opt.isChecked}
                        value={opt.optionValue}
                        onChange={(e) => handleChangeValue(field, e,copiedFormVals)}
                        name={opt.optionValue}
                      />
                    }
                    label={opt.optionValue}
                  />
                })
              }
            </FormGroup>
          </div>
        </div>
      );
    } else if (field.attrName === "Table") { 
        return (
          <>
            <div className={Styles.stringDiv}>
            <div className={Styles.labelDiv}>
              <h4>{field.fieldName}</h4>
            </div>
            <div className={Styles.tableDiv}>
                <button onClick={() => {
                    setShowTable(true);
                    // setTableHeaders(field.headers);
                    // setTableRows(field.tableData)
                }}>VIEW TABLE</button>
            </div>
          </div>
          { 
          showTable ? 
          <EditableDocumentTable open={showTable} close={() => setShowTable(false)} headers = {field.fieldValue.headers} rows = {field.fieldValue.tableData} updateTableData={getTableUpdatedData} tableId={field.id}/>
             : <></>
          }
          </>
        );
      } else if (field.attrName === "Number") {
        return (
          <div className={Styles.stringDiv}>
            <div className={Styles.labelDiv}>
              <h4>{field.fieldName}</h4>
            </div>
            <div className={Styles.inputDiv}>
              <input type="number" defaultValue={field.fieldValue} 
              onChange={(e) => handleChangeValue(field, e,formvalues)}
              />
            </div>
          </div>
        );
      }
  };
  useEffect(() => {
    setFormValues(Location.state.formvals);
    setCopiedFormVals(Location.state.formvals)
  }, []);
  useEffect(() => {
    // console.log(editedData,"editedData")
  },[editedData])
  console.log(formvalues,"editedData")
  return (
    <>
      <div className={Styles.edit_doc_header}>
        <div className={Styles.flexBox}>
            <EditIcon fontSize="large"/>
        <h2>Edit Document Data</h2>
        </div>
      </div>
      <div className={Styles.edit_doc_container}>
        {formvalues.map((field) => {
          return <div key={field.id}>{handleFielType(field)}</div>;
        })}
        <div className={Styles.updateBtnDiv}>
            <button onClick={handleUpdate}>UPDATE</button>
            <button onClick={() => Navigate(-1)}>CANCEL</button>
        </div>
      </div>
      {/* {
        showTable ?  : <></>
      } */}
    </>
  );
};
