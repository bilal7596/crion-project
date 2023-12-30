import React from "react";
import Styles from "../../ModuleStyles/Attributes/Image.module.css";

const Image = ({ positions, element,dimensions }) => {
  console.log("dimensions",dimensions)
  return (
    <div
      className={Styles.image_attribute_container}
      style={{
        top: `${positions.y}px`,
        left: `${positions.x}px`,
      }}
    >
      <div className={Styles.image_attribute_content}>
        <img src={element.fieldValue}  alt={element.fieldName} height={dimensions?.height} width={dimensions?.width}/>
      </div>
    </div>
  );
};

export default Image;
