import React, { useState } from "react";

const TreeNode = ({ asset, onAssetClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleNodeClick = () => {
    setIsOpen(!isOpen);
    onAssetClick(asset.assetId); 
  };

  return (
    <div>
      {/* Render the asset label */}
      <div style={{display:"flex",justifyContent:"space-between"}}>
      <span onClick={handleNodeClick}>{asset.assetName}</span>
      <input type="checkbox"/>
      </div>
      {/* Check if the asset has children and render them if it's open */}
      {isOpen &&
        asset.subAssets &&
        asset.subAssets.map((childNode) => (
          <TreeNode key={childNode.assetId} asset={childNode} onAssetClick={onAssetClick} />
        ))}
    </div>
  );
};

const AssetTree = ({assets}) => {
 
  const [treeData, setTreeData] = useState([...assets]);
  const [selectedNode, setSelectedNode] = useState(null);

  const handleNodeClick = (assetId) => {
    setSelectedNode(assetId);
  };

  return (
    <div>
      {/* Render the root assets */}
      {treeData?.map((asset) => (
        <TreeNode key={asset.assetId} asset={asset} onAssetClick={handleNodeClick} />
      ))}
    </div>
  );
};

export default AssetTree;
