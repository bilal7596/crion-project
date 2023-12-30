import React from "react";

import { Group, Rect, Text } from "react-konva";
import CanvasCustomClose from "./CanvasCustomClose";

const CanvasCustomText = ({
  title,
  element,
  handleDestroy,
  canvasDimensions,
}) => {
  console.log("canvasDimensions:", canvasDimensions);
  console.log("element:", element);
  const textRef = React.useRef(null);
  const [componentWidth, setComponentWidth] = React.useState(200);

  React.useEffect(() => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    context.font = "16px Arial";
    const textWidth = context.measureText(element.fieldName).width;
    setComponentWidth(
      title == "table" ? Math.floor(canvasDimensions.width) : textWidth + 20
    ); // Add padding of 10 on both sides
  }, [title]);

  return (
    <Group draggable>
      <Rect
        width={componentWidth}
        height={30}
        fill="#4f69ffce"
        stroke="#3f51b5"
        strokeWidth={0.5}
        cornerRadius={5}
        shadowBlur={4}
      />
      <Text
        text={`${element.fieldName}`}
        fontSize={15}
        padding={10}
        fill="white"
        ref={textRef}
      />
      <CanvasCustomClose handleDestroy={handleDestroy} coordinates={{}} />
    </Group>
  );
};

export default CanvasCustomText;
