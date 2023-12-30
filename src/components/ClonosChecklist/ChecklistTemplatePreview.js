import Styles from "../../ModuleStyles/ChecklistAndReports/ClonosChecklist/ChecklistTemplatePreview/ChecklistTemplatePreview.module.css";
import TEMPLATE_PREVIEW_ADDIMAGE from "../../assets/UIUX/icons/Checklist/add-image.svg";
import TEMPLATE_PREVIEW_VIEWIMAGE from "../../assets/UIUX/icons/Checklist/view-image.svg";
import TEMPLATE_PREVIEW_ADDNOTE from "../../assets/UIUX/icons/Checklist/add-note.svg";
import TEMPLATE_PREVIEW_VIEWNOTE from "../../assets/UIUX/icons/Checklist/view-note.svg";
import { useState } from "react";
export const ChecklistTemplatePreview = ({ attributes, isEdit, getUpdatedValues }) => {
  console.log('attributes:', attributes)
  const [showEditLabel, setShowEditLabel] = useState(false);
  const [localDetails, setLocalDetails] = useState([...attributes]);
  const [choosedValues, setChoosedValues] = useState({})
  const handleChange = ({ e, attributeId, attributeName, changeIn, optionId }) => {
    const { name, value } = e.target
    if (attributeName === "Text" || attributeName === "Number" || attributeName === "Date") {
      setLocalDetails((prev) => {
        let temp = attributes?.map((attribute) => {
          if (attribute?.id === attributeId) {
            return {
              ...attribute,
              [changeIn]: value
            }
          } else {
            return attribute
          }
        })
        getUpdatedValues(temp);
        return temp
      })

    } else if (attributeName === "Dropdown" || attributeName === "Checkboxes" || attributeName === "Multiple Choice") {
      let tempOptions = {};
      setLocalDetails((prev) => {
        let temp = attributes?.map((attribute) => {
          if (attribute?.id === attributeId) {
            if (changeIn === "choosedValue") {
              let prevOptions = choosedValues[`${attribute?.id}`]
              if (prevOptions?.includes(optionId)) {
                prevOptions = prevOptions?.filter((opt) => opt !== optionId);
                tempOptions[`${attribute.id}`] = [...prevOptions];
              } else {
                if (prevOptions?.length) {
                  tempOptions[`${attribute.id}`] = [...prevOptions, optionId];
                } else {
                  tempOptions[`${attribute.id}`] = [optionId];
                }
              }
              setChoosedValues(tempOptions)
              return {
                ...attribute,
                [changeIn]: tempOptions[`${attribute?.id}`]
              }
            } else {
              return {
                ...attribute,
                [changeIn]: value
              }
            }
          } else {
            return attribute
          }
        })
        return temp
      })
    }
  }

  const handleSubmit = () => {
    getUpdatedValues(localDetails)
  }
  console.log(localDetails, "localDetails")
  return (
    <>
      <div className={Styles.ct_preview_container}>
        {attributes?.length ? (
          attributes?.map((attribute) => {
            return (
              <div className={Styles.ct_preview_attribute_container}>
                <div className={Styles.ct_preview_field_label_container}>
                  <h4 className={Styles.ct_preview_field_label}>
                    {attribute?.fieldName || "Untitled Field"}
                  </h4>
                </div>
                <div className={Styles.ct_preview_attribute_value_contanier}>
                  {
                    (attribute?.attributeName === "Text" || attribute?.attributeName === "Number" || attribute?.attributeName === "Date") &&
                    <div className={Styles.ct_preview_attribute_value_left}>
                      <input readOnly={!isEdit} type={attribute?.attributeName.toLowerCase()} className={Styles.ct_preview_field_Value_input} defaultValue={attribute?.fieldValue} onChange={(e) => handleChange({ e, id: attribute?.id, attributeName: attribute?.attributeName, changeIn: "fieldValue" })} />
                    </div>
                  }
                  {
                    attribute?.attributeName === "Dropdown" && <div className={Styles.ct_preview_attribute_value_left}>
                      <select onChange={(e) => handleChange({ e, attributeId: attribute?.id, changeIn: "choosedValue", attributeName: attribute?.attributeName })} defaultValue={attribute?.choosedValue?.length ? attribute?.choosedValue[0] : ""} disabled={!isEdit} className={Styles.ct_preview_dropdown}>
                        <>
                          <option value="">Select</option>
                          {
                            attribute?.fieldValue?.map((opt) => {
                              if (opt?.optionValue) return <option value={opt?.optionId}>{opt?.optionValue}</option>
                            })
                          }
                        </>
                      </select>
                    </div>
                  }
                  {
                    attribute?.attributeName === "Multiple Choice" && <div className={Styles.ct_preview_attribute_value_left}>
                      {
                        attribute?.fieldValue?.map((opt) => {
                          return <div className={Styles.ct_preview_multichoice_options_container}>
                            {opt?.optionValue &&
                              <div className={Styles.ct_preview_attribute_option}>
                                <input value={opt?.optionId} onChange={(e) => handleChange({ e, attributeId: attribute?.id, attributeName: attribute?.attributeName, changeIn: "choosedValue" })} disabled={!isEdit} defaultChecked={attribute?.choosedValue?.includes(opt?.optionValue)} name="multichoice" type="radio" />
                                <label>{opt?.optionValue}</label>
                              </div>
                            }
                          </div>
                        })
                      }
                    </div>
                  }
                  {
                    attribute?.attributeName === "Checkboxes" && <div className={Styles.ct_preview_attribute_value_left}>
                      {
                        attribute?.fieldValue?.map((opt) => {
                          return <div className={Styles.ct_preview_checkboxes_option}>
                            {opt?.optionValue && <div className={Styles.ct_preview_attribute_option}>
                              <input value={opt?.optionId} onChange={(e) => handleChange({ e, attributeId: attribute?.id, attributeName: attribute?.attributeName, changeIn: "choosedValue", optionId: opt?.optionId })} disabled={!isEdit} defaultChecked={attribute?.choosedValue?.includes(opt?.optionId)} name="multichoice" type="checkbox" />
                              <label>{opt?.optionValue}</label>
                            </div>}
                          </div>
                        })
                      }
                    </div>
                  }
                  <div className={Styles.ct_preview_attribute_value_right}>
                    <div className={Styles.ct_preview_attribute_files_box}>
                      <img
                        src={
                          attribute?.filesCount > 0
                            ? TEMPLATE_PREVIEW_VIEWIMAGE
                            : TEMPLATE_PREVIEW_ADDIMAGE
                        }
                      />
                      {attribute?.filesCount > 0 && <div className={Styles.ct_preview_attribute_files_count}>1</div>}
                    </div>
                    <div>
                      <img
                        src={
                          attribute?.notes?.length > 0
                            ? TEMPLATE_PREVIEW_VIEWNOTE
                            : TEMPLATE_PREVIEW_ADDNOTE
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div></div>
        )}
      </div>
      {/* {isEdit && <div className={Styles.ct_preview_btn_container}>
        <div className={Styles.ct_preview_controllers}>
          <ClonosButton p={"0.5rem 1rem"} isHollow={true} style={{color:"#06337E"}} >Cancel</ClonosButton>
          <ClonosButton p={"0.5rem 1rem"} onClick={handleSubmit}>Submit</ClonosButton>
        </div>
      </div>} */}
    </>
  );
};
