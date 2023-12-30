import React from "react";
import Styles from "../../ModuleStyles/Attributes/Number.module.css";

const Number = ({ positions, element }) => {
  console.log("{positions,element}:", { positions, element });
  return (
    <div
      className={Styles.number_attribute_container}
      style={{
        top: `${positions.y}px`,
        left: `${positions.x}px`,
      }}
    >
      <div className={Styles.number_attribute_content}>
        <span>{element.fieldName}</span>
        <span className={Styles.number_attribute_value}>
          {element.fieldValue}
        </span>
      </div>
    </div>
  );
};

export default Number;
