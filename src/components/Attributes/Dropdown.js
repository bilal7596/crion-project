import React from "react";
import Styles from "../../ModuleStyles/Attributes/Dropdown.module.css";

const Dropdown = ({ positions, element }) => {
  console.log("{positions,element}:", { positions, element });
  return (
    <div
      className={Styles.dropdown_attribute_container}
      style={{
        top: `${positions.y}px`,
        left: `${positions.x}px`,
      }}
    >
      <div className={Styles.dropdown_attribute_content}>
        <span>{element.fieldName}</span>
        <span className={Styles.dropdown_attribute_value}>
          {element.choosedValue}
        </span>
      </div>
    </div>
  );
};

export default Dropdown;
