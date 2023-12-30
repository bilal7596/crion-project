import { removeAnyKeyFromAnObject } from "./CommonMethods";

/**
 * handleDragStart method is going to use for start the dragging in the canvas container
 * @param {*} e // "e" represent the the event
 */
export const handleDragStart = (e) => {
  // Set a flag in the node's custom attributes to indicate dragging
  e.target.setAttr('isDragging', true);
  e.target.getLayer().batchDraw(); // Redraw the layer to apply the changes
};

/**
 * handleDragEnd method is going to use for end the dragging of the element in the canvas container
 * @param {*} e "e" represent the the event
 */
export const handleDragEnd = (e, args, handleStoreAttributesPosition) => {
  const { x, y } = e.target.position();
  console.log("Dropped at:", x, y);
  handleStoreAttributesPosition({ x, y }, args);
  if (x < 0 || y < 0) {
    alert("position not valid")
    return
  }
};

/**
 * handleDrop method is going to use for dropping the element in the from the canvas container
 * @param {*} e "e" represent the the event
 */
export const handleDrop = (e) => {
  // Check if the dataTransfer object has the dragging flag
  const { x, y } = e.target.position();
  console.log('y:', y)
  console.log('x:', x)
  const isDragging = e.evt.dataTransfer.getData('isDragging');
  if (isDragging) {
    // Get the dropped element's position
    const { x, y } = e.target.position();
    console.log("Dropped on:", x, y);
  }
};

export const handleDragMove = (e) => {
  // Get the stage object from the draggable shape
  const stage = e.target.getStage();

  // Get the container element of the stage
  const container = stage.container();

  // Get the dimensions of the container element
  const containerRect = container.getBoundingClientRect();

  // Get the width and height of the canvas area
  const canvasWidth = containerRect.width;
  const canvasHeight = containerRect.height;

  // Get the draggable shape
  const shape = e.target;

  // Get the bounding rectangle of the shape (excluding any transformations)
  const shapeRect = shape.getClientRect({ skipTransform: true });

  // Calculate the new position for the shape, ensuring it stays within the canvas boundaries
  const newX = Math.max(0, Math.min(shape.x(), canvasWidth - shapeRect.width));
  const newY = Math.max(0, Math.min(shape.y(), canvasHeight - shapeRect.height));

  // Set the new position for the shape
  shape.position({ x: newX, y: newY });

  // Redraw the layer to reflect the updated position
  shape.getLayer().batchDraw();
};


/**
 * This is method is going to use for adding the attributes in the canvas
 */

export const dataManipulator = (lcData) => {
  console.log('lcData:', lcData)
  // This function, "dataManipulator", takes in local data as "lcData" and manipulates it to generate modified data for further processing.
  let orderObj = {}; // An object used to track the order of field types.
  let data = lcData.map((ele) => {
    console.log('ele:', ele[Object.keys(ele)[0]])
    let newElement = ele[Object.keys(ele)[0]]
    console.log('newElement:', newElement)
    if (orderObj[newElement.fieldType] === undefined) {
      orderObj[newElement.fieldType] = 0;
      return {
        ...newElement,
        countOfAttribute: orderObj[newElement.fieldType],
        customFieldType: 0,
      };
    } else {
      orderObj[newElement.fieldType]++;
      return {
        ...newElement,
        countOfAttribute: orderObj[newElement.fieldType],
        customFieldType: `${newElement.fieldType + orderObj[newElement.fieldType]}`,
      };
    }
  });

  return data; // The manipulated data is returned for further processing or usage.
};


/**
 * 'handleMouseDown' function is getting use for handling the lines in the dynamic form
 * @param {*} e "e stands for event"
 * @param {*} allowLines "allowLines is the boolean value is ensure that you can draw the lines or not"
 * @param {*} stageRef "stageRef is take care of the stages which we are creating in the layer"
 * @param {*} startPos "startPos is the object which stores the starding position of the lines"
 * @param {*} clickTimeout "clickTimeout store the previous interval, If it is less than 2 second so it clear previous interval and set new interval. Because with help of this interval we are replicating the double click functionality to dray our lines"
 * @param {*} setIsDrawing "setIsDrawing is another boolean state which ensure the you drawing the line or not"
 */
export const handleMouseDown = (e, allowLines, stageRef, startPos, clickTimeout, setIsDrawing, lines) => {
  // Here we are checking the if the mouse click if still holding or not?
  if (e.evt.button === 0) {
    // Here we are replicate the behaviour of the doulbe click because we don't want to start our line drawing because in our code there are two work is running on mouse event when we press the mouse left click.
    clearTimeout(clickTimeout.current); // So this will wait about 200 milisecond after that start printing the lines
    clickTimeout.current = setTimeout(() => {
      if (allowLines) setIsDrawing(true)
      startPos.current = stageRef.current.getPointerPosition();
    }, 200);
  }
};


export const handleMouseUp = (allowLines, clickTimeout, setIsDrawing, recordOfLinesCoordinatesToolkitState, lines, dispatch, dynamicFormStateManagementActions, recordOfHowManyLinesAreAvailableIntoTheCanvasToolkitState,) => {
  if (allowLines) {
    clearTimeout(clickTimeout.current);
    setIsDrawing(false);
    let lineCount = Object.keys(recordOfLinesCoordinatesToolkitState).length + 1; // Here We are taking the record of the lines
    let points = lines[lines.length - 1].points; // Here we are getting the latest line coordinates.
    let coordinatesOfLines = {
      startPoint: { x: points[0], y: points[1] },
      endPoint: { x: points[2], y: points[3] },
    };

    if (recordOfHowManyLinesAreAvailableIntoTheCanvasToolkitState[lineCount]) {
      dispatch(dynamicFormStateManagementActions.setRecordOfHowManyLinesAreAvailableIntoTheCanvasMethod({ ...recordOfHowManyLinesAreAvailableIntoTheCanvasToolkitState, [lineCount]: { ...recordOfHowManyLinesAreAvailableIntoTheCanvasToolkitState[lineCount], endingIndexOfLines: lines.length } }))
    }

    dispatch(
      dynamicFormStateManagementActions.setRecordOfLinesCoordinatesMethod({
        ...recordOfLinesCoordinatesToolkitState,
        [lineCount]: coordinatesOfLines,
      })
    );
  }
};


/**
 * handleMouseMove function is getting use for creating the dynamic form lines
 */
export const handleMouseMove = (
  e,
  stageRef,
  startPos,
  lines,
  isDrawing,
  setLines,
  dynamicFormStateManagementActions,
  recordOfHowManyLinesAreAvailableIntoTheCanvasToolkitState,
  recordOfLinesCoordinatesToolkitState,
  dispatch
) => {
  if (isDrawing) {
    const stage = stageRef.current;
    const pos = stage.getPointerPosition();

    const dx = pos.x - startPos.current.x;
    const dy = pos.y - startPos.current.y;

    // Determine if the line should be vertical or horizontal based on the change in coordinates
    const isVertical = Math.abs(dy) > Math.abs(dx);

    const startPoint = { x: startPos.current.x, y: startPos.current.y };
    const endPoint = isVertical
      ? { x: startPos.current.x, y: pos.y } // Vertical line
      : { x: pos.x, y: startPos.current.y }; // Horizontal line

    const currentLine = {
      points: [startPoint.x, startPoint.y, endPoint.x, endPoint.y],
      stroke: "black",
      strokeWidth: 2,
    };


    let lineCount = Object.keys(recordOfLinesCoordinatesToolkitState).length + 1; // Here We are taking the record of the lines
    if (!recordOfHowManyLinesAreAvailableIntoTheCanvasToolkitState[lineCount]) {
      dispatch(dynamicFormStateManagementActions.setRecordOfHowManyLinesAreAvailableIntoTheCanvasMethod({ ...recordOfHowManyLinesAreAvailableIntoTheCanvasToolkitState, [lineCount]: { startingIndexOfLines: lines.length } }))
    }

    lines.push(currentLine); // Add the current line to the lines array
    setLines(lines)
    stage.batchDraw(); // Batch draw the stage to update the canvas
  }
};



export const handleUndoLines = (
  lines,
  setLines,
  dispatch,
  dynamicFormStateManagementActions,
  undoLinesToolkitState,
  redoLinesToolkitState,
  recordOfHowManyLinesAreAvailableIntoTheCanvasToolkitState,
  recordOfLinesCoordinatesToolkitState,
  recordOfUndoLinesCoordinatesToolkitState,
  recordOfUndoLinesAreAvailableInToolkit
) => {
  let tempLinesArray = [...lines];
  let keys = Object.keys(recordOfHowManyLinesAreAvailableIntoTheCanvasToolkitState)
  let lastElement = recordOfHowManyLinesAreAvailableIntoTheCanvasToolkitState[keys.length];
  let totalElementHaveToDelete = lastElement?.endingIndexOfLines - lastElement?.startingIndexOfLines
  let temp = tempLinesArray.splice(lastElement.startingIndexOfLines, totalElementHaveToDelete)
  setLines(tempLinesArray)

  let lastKeyRemovedLinesAreAvailable = removeAnyKeyFromAnObject(keys.length, { ...recordOfHowManyLinesAreAvailableIntoTheCanvasToolkitState })
  let lastKeyRemovedLineCoordinates = removeAnyKeyFromAnObject(keys.length, { ...recordOfLinesCoordinatesToolkitState })

  dispatch(dynamicFormStateManagementActions.setRecordOfUndoLinesAreAvailableInToolkitStateMethod({ ...recordOfUndoLinesAreAvailableInToolkit, [keys.length]: lastKeyRemovedLinesAreAvailable?.removedElement[keys.length] }))


  dispatch(dynamicFormStateManagementActions.setRecordOfUndoLinesCoordinatesMethod({ ...recordOfUndoLinesCoordinatesToolkitState, [keys.length]: lastKeyRemovedLineCoordinates?.removedElement[keys.length] }))

  dispatch(dynamicFormStateManagementActions.setUndoLinesMethod([...undoLinesToolkitState, temp]))
  dispatch(dynamicFormStateManagementActions.setRecordOfHowManyLinesAreAvailableIntoTheCanvasMethod(lastKeyRemovedLinesAreAvailable.updatedValues))
  dispatch(dynamicFormStateManagementActions.setRecordOfLinesCoordinatesMethod(lastKeyRemovedLineCoordinates.updatedValues))
}

export const handleRedoLines = (
  lines,
  setLines,
  dispatch,
  dynamicFormStateManagementActions,
  undoLinesToolkitState,
  redoLinesToolkitState,
  recordOfHowManyLinesAreAvailableIntoTheCanvasToolkitState,
  recordOfLinesCoordinatesToolkitState,
  recordOfUndoLinesCoordinatesToolkitState,
  recordOfUndoLinesAreAvailableInToolkit

) => {

  let temp = [...undoLinesToolkitState]
  let poppedElement = temp.pop()
  setLines([...lines, ...poppedElement])

  let lastKey = Object.keys(recordOfHowManyLinesAreAvailableIntoTheCanvasToolkitState).length+1
  let updatedRecordOfUndoLinesAreAvailableInToolkit = removeAnyKeyFromAnObject(lastKey, { ...recordOfUndoLinesAreAvailableInToolkit })

  let updatedRecordOfUndoLinesCoordinatesToolkitState = removeAnyKeyFromAnObject(lastKey, { ...recordOfUndoLinesCoordinatesToolkitState })


  dispatch(dynamicFormStateManagementActions.setRecordOfUndoLinesAreAvailableInToolkitStateMethod(updatedRecordOfUndoLinesAreAvailableInToolkit.updatedValues))


  dispatch(dynamicFormStateManagementActions.setRecordOfUndoLinesCoordinatesMethod(updatedRecordOfUndoLinesCoordinatesToolkitState.updatedValues))


  dispatch(dynamicFormStateManagementActions.setRecordOfHowManyLinesAreAvailableIntoTheCanvasMethod({...recordOfHowManyLinesAreAvailableIntoTheCanvasToolkitState,[lastKey]:updatedRecordOfUndoLinesAreAvailableInToolkit?.removedElement[lastKey]}))

  dispatch(dynamicFormStateManagementActions.setRecordOfLinesCoordinatesMethod({...recordOfLinesCoordinatesToolkitState,[lastKey]:updatedRecordOfUndoLinesCoordinatesToolkitState?.removedElement[lastKey]}))
  
  dispatch(dynamicFormStateManagementActions.setUndoLinesMethod(temp))
}