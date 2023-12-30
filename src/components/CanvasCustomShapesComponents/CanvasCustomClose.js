import React from 'react';
import { Group, Circle, Line } from 'react-konva';

const CancelButtonDesign = ({handleDestroy,coordinates}) => {
  const buttonSize = 10;
  const strokeWidth = 1;
  const strokeColor = 'white';

  return (
    <Group
    onClick={handleDestroy}
    x={Object.keys(coordinates).length===0 ? "" : coordinates?.anchorPosition?.x - coordinates.width}
    y={Object.keys(coordinates).length===0 ? "" : coordinates?.anchorPosition?.y}
    >
      <Circle
        x={buttonSize / 2}
        y={buttonSize / 2}
        radius={buttonSize / 2}
        fill="red"
        // stroke={strokeColor}
        // strokeWidth={strokeWidth}
      />
      <Line
        points={[
          buttonSize / 4,
          buttonSize / 4,
          (buttonSize * 3) / 4,
          (buttonSize * 3) / 4,
        ]}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
      <Line
        points={[
          (buttonSize * 3) / 4,
          buttonSize / 4,
          buttonSize / 4,
          (buttonSize * 3) / 4,
        ]}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
    </Group>
  );
};

export default CancelButtonDesign;
