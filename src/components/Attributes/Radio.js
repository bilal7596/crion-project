import React from "react";
import Styles from "../../ModuleStyles/Attributes/Radio.module.css";

const Radio = ({ positions, element }) => {
  console.log("{positions,element}:", { positions, element });
  return (
    <div
      className={Styles.radio_attribute_container}
      style={{
        top: `${positions.y}px`,
        left: `${positions.x}px`,
      }}
    >
      <div className={Styles.radio_attribute_content}>
        <span>{element.fieldName}</span>
        <span className={Styles.radio_attribute_value}>
          {element.choosedValue}
        </span>
      </div>
    </div>
  );
};

export default Radio;
