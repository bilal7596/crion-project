import React from "react";
import Styles from "../../ModuleStyles/Attributes/Map.module.css";

const Map = ({ positions, element }) => {
  console.log("{positions,element}:", { positions, element });
  return (
    <div
      style={{
        position: "absolute",
        top: `${positions.y}px`,
        left: `${positions.x}px`,
      }}
    >
      <p>{element.fieldName}</p>
    </div>
  );
};

export default Map;
