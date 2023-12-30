import React from "react";
import Styles from "../../ModuleStyles/Attributes/Date.module.css";
const Date = ({ positions, element }) => {
  console.log("{positions,element}:", { positions, element });
  return (
    <div
      className={Styles.date_attribute_container}
      style={{
        top: `${positions.y}px`,
        left: `${positions.x}px`,
      }}
    >
      <div className={Styles.date_attribute_content}>
        <span>{element.fieldName}</span>
        <span className={Styles.date_attribute_value}>
          {element.fieldValue}
        </span>
      </div>
    </div>
  );
};

export default Date;
