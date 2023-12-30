// ViewAssetHierarchy.js
import { CloseOutlined, CloseRounded } from "@material-ui/icons";
import { useEffect, useRef, useState } from "react";
import Tree from "react-d3-tree";
import "./custom-tree.css";
import { useDispatch } from "react-redux";
import { commonActions } from "../../../Store/Reducers/CommonReducer";
import CircularProgress from '@material-ui/core/CircularProgress';
import Styles from "../../../ModuleStyles/Assets/viewAsset.module.css"
import { useLocation } from "react-router-dom";
import { getAssetHierarchy, getSingleAsset, getSingleAssetHierarchy } from "../../../Api/Asset/assetApi";
import { handleLoginExpiry } from "../../../utils/clonosCommon";
import CustomNode from "./CustomNode";

export const ViewAssetHierarchy = ({ OnClose, selectedAsset }) => {
  const [selectedNode,setSelectedNode] = useState({...selectedAsset})
  const [treeData, setTreeData] = useState({});
  const treeContainerRef = useRef(null);
  const treeRef = useRef(null);
  const Location = useLocation();
  const dispatch = useDispatch();
  const [hierarchyLoader, setHierarchyLoader] = useState(false);
  const separation = { siblings: 2, nonSiblings: 2 };
  const [showSingleAssetTree,setShowSingleAssetTree] = useState(false);
  const [containerDimensions, setContainerDimensions] = useState({
    width: 0,
    height: 0,
  });

  function renameKeys(obj) {
    const renamedObj = {};
    for (const key in obj) {
      if (key === "assetName") {
        renamedObj.name = obj[key];
      } else if (key === "subAsset") {
        renamedObj.children = renameKeys(obj[key]);
      } else {
        renamedObj[key] = obj[key];
      }
    }
    return renamedObj;
  }

  useEffect(() => {
    if(!showSingleAssetTree){
      setHierarchyLoader(true);
      setTreeData({})
    getAssetHierarchy(Location?.state?.assetId)
      .then((res) => {
        console.log(res?.data?.result,"resp")
        setHierarchyLoader(false);
        const updatedTreeData = markSelectedNodes(res?.data?.result, selectedNode);
        setTreeData(updatedTreeData);
      })
      .catch((err) => {
        setHierarchyLoader(false);
        handleLoginExpiry(err, dispatch);
      });
    }
  }, [Location?.state, selectedNode,showSingleAssetTree]);
  console.log(Location,"location data")
  useEffect(() => {
    if(showSingleAssetTree){
      setHierarchyLoader(true);
      setTreeData({})
      if(Location?.state?.parentId){
        getSingleAsset(Location?.state?.assetId).then((response) => {
          getSingleAssetHierarchy(Location?.state?.assetId).then((res) => {
            console.log(res?.data?.result,"ressss")
            let tempData = {
              name : response?.data?.result?.assetName,
              attributes : {
                assetId: response?.data?.result?.assetId
              },
              children : [{
                name : res?.data?.result?.name,
                children : res?.data?.result?.children,
                attributes : res?.data?.result?.attributes
              }]
            }
            console.log(tempData,"tempdata");
            setSelectedNode({assetName:res?.data?.result?.name,assetNumber : res?.data?.result?.attributes?.assetNumber,assetId : res?.data?.result?.attributes?.assetId})
            const updatedTreeData = markSelectedNodes(tempData, selectedNode);
            setHierarchyLoader(false);
              setTreeData(updatedTreeData);
          }).catch((err) => {
            handleLoginExpiry(err,dispatch)
          })
        }).catch((err) => {
          handleLoginExpiry(err,dispatch)
        })
      } else {
        getSingleAssetHierarchy(Location?.state?.assetId).then((res) => {
          // console.log(res?.data?.result,"ressss")
          // let tempData = {
          //   name : response?.data?.result?.assetName,
          //   attributes : {
          //     assetId: response?.data?.result?.assetId
          //   },
          //   children : [{
          //     name : res?.data?.result?.name,
          //     children : res?.data?.result?.children,
          //     attributes : res?.data?.result?.attributes
          //   }]
          // }
          // console.log(tempData,"tempdata");
          setSelectedNode({assetName:res?.data?.result?.name,assetNumber : res?.data?.result?.attributes?.assetNumber,assetId : res?.data?.result?.attributes?.assetId})
          const updatedTreeData = markSelectedNodes(res?.data?.result, selectedNode);
          setHierarchyLoader(false);
            setTreeData(updatedTreeData);
        }).catch((err) => {
          handleLoginExpiry(err,dispatch)
        })
      }
      
    }
  },[showSingleAssetTree])
  useEffect(() => {
    if (treeContainerRef.current) {
      const { clientWidth, clientHeight } = treeContainerRef.current;
      setContainerDimensions({ width: clientWidth, height: clientHeight });
    }
    setSelectedNode({...selectedAsset})
  }, []);
console.log(treeData,"tree1")
  const markSelectedNodes = (nodeData, selectedNode) => {
    if (!nodeData) return null;

    const isHighlighted = nodeData.attributes?.assetId == selectedNode.assetId
      console.log("values",isHighlighted,"nodeDate",nodeData,"selectedNode",selectedNode)
    return {
      ...nodeData,
      _isSelected: isHighlighted,
      children: nodeData.children?.map((child) => markSelectedNodes(child, selectedNode)),
    };
  };

  const renderRectSvgNode = ({ nodeDatum, toggleNode }) => (
    <g>
      <circle r={20} width="20"  fill ={nodeDatum._isSelected ? "#3F51B5" : "#dcdcdc"} height="20" x="-10" onClick={toggleNode} />
      <text strokeWidth="1" x={25} y={5}>
        <tspan fill={nodeDatum._isSelected ? "#3F51B5" : "black"}>{nodeDatum.name}</tspan>
      </text>
      {/* {nodeDatum.attributes?.department && (
        <text fill="black" x="20" dy="20" strokeWidth="1">
          Department: {nodeDatum.attributes?.department}
        </text>
      )} */}
    </g>
  );

  const centerPositions = {
    x: containerDimensions.width / 2,
    y: 100,
  };

  console.log("treeData",containerDimensions)

  return (
    <div className="assetHierarchyContainer">
      <div
        id="treeWrapper"
        ref={treeContainerRef}
        style={{ width: "90vw", height: "80vh", background: "#FFF",display:"flex",justifyContent:"center",alignItems:"center" }}
      >
        {renameKeys(treeData)?.name ? (
          <Tree
            data={renameKeys(treeData)}
            translate={centerPositions}
            orientation={"vertical"}
            pathFunc={"step"}
            separation={separation}
            // nodeSvgShape={{
            //   shape: (nodeData) => <CustomNode nodeDatum={nodeData} selectedNode={selectedNode} />,
            //   shapeProps: { width: 30, height: 40, x: -10, y: -10 },
            // }}
            rootNodeClassName="node__root"
            leafNodeClassName="node__leaf"
            renderCustomNodeElement={renderRectSvgNode}
          />
        ) : (
          <div>
            {hierarchyLoader ? (
              <div
                style={{
                  display: "flex",
                  height: "80vh",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "#3f51b5",
                }}
              >
                <CircularProgress size={"200px"} />
              </div>
            ) : !hierarchyLoader && !treeData?.name ? (
              <div
                style={{
                  display: "flex",
                  height: "80vh",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "#3f51b5",
                }}
              >
                <h1>Looks like no hierarchy Present !!.</h1>
              </div>
            ) : (
              <></>
            )}
          </div>
        )}
      </div>
      <div className={Styles.hierarchyControls}>
        <div>
          <button onClick={() => setShowSingleAssetTree(true)}>Current Hierarchy</button>
        </div>
        <div>
          <button onClick={() => setShowSingleAssetTree(false)}>Full Hierarchy</button>
        </div>
        <div className={Styles.closeIconBox} onClick={() => OnClose()}>
          <CloseRounded fontSize="large" />
        </div>
      </div>
    </div>
  );
};
