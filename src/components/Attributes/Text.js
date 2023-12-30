import React from "react";
import Styles from "../../ModuleStyles/Attributes/Text.module.css";

const TextComponent = ({ positions, element }) => {
  return (
    <div
      className={Styles.text_attribute_container}
      style={{
        top: `${positions.y}px`,
        left: `${positions.x}px`,
      }}
    >
      <div className={Styles.text_attribute_content}>
        <span>{element.fieldName}</span>
        <span className={Styles.text_attribute_value}>
          {element.fieldValue}
        </span>
      </div>
    </div>
  );
};

export default TextComponent;
