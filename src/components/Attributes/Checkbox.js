import React from "react";
import Styles from "../../ModuleStyles/Attributes/Checkbox.module.css";

const Checkbox = ({ positions, element }) => {
  console.log("{positions,element}:", { positions, element });
  return (
    <div
    className={Styles.checkbox_attribute_container}
    style={{
      top: `${positions.y}px`,
      left: `${positions.x}px`,
    }}
  >
    <div className={Styles.checkbox_attribute_content}>
      <span>{element.fieldName}</span>
      <span className={Styles.checkbox_attribute_value}>
            {
              element.fieldValue.map((ele)=>{
                if(ele.isChecked){
                  return ele.optionValue
                }
              })
            }
      </span>
    </div>
  </div>
  );
};

export default Checkbox;
