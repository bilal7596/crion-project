import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Image, Rect, Transformer } from "react-konva";
import { useDispatch, useSelector } from "react-redux";
import { dynamicFormStateManagementActions } from "../../Store/Reducers/ClonosDynamicFormReducer";
import { handleDragMove } from "../../utils/CanvasMethods/SetupCanvasMethods";
import CancelButtonDesign from "./CanvasCustomClose";

const DraggableResizableImage = ({
  src,
  x,
  y,
  onDragEnd,
  element,
  handleDestroy,
}) => {
  const dispatch = useDispatch();
  const [selected, setSelected] = useState(false);
  const [image, setImage] = useState(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [anchorPosition, setAnchorPosition] = useState({ x: 0, y: 0 });
  const [lastDroppedPosition, setLastDroppedPosition] = useState({
    x: 0,
    y: 0,
  });
  const transformerRef = useRef(null);
  const anchorRef = useRef(null);
  const { recordOfHeightAndWidthOfImagesToolkitState } = useSelector(
    (store) => store.dynamicFormStateManagement
  );

  console.log(
    "recordOfHeightAndWidthOfImagesToolkitState:",
    recordOfHeightAndWidthOfImagesToolkitState
  );
  console.log("height", height);
  console.log("width", width);
  console.log("lastDroppedLocation", lastDroppedPosition);
  useEffect(() => {
    const img = new window.Image();
    console.log("img", img);
    img.src = src;
    img.onload = () => {
      setImage(img);
      const newWidth = img.width;
      const newHeight = img.height;
      console.log("use", newWidth);
      console.log("use", newHeight);
      setWidth(60);
      setHeight(60);
      setLastDroppedPosition({ x: x + newWidth, y: y + newHeight });
      setAnchorPosition({ x: x + newWidth, y: y + newHeight });
    };
  }, [src, x, y]);

  const handleDragStart = () => {
    setSelected(true);
  };

  const handleDragEnd = (e) => {
    let key =
      element.countOfAttribute > 0
        ? element.customFieldType
        : element.fieldType;
    const { x, y } = e.target.attrs;
    setSelected(false);
    onDragEnd({ x, y }, element);
    console.log("element:", element);
    setLastDroppedPosition({ x, y });
    setAnchorPosition({ x: x + width, y: y + height });
    dispatch(
      dynamicFormStateManagementActions.setRecordOfHeightAndWidthOfImagesMethod(
        {
          ...recordOfHeightAndWidthOfImagesToolkitState,
          [key]: { height, width },
        }
      )
    );
  };

  const handleTransform = () => {
    const node = transformerRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    const newWidth = Math.max(5, node.width() * scaleX);
    const newHeight = Math.max(5, node.height() * scaleY);
    setWidth(newWidth);
    setHeight(newHeight);
    setAnchorPosition({
      x: lastDroppedPosition.x + newWidth,
      y: lastDroppedPosition.y + newHeight,
    });
  };

  return (
    <>
      <Image
        x={x}
        y={y}
        image={image}
        width={width}
        height={height}
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        cornerRadius={20}
        onClick={() => setSelected(true)}
        onDragMove={handleDragMove}
      />
      {selected && (
        <>
          <Transformer
            ref={transformerRef}
            rotateEnabled={false}
            keepRatio
            boundBoxFunc={(oldBox, newBox) => {
              const imgAspect = image.width / image.height;
              const newWidth = newBox.width;
              const newHeight = newWidth / imgAspect;
              return {
                ...newBox,
                height: newHeight,
              };
            }}
            onTransform={handleTransform}
          />
          <Rect
            x={anchorPosition.x}
            y={anchorPosition.y}
            width={6}
            height={6}
            fill="white"
            stroke="black"
            draggable
            onDragMove={(e) => {
              const anchorNode = e.target;
              const anchorX = anchorNode.x();
              const anchorY = anchorNode.y();
              console.log("anchorX", anchorX);
              console.log("anchorY", anchorY);
              console.log("x", x);
              console.log("y", y);

              setWidth(anchorX - lastDroppedPosition.x);
              setHeight(anchorY - lastDroppedPosition.y);
            }}
          />
          <CancelButtonDesign
            handleDestroy={handleDestroy}
            coordinates={{ anchorPosition, width }}
          />
        </>
      )}
    </>
  );
};

export default DraggableResizableImage;
