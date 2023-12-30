// CustomNode.js
import React from "react";

const CustomNode = ({ nodeDatum }) => {
console.log("nodeDatum",nodeDatum)
  const isHighlighted =
    nodeDatum.name === nodeDatum.selectedAsset.name &&
    nodeDatum.attributes?.assetNumber === nodeDatum.selectedAsset.assetNumber;

  return (
    <g>
      <circle r={10} fill={isHighlighted ? "green" : "red"} />
      <text x="105" y="5" style={{ fill: "black", fontSize: "20px" }}>
        {nodeDatum.name}
      </text>
    </g>
  );
};

export default CustomNode;
